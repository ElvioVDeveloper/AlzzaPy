import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { Category, CategoryStatus, Product } from '../types';
import { DEFAULT_CATEGORIES } from '../types';

const CATEGORIES_COLLECTION = 'categories';
const PRODUCTS_COLLECTION = 'products';

/**
 * Generate URL-friendly slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Auto-seed initial categories into Firestore if collection is empty
 */
export async function checkAndSeedInitialCategories(): Promise<void> {
  try {
    const colRef = collection(db, CATEGORIES_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      console.log('Alzza categories collection empty. Seeding default categories...');
      for (const cat of DEFAULT_CATEGORIES) {
        const { id, ...data } = cat;
        await addDoc(colRef, {
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      console.log('Categories seeding completed successfully.');
    }
  } catch (error) {
    console.warn('Initial categories seed notice (using default categories if offline/unauthenticated):', error);
  }
}

/**
 * Real-time subscription to categories
 */
export function subscribeToCategories(
  callback: (categories: Category[]) => void,
  onlyActive = false
): () => void {
  const colRef = collection(db, CATEGORIES_COLLECTION);
  const q = onlyActive
    ? query(colRef, where('status', '==', 'activo'))
    : query(colRef);

  let fallbackUsed = false;

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        callback(onlyActive ? DEFAULT_CATEGORIES.filter(c => c.status === 'activo') : DEFAULT_CATEGORIES);
        return;
      }

      const items: Category[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          name: data.name || '',
          slug: data.slug || generateSlug(data.name || ''),
          description: data.description || '',
          order: typeof data.order === 'number' ? data.order : 99,
          icon: data.icon || 'Sparkles',
          status: data.status === 'inactivo' ? 'inactivo' : 'activo',
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || '',
        });
      });

      // Sort by display order asc, then name
      items.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.name.localeCompare(b.name);
      });

      callback(items.length > 0 ? items : DEFAULT_CATEGORIES);
    },
    (error) => {
      console.warn('Firestore categories subscription fallback to default list:', error);
      if (!fallbackUsed) {
        fallbackUsed = true;
        callback(onlyActive ? DEFAULT_CATEGORIES.filter(c => c.status === 'activo') : DEFAULT_CATEGORIES);
      }
    }
  );

  return unsubscribe;
}

/**
 * Create a new category
 */
export async function createCategory(
  categoryData: Omit<Category, 'id'>
): Promise<string> {
  const colRef = collection(db, CATEGORIES_COLLECTION);
  try {
    const slug = categoryData.slug?.trim() || generateSlug(categoryData.name);
    const docRef = await addDoc(colRef, {
      ...categoryData,
      slug,
      order: Number(categoryData.order) || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, CATEGORIES_COLLECTION);
    throw error;
  }
}

/**
 * Update an existing category
 */
export async function updateCategory(
  id: string,
  updates: Partial<Omit<Category, 'id'>>
): Promise<void> {
  const docRef = doc(db, CATEGORIES_COLLECTION, id);
  try {
    const payload: any = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    if (updates.order !== undefined) {
      payload.order = Number(updates.order);
    }
    await updateDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${CATEGORIES_COLLECTION}/${id}`);
    throw error;
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string): Promise<void> {
  const docRef = doc(db, CATEGORIES_COLLECTION, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${CATEGORIES_COLLECTION}/${id}`);
    throw error;
  }
}

/**
 * Toggle category status (activo <-> inactivo)
 */
export async function toggleCategoryStatus(
  id: string,
  currentStatus: CategoryStatus
): Promise<CategoryStatus> {
  const nextStatus: CategoryStatus = currentStatus === 'activo' ? 'inactivo' : 'activo';
  await updateCategory(id, { status: nextStatus });
  return nextStatus;
}

/**
 * Automatically update products category when a category name is edited,
 * ensuring products don't get disconnected or orphaned.
 */
export async function updateProductsCategoryName(
  oldCategoryName: string,
  newCategoryName: string
): Promise<number> {
  if (!oldCategoryName || !newCategoryName || oldCategoryName === newCategoryName) {
    return 0;
  }

  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(colRef, where('category', '==', oldCategoryName));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Also check if products used 'categoria'
      const qAlt = query(colRef, where('categoria', '==', oldCategoryName));
      const snapshotAlt = await getDocs(qAlt);
      if (snapshotAlt.empty) return 0;

      const batch = writeBatch(db);
      snapshotAlt.forEach((d) => {
        batch.update(d.ref, {
          category: newCategoryName,
          categoria: newCategoryName,
          updatedAt: new Date().toISOString(),
        });
      });
      await batch.commit();
      return snapshotAlt.size;
    }

    const batch = writeBatch(db);
    snapshot.forEach((d) => {
      batch.update(d.ref, {
        category: newCategoryName,
        categoria: newCategoryName,
        updatedAt: new Date().toISOString(),
      });
    });
    await batch.commit();
    return snapshot.size;
  } catch (error) {
    console.warn('Could not batch update products in Firestore:', error);
    return 0;
  }
}

/**
 * Reassign all products from one category to another
 */
export async function reassignProductsCategory(
  fromCategoryName: string,
  toCategoryName: string
): Promise<number> {
  return updateProductsCategoryName(fromCategoryName, toCategoryName);
}
