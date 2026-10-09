import React from 'react';
import { MapPin, Clock, MessageSquare, ShieldCheck, ExternalLink, Calendar } from 'lucide-react';

interface LocationSectionProps {
  onOpenReservation: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ onOpenReservation }) => {
  return (
    <section id="ubicacion" className="w-full bg-[#110d0b] py-12 sm:py-16 lg:py-24 relative scroll-mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-[720px] mx-auto mb-10 sm:mb-12">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#edbd9b] font-medium mb-2">
            Shopping de Encarnación
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#eae1dc] tracking-tight">
            Encuéntranos en las Alturas
          </h2>
          <p className="text-[#e0bfbf] text-xs sm:text-base mt-2 font-light">
            Fácil acceso, seguridad de primer nivel y la mejor perspectiva nocturna de Itapúa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6 bg-[#1f1b18] p-5 sm:p-8 rounded-2xl border border-[#584141]/30 shadow-xl">
            <div className="flex flex-col gap-6">
              {/* Item Dirección */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#2e2926] border border-[#584141]/40 flex items-center justify-center text-[#edbd9b] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold">
                    Dirección
                  </h4>
                  <p className="text-sm sm:text-base text-[#eae1dc] mt-1 font-medium">
                    Shopping de Encarnación, Nivel Terraza / Planta Alta.
                  </p>
                  <p className="text-xs sm:text-sm text-[#e0bfbf]">
                    Encarnación, Departamento de Itapúa, Paraguay.
                  </p>
                </div>
              </div>

              {/* Item Horarios */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#2e2926] border border-[#584141]/40 flex items-center justify-center text-[#edbd9b] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold">
                    Horario de Atención
                  </h4>
                  <p className="text-sm sm:text-base text-[#eae1dc] mt-1 font-medium">
                    Martes a Domingo: 18:00 hs — 02:00 hs.
                  </p>
                  <p className="text-xs sm:text-sm text-[#e0bfbf]">
                    Lunes cerrado para mantenimiento y eventos privados.
                  </p>
                </div>
              </div>

              {/* Item WhatsApp & Tel */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#2e2926] border border-[#584141]/40 flex items-center justify-center text-[#edbd9b] shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold">
                    WhatsApp &amp; Concierge
                  </h4>
                  <p className="text-sm sm:text-base text-[#eae1dc] mt-1 font-medium">
                    +54 9 11 8888 9999
                  </p>
                  <p className="text-xs sm:text-sm text-[#e0bfbf]">
                    Atención directa para reservas de mesas, lounges y eventos.
                  </p>
                </div>
              </div>

              {/* Item Estacionamiento */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#2e2926] border border-[#584141]/40 flex items-center justify-center text-[#edbd9b] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold">
                    Estacionamiento
                  </h4>
                  <p className="text-sm sm:text-base text-[#eae1dc] mt-1 font-medium">
                    Aparcamiento seguro y techado dentro del Shopping de Encarnación.
                  </p>
                  <p className="text-xs sm:text-sm text-[#e0bfbf]">
                    Vigilancia permanente 24/7 y acceso directo por ascensor.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct CTA button */}
            <div className="pt-4 border-t border-[#584141]/30">
              <button
                type="button"
                onClick={onOpenReservation}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#9b1b30] text-white text-[12px] uppercase tracking-wider font-semibold hover:bg-[#b8243c] shadow-lg transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Reservar Mesa en Terraza</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Map Card */}
          <div className="lg:col-span-6 flex flex-col bg-[#1f1b18] rounded-2xl overflow-hidden border border-[#584141]/30 shadow-xl p-3.5 sm:p-6">
            <div
              className="w-full h-72 sm:h-96 rounded-xl bg-[#2e2926] relative overflow-hidden flex items-center justify-center group bg-cover bg-center"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAJ_AaM4R3pksk46ojJPXaIV66OSqlJ9LYI6PRqY1pvSEP_Bl2D2lyDa2tzkB8aZvZrTeNxgtQQkxPP-Ci81igapXzC1uRxZ0HoY6WWCus4lhAMFusVgxakDYilvY8ZsZp53JnFVgR09NpOePw4F1qoRWXEwtjunFUf4ESHqqbjfIlv8BytmXW3mvKSujoipjWahl7S-ekPGnKjLb3rjuNk2OPJ3E6AOz5sQ3OQkb0Oq5WJd5S3mZg')`,
              }}
            >
              {/* Simulated Radar Beacon & Overlay */}
              <div className="absolute inset-0 bg-[#110d0b]/60 backdrop-blur-[2px]"></div>

              <div className="relative z-10 flex flex-col items-center text-center p-5 sm:p-6 bg-[#231f1c]/90 border border-[#C89B7B]/30 rounded-2xl shadow-2xl max-w-xs">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#9b1b30] flex items-center justify-center text-white mb-2.5 sm:mb-3 shadow-lg animate-bounce">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <p className="font-serif text-lg sm:text-xl text-[#eae1dc] font-semibold">Elevva Encarnación</p>
                <p className="text-xs text-[#e0bfbf] mt-1">Shopping de Encarnación, Nivel Terraza</p>
                <span className="mt-2.5 sm:mt-3 px-3 py-1 rounded-full bg-[#613f26] text-[#ffdcc4] text-[9px] sm:text-[10px] uppercase tracking-widest font-mono">
                  27°20'00"S 55°52'00"W
                </span>
              </div>
            </div>

            <div className="pt-3.5 sm:pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3">
              <div className="flex items-center gap-2 text-[#e0bfbf] text-[11px] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#edbd9b]"></span>
                <span>Encarnación, Itapúa • Paraguay</span>
              </div>
              <a
                className="inline-flex items-center gap-1.5 text-[#edbd9b] hover:text-[#ffdcc4] transition-colors text-[11px] uppercase tracking-wider font-semibold"
                href="https://maps.google.com/?q=Shopping+de+Encarnacion+Paraguay"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Abrir en Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
