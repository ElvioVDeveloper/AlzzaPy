import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  Utensils,
} from 'lucide-react';
import { Category, CategoryStatus, Product } from '../../types';
import { renderCategoryIcon } from './AdminCategoryModal';

interface AdminCategoriesProps {
  categories: Category[];
  products: Product[];
  onOpenCreate: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
  onReorderCategory: (category: Category, direction: 'up' | 'down') => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  products,
  onOpenCreate,
  onEditCategory,
  onDeleteCategory,
  onToggleStatus,
  onReorderCategory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'Todos' | 'activo' | 'inactivo'>('Todos');

  // Compute active products count for each category
  const getProductCount = (categoryName: string) => {
    return products.filter(
      (p) => (p.category === categoryName || p.categoria === categoryName) && (p.status === 'activo' || p.activo === true)
    ).length;
  };

  const getTotalProductCount = (categoryName: string) => {
    return products.filter(
      (p) => p.category === categoryName || p.categoria === categoryName
    ).length;
  };

  // Filter categories
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      selectedStatus === 'Todos' || cat.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#584141]/30">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#edbd9b] font-semibold">
            Estructura &amp; Filtros de Menú
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#eae1dc] font-semibold mt-1">
            Gestión de Categorías
          </h1>
          <p className="text-xs sm:text-sm text-[#e0bfbf] mt-1">
            Organiza las pestañas de navegación de la landing page y las opciones de clasificación de los productos.
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#9b1b30] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#b8243c] shadow-lg transition-all w-full sm:w-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-[#1f1b18] border border-[#C89B7B]/30 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-[#2e2926] border border-[#584141]/50 flex items-center justify-center text-[#edbd9b] shrink-0 mt-0.5">
          <Layers className="w-4 h-4" />
        </div>
        <div className="text-xs text-[#e0bfbf] space-y-1">
          <p className="text-[#eae1dc] font-medium">
            Sincronización directa en vivo con la Landing Page
          </p>
          <p className="text-[#e0bfbf]/80 leading-relaxed">
            Las categorías activas se muestran en orden secuencial como botones de filtro en la sección <strong>&quot;MENÚ&quot;</strong> pública. Cualquier cambio de orden, nombre o visibilidad se refleja al instante para los comensales.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#1f1b18] border border-[#584141]/40 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#584141] absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Buscar por nombre, slug o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-xs sm:text-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3.5 py-2.5 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] focus:outline-none focus:border-[#edbd9b] text-xs font-medium"
          >
            <option value="Todos">Todos los Estados</option>
            <option value="activo">Solo Activas (Visibles)</option>
            <option value="inactivo">Solo Inactivas (Ocultas)</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#e0bfbf]">
        <p>
          Mostrando <strong className="text-[#edbd9b]">{filteredCategories.length}</strong> de{' '}
          {categories.length} categorías registradas
        </p>
      </div>

      {/* Categories Table */}
      {filteredCategories.length === 0 ? (
        <div className="bg-[#1f1b18] border border-[#584141]/40 rounded-2xl p-12 text-center text-[#e0bfbf]">
          <p className="font-serif text-xl text-[#edbd9b] mb-2">No se encontraron categorías</p>
          <p className="text-xs">Prueba ajustando el término de búsqueda o crea una nueva categoría.</p>
        </div>
      ) : (
        <div className="bg-[#1f1b18] border border-[#584141]/40 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#584141]/40 bg-[#231f1c] text-[10px] uppercase tracking-wider text-[#edbd9b] font-semibold">
                  <th className="py-3.5 px-4 sm:px-6">Categoría</th>
                  <th className="py-3.5 px-4">Slug / Identificador</th>
                  <th className="py-3.5 px-4 text-center">Orden</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4 text-center">Productos</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#584141]/20 text-xs sm:text-sm">
                {filteredCategories.map((category, index) => {
                  const isActive = category.status === 'activo';
                  const activeCount = getProductCount(category.name);
                  const totalCount = getTotalProductCount(category.name);

                  return (
                    <tr
                      key={category.id}
                      className="hover:bg-[#231f1c]/50 transition-colors group"
                    >
                      {/* Name & Icon */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-[#2e2926] border border-[#584141]/40 flex items-center justify-center shrink-0 text-[#edbd9b] group-hover:border-[#edbd9b]/40 transition-colors">
                            {renderCategoryIcon(category.icon, 'w-5 h-5 text-[#edbd9b]')}
                          </div>
                          <div className="min-w-0">
                            <span className="font-serif text-sm sm:text-base font-semibold text-[#eae1dc] group-hover:text-[#edbd9b] transition-colors">
                              {category.name}
                            </span>
                            {category.description && (
                              <p className="text-[11px] text-[#e0bfbf] line-clamp-1 max-w-sm mt-0.5">
                                {category.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-[#171310] border border-[#584141]/40 text-[#edbd9b]">
                          #{category.slug}
                        </span>
                      </td>

                      {/* Order Controls */}
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        <div className="inline-flex items-center gap-1.5 bg-[#171310] border border-[#584141]/40 rounded-xl px-2 py-1">
                          <button
                            type="button"
                            onClick={() => onReorderCategory(category, 'up')}
                            disabled={index === 0}
                            className="p-1 rounded-md text-[#e0bfbf] hover:text-[#edbd9b] hover:bg-[#2e2926] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                            title="Subir posición"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-5 text-center font-serif text-xs font-semibold text-[#eae1dc]">
                            {category.order}
                          </span>
                          <button
                            type="button"
                            onClick={() => onReorderCategory(category, 'down')}
                            disabled={index === filteredCategories.length - 1}
                            className="p-1 rounded-md text-[#e0bfbf] hover:text-[#edbd9b] hover:bg-[#2e2926] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                            title="Bajar posición"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => onToggleStatus(category)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-700/50 hover:bg-emerald-900/60'
                              : 'bg-[#93000a]/30 text-[#ffb4ab] border border-[#93000a]/60 hover:bg-[#93000a]/50'
                          }`}
                          title="Haz clic para alternar visibilidad en la carta"
                        >
                          {isActive ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Activo</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>Inactivo</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Products Count */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${
                            activeCount > 0
                              ? 'bg-[#2e2926] border-[#584141]/50 text-[#edbd9b]'
                              : 'bg-[#171310] border-[#584141]/20 text-[#e0bfbf]/50'
                          }`}
                        >
                          <Utensils className="w-3 h-3" />
                          <span>
                            {activeCount} {activeCount === 1 ? 'producto' : 'productos'}
                          </span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEditCategory(category)}
                            className="p-2 rounded-xl bg-[#2e2926] text-[#e0bfbf] hover:text-[#edbd9b] hover:bg-[#3d3835] transition-all cursor-pointer border border-[#584141]/40"
                            title="Editar Categoría"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onDeleteCategory(category)}
                            className="p-2 rounded-xl bg-[#2e2926] text-[#e0bfbf] hover:text-[#ffb4ab] hover:bg-[#93000a]/30 transition-all cursor-pointer border border-[#584141]/40"
                            title="Eliminar Categoría"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
