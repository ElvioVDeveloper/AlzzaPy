import React, { useState } from 'react';
import { AlertTriangle, X, Trash2, ArrowRight } from 'lucide-react';
import { Category } from '../../types';

interface AdminCategoryDeleteModalProps {
  isOpen: boolean;
  category: Category | null;
  assignedProductCount: number;
  availableCategories: Category[];
  onClose: () => void;
  onConfirmDelete: (categoryId: string, reassignToCategoryName?: string) => Promise<void>;
}

export const AdminCategoryDeleteModal: React.FC<AdminCategoryDeleteModalProps> = ({
  isOpen,
  category,
  assignedProductCount,
  availableCategories,
  onClose,
  onConfirmDelete,
}) => {
  const [reassignCategoryName, setReassignCategoryName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !category) return null;

  // Filter out the category being deleted from available targets
  const otherCategories = availableCategories.filter((c) => c.id !== category.id);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirmDelete(
        category.id,
        assignedProductCount > 0 && reassignCategoryName ? reassignCategoryName : undefined
      );
      onClose();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const hasAssignedProducts = assignedProductCount > 0;
  const canProceed = !hasAssignedProducts || (hasAssignedProducts && reassignCategoryName !== '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#110d0b]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#1f1b18] border border-[#ffb4ab]/30 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#231f1c] border-b border-[#584141]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/40 flex items-center justify-center text-[#ffb4ab]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#ffb4ab] font-semibold">
                Confirmación de Eliminación
              </span>
              <h3 className="font-serif text-xl text-[#eae1dc] font-semibold">
                Eliminar Categoría
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#110d0b] border border-[#584141]/40 text-[#edbd9b] hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs sm:text-sm text-[#e0bfbf]">
          <p>
            ¿Estás seguro de que deseas eliminar la categoría{' '}
            <strong className="text-[#edbd9b] font-serif text-base font-medium">
              &quot;{category.name}&quot;
            </strong>
            ?
          </p>

          {/* Safety Rule Warning if products are assigned */}
          {hasAssignedProducts ? (
            <div className="p-4 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/40 space-y-3">
              <div className="flex items-start gap-2.5 text-[#ffb4ab]">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-xs text-[#ffb4ab]">
                    Regla de Seguridad Activa:
                  </p>
                  <p className="text-[11px] text-[#ffdad6] mt-0.5">
                    Esta categoría tiene <strong className="underline">{assignedProductCount} productos asignados</strong>. Reasigna los productos a otra categoría antes de eliminarla para no dejarlos huérfanos.
                  </p>
                </div>
              </div>

              {otherCategories.length > 0 ? (
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[10px] uppercase tracking-wider text-[#edbd9b] font-semibold">
                    Reasignar {assignedProductCount} productos a:
                  </label>
                  <select
                    value={reassignCategoryName}
                    onChange={(e) => setReassignCategoryName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#171310] border border-[#ffb4ab]/50 text-[#eae1dc] focus:outline-none focus:border-[#edbd9b] text-xs font-medium"
                  >
                    <option value="">Selecciona categoría de destino...</option>
                    {otherCategories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p className="text-[11px] text-[#ffb4ab]">
                  No hay otras categorías disponibles. Primero crea otra categoría para poder reasignar estos productos.
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#e0bfbf]/80 bg-[#171310] p-3 rounded-xl border border-[#584141]/30">
              Esta categoría no tiene productos asignados actualmente y se puede eliminar de manera segura.
            </p>
          )}

          <p className="text-[11px] text-[#e0bfbf]/70">
            Esta acción eliminará la pestaña correspondiente de la carta comercial en la landing page.
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#231f1c] border-t border-[#584141]/40 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider text-[#e0bfbf] hover:text-white hover:bg-[#2e2926] transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || !canProceed}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#93000a] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#b8243c] shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>
              {isDeleting
                ? 'Eliminando...'
                : hasAssignedProducts
                ? 'Reasignar y Eliminar'
                : 'Eliminar Definitivamente'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
