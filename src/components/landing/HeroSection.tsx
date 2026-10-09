import React from 'react';
import { MessageSquare, BookOpen, Clock, MapPin, Phone, Wine } from 'lucide-react';
import { useBranding } from '../../context/BrandingContext';

interface HeroSectionProps {
  onOpenReservation: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenReservation }) => {
  const { logoUrl, brandName } = useBranding();
  const scrollToMenu = () => {
    const el = document.getElementById('menu') || document.getElementById('carta-menu');
    if (el) {
      const navHeight = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="relative w-full overflow-hidden bg-[#110d0b] pt-8 pb-16 scroll-mt-20">
      {/* Ambient Wine Glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[780px] h-[520px] bg-[#9b1b30]/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 -right-24 w-[420px] h-[420px] bg-[#613f26]/25 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 relative z-10">
        {/* Top Eyebrow Tag */}
        <div className="flex items-center gap-2 mb-5 sm:mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2e2926] text-[#edbd9b] text-[10px] sm:text-[11px] uppercase tracking-wider font-medium border border-[#584141]/30 shadow-sm max-w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#edbd9b] animate-pulse shrink-0"></span>
            <span className="truncate sm:whitespace-normal">
              Shopping de Encarnación • After Office • Reservas Limitadas
            </span>
          </span>
        </div>

        {/* Main Hero Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start gap-4 sm:gap-5">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <img
                alt={`${brandName} Isologo`}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shadow-md ring-1 ring-[#edbd9b]/40 shrink-0"
                src={logoUrl || '/elevva-logo.jpg'}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/elevva-logo.jpg';
                }}
              />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#edbd9b] font-medium">
                Salon &amp; Rooftop Experience
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#eae1dc] tracking-tight leading-[1.15]">
              Gastronomía <br />
              <span className="italic text-[#edbd9b] font-normal">&amp; Coctelería</span> de Altura
            </h1>

            <p className="text-sm sm:text-lg text-[#e0bfbf] max-w-[620px] font-light leading-relaxed">
              Sabores de autor y el mejor after a la altura en la noche encarnacena. Una experiencia sensorial donde la alta cocina se encuentra con la coctelería contemporánea y el horizonte de la ciudad.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-2">
              <a
                href="https://wa.me/5491188889999?text=Hola%20Elevva,%20quisiera%20reservar%20una%20mesa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#9b1b30] text-white text-[12px] uppercase tracking-wider font-semibold shadow-xl hover:bg-[#b8243c] hover:shadow-[0_4px_24px_rgba(155,27,48,0.55)] transition-all text-center"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Reservar por WhatsApp</span>
              </a>

              <button
                onClick={scrollToMenu}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#2e2926] text-[#edbd9b] text-[12px] uppercase tracking-wider font-semibold hover:bg-[#3d3835] hover:text-white transition-all border border-[#584141]/50 shadow-sm cursor-pointer text-center"
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Ver Carta de Autor</span>
              </button>
            </div>

            {/* Micro Metas */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 w-full max-w-[560px] border-t border-[#584141]/30">
              <div>
                <p className="font-serif text-lg sm:text-2xl text-[#edbd9b] font-semibold">18:00</p>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#e0bfbf] leading-tight mt-0.5">
                  Apertura Mar-Dom
                </p>
              </div>
              <div>
                <p className="font-serif text-lg sm:text-2xl text-[#edbd9b] font-semibold">Planta Alta</p>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#e0bfbf] leading-tight mt-0.5">
                  Shopping Encarnación
                </p>
              </div>
              <div>
                <p className="font-serif text-lg sm:text-2xl text-[#edbd9b] font-semibold">Signature</p>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#e0bfbf] leading-tight mt-0.5">
                  Coctelería de Autor
                </p>
              </div>
            </div>
          </div>

          {/* Hero Right Column: Showcase Card */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative rounded-2xl overflow-hidden bg-[#231f1c] p-2 sm:p-2.5 border border-[#C89B7B]/30 shadow-2xl group">
              <div className="relative w-full h-[280px] sm:h-[420px] lg:h-[460px] rounded-xl overflow-hidden">
                <img
                  alt="Cóctel de autor en barra Elevva"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuApUl6XrYrriDwV6Jqc9nAALV4LWJo73X4Wr7jXReV7r6N2XQLKSHAwUbcJuJo4SlsVYM-pqXqHovLThJ0VYLmlfkOSJWxa5Pu3mPhMtspn13sh3lS9jf3Frc9mr4zc_qkBpOQAXaAGsd3JN513UR4xJaa2eCyjpXyycAyIWgJ08tFNkPLqI2UEDQc7Kvfr66L2Vr1uKHZoZESGdPSMuF1iFjF6GA2gm_fZdxFxdN6Nl7x7kd-lO3M"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#110d0b] via-[#110d0b]/30 to-transparent"></div>

                {/* Floating badge over image */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-xl bg-[#2e2926]/90 backdrop-blur-md border border-[#C89B7B]/30 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#edbd9b] font-medium block truncate">
                      Coctel de Temporada
                    </span>
                    <span className="font-serif text-base sm:text-xl text-[#eae1dc] font-medium truncate block">
                      Negroni Ahumado Elevva
                    </span>
                  </div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#9b1b30] flex items-center justify-center text-white shadow-md shrink-0">
                    <Wine className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick info ticker bar */}
        <div className="mt-6 sm:mt-8 w-full p-3.5 sm:p-4 rounded-xl bg-[#1f1b18] border border-[#584141]/30 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs sm:text-[12px] text-[#e0bfbf]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#edbd9b] shrink-0" />
            <span>
              <strong className="text-[#eae1dc]">Horario:</strong> Martes a Domingo desde las 18:00 hs
            </span>
          </div>
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-[#584141]"></div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#edbd9b] shrink-0" />
            <span>
              <strong className="text-[#eae1dc]">Ubicación:</strong> Terraza / Planta Alta Shopping de Encarnación
            </span>
          </div>
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-[#584141]"></div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#edbd9b] shrink-0" />
            <span>
              <strong className="text-[#eae1dc]">Reservas:</strong> +54 9 11 8888 9999
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
