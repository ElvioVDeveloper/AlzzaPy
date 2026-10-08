import React from 'react';
import { X, MessageSquare, Sparkles, Tag, Wine } from 'lucide-react';
import { Product } from '../../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenReservation: (productName?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenReservation,
}) => {
  if (!product) return null;

  const productName = product.name || product.nombre || '';
  const productPrice = product.price || product.precio || '';
  const productDesc = product.description || product.descripcion || '';
  const productCategory = product.category || product.categoria || '';
  const productImage = product.image || product.imagen || '';

  const whatsappMessage = encodeURIComponent(
    `Hola Elevva Encarnación, deseo consultar disponibilidad y reservar una mesa para degustar su creación "${productName}" (${productPrice}).`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#110d0b]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#1f1b18] border border-[#C89B7B]/40 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#110d0b]/80 border border-[#584141]/50 text-[#edbd9b] hover:text-white hover:bg-[#9b1b30] flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Banner */}
        {productImage && (
          <div className="relative w-full h-64 sm:h-72 bg-[#171310] overflow-hidden">
            <img
              src={productImage}
              alt={productName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f1b18] via-transparent to-transparent"></div>

            {product.badge && (
              <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#9b1b30] text-white text-[11px] uppercase tracking-widest font-semibold shadow-lg">
                {product.badge}
              </span>
            )}
          </div>
        )}

        {/* Details Body */}
        <div className="p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-[11px] uppercase tracking-widest text-[#edbd9b] font-medium flex items-center gap-1.5">
                <Wine className="w-3.5 h-3.5" />
                {productCategory}
              </span>

              <span className="font-serif text-2xl text-[#edbd9b] font-semibold">
                {productPrice}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-[#eae1dc] font-semibold">
              {productName}
            </h2>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold">
              Notas de Cata &amp; Preparación
            </h4>
            <p className="text-sm sm:text-base text-[#e0bfbf] leading-relaxed font-light">
              {productDesc}
            </p>
          </div>

          {product.tag && (
            <div className="flex items-center gap-2 pt-2">
              <Tag className="w-4 h-4 text-[#edbd9b]" />
              <span className="text-xs text-[#eae1dc] font-medium bg-[#2e2926] px-3 py-1 rounded-full border border-[#584141]/30">
                {product.tag}
              </span>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[#584141]/30 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={`https://wa.me/595985100935?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#9b1b30] text-white text-[12px] uppercase tracking-wider font-semibold hover:bg-[#b8243c] shadow-lg transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Pedir o Reservar por WhatsApp</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onOpenReservation(productName);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-[#2e2926] text-[#edbd9b] text-[12px] uppercase tracking-wider font-medium hover:bg-[#3d3835] hover:text-white transition-all border border-[#584141]/50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Agendar Mesa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
