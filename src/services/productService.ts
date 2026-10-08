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
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { Product, ProductStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/defaultProducts';

const PRODUCTS_COLLECTION = 'products';

// Auto-seed initial catalog when the database is empty (called if user is admin)
export async function checkAndSeedInitialProducts(): Promise<void> {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      console.log('Alzza database empty. Seeding signature items...');
      for (const item of INITIAL_PRODUCTS) {
        const { id, ...data } = item;
        await addDoc(colRef, {
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      console.log('Seeding completed successfully.');
    }
  } catch (error) {
    console.warn('Initial seed notice (will use demo items if offline/unauthenticated):', error);
  }
}

// Real-time subscription to products
export function subscribeToProducts(
  callback: (products: Product[]) => void,
  onlyActive = false
): () => void {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  let q = onlyActive
    ? query(colRef, where('status', '==', 'activo'))
    : query(colRef);

  let fallbackUsed = false;

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        // If Firestore is empty, provide the 14 gourmet products
        callback(INITIAL_PRODUCTS);
        return;
      }

      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const productName = data.name || data.nombre || '';
        const productDesc = data.description || data.descripcion || '';
        const productPrice = data.price || data.precio || 'Gs. 0';
        const productImage = data.image || data.imagen || '';
        const productCategory = data.category || data.categoria || 'Coctelería de Autor';
        const productStatus = data.status || (data.activo === false ? 'inactivo' : 'activo');

        items.push({
          id: docSnap.id,
          name: productName,
          nombre: productName,
          description: productDesc,
          descripcion: productDesc,
          price: productPrice,
          precio: productPrice,
          image: productImage,
          imagen: productImage,
          category: productCategory,
          categoria: productCategory,
          status: productStatus,
          activo: productStatus === 'activo',
          badge: data.badge || '',
          tag: data.tag || '',
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || '',
        });
      });

      // Sort with latest or default order
      items.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });

      callback(items.length > 0 ? items : INITIAL_PRODUCTS);
    },
    (error) => {
      console.warn('Firestore subscription fallback to demo catalog:', error);
      if (!fallbackUsed) {
        fallbackUsed = true;
        callback(INITIAL_PRODUCTS);
      }
    }
  );

  return unsubscribe;
}

// Create product
export async function createProduct(
  productData: Omit<Product, 'id'>
): Promise<string> {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  try {
    const docRef = await addDoc(colRef, {
      ...productData,
      nombre: productData.name,
      descripcion: productData.description,
      precio: productData.price,
      categoria: productData.category,
      imagen: productData.image,
      activo: productData.status === 'activo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, PRODUCTS_COLLECTION);
    throw error;
  }
}

// Update product
export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, 'id'>>
): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  try {
    const payload: any = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    if (updates.name) payload.nombre = updates.name;
    if (updates.description) payload.descripcion = updates.description;
    if (updates.price) payload.precio = updates.price;
    if (updates.category) payload.categoria = updates.category;
    if (updates.image) payload.imagen = updates.image;
    if (updates.status) payload.activo = updates.status === 'activo';

    await updateDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PRODUCTS_COLLECTION}/${id}`);
    throw error;
  }
}

// Delete product
export async function deleteProduct(id: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${id}`);
    throw error;
  }
}

// Toggle status (activo <-> inactivo)
export async function toggleProductStatus(
  id: string,
  currentStatus: ProductStatus
): Promise<ProductStatus> {
  const nextStatus: ProductStatus = currentStatus === 'activo' ? 'inactivo' : 'activo';
  await updateProduct(id, { status: nextStatus, activo: nextStatus === 'activo' });
  return nextStatus;
}
