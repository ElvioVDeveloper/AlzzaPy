import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Calendar } from 'lucide-react';
import { useBranding } from '../../context/BrandingContext';

interface NavbarProps {
  onOpenReservation: () => void;
  onNavigateToAdmin?: () => void;
}

const NAV_ITEMS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'concepto', label: 'Concepto' },
  { id: 'menu', label: 'Menú' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'ubicacion', label: 'Ubicación' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenReservation }) => {
  const { logoUrl, brandName } = useBranding();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('inicio');
  const isClickScrollingRef = useRef(false);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // IntersectionObserver to observe sections and dynamically update active item
  useEffect(() => {
    const sectionElements = NAV_ITEMS
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    // Observe each section with an offset matching the fixed header height (80px)
    const observer = new IntersectionObserver(
      (entries) => {
        // Skip observer state during smooth scroll animation initiated by click
        if (isClickScrollingRef.current) return;

        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        if (visibleEntries.length > 0) {
          // Sort by nearest to top of viewport (below header)
          visibleEntries.sort((a, b) => {
            const distA = Math.abs(a.boundingClientRect.top - 80);
            const distB = Math.abs(b.boundingClientRect.top - 80);
            return distA - distB;
          });

          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-80px 0px -40% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    // Handle scroll edge cases (absolute top and bottom of page)
    const handleScroll = () => {
      if (isClickScrollingRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollY < 80) {
        setActiveSection('inicio');
      } else if (scrollY + windowHeight >= docHeight - 80) {
        setActiveSection('ubicacion');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setActiveSection(id);
    isClickScrollingRef.current = true;

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 850);

    const element = document.getElementById(id);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#2B0B17]/95 backdrop-blur-md border-b border-[#C89B7B]/30 transition-all">
      <div className="h-16 sm:h-20 w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('inicio');
            }}
            className="flex items-center gap-2 sm:gap-3 group min-w-0"
          >
            <img
              src={logoUrl || '/elevva-logo.jpg'}
              alt={`${brandName} Logo`}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/elevva-logo.jpg';
              }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-1 ring-[#edbd9b]/50 shadow-md group-hover:scale-105 transition-transform shrink-0"
            />
            <span className="font-serif text-lg sm:text-2xl tracking-wider text-[#edbd9b] group-hover:text-[#ffdcc4] transition-colors font-medium truncate">
              {brandName}
            </span>
            <span className="hidden md:inline-block w-px h-4 bg-[#584141]"></span>
            <span className="hidden md:inline-block text-[10px] uppercase tracking-[0.2em] text-[#e0bfbf]/80 font-medium">
              Gastronomía &amp; Coctelería de Altura
            </span>
          </a>
        </div>

        {/* Desktop Nav: dynamic active state with single active underline */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-[12px] uppercase tracking-[0.16em] transition-all font-medium pb-1 cursor-pointer ${
                  isActive
                    ? 'text-[#edbd9b] border-b-2 border-[#edbd9b] font-semibold'
                    : 'text-[#e0bfbf] hover:text-[#eae1dc] border-b-2 border-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action button */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={onOpenReservation}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.16em] font-semibold px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#9b1b30] text-[#eae1dc] border border-[#C89B7B]/60 shadow-[0_4px_20px_rgba(155,27,48,0.45)] hover:bg-[#b8243c] hover:border-[#edbd9b] transition-all cursor-pointer whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Reservar Mesa</span>
            <span className="inline sm:hidden">Reservar</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-[#edbd9b] hover:text-white rounded-lg hover:bg-[#3a1120] transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 sm:top-20 bg-black/65 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden relative z-50 bg-[#2B0B17] border-b border-[#C89B7B]/30 px-5 py-5 flex flex-col gap-2 shadow-2xl animate-in slide-in-from-top-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-left text-xs uppercase tracking-widest transition-all cursor-pointer py-2.5 px-3 rounded-lg ${
                  isActive
                    ? 'text-[#edbd9b] font-semibold bg-[#3a1120] border-l-2 border-[#edbd9b]'
                    : 'text-[#e0bfbf] hover:text-white border-l-2 border-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenReservation();
            }}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-semibold py-3 rounded-lg bg-[#9b1b30] text-white border border-[#C89B7B]/60 shadow-lg cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Reservar Mesa en Terraza</span>
          </button>
        </div>
      )}
    </header>
  );
};
