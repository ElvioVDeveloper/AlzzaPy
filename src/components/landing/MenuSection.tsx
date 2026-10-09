import React, { useState } from 'react';
import { FileText, Plus, Eye, Loader2, MessageSquare } from 'lucide-react';
import { Product, Category, DEFAULT_CATEGORIES } from '../../types';
import { generateMenuPDF } from '../../services/pdfGenerator';
import { renderCategoryIcon } from '../admin/AdminCategoryModal';

interface MenuSectionProps {
  products: Product[];
  categories?: Category[];
  loading: boolean;
  onSelectProduct: (product: Product) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  products,
  categories = DEFAULT_CATEGORIES,
  loading,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Filter only active products for the public landing
  const activeProducts = products.filter(
    (p) => p.status === 'activo' || p.activo === true
  );

  // Active categories sorted by display order
  const activeCategories = [...categories]
    .filter((c) => c.status === 'activo')
    .sort((a, b) => a.order - b.order);

  // Display categories: active ones, or fallback to defaults
  const displayCategories = activeCategories.length > 0 ? activeCategories : DEFAULT_CATEGORIES;

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      await generateMenuPDF(products, categories);
    } catch (error) {
      console.error('Error al generar el PDF del menú:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const filteredProducts =
    selectedCategory === 'Todos'
      ? activeProducts
      : activeProducts.filter(
          (p) => (p.category || p.categoria) === selectedCategory
        );

  const getCategoryIcon = (categoryName: string) => {
    const found = displayCategories.find((c) => c.name === categoryName);
    return renderCategoryIcon(found?.icon, 'w-3.5 h-3.5 text-[#edbd9b]');
  };

  return (
    <section id="menu" className="w-full bg-[#110d0b] py-12 sm:py-16 lg:py-24 relative scroll-mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#edbd9b] font-medium">
              Selección Gastronómica &amp; Barra
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#eae1dc] tracking-tight mt-1">
              Nuestra Carta de Autor
            </h2>
            <p className="text-[#e0bfbf] text-xs sm:text-base mt-2 max-w-[620px] font-light">
              Creaciones diseñadas por nuestro equipo de mixólogos y chefs ejecutivos. Ingredientes autóctonos con técnica de alta cocina internacional.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Dynamic PDF Download Button */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg bg-[#2e2926] text-[#edbd9b] text-[11px] sm:text-[12px] uppercase tracking-wider font-semibold hover:bg-[#3d3835] hover:text-white transition-all border border-[#584141]/50 shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-wait text-center w-full sm:w-auto"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#edbd9b]" />
                  <span>Generando PDF...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-[#edbd9b]" />
                  <span>Descargar Carta (PDF)</span>
                </>
              )}
            </button>

            {/* Separate Dedicated Button for WhatsApp Reservations */}
            <a
              href="https://wa.me/5491188889999?text=Hola%20Elevva,%20quisiera%20consultar%20por%20la%20carta%20y%20hacer%20una%20reserva"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#9b1b30] text-white text-[11px] sm:text-[12px] uppercase tracking-wider font-semibold hover:bg-[#b8243c] transition-colors border border-[#C89B7B]/40 shadow-sm text-center w-full sm:w-auto"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Reservar por WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Category Filter Pills: Edge-to-edge scroll on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none mb-8 sm:mb-10 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setSelectedCategory('Todos')}
            className={`px-5 py-2 rounded-full text-[11px] uppercase tracking-wider font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'Todos'
                ? 'bg-[#9b1b30] text-white shadow-md'
                : 'bg-[#231f1c] text-[#e0bfbf] hover:text-white hover:bg-[#2e2926] border border-[#584141]/30'
            }`}
          >
            TODOS ({activeProducts.length})
          </button>

          {displayCategories.map((cat) => {
            const count = activeProducts.filter(
              (p) => (p.category || p.categoria) === cat.name
            ).length;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id || cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] uppercase tracking-wider font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#9b1b30] text-white shadow-md'
                    : 'bg-[#231f1c] text-[#e0bfbf] hover:text-white hover:bg-[#2e2926] border border-[#584141]/30'
                }`}
              >
                {renderCategoryIcon(cat.icon, `w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#edbd9b]'}`)}
                <span>{cat.name.toUpperCase()}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#171310] text-[#edbd9b]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading State Skeleton (only if strictly loading and no cached products) */}
        {loading && activeProducts.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-[#231f1c] rounded-2xl overflow-hidden p-4 border border-[#584141]/30 animate-pulse h-96 flex flex-col justify-between"
              >
                <div className="w-full h-56 bg-[#2e2926] rounded-xl mb-4"></div>
                <div className="h-4 bg-[#2e2926] rounded w-1/3 mb-2"></div>
                <div className="h-5 bg-[#2e2926] rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-[#2e2926] rounded w-full mb-4"></div>
                <div className="h-5 bg-[#2e2926] rounded w-1/4"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {(!loading || activeProducts.length > 0) && filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-[#1f1b18] rounded-2xl border border-[#584141]/30 p-8">
            <p className="font-serif text-2xl text-[#edbd9b] mb-2">No hay platos en esta categoría</p>
            <p className="text-sm text-[#e0bfbf]">El menú se actualiza periódicamente por nuestro chef y mixólogos.</p>
          </div>
        )}

        {/* 3-Column Menu Grid: 1 col mobile, 2 cols tablet, 3 cols desktop */}
        {filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => {
              const productName = product.name || product.nombre || '';
              const productDesc = product.description || product.descripcion || '';
              const productPrice = product.price || product.precio || '';
              const productCategory = product.category || product.categoria || '';
              const productImage = product.image || product.imagen || '';

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="bg-[#231f1c] rounded-2xl overflow-hidden border border-[#584141]/30 shadow-xl hover:-translate-y-1 hover:border-[#edbd9b]/50 transition-all duration-300 flex flex-col h-full cursor-pointer group"
                >
                  {/* Image container: Uniform proportion */}
                  <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-[#171310] shrink-0">
                    <img
                      alt={productName}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      src={productImage}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#231f1c] via-[#231f1c]/20 to-transparent"></div>

                    {product.badge && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#9b1b30] text-white text-[10px] uppercase tracking-widest font-semibold shadow-md">
                        {product.badge}
                      </span>
                    )}

                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-[#110d0b]/80 p-2 rounded-full text-[#edbd9b] backdrop-blur-sm border border-[#C89B7B]/20">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Card Body with uniform flex stretch */}
                  <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow gap-3.5 sm:gap-4">
                    <div className="space-y-2">
                      {/* [Categoría] */}
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#edbd9b] font-semibold">
                        {getCategoryIcon(productCategory)}
                        <span>{productCategory}</span>
                      </div>

                      {/* [Nombre] */}
                      <h3 className="font-serif text-xl text-[#eae1dc] font-medium leading-snug group-hover:text-[#edbd9b] transition-colors">
                        {productName}
                      </h3>

                      {/* [Descripción] */}
                      <p className="text-xs sm:text-sm text-[#e0bfbf] leading-relaxed line-clamp-3 font-light">
                        {productDesc}
                      </p>
                    </div>

                    {/* [Precio] & Interaction Footer */}
                    <div className="pt-4 border-t border-[#584141]/30 flex items-center justify-between mt-auto">
                      <span className="font-serif text-lg sm:text-xl text-[#edbd9b] whitespace-nowrap font-medium">
                        {productPrice}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(product);
                        }}
                        className="w-8 h-8 rounded-full bg-[#2e2926] hover:bg-[#9b1b30] flex items-center justify-center text-white transition-colors cursor-pointer border border-[#584141]/40"
                        title="Ver detalles del producto"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
