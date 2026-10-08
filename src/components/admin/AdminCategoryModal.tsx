import React, { useState, useEffect } from 'react';
import {
  X,
  AlertCircle,
  Wine,
  UtensilsCrossed,
  Flame,
  Sparkles,
  Grape,
  Coffee,
  Cake,
  Beer,
  GlassWater,
  Fish,
  Beef,
  Salad,
  Martini,
  Tag,
  Check,
} from 'lucide-react';
import { Category, CategoryStatus } from '../../types';
import { generateSlug } from '../../services/categoryService';

export const AVAILABLE_CATEGORY_ICONS = [
  { name: 'Wine', label: 'Copa de Vino', Icon: Wine },
  { name: 'Martini', label: 'Coctelería', Icon: Martini },
  { name: 'UtensilsCrossed', label: 'Cubiertos', Icon: UtensilsCrossed },
  { name: 'Flame', label: 'Fuego / Parrilla', Icon: Flame },
  { name: 'Sparkles', label: 'Destacado / Autor', Icon: Sparkles },
  { name: 'Grape', label: 'Vinos / Cepa', Icon: Grape },
  { name: 'Beef', label: 'Cortes & Carnes', Icon: Beef },
  { name: 'Fish', label: 'Pescados & Mar', Icon: Fish },
  { name: 'Salad', label: 'Entradas & Frescos', Icon: Salad },
  { name: 'Cake', label: 'Postres & Dulces', Icon: Cake },
  { name: 'Coffee', label: 'Cafetería', Icon: Coffee },
  { name: 'Beer', label: 'Cervecería / Bar', Icon: Beer },
  { name: 'GlassWater', label: 'Bebidas & Refrescos', Icon: GlassWater },
  { name: 'Tag', label: 'Etiqueta Especial', Icon: Tag },
];

export function renderCategoryIcon(iconName?: string, className = 'w-4 h-4 text-[#edbd9b]') {
  const found = AVAILABLE_CATEGORY_ICONS.find((item) => item.name === iconName);
  if (found) {
    const Component = found.Icon;
    return <Component className={className} />;
  }
  return <Sparkles className={className} />;
}

interface AdminCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: Omit<Category, 'id'>, oldName?: string) => Promise<void>;
  editingCategory: Category | null;
  existingCount: number;
}

export const AdminCategoryModal: React.FC<AdminCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCategory,
  existingCount,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugModifiedManually, setSlugModifiedManually] = useState(false);
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [icon, setIcon] = useState('Wine');
  const [status, setStatus] = useState<CategoryStatus>('activo');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setSlug(editingCategory.slug);
      setSlugModifiedManually(true);
      setDescription(editingCategory.description || '');
      setOrder(editingCategory.order || 1);
      setIcon(editingCategory.icon || 'Sparkles');
      setStatus(editingCategory.status);
    } else {
      setName('');
      setSlug('');
      setSlugModifiedManually(false);
      setDescription('');
      setOrder(existingCount + 1);
      setIcon('Wine');
      setStatus('activo');
    }
    setError(null);
  }, [editingCategory, isOpen, existingCount]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugModifiedManually) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(generateSlug(val));
    setSlugModifiedManually(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('El nombre de la categoría es obligatorio.');
      return;
    }

    const finalSlug = slug.trim() || generateSlug(trimmedName);
    if (!finalSlug) {
      setError('El slug o identificador es obligatorio.');
      return;
    }

    setSaving(true);
    try {
      await onSave(
        {
          name: trimmedName,
          slug: finalSlug,
          description: description.trim() || undefined,
          order: Number(order) || 1,
          icon,
          status,
        },
        editingCategory ? editingCategory.name : undefined
      );
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar la categoría';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#110d0b]/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-xl bg-[#1f1b18] border border-[#C89B7B]/40 rounded-2xl overflow-hidden shadow-2xl my-8 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-[#231f1c] border-b border-[#584141]/40 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#edbd9b] font-semibold">
              Estructura de la Carta
            </span>
            <h3 className="font-serif text-2xl text-[#eae1dc] font-semibold">
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#110d0b] border border-[#584141]/40 text-[#edbd9b] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-4 rounded-xl bg-[#93000a]/30 border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Nombre & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-7">
              <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1">
                Nombre de la Categoría *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Coctelería de Autor, Fondos de Autor"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-sm"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1">
                Slug / Identificador *
              </label>
              <input
                type="text"
                required
                placeholder="cocteleria-de-autor"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-xs font-mono"
              />
            </div>
          </div>

          {/* Orden de Despliegue & Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1">
                Orden de Despliegue *
              </label>
              <input
                type="number"
                min={1}
                max={99}
                required
                value={order}
                onChange={(e) => setOrder(Number(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] focus:outline-none focus:border-[#edbd9b] text-sm"
              />
              <p className="text-[10px] text-[#e0bfbf]/70 mt-1">
                Define la posición de la pestaña en la landing page (1 es la primera).
              </p>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1">
                Estado de Visibilidad *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CategoryStatus)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] focus:outline-none focus:border-[#edbd9b] text-sm"
              >
                <option value="activo">Visible en Landing (Activa)</option>
                <option value="inactivo">Oculta (Inactiva)</option>
              </select>
              <p className="text-[10px] text-[#e0bfbf]/70 mt-1">
                Si está inactiva, la pestaña no aparecerá en la carta pública.
              </p>
            </div>
          </div>

          {/* Descripción Corta */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1">
              Descripción Corta (Opcional)
            </label>
            <input
              type="text"
              placeholder="Breve reseña que describe esta sección en el menú..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-sm"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-2">
              Icono / Ilustración de la Pestaña
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto p-1 border border-[#584141]/30 rounded-xl bg-[#171310]">
              {AVAILABLE_CATEGORY_ICONS.map((item) => {
                const ItemIcon = item.Icon;
                const isSelected = icon === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIcon(item.name)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#9b1b30] border-[#C89B7B] text-white shadow-md'
                        : 'bg-[#1f1b18] border-[#584141]/30 text-[#e0bfbf] hover:text-[#eae1dc] hover:border-[#edbd9b]/40'
                    }`}
                  >
                    <ItemIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-[#edbd9b]'}`} />
                    <span className="text-[11px] truncate">{item.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notice on name change for editing */}
          {editingCategory && (
            <div className="p-3 rounded-xl bg-[#2e2926] border border-[#584141]/40 text-[11px] text-[#edbd9b]">
              💡 <strong>Actualización automática:</strong> Si modificas el nombre de esta categoría, los productos vinculados se actualizarán automáticamente para mantener la relación.
            </div>
          )}

          {/* Footer Submit */}
          <div className="pt-4 border-t border-[#584141]/40 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider text-[#e0bfbf] hover:text-white hover:bg-[#2e2926] transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#9b1b30] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#b8243c] shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>{saving ? 'Guardando...' : editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
