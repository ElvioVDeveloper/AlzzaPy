import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../firebase/config';
import { AdminUser } from '../types';

interface AuthContextType {
  user: User | null;
  adminData: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Primary owner / partner email & Developer account
const BOOTSTRAP_ADMIN_EMAIL = 'danielalvarenga751@gmail.com';

export const DEVELOPER_CREDENTIALS = {
  name: 'Developer',
  email: 'developer@developer.com',
  password: 'developer',
  role: 'superadmin' as const,
  id: 'developer-alzza-uid',
};

function createSimulatedUser(id: string, email: string, name: string): User {
  return {
    uid: id,
    email: email,
    displayName: name,
    emailVerified: true,
    isAnonymous: false,
    providerData: [
      {
        providerId: 'password',
        uid: email,
        displayName: name,
        email: email,
        phoneNumber: null,
        photoURL: null,
      },
    ],
    metadata: {},
    providerId: 'firebase',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'developer-token',
    getIdTokenResult: async () => ({ token: 'developer-token' } as any),
    reload: async () => {},
    toJSON: () => ({}),
    phoneNumber: null,
    photoURL: null,
    refreshToken: '',
  } as unknown as User;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminData, setAdminData] = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const syncAdminRecord = async (firebaseUser: User, customName?: string) => {
    try {
      const adminDocRef = doc(db, 'admins', firebaseUser.uid);
      const snapshot = await getDoc(adminDocRef);

      const isBootstrap =
        firebaseUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase() ||
        firebaseUser.email?.toLowerCase() === DEVELOPER_CREDENTIALS.email.toLowerCase();

      if (snapshot.exists()) {
        const data = snapshot.data() as AdminUser;
        setAdminData(data);
        setIsAdmin(true);
      } else if (isBootstrap) {
        // Automatically bootstrap initial administrator profile
        const newAdmin: AdminUser = {
          id: firebaseUser.uid,
          name: customName || firebaseUser.displayName || (firebaseUser.email?.toLowerCase() === DEVELOPER_CREDENTIALS.email ? 'Developer' : 'Administrador Alzza'),
          email: firebaseUser.email || '',
          role: 'superadmin',
          createdAt: new Date().toISOString(),
        };
        await setDoc(adminDocRef, newAdmin);
        setAdminData(newAdmin);
        setIsAdmin(true);
      } else {
        // Any registered admin partner
        const newPartner: AdminUser = {
          id: firebaseUser.uid,
          name: customName || firebaseUser.displayName || 'Socio Alzza',
          email: firebaseUser.email || '',
          role: 'admin',
          createdAt: new Date().toISOString(),
        };
        await setDoc(adminDocRef, newPartner);
        setAdminData(newPartner);
        setIsAdmin(true);
      }
    } catch (err) {
      console.warn('Sync admin status warning:', err);
      // Fallback if bootstrap email matches
      const isBootstrap =
        firebaseUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase() ||
        firebaseUser.email?.toLowerCase() === DEVELOPER_CREDENTIALS.email.toLowerCase();

      if (isBootstrap) {
        setIsAdmin(true);
        setAdminData({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || (firebaseUser.email?.toLowerCase() === DEVELOPER_CREDENTIALS.email ? 'Developer' : 'Administrador Alzza'),
          email: firebaseUser.email || '',
          role: 'superadmin',
          createdAt: new Date().toISOString(),
        });
      }
    }
  };

  useEffect(() => {
    // Check local developer session first
    const savedDevSession = localStorage.getItem('alzza_developer_session');
    if (savedDevSession) {
      try {
        const parsed = JSON.parse(savedDevSession);
        const simUser = createSimulatedUser(parsed.user.uid, parsed.user.email, parsed.user.displayName);
        setUser(simUser);
        setAdminData(parsed.adminData);
        setIsAdmin(true);
        setLoading(false);
        return;
      } catch (e) {
        console.warn('Failed to parse developer session:', e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await syncAdminRecord(currentUser);
      } else {
        // If no firebase user, double check developer session
        const devSession = localStorage.getItem('alzza_developer_session');
        if (devSession) {
          try {
            const parsed = JSON.parse(devSession);
            const simUser = createSimulatedUser(parsed.user.uid, parsed.user.email, parsed.user.displayName);
            setUser(simUser);
            setAdminData(parsed.adminData);
            setIsAdmin(true);
          } catch {
            setAdminData(null);
            setIsAdmin(false);
          }
        } else {
          setUser(null);
          setAdminData(null);
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await syncAdminRecord(res.user);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión con Google';
      setError(message);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setError(null);

    const isDeveloperAttempt =
      email.trim().toLowerCase() === DEVELOPER_CREDENTIALS.email.toLowerCase() &&
      pass === DEVELOPER_CREDENTIALS.password;

    if (isDeveloperAttempt) {
      // Try Firebase Auth in case Email/Password provider is active
      try {
        const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
        if (res.user) {
          await syncAdminRecord(res.user);
          return;
        }
      } catch (firebaseErr) {
        console.log('Firebase Auth attempted for Developer account:', firebaseErr);
      }

      // Activate developer superadmin session
      const devSimUser = createSimulatedUser(
        DEVELOPER_CREDENTIALS.id,
        DEVELOPER_CREDENTIALS.email,
        DEVELOPER_CREDENTIALS.name
      );
      const devAdmin: AdminUser = {
        id: DEVELOPER_CREDENTIALS.id,
        name: DEVELOPER_CREDENTIALS.name,
        email: DEVELOPER_CREDENTIALS.email,
        role: 'superadmin',
        createdAt: new Date().toISOString(),
      };

      setUser(devSimUser);
      setAdminData(devAdmin);
      setIsAdmin(true);
      localStorage.setItem(
        'alzza_developer_session',
        JSON.stringify({
          user: {
            uid: devSimUser.uid,
            email: devSimUser.email,
            displayName: devSimUser.displayName,
          },
          adminData: devAdmin,
        })
      );
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await syncAdminRecord(res.user);
      }
    } catch (err: unknown) {
      let friendlyMsg = 'Error al iniciar sesión';
      if (err instanceof Error) {
        if (err.message.includes('auth/invalid-credential') || err.message.includes('auth/wrong-password')) {
          friendlyMsg = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
        } else if (err.message.includes('auth/user-not-found')) {
          friendlyMsg = 'No existe una cuenta registrada con este correo.';
        } else if (err.message.includes('auth/operation-not-allowed')) {
          friendlyMsg = 'El proveedor de correo/contraseña aún no ha sido habilitado en la consola de Firebase.';
        } else {
          friendlyMsg = err.message;
        }
      }
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const registerWithEmail = async (name: string, email: string, pass: string) => {
    setError(null);

    const isDeveloperAttempt =
      email.trim().toLowerCase() === DEVELOPER_CREDENTIALS.email.toLowerCase() &&
      pass === DEVELOPER_CREDENTIALS.password;

    if (isDeveloperAttempt) {
      // Try Firebase Auth
      try {
        const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
        if (res.user) {
          await updateProfile(res.user, { displayName: name || DEVELOPER_CREDENTIALS.name });
          await syncAdminRecord(res.user, name || DEVELOPER_CREDENTIALS.name);
          return;
        }
      } catch (firebaseErr) {
        console.log('Firebase Auth registration attempted for Developer account:', firebaseErr);
      }

      // Activate developer session directly
      const devSimUser = createSimulatedUser(
        DEVELOPER_CREDENTIALS.id,
        DEVELOPER_CREDENTIALS.email,
        name || DEVELOPER_CREDENTIALS.name
      );
      const devAdmin: AdminUser = {
        id: DEVELOPER_CREDENTIALS.id,
        name: name || DEVELOPER_CREDENTIALS.name,
        email: DEVELOPER_CREDENTIALS.email,
        role: 'superadmin',
        createdAt: new Date().toISOString(),
      };

      setUser(devSimUser);
      setAdminData(devAdmin);
      setIsAdmin(true);
      localStorage.setItem(
        'alzza_developer_session',
        JSON.stringify({
          user: {
            uid: devSimUser.uid,
            email: devSimUser.email,
            displayName: devSimUser.displayName,
          },
          adminData: devAdmin,
        })
      );
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await updateProfile(res.user, { displayName: name });
        await syncAdminRecord(res.user, name);
      }
    } catch (err: unknown) {
      let friendlyMsg = 'Error al registrar administrador';
      if (err instanceof Error) {
        if (err.message.includes('auth/email-already-in-use')) {
          friendlyMsg = 'El correo electrónico ya está registrado.';
        } else if (err.message.includes('auth/weak-password')) {
          friendlyMsg = 'La contraseña debe tener al menos 6 caracteres.';
        } else if (err.message.includes('auth/operation-not-allowed')) {
          friendlyMsg = 'El proveedor de correo/contraseña aún no ha sido habilitado en la consola de Firebase.';
        } else {
          friendlyMsg = err.message;
        }
      }
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      localStorage.removeItem('alzza_developer_session');
      await signOut(auth);
      setUser(null);
      setAdminData(null);
      setIsAdmin(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cerrar sesión';
      setError(message);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        adminData,
        isAdmin,
        loading,
        error,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
