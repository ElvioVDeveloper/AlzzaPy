import React from 'react';
import { Lock } from 'lucide-react';

interface FooterProps {
  onNavigateToAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToAdmin }) => {
  return (
    <footer className="w-full bg-[#110d0b] border-t border-[#C89B7B]/20 py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#584141]/30">
          <div className="flex items-center gap-3.5">
            <img
              src="/src/assets/images/elevva_logo_emblem_1791482529055.jpg"
              alt="Elevva Logo"
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover ring-1 ring-[#edbd9b]/40 shadow-sm shrink-0"
            />
            <div>
              <h2 className="font-serif text-2xl text-[#edbd9b] tracking-wide font-medium">Elevva</h2>
              <p className="text-xs sm:text-sm text-[#e0bfbf] mt-0.5 font-light">
                Gastronomía &amp; Coctelería de Altura — Shopping de Encarnación
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[#e0bfbf] text-xs">
            <a
              className="hover:text-[#edbd9b] transition-colors"
              href="https://instagram.com/elevva.py"
              rel="noopener noreferrer"
              target="_blank"
            >
              Instagram @elevva.py
            </a>
            <span className="text-[#584141]">•</span>
            <a
              className="hover:text-[#edbd9b] transition-colors"
              href="https://wa.me/595985100935"
              rel="noopener noreferrer"
              target="_blank"
            >
              WhatsApp +595 985 100 935
            </a>
            <span className="text-[#584141]">•</span>
            <span>Shopping de Encarnación, Paraguay</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#e0bfbf]">
          <p>© {new Date().getFullYear()} Elevva. Todos los derechos reservados.</p>

          <div className="flex items-center gap-3">
            <p className="tracking-widest uppercase text-[#edbd9b]/70 text-[10px]">
              Encarnación • Itapúa • Paraguay
            </p>

            {/* Discrete admin access for partners & owners */}
            <button
              onClick={onNavigateToAdmin}
              className="text-[#584141] hover:text-[#edbd9b] transition-colors p-1 rounded cursor-pointer opacity-50 hover:opacity-100"
              title="Portal de Administración"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
