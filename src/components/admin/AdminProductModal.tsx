import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Product, PRODUCT_CATEGORIES, ProductCategory, Category, DEFAULT_CATEGORIES } from '../../types';
import { GALLERY_PRESETS } from '../../data/defaultProducts';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'>) => Promise<void>;
  editingProduct: Product | null;
  categories?: Category[];
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  categories = DEFAULT_CATEGORIES,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('Gs. ');
  const [category, setCategory] = useState<ProductCategory>('Coctelería de Autor');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'activo' | 'inactivo'>('activo');
  const [badge, setBadge] = useState('');
  const [tag, setTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derive dynamic list of categories: active ones or currently selected
  const activeCategoryList = categories.filter((c) => c.status === 'activo');
  const availableCategories = activeCategoryList.length > 0 ? activeCategoryList : categories;
  const defaultCategoryName = availableCategories[0]?.name || 'Coctelería de Autor';

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description);
      setPrice(editingProduct.price);
      setCategory(editingProduct.category || editingProduct.categoria || defaultCategoryName);
      setImage(editingProduct.image);
      setStatus(editingProduct.status);
      setBadge(editingProduct.badge || '');
      setTag(editingProduct.tag || '');
    } else {
      setName('');
      setDescription('');
      setPrice('Gs. ');
      setCategory(defaultCategoryName);
      setImage(GALLERY_PRESETS[0].url);
      setStatus('activo');
      setBadge('');
      setTag('');
    }
    setError(null);
  }, [editingProduct, isOpen, defaultCategoryName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('El nombre del servicio o producto es obligatorio.');
      return;
    }

    if (!description.trim()) {
      setError('La descripción gastronómica es obligatoria.');
      return;
    }

    if (!price.trim()) {
      setError('El precio es obligatorio (ej. Gs. 55.000).');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        price: price.trim(),
        category,
        image: image.trim(),
        status,
        badge: badge.trim() || undefined,
        tag: tag.trim() || undefined,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el producto';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#110d0b]/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[#1f1b18] border border-[#C89B7B]/40 rounded-2xl overflow-hidden shadow-2xl my-8 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-[#231f1c] border-b border-[#584141]/40 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#edbd9b] font-semibold">
              Gestión Gastronómica
            </span>
            <h3 className="font-serif text-2xl text-[#eae1dc] font-semibold">
              {editingProduct ? 'Editar Servicio / Producto' : 'Crear Nuevo Servicio / Producto'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#110d0b] border border-[#584141]/40 text-[#edbd9b] hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-4 rounded-xl bg-[#93000a]/30 border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Name & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1">
                Nombre de la Creación o Servicio *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Elevva Florece"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-sm"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1">
                Precio *
              </label>
              <input
                type="text"
                required
                placeholder="Gs. 55.000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-sm font-serif"
              />
            </div>
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1">
                Categoría *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] focus:outline-none focus:border-[#edbd9b] text-sm"
              >
                {availableCategories.map((cat) => (
                  <option key={cat.id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
                {!availableCategories.some((c) => c.name === category) && category && (
                  <option value={category}>{category}</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1">
                Estado de Publicación *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'activo' | 'inactivo')}
                className="w-full px-3 py-2.5 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] focus:outline-none focus:border-[#edbd9b] text-sm"
              >
                <option value="activo">Activo (Visible en Landing)</option>
                <option value="inactivo">Inactivo (Oculto del público)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1">
              Descripción Gastronómica &amp; Notas de Cata *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Ingredientes nobles, técnicas de cocción, maridaje o botánicos..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-sm resize-none"
            />
          </div>

          {/* Badge & Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1">
                Badge / Distintivo (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Firma Elevva, Recomendado, Exclusivo"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold mb-1">
                Etiqueta Sensorial / Perfil (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Aromático • Floral, Intenso & Ahumado"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-sm"
              />
            </div>
          </div>

          {/* Image URL & Presets */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] uppercase tracking-wider text-[#edbd9b] font-semibold">
                Imagen del Producto (URL o Galería Elevva)
              </label>
              <span className="text-[10px] text-[#e0bfbf]">Previsualización en vivo</span>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="url"
                  placeholder="https://..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-xs font-mono"
                />
                <ImageIcon className="w-4 h-4 text-[#584141] absolute left-3.5 top-3" />
              </div>

              {image && (
                <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#edbd9b]/50 shrink-0">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Quick Gallery Presets */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#584141] mb-2 font-medium">
                Selección rápida de imágenes oficiales:
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {GALLERY_PRESETS.map((preset, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setImage(preset.url)}
                    className={`relative h-14 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                      image === preset.url
                        ? 'border-[#edbd9b] ring-2 ring-[#edbd9b]'
                        : 'border-[#584141]/40 opacity-70 hover:opacity-100'
                    }`}
                    title={preset.name}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover"
                    />
                    {image === preset.url && (
                      <div className="absolute inset-0 bg-[#9b1b30]/60 flex items-center justify-center text-white">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

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
              <span>{saving ? 'Guardando...' : editingProduct ? 'Actualizar Producto' : 'Crear Producto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
