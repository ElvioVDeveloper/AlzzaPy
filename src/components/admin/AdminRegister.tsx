import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBranding } from '../../context/BrandingContext';

interface AdminRegisterProps {
  onNavigate: (route: string) => void;
}

export const AdminRegister: React.FC<AdminRegisterProps> = ({ onNavigate }) => {
  const { registerWithEmail, error, clearError } = useAuth();
  const { logoUrl, brandName } = useBranding();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(name, email, password);
      onNavigate('/admin/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar administrador';
      setLocalError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#110d0b] text-[#eae1dc] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#9b1b30]/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#1f1b18] border border-[#C89B7B]/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
        <button
          onClick={() => onNavigate('/admin/login')}
          className="inline-flex items-center gap-1.5 text-xs text-[#edbd9b] hover:text-[#ffdcc4] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio de sesión</span>
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#2e2926] border border-[#C89B7B]/40 mb-4 shadow-xl overflow-hidden p-1">
            <img
              src={logoUrl || '/elevva-logo.jpg'}
              alt={brandName}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/elevva-logo.jpg';
              }}
              className="w-full h-full rounded-xl object-cover"
            />
          </div>
          <h1 className="font-serif text-3xl text-[#eae1dc] font-semibold">Registro de Socio</h1>
          <p className="text-xs uppercase tracking-widest text-[#edbd9b] mt-1 font-medium">
            {brandName} Rooftop Experience
          </p>
          <p className="text-xs text-[#e0bfbf] mt-2">
            Crea tu credencial autorizada para gestionar la plataforma comercial.
          </p>
        </div>

        {(localError || error) && (
          <div className="mb-6 p-4 rounded-xl bg-[#93000a]/30 border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{localError || error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1.5">
              Nombre Completo *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Martín Soler"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-sm"
              />
              <User className="w-4 h-4 text-[#584141] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1.5">
              Correo Electrónico *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="socio@elevva.com.py"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-sm"
              />
              <Mail className="w-4 h-4 text-[#584141] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1.5">
              Contraseña (mínimo 6 caracteres) *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-sm"
              />
              <Lock className="w-4 h-4 text-[#584141] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1.5">
              Confirmar Contraseña *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-sm"
              />
              <Lock className="w-4 h-4 text-[#584141] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#9b1b30] text-white text-[12px] uppercase tracking-wider font-semibold hover:bg-[#b8243c] shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Creando cuenta...' : 'Completar Registro'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
