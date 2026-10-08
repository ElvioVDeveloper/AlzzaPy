export type ProductStatus = 'activo' | 'inactivo';

export interface Product {
  id: string;
  name: string;
  nombre?: string;
  description: string;
  descripcion?: string;
  price: string;
  precio?: string;
  image: string;
  imagen?: string;
  category: string;
  categoria?: string;
  status: ProductStatus;
  activo?: boolean;
  badge?: string;
  tag?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CategoryStatus = 'activo' | 'inactivo';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  icon?: string;
  status: CategoryStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  createdAt: string;
}

export const PRODUCT_CATEGORIES = [
  'Coctelería de Autor',
  'Entradas & Tapas',
  'Platos Principales',
  'Postres de Autor',
  'Vinos & Espumantes',
] as const;

export type ProductCategory = string;

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-cocteleria',
    name: 'Coctelería de Autor',
    slug: 'cocteleria-de-autor',
    description: 'Tragos de autor y botánicos macerados en barrica',
    order: 1,
    icon: 'Wine',
    status: 'activo',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-entradas',
    name: 'Entradas & Tapas',
    slug: 'entradas-y-tapas',
    description: 'Pequeños bocados y preparaciones para compartir',
    order: 2,
    icon: 'UtensilsCrossed',
    status: 'activo',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-principales',
    name: 'Platos Principales',
    slug: 'platos-principales',
    description: 'Cortes premium y recetas de fondo con identidad',
    order: 3,
    icon: 'Flame',
    status: 'activo',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-postres',
    name: 'Postres de Autor',
    slug: 'postres-de-autor',
    description: 'Dulzuras diseñadas para un cierre memorable',
    order: 4,
    icon: 'Sparkles',
    status: 'activo',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-vinos',
    name: 'Vinos & Espumantes',
    slug: 'vinos-y-espumantes',
    description: 'Etiquetas selectas y cavas de bodegas de altura',
    order: 5,
    icon: 'Grape',
    status: 'activo',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

export interface ReservationRequest {
  fullName: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  zone: 'Terraza Rooftop' | 'Salón Principal' | 'Barra Lounge' | 'Sector VIP';
  specialRequests?: string;
}
