import React, { useState } from 'react';
import {
  LayoutDashboard,
  Utensils,
  Tag,
  User,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  currentTab: 'dashboard' | 'products' | 'categories' | 'profile';
  onSelectTab: (tab: 'dashboard' | 'products' | 'categories' | 'profile') => void;
  onNavigateLanding: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onNavigateLanding,
  children,
}) => {
  const { user, adminData, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    onNavigateLanding();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Servicios & Productos', icon: Utensils },
    { id: 'categories', label: 'Categorías', icon: Tag },
    { id: 'profile', label: 'Perfil de Socio', icon: User },
  ] as const;

  return (
    <div className="min-h-screen bg-[#110d0b] text-[#eae1dc] flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-[#1f1b18] border-b border-[#584141]/40 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl text-[#edbd9b] font-medium">Alzza</span>
          <span className="text-[10px] uppercase tracking-wider bg-[#2e2926] px-2 py-0.5 rounded text-[#e0bfbf]">
            Admin
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#edbd9b]"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-[#171310] border-r border-[#C89B7B]/20 flex flex-col justify-between p-6 z-50 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-8">
          {/* Brand header */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-serif text-2xl text-[#edbd9b] tracking-wider font-semibold">
                Alzza
              </span>
              <p className="text-[10px] uppercase tracking-widest text-[#e0bfbf] font-medium mt-0.5">
                Panel de Administración
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#2e2926] border border-[#584141]/50 flex items-center justify-center text-[#edbd9b]">
              <Shield className="w-4 h-4" />
            </div>
          </div>

          {/* User badge */}
          <div className="p-3.5 rounded-xl bg-[#1f1b18] border border-[#584141]/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#9b1b30] text-white flex items-center justify-center font-serif text-base font-semibold shrink-0">
              {adminData?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-[#eae1dc] truncate">
                {adminData?.name || user?.displayName || 'Administrador'}
              </p>
              <p className="text-[10px] text-[#edbd9b] truncate">{user?.email}</p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#9b1b30] text-white shadow-lg'
                      : 'text-[#e0bfbf] hover:bg-[#231f1c] hover:text-[#eae1dc]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2 pt-6 border-t border-[#584141]/40">
          <button
            onClick={onNavigateLanding}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs text-[#edbd9b] hover:bg-[#231f1c] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ver Landing Pública</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-[#ffb4ab] hover:bg-[#93000a]/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen p-4 sm:p-8 lg:p-10 max-w-7xl">
        {children}
      </main>
    </div>
  );
};
