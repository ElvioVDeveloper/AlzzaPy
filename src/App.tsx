import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Product, Category, DEFAULT_CATEGORIES } from './types';
import {
  subscribeToProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  checkAndSeedInitialProducts,
} from './services/productService';
import {
  subscribeToCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  checkAndSeedInitialCategories,
  updateProductsCategoryName,
  reassignProductsCategory,
} from './services/categoryService';
import { INITIAL_PRODUCTS } from './data/defaultProducts';

// Public Landing Components
import { Navbar } from './components/landing/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { ConceptSection } from './components/landing/ConceptSection';
import { MenuSection } from './components/landing/MenuSection';
import { EventsSection } from './components/landing/EventsSection';
import { LocationSection } from './components/landing/LocationSection';
import { Footer } from './components/landing/Footer';
import { ProductDetailModal } from './components/landing/ProductDetailModal';
import { ReservationModal } from './components/landing/ReservationModal';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminRegister } from './components/admin/AdminRegister';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminCategories } from './components/admin/AdminCategories';
import { AdminProfile } from './components/admin/AdminProfile';
import { AdminBranding } from './components/admin/AdminBranding';
import { AdminProductModal } from './components/admin/AdminProductModal';
import { AdminDeleteModal } from './components/admin/AdminDeleteModal';
import { AdminCategoryModal } from './components/admin/AdminCategoryModal';
import { AdminCategoryDeleteModal } from './components/admin/AdminCategoryDeleteModal';
import { BrandingProvider } from './context/BrandingContext';
import { CheckCircle2 } from 'lucide-react';

function AppContent() {
  const { user, loading: authLoading, logout } = useAuth();

  // Route state: '/', '/admin/login', '/admin/register', '/admin/dashboard', '/admin/products', '/admin/categories', '/admin/profile'
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('/admin')) return hash;
    if (path.startsWith('/admin')) return path;
    return '/';
  });

  // Products state (shared live across landing and admin)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [productsLoading, setProductsLoading] = useState(false);

  // Categories state (shared live across landing and admin)
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Modals state
  const [selectedLandingProduct, setSelectedLandingProduct] = useState<Product | null>(null);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [reservationPrefilledDish, setReservationPrefilledDish] = useState<string | undefined>();

  // Admin Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Admin Category Modals
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryDeleteModalOpen, setCategoryDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Sync route with URL bar & browser history
  const navigate = (newPath: string) => {
    setCurrentPath(newPath);
    try {
      window.history.pushState({}, '', newPath);
    } catch {
      window.location.hash = newPath;
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('/admin')) {
        setCurrentPath(hash);
      } else if (path.startsWith('/admin')) {
        setCurrentPath(path);
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Ensure browser tab title always displays Elevva
  useEffect(() => {
    let tabTitle = 'Elevva | Gastronomía & Coctelería de Altura';
    if (currentPath === '/admin/login') {
      tabTitle = 'Elevva | Iniciar Sesión';
    } else if (currentPath === '/admin/register') {
      tabTitle = 'Elevva | Registro de Socio';
    } else if (currentPath.startsWith('/admin')) {
      tabTitle = 'Elevva | Panel de Administración';
    }
    document.title = tabTitle;
    try {
      if (window.top && window.top !== window) {
        window.top.document.title = tabTitle;
      }
    } catch {
      // Ignore cross-origin iframe security restriction
    }
  }, [currentPath]);

  // Initialize and subscribe to products & categories in Firestore
  useEffect(() => {
    // Attempt seed if catalog and categories are empty
    checkAndSeedInitialProducts();
    checkAndSeedInitialCategories();

    // Subscribe to all products in real time
    const unsubscribeProducts = subscribeToProducts((loadedProducts) => {
      setProducts(loadedProducts);
      setProductsLoading(false);
    }, false);

    // Subscribe to all categories in real time
    const unsubscribeCategories = subscribeToCategories((loadedCategories) => {
      setCategories(loadedCategories);
    }, false);

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
    };
  }, []);

  // Protected Routes enforcement:
  // If attempting to access /admin/dashboard, /admin/products, /admin/categories, /admin/profile without authentication, redirect to /admin/login
  useEffect(() => {
    if (!authLoading) {
      const isProtectedAdminRoute =
        currentPath === '/admin/dashboard' ||
        currentPath === '/admin/products' ||
        currentPath === '/admin/categories' ||
        currentPath === '/admin/profile';

      if (isProtectedAdminRoute && !user) {
        navigate('/admin/login');
      } else if ((currentPath === '/admin/login' || currentPath === '/admin/register') && user) {
        navigate('/admin/dashboard');
      }
    }
  }, [currentPath, user, authLoading]);

  // Handlers for Admin Products CRUD
  const handleSaveProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } : p))
        );
        showToast(`Producto "${productData.name}" actualizado con éxito.`);
      } else {
        const newId = await createProduct(productData);
        setProducts((prev) => [{ ...productData, id: newId, status: productData.status }, ...prev]);
        showToast(`Producto "${productData.name}" añadido a la carta.`);
      }
    } catch (err) {
      console.warn('Applied change locally:', err);
      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } : p))
        );
        showToast(`Producto "${productData.name}" actualizado.`);
      } else {
        const tempId = 'prod_' + Date.now();
        setProducts((prev) => [{ ...productData, id: tempId, status: productData.status }, ...prev]);
        showToast(`Producto "${productData.name}" creado.`);
      }
    }
    setProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleToggleStatus = async (product: Product) => {
    const nextStatus = product.status === 'activo' ? 'inactivo' : 'activo';
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, status: nextStatus, activo: nextStatus === 'activo' } : p))
    );
    try {
      await toggleProductStatus(product.id, product.status);
    } catch (err) {
      console.warn('Error toggling status:', err);
    }
  };

  const handleDeleteConfirm = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    try {
      await deleteProduct(productId);
      showToast('Producto eliminado del catálogo.');
    } catch (err) {
      console.warn('Error deleting product:', err);
      showToast('Producto eliminado.');
    }
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Handlers for Admin Categories CRUD
  const handleSaveCategory = async (
    categoryData: Omit<Category, 'id'>,
    oldName?: string
  ) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData);
        setCategories((prev) =>
          prev
            .map((c) => (c.id === editingCategory.id ? { ...c, ...categoryData } : c))
            .sort((a, b) => a.order - b.order)
        );

        // If category name changed, auto-update all linked products
        if (oldName && oldName !== categoryData.name) {
          setProducts((prev) =>
            prev.map((p) => {
              if (p.category === oldName || p.categoria === oldName) {
                return {
                  ...p,
                  category: categoryData.name,
                  categoria: categoryData.name,
                };
              }
              return p;
            })
          );
          await updateProductsCategoryName(oldName, categoryData.name);
        }
        showToast(`Categoría "${categoryData.name}" actualizada con éxito.`);
      } else {
        const newId = await createCategory(categoryData);
        setCategories((prev) =>
          [...prev, { ...categoryData, id: newId }].sort((a, b) => a.order - b.order)
        );
        showToast(`Categoría "${categoryData.name}" creada con éxito.`);
      }
    } catch (err) {
      console.warn('Applied category change locally:', err);
      if (editingCategory) {
        setCategories((prev) =>
          prev
            .map((c) => (c.id === editingCategory.id ? { ...c, ...categoryData } : c))
            .sort((a, b) => a.order - b.order)
        );
        if (oldName && oldName !== categoryData.name) {
          setProducts((prev) =>
            prev.map((p) =>
              p.category === oldName || p.categoria === oldName
                ? { ...p, category: categoryData.name, categoria: categoryData.name }
                : p
            )
          );
        }
        showToast(`Categoría "${categoryData.name}" actualizada.`);
      } else {
        const tempId = 'cat_' + Date.now();
        setCategories((prev) =>
          [...prev, { ...categoryData, id: tempId }].sort((a, b) => a.order - b.order)
        );
        showToast(`Categoría "${categoryData.name}" creada.`);
      }
    }
    setCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleToggleCategoryStatus = async (category: Category) => {
    const nextStatus = category.status === 'activo' ? 'inactivo' : 'activo';
    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? { ...c, status: nextStatus } : c))
    );
    try {
      await toggleCategoryStatus(category.id, category.status);
      showToast(`Categoría "${category.name}" ahora está ${nextStatus === 'activo' ? 'Visible' : 'Oculta'}.`);
    } catch (err) {
      console.warn('Error toggling category status:', err);
    }
  };

  const handleReorderCategory = async (category: Category, direction: 'up' | 'down') => {
    const sorted = [...categories].sort((a, b) => a.order - b.order);
    const currentIndex = sorted.findIndex((c) => c.id === category.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const targetCategory = sorted[targetIndex];
    const currentOrder = category.order;
    const targetOrder = targetCategory.order;

    // Swap orders (ensure unique if they were identical)
    const newCurrentOrder = targetOrder;
    const newTargetOrder = currentOrder === targetOrder
      ? (direction === 'up' ? targetOrder + 1 : targetOrder - 1)
      : currentOrder;

    const updatedCategories = sorted.map((c) => {
      if (c.id === category.id) return { ...c, order: newCurrentOrder };
      if (c.id === targetCategory.id) return { ...c, order: newTargetOrder };
      return c;
    }).sort((a, b) => a.order - b.order);

    setCategories(updatedCategories);

    try {
      await updateCategory(category.id, { order: newCurrentOrder });
      await updateCategory(targetCategory.id, { order: newTargetOrder });
      showToast(`Orden actualizado: "${category.name}" en posición ${newCurrentOrder}.`);
    } catch (err) {
      console.warn('Error updating order:', err);
    }
  };

  const handleDeleteCategoryConfirm = async (
    categoryId: string,
    reassignToCategoryName?: string
  ) => {
    const targetCat = categories.find((c) => c.id === categoryId);
    if (!targetCat) return;

    // If reassigning products
    if (reassignToCategoryName) {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.category === targetCat.name || p.categoria === targetCat.name) {
            return {
              ...p,
              category: reassignToCategoryName,
              categoria: reassignToCategoryName,
            };
          }
          return p;
        })
      );
      try {
        await reassignProductsCategory(targetCat.name, reassignToCategoryName);
      } catch (err) {
        console.warn('Error reassigning products:', err);
      }
    }

    // Delete category
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    try {
      await deleteCategory(categoryId);
      showToast(`Categoría "${targetCat.name}" eliminada.`);
    } catch (err) {
      console.warn('Error deleting category:', err);
      showToast(`Categoría "${targetCat.name}" eliminada.`);
    }

    setCategoryDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  // 1. Render Admin Login
  if (currentPath === '/admin/login') {
    return <AdminLogin onNavigate={navigate} />;
  }

  // 2. Render Admin Register
  if (currentPath === '/admin/register') {
    return <AdminRegister onNavigate={navigate} />;
  }

  // 3. Render Admin Private Dashboard & Subviews
  if (currentPath.startsWith('/admin')) {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-[#110d0b] flex items-center justify-center text-[#edbd9b]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#edbd9b] border-t-transparent rounded-full animate-spin"></div>
            <p className="font-serif text-lg">Cargando portal Elevva...</p>
          </div>
        </div>
      );
    }

    let adminTab: 'dashboard' | 'products' | 'categories' | 'branding' | 'profile' = 'dashboard';
    if (currentPath === '/admin/products') adminTab = 'products';
    if (currentPath === '/admin/categories') adminTab = 'categories';
    if (currentPath === '/admin/branding') adminTab = 'branding';
    if (currentPath === '/admin/profile') adminTab = 'profile';

    // Products assigned to the category selected for deletion
    const assignedProductCount = categoryToDelete
      ? products.filter(
          (p) => p.category === categoryToDelete.name || p.categoria === categoryToDelete.name
        ).length
      : 0;

    return (
      <>
        {/* Toast feedback */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#2e2926] border border-[#edbd9b]/60 text-[#eae1dc] shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="w-4 h-4 text-[#edbd9b] shrink-0" />
            <span className="text-xs font-medium">{toastMessage}</span>
          </div>
        )}

        <AdminLayout
          currentTab={adminTab}
          onSelectTab={(tab) => navigate(`/admin/${tab}`)}
          onNavigateLanding={() => navigate('/')}
        >
          {adminTab === 'dashboard' && (
            <AdminDashboard
              products={products}
              onOpenCreate={() => {
                setEditingProduct(null);
                setProductModalOpen(true);
              }}
              onNavigateProducts={() => navigate('/admin/products')}
              onEditProduct={(product) => {
                setEditingProduct(product);
                setProductModalOpen(true);
              }}
              onToggleStatus={handleToggleStatus}
            />
          )}

          {adminTab === 'products' && (
            <AdminProducts
              products={products}
              categories={categories}
              onOpenCreate={() => {
                setEditingProduct(null);
                setProductModalOpen(true);
              }}
              onEditProduct={(product) => {
                setEditingProduct(product);
                setProductModalOpen(true);
              }}
              onDeleteProduct={(product) => {
                setProductToDelete(product);
                setDeleteModalOpen(true);
              }}
              onToggleStatus={handleToggleStatus}
            />
          )}

          {adminTab === 'categories' && (
            <AdminCategories
              categories={categories}
              products={products}
              onOpenCreate={() => {
                setEditingCategory(null);
                setCategoryModalOpen(true);
              }}
              onEditCategory={(category) => {
                setEditingCategory(category);
                setCategoryModalOpen(true);
              }}
              onDeleteCategory={(category) => {
                setCategoryToDelete(category);
                setCategoryDeleteModalOpen(true);
              }}
              onToggleStatus={handleToggleCategoryStatus}
              onReorderCategory={handleReorderCategory}
            />
          )}

          {adminTab === 'branding' && (
            <AdminBranding onNotify={showToast} />
          )}

          {adminTab === 'profile' && (
            <AdminProfile
              onLogout={async () => {
                await logout();
                navigate('/admin/login');
              }}
            />
          )}
        </AdminLayout>

        {/* Product Create / Edit Modal */}
        <AdminProductModal
          isOpen={productModalOpen}
          categories={categories}
          onClose={() => {
            setProductModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
          editingProduct={editingProduct}
        />

        {/* Product Delete Confirmation Modal */}
        <AdminDeleteModal
          isOpen={deleteModalOpen}
          product={productToDelete}
          onClose={() => {
            setDeleteModalOpen(false);
            setProductToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
        />

        {/* Category Create / Edit Modal */}
        <AdminCategoryModal
          isOpen={categoryModalOpen}
          editingCategory={editingCategory}
          existingCount={categories.length}
          onClose={() => {
            setCategoryModalOpen(false);
            setEditingCategory(null);
          }}
          onSave={handleSaveCategory}
        />

        {/* Category Delete Modal with Safety Rule */}
        <AdminCategoryDeleteModal
          isOpen={categoryDeleteModalOpen}
          category={categoryToDelete}
          assignedProductCount={assignedProductCount}
          availableCategories={categories}
          onClose={() => {
            setCategoryDeleteModalOpen(false);
            setCategoryToDelete(null);
          }}
          onConfirmDelete={handleDeleteCategoryConfirm}
        />
      </>
    );
  }

  // 4. Render Public Landing Page
  return (
    <div className="min-h-screen bg-[#171310] text-[#eae1dc] flex flex-col selection:bg-[#9b1b30] selection:text-[#eae1dc]">
      {/* Header / Navbar */}
      <Navbar
        onOpenReservation={() => {
          setReservationPrefilledDish(undefined);
          setReservationOpen(true);
        }}
        onNavigateToAdmin={() => navigate('/admin/login')}
      />

      {/* Main Sections */}
      <main className="flex-1 w-full pt-16 sm:pt-20">
        <HeroSection
          onOpenReservation={() => {
            setReservationPrefilledDish(undefined);
            setReservationOpen(true);
          }}
        />

        <ConceptSection />

        <MenuSection
          products={products}
          categories={categories}
          loading={productsLoading}
          onSelectProduct={(product) => setSelectedLandingProduct(product)}
        />

        <EventsSection />

        <LocationSection
          onOpenReservation={() => {
            setReservationPrefilledDish(undefined);
            setReservationOpen(true);
          }}
        />
      </main>

      {/* Footer */}
      <Footer onNavigateToAdmin={() => navigate('/admin/login')} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedLandingProduct}
        onClose={() => setSelectedLandingProduct(null)}
        onOpenReservation={(productName) => {
          setReservationPrefilledDish(productName);
          setReservationOpen(true);
        }}
      />

      {/* Table Reservation Modal */}
      <ReservationModal
        isOpen={reservationOpen}
        onClose={() => setReservationOpen(false)}
        preferredProduct={reservationPrefilledDish}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrandingProvider>
        <AppContent />
      </BrandingProvider>
    </AuthProvider>
  );
}

