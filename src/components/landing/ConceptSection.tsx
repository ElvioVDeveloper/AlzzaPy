import React from 'react';
import { Wine, Utensils, Moon, ArrowRight } from 'lucide-react';

export const ConceptSection: React.FC = () => {
  return (
    <section id="concepto" className="w-full bg-[#171310] py-16 lg:py-24 relative scroll-mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-[760px] mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#edbd9b] font-medium mb-2">
            La Esencia de Elevva
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#eae1dc] tracking-tight">
            Un homenaje a la noche, la técnica y los sentidos
          </h2>
          <p className="text-[#e0bfbf] text-sm sm:text-base mt-3 leading-relaxed font-light">
            Ubicado en el epicentro cosmopolita de Encarnación, Elevva nace para resignificar el ritual de la sobremesa y el after-office. Diseñamos atmósferas que provocan el asombro.
          </p>
        </div>

        {/* 3-Column Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1 */}
          <div className="relative bg-[#1f1b18] rounded-2xl p-6 sm:p-8 border border-[#584141]/30 shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#2e2926] border border-[#584141]/40 flex items-center justify-center text-[#edbd9b] group-hover:bg-[#9b1b30] group-hover:text-white transition-colors">
                <Wine className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#eae1dc] mb-2 font-medium">Sabores de Autor</h3>
                <p className="text-xs sm:text-sm text-[#e0bfbf] leading-relaxed font-light">
                  Coctelería exclusiva concebida con botánicos selectos, destilados premium e infusiones artesanales. Cada copa es una obra de arte creada en vivo con ahumados, espumas y extractos nobles.
                </p>
              </div>
            </div>
            <div className="pt-6 flex items-center gap-2 text-[#edbd9b] text-[11px] uppercase tracking-wider font-semibold">
              <span>Mixología de Vanguardia</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative bg-[#1f1b18] rounded-2xl p-6 sm:p-8 border border-[#584141]/30 shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#2e2926] border border-[#584141]/40 flex items-center justify-center text-[#edbd9b] group-hover:bg-[#9b1b30] group-hover:text-white transition-colors">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#eae1dc] mb-2 font-medium">Gastronomía Exclusiva</h3>
                <p className="text-xs sm:text-sm text-[#e0bfbf] leading-relaxed font-light">
                  Platos de autor diseñados meticulosamente para maridaje de alto nivel. Cortes nobles, cocciones lentas al vacío y presentaciones contemporáneas pensadas para compartir o saborear a solas.
                </p>
              </div>
            </div>
            <div className="pt-6 flex items-center gap-2 text-[#edbd9b] text-[11px] uppercase tracking-wider font-semibold">
              <span>Maridajes de Altura</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative bg-[#1f1b18] rounded-2xl p-6 sm:p-8 border border-[#584141]/30 shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#2e2926] border border-[#584141]/40 flex items-center justify-center text-[#edbd9b] group-hover:bg-[#9b1b30] group-hover:text-white transition-colors">
                <Moon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#eae1dc] mb-2 font-medium">Noche Encarnacena</h3>
                <p className="text-xs sm:text-sm text-[#e0bfbf] leading-relaxed font-light">
                  El punto de encuentro y after-office de referencia en Itapúa. Acústica cálida, iluminación tenue, curaduría de música electrónica selecta y vistas panorámicas sobre el perfil de la ciudad.
                </p>
              </div>
            </div>
            <div className="pt-6 flex items-center gap-2 text-[#edbd9b] text-[11px] uppercase tracking-wider font-semibold">
              <span>After Office &amp; Lounge</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
