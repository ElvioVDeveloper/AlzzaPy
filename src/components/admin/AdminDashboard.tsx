import React from 'react';
import {
  Utensils,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  Clock,
  Eye,
} from 'lucide-react';
import { Product, PRODUCT_CATEGORIES } from '../../types';

interface AdminDashboardProps {
  products: Product[];
  onOpenCreate: () => void;
  onNavigateProducts: () => void;
  onEditProduct: (product: Product) => void;
  onToggleStatus: (product: Product) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onOpenCreate,
  onNavigateProducts,
  onEditProduct,
  onToggleStatus,
}) => {
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === 'activo').length;
  const inactiveProducts = totalProducts - activeProducts;

  // Categories count
  const categoryStats = PRODUCT_CATEGORIES.map((category) => {
    const count = products.filter((p) => p.category === category).length;
    const activeCount = products.filter(
      (p) => p.category === category && p.status === 'activo'
    ).length;
    return { category, count, activeCount };
  });

  const latestProducts = products.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#584141]/30">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#edbd9b] font-semibold">
            Resumen General
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#eae1dc] font-semibold mt-1">
            Dashboard Comercial
          </h1>
          <p className="text-xs sm:text-sm text-[#e0bfbf] mt-1">
            Administra el catálogo gastronómico y la disponibilidad en la carta en tiempo real.
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#9b1b30] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#b8243c] shadow-lg transition-all w-full sm:w-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Servicio / Producto</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Products */}
        <div className="bg-[#1f1b18] border border-[#584141]/40 rounded-2xl p-6 shadow-xl relative overflow-hidden flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#e0bfbf] font-medium">
              Total Registrados
            </span>
            <p className="font-serif text-3xl sm:text-4xl text-[#eae1dc] font-bold">
              {totalProducts}
            </p>
            <p className="text-[11px] text-[#edbd9b]">En base de datos</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#2e2926] border border-[#584141]/40 flex items-center justify-center text-[#edbd9b]">
            <Utensils className="w-6 h-6" />
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-[#1f1b18] border border-[#584141]/40 rounded-2xl p-6 shadow-xl relative overflow-hidden flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#edbd9b] font-medium">
              Activos en Landing
            </span>
            <p className="font-serif text-3xl sm:text-4xl text-[#ffdcc4] font-bold">
              {activeProducts}
            </p>
            <p className="text-[11px] text-emerald-400">Visibles para clientes</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Inactive Products */}
        <div className="bg-[#1f1b18] border border-[#584141]/40 rounded-2xl p-6 shadow-xl relative overflow-hidden flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#ffb4ab] font-medium">
              Inactivos / Ocultos
            </span>
            <p className="font-serif text-3xl sm:text-4xl text-[#ffb4ab] font-bold">
              {inactiveProducts}
            </p>
            <p className="text-[11px] text-[#ffdad6]/70">Pausados temporalmente</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#93000a]/30 border border-[#93000a]/60 flex items-center justify-center text-[#ffb4ab]">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Category Breakdown & Latest Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Breakdown */}
        <div className="lg:col-span-5 bg-[#1f1b18] border border-[#584141]/40 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl text-[#eae1dc] font-semibold flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#edbd9b]" />
              <span>Distribución por Categoría</span>
            </h2>
          </div>

          <div className="space-y-3.5">
            {categoryStats.map((item) => (
              <div
                key={item.category}
                className="p-3.5 rounded-xl bg-[#231f1c] border border-[#584141]/30 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-[#eae1dc]">{item.category}</p>
                  <p className="text-[10px] text-[#e0bfbf]">
                    {item.activeCount} activos de {item.count} total
                  </p>
                </div>
                <span className="text-xs font-serif text-[#edbd9b] font-bold bg-[#171310] px-3 py-1 rounded-full border border-[#584141]/40">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest items added */}
        <div className="lg:col-span-7 bg-[#1f1b18] border border-[#584141]/40 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl text-[#eae1dc] font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#edbd9b]" />
              <span>Últimos Servicios / Productos</span>
            </h2>
            <button
              onClick={onNavigateProducts}
              className="text-[11px] uppercase tracking-wider text-[#edbd9b] hover:text-[#ffdcc4] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {latestProducts.length === 0 ? (
            <div className="p-8 text-center text-[#e0bfbf]">
              No hay productos registrados aún. Comienza creando uno nuevo.
            </div>
          ) : (
            <div className="divide-y divide-[#584141]/30">
              {latestProducts.map((p) => (
                <div key={p.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#584141]/40"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#2e2926] flex items-center justify-center text-[#edbd9b] shrink-0">
                        <Utensils className="w-5 h-5" />
                      </div>
                    )}
                    <div className="truncate">
                      <p className="text-xs sm:text-sm font-semibold text-[#eae1dc] truncate">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-[#edbd9b]">
                        {p.category} • <span className="font-medium text-[#eae1dc]">{p.price}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onToggleStatus(p)}
                      title={p.status === 'activo' ? 'Haga clic para pausar' : 'Haga clic para activar'}
                      className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                        p.status === 'activo'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-700/50 hover:bg-emerald-900/60'
                          : 'bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/30 hover:bg-[#93000a]/70'
                      }`}
                    >
                      {p.status}
                    </button>

                    <button
                      onClick={() => onEditProduct(p)}
                      className="p-1.5 rounded-lg bg-[#2e2926] text-[#e0bfbf] hover:text-[#edbd9b] transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
