import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBranding } from '../../context/BrandingContext';

interface AdminLoginProps {
  onNavigate: (route: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onNavigate }) => {
  const { loginWithEmail, loginWithGoogle, error, clearError } = useAuth();
  const { logoUrl, brandName } = useBranding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      onNavigate('/admin/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al autenticar';
      setLocalError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError(null);
    clearError();
    setLoading(true);
    try {
      await loginWithGoogle();
      onNavigate('/admin/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al autenticar con Google';
      setLocalError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#110d0b] text-[#eae1dc] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#9b1b30]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#613f26]/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#1f1b18] border border-[#C89B7B]/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
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
          <h1 className="font-serif text-3xl text-[#eae1dc] font-semibold">{brandName} Admin</h1>
          <p className="text-xs uppercase tracking-widest text-[#edbd9b] mt-1 font-medium">
            Panel Privado para Socios &amp; Dirección
          </p>
          <p className="text-xs text-[#e0bfbf] mt-2">
            Ingreso exclusivo para gestión de servicios, carta gastronómica y reservas.
          </p>
        </div>

        {/* Error notification */}
        {(localError || error) && (
          <div className="mb-6 p-4 rounded-xl bg-[#93000a]/30 border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{localError || error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@elevva.com.py"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-sm"
              />
              <Mail className="w-4 h-4 text-[#584141] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-sm"
              />
              <Lock className="w-4 h-4 text-[#584141] absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Developer Quick-Access Card */}
          <div className="p-3 rounded-xl bg-[#2e2926]/90 border border-[#edbd9b]/30 flex items-center justify-between gap-3">
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#edbd9b]" />
                <span className="text-[11px] font-semibold text-[#edbd9b]">Cuenta Developer Lista</span>
              </div>
              <p className="text-[10px] text-[#e0bfbf] font-mono mt-0.5">
                developer@developer.com • developer
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail('developer@developer.com');
                setPassword('developer');
              }}
              className="shrink-0 px-2.5 py-1.5 rounded-lg bg-[#9b1b30] hover:bg-[#b8243c] text-white text-[10px] uppercase tracking-wider font-semibold transition-all cursor-pointer shadow"
            >
              Completar
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#9b1b30] text-white text-[12px] uppercase tracking-wider font-semibold hover:bg-[#b8243c] shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Accediendo...' : 'Iniciar Sesión'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-[#584141]/40"></div>
          <span className="text-[10px] uppercase tracking-widest text-[#584141]">O continuar con</span>
          <div className="flex-1 h-px bg-[#584141]/40"></div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-[#2e2926] text-[#eae1dc] text-xs font-semibold hover:bg-[#3d3835] transition-all border border-[#584141]/50 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.54 0 2.9.54 3.99 1.43l2.98-2.98C17.15 1.7 14.76 1 12 1 7.42 1 3.54 3.61 1.67 7.42l3.66 2.84C6.22 7.18 8.87 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.69-4.98 3.69-8.71z"
            />
            <path
              fill="#FBBC05"
              d="M5.33 14.74c-.23-.68-.36-1.41-.36-2.17s.13-1.49.36-2.17L1.67 7.56C.61 9.68 0 12.04 0 14.57s.61 4.89 1.67 7.01l3.66-2.84z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.73-2.89c-1.07.72-2.45 1.16-4.2 1.16-3.13 0-5.78-2.18-6.67-5.26L1.67 16.94C3.54 20.75 7.42 23.36 12 23.36z"
            />
          </svg>
          <span>Acceder con Google Workspace</span>
        </button>

        {/* Footer links */}
        <div className="mt-8 pt-6 border-t border-[#584141]/30 flex items-center justify-between text-xs">
          <button
            onClick={() => onNavigate('/admin/register')}
            className="text-[#edbd9b] hover:text-[#ffdcc4] transition-colors cursor-pointer"
          >
            Registrar nuevo socio
          </button>

          <button
            onClick={() => onNavigate('/')}
            className="text-[#e0bfbf] hover:text-white transition-colors cursor-pointer"
          >
            Ir a la Landing pública
          </button>
        </div>
      </div>
    </div>
  );
};
