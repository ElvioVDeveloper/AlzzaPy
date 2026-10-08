import React, { useState } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { Product } from '../../types';

interface AdminDeleteModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (productId: string) => Promise<void>;
}

export const AdminDeleteModal: React.FC<AdminDeleteModalProps> = ({
  isOpen,
  product,
  onClose,
  onConfirm,
}) => {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !product) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm(product.id);
      onClose();
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#110d0b]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#1f1b18] border border-[#ffb4ab]/30 rounded-2xl overflow-hidden shadow-2xl p-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#584141] hover:text-[#eae1dc] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#93000a]/30 border border-[#ffb4ab]/40 flex items-center justify-center text-[#ffb4ab] shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-[#eae1dc] font-semibold">
              Confirmar Eliminación
            </h3>
            <p className="text-xs text-[#e0bfbf] mt-1">
              Esta acción no se puede deshacer y retirará el plato de la carta en tiempo real.
            </p>
          </div>
        </div>

        {/* Product Card preview */}
        <div className="p-4 rounded-xl bg-[#231f1c] border border-[#584141]/30 flex items-center gap-3 mb-6">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
          )}
          <div className="truncate">
            <p className="font-serif text-sm font-semibold text-[#eae1dc] truncate">
              {product.name}
            </p>
            <p className="text-[11px] text-[#edbd9b]">
              {product.category} • {product.price}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider text-[#e0bfbf] hover:bg-[#2e2926] hover:text-white transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#93000a] text-[#ffdad6] text-xs uppercase tracking-wider font-semibold hover:bg-[#b8243c] shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{deleting ? 'Eliminando...' : 'Sí, Eliminar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
