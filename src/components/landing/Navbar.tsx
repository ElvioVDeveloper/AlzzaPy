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
    <header className="fixed top-0 w-full z-50 bg-[#2B0B17]/90 backdrop-blur-md border-b border-[#C89B7B]/30 transition-all">
      <div className="h-20 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('inicio');
            }}
            className="flex items-center gap-3 group"
          >
            <img
              src={logoUrl || '/elevva-logo.jpg'}
              alt={`${brandName} Logo`}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/elevva-logo.jpg';
              }}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-[#edbd9b]/50 shadow-md group-hover:scale-105 transition-transform"
            />
            <span className="font-serif text-2xl tracking-wider text-[#edbd9b] group-hover:text-[#ffdcc4] transition-colors font-medium">
              {brandName}
            </span>
            <span className="hidden sm:inline-block w-px h-4 bg-[#584141]"></span>
            <span className="hidden sm:inline-block text-[10px] uppercase tracking-[0.2em] text-[#e0bfbf]/80 font-medium">
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
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenReservation}
            className="inline-flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.16em] font-semibold px-4 py-2.5 rounded-lg bg-[#9b1b30] text-[#eae1dc] border border-[#C89B7B]/60 shadow-[0_4px_20px_rgba(155,27,48,0.45)] hover:bg-[#b8243c] hover:border-[#edbd9b] transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Reservar Mesa</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#edbd9b] hover:text-white transition-colors cursor-pointer"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#2B0B17] border-b border-[#C89B7B]/30 px-6 py-5 flex flex-col gap-3 animate-in slide-in-from-top-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-left text-[13px] uppercase tracking-widest transition-all cursor-pointer py-2 px-3 rounded-lg ${
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
            className="w-full mt-3 inline-flex items-center justify-center gap-2 text-[12px] uppercase tracking-widest font-semibold py-3 rounded-lg bg-[#9b1b30] text-white border border-[#C89B7B]/60 shadow-lg cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Reservar Mesa</span>
          </button>
        </div>
      )}
    </header>
  );
};
