import React from 'react';
import { Calendar, Sparkles, Music } from 'lucide-react';

export const EventsSection: React.FC = () => {
  return (
    <section id="eventos" className="w-full bg-[#171310] py-16 lg:py-24 relative overflow-hidden scroll-mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#1f1b18] border border-[#C89B7B]/20 overflow-hidden shadow-2xl p-6 sm:p-10 lg:p-14">
          {/* Ambient Glow backing */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#9b1b30]/20 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            <div className="lg:col-span-7 flex flex-col items-start gap-5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2e2926] text-[#edbd9b] text-[10px] uppercase tracking-widest font-semibold border border-[#584141]/30">
                <span className="w-2 h-2 rounded-full bg-[#ffb3b5] animate-ping"></span>
                Ciclo de Experiencias Nocturnas
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#eae1dc] tracking-tight leading-tight">
                Noches Alzza: <br />
                <span className="italic text-[#edbd9b]">“Alzza Florece”</span> &amp; DJ Sessions
              </h2>

              <div className="flex items-center gap-2 text-[#edbd9b] text-xs sm:text-sm font-medium">
                <Calendar className="w-4 h-4" />
                <span>Viernes &amp; Sábados • Live Acoustic &amp; Sunset Lounge</span>
              </div>

              <p className="text-sm sm:text-base text-[#e0bfbf] max-w-[580px] font-light leading-relaxed">
                Disfruta de nuestros after-office exclusivos y noches temáticas con DJs invitados, mixología en vivo y una vista inigualable del anochecer encarnaceno. Reserva tu mesa con antelación para acceder al sector VIP de la terraza.
              </p>

              <div className="pt-2">
                <a
                  href="https://wa.me/595985100935?text=Hola%20Alzza,%20deseo%20consultar%20fechas%20y%20reservar%20para%20las%20Noches%20Especiales"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#9b1b30] text-white text-[12px] uppercase tracking-wider font-semibold shadow-lg hover:bg-[#b8243c] transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Consultar Fechas &amp; Reservas VIP</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative w-full h-[300px] sm:h-[380px] rounded-2xl overflow-hidden border border-[#C89B7B]/30 shadow-2xl">
                <img
                  alt="Noche sensorial en Alzza Encarnación"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQGWDloyJrhsyyH6-t-s94N9jkJtrdEb8-FtPN2u3OgsfYS22jOZ7ssR4S76-uSAodvOmFsTmXL80SreyeKXH85RoP6EG9n79NxD5RUf9VVMiwupjUmZTHPyWckf84UDdimu2nDlsvTB11We3UzOt7EzbDopY2choUPewBJBSkEEXH_hF_uRVpvGsJMTRlaKgoUV8ZMtYRhXwGE0Oo2krnJYYgdTEchU0k5qVWY0CcVM4eVkHMqQs"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#110d0b] via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-[#2e2926]/90 backdrop-blur-md rounded-xl border border-[#C89B7B]/30 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#9b1b30] flex items-center justify-center text-white shrink-0">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-[#eae1dc]">
                      Curaduría Sonora Exclusiva
                    </p>
                    <p className="text-xs text-[#e0bfbf]">Deep House, Nu-Disco &amp; Chill Beats</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
