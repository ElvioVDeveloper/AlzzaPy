import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Utensils,
  ExternalLink,
} from 'lucide-react';
import { Product, PRODUCT_CATEGORIES, ProductCategory, Category, DEFAULT_CATEGORIES } from '../../types';

interface AdminProductsProps {
  products: Product[];
  categories?: Category[];
  onOpenCreate: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onToggleStatus: (product: Product) => void;
  onViewProductOnLanding?: (product: Product) => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  categories = DEFAULT_CATEGORIES,
  onOpenCreate,
  onEditProduct,
  onDeleteProduct,
  onToggleStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<'Todos' | 'activo' | 'inactivo'>('Todos');

  // Distinct category list from categories prop + any legacy products
  const categoryNames = Array.from(
    new Set([
      ...categories.map((c) => c.name),
      ...products.map((p) => p.category || p.categoria).filter(Boolean) as string[],
    ])
  );

  // Filtering
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.price.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.badge && p.badge.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'Todos' || p.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'Todos' || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#584141]/30">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#edbd9b] font-semibold">
            Catálogo &amp; Carta
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#eae1dc] font-semibold mt-1">
            Servicios y Productos
          </h1>
          <p className="text-xs sm:text-sm text-[#e0bfbf] mt-1">
            Gestiona los platos, cócteles de autor y maridajes reflejados en la landing page.
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#9b1b30] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#b8243c] shadow-lg transition-all w-full sm:w-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Producto / Servicio</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#1f1b18] border border-[#584141]/40 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row gap-3 sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#584141] absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Buscar por nombre, descripción o precio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] placeholder-[#584141] focus:outline-none focus:border-[#edbd9b] text-xs sm:text-sm"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] focus:outline-none focus:border-[#edbd9b] text-xs font-medium"
          >
            <option value="Todos">Todas las Categorías</option>
            {categoryNames.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-[#171310] border border-[#584141]/50 text-[#eae1dc] focus:outline-none focus:border-[#edbd9b] text-xs font-medium"
          >
            <option value="Todos">Todos los Estados</option>
            <option value="activo">Solo Activos</option>
            <option value="inactivo">Solo Inactivos</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#e0bfbf]">
        <p>
          Mostrando <strong className="text-[#edbd9b]">{filteredProducts.length}</strong> de{' '}
          {products.length} productos registrados
        </p>
      </div>

      {/* Table & Cards */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#1f1b18] border border-[#584141]/40 rounded-2xl p-12 text-center text-[#e0bfbf]">
          <p className="font-serif text-xl text-[#edbd9b] mb-2">No se encontraron productos</p>
          <p className="text-xs">Prueba ajustando los filtros de búsqueda o categoría.</p>
        </div>
      ) : (
        <div className="bg-[#1f1b18] border border-[#584141]/40 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#584141]/40 bg-[#231f1c] text-[10px] uppercase tracking-wider text-[#edbd9b] font-semibold">
                  <th className="py-3.5 px-4 sm:px-6">Producto / Servicio</th>
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4">Precio</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#584141]/20 text-xs sm:text-sm">
                {filteredProducts.map((product) => {
                  const isActive = product.status === 'activo';

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-[#231f1c]/50 transition-colors group"
                    >
                      {/* Product Name & Image */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3.5">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#584141]/40"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-[#2e2926] border border-[#584141]/40 flex items-center justify-center text-[#edbd9b] shrink-0">
                              <Utensils className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-serif text-sm sm:text-base font-semibold text-[#eae1dc]">
                                {product.name}
                              </span>
                              {product.badge && (
                                <span className="px-2 py-0.5 rounded-md bg-[#2e2926] text-[#edbd9b] text-[9px] uppercase tracking-wider font-semibold border border-[#584141]/40">
                                  {product.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#e0bfbf] line-clamp-1 max-w-sm mt-0.5">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-[#e0bfbf]">
                        <span className="px-2.5 py-1 rounded-lg bg-[#171310] border border-[#584141]/40 text-[#eae1dc]">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 whitespace-nowrap font-serif text-sm sm:text-base font-semibold text-[#edbd9b]">
                        {product.price}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => onToggleStatus(product)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-700/50 hover:bg-emerald-900/60'
                              : 'bg-[#93000a]/30 text-[#ffb4ab] border border-[#93000a]/60 hover:bg-[#93000a]/50'
                          }`}
                          title="Haz clic para alternar visibilidad"
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

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEditProduct(product)}
                            className="p-2 rounded-xl bg-[#2e2926] text-[#e0bfbf] hover:text-[#edbd9b] hover:bg-[#3d3835] transition-all cursor-pointer border border-[#584141]/40"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onDeleteProduct(product)}
                            className="p-2 rounded-xl bg-[#2e2926] text-[#e0bfbf] hover:text-[#ffb4ab] hover:bg-[#93000a]/30 transition-all cursor-pointer border border-[#584141]/40"
                            title="Eliminar"
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
