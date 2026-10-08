import React from 'react';
import { User, Shield, Mail, Key, Clock, CheckCircle2, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminProfileProps {
  onLogout: () => void;
}

export const AdminProfile: React.FC<AdminProfileProps> = ({ onLogout }) => {
  const { user, adminData } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl">
      {/* Top Header */}
      <div className="pb-6 border-b border-[#584141]/30">
        <span className="text-[11px] uppercase tracking-widest text-[#edbd9b] font-semibold">
          Credenciales &amp; Seguridad
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#eae1dc] font-semibold mt-1">
          Perfil de Socio / Administrador
        </h1>
        <p className="text-xs sm:text-sm text-[#e0bfbf] mt-1">
          Información de la sesión autenticada con Firebase y privilegios asignados.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#1f1b18] border border-[#C89B7B]/30 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-[#584141]/30">
          <div className="w-20 h-20 rounded-2xl bg-[#9b1b30] text-white flex items-center justify-center font-serif text-3xl font-bold shadow-lg ring-2 ring-[#edbd9b]/40">
            {adminData?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'A'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-2xl text-[#eae1dc] font-semibold">
                {adminData?.name || user?.displayName || 'Administrador Alzza'}
              </h2>
              <span className="px-3 py-0.5 rounded-full bg-[#613f26] text-[#ffdcc4] text-[10px] uppercase tracking-widest font-semibold border border-[#edbd9b]/30">
                {adminData?.role || 'Socio'}
              </span>
            </div>
            <p className="text-sm text-[#edbd9b]">{user?.email}</p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sesión activa y verificada con Firebase Auth</span>
            </div>
          </div>
        </div>

        {/* Detailed Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-[#231f1c] border border-[#584141]/30 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#edbd9b] font-medium flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Identificador UID
            </span>
            <p className="text-[#eae1dc] font-mono text-xs break-all">{user?.uid || 'N/A'}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#231f1c] border border-[#584141]/30 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#edbd9b] font-medium flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Nivel de Autorización
            </span>
            <p className="text-[#eae1dc]">
              Acceso total para mutación CRUD en colección <code className="text-[#edbd9b]">products</code>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#231f1c] border border-[#584141]/30 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#edbd9b] font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Proveedor de Identidad
            </span>
            <p className="text-[#eae1dc]">
              {user?.providerData?.[0]?.providerId === 'google.com'
                ? 'Google Workspace OAuth'
                : 'Credencial segura cifrada'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#231f1c] border border-[#584141]/30 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#edbd9b] font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Última Conexión
            </span>
            <p className="text-[#eae1dc]">{new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="pt-8 mt-6 border-t border-[#584141]/30 flex justify-end">
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#93000a]/30 text-[#ffb4ab] border border-[#ffb4ab]/30 hover:bg-[#93000a]/50 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};
