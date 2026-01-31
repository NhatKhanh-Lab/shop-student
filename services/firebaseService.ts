import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, getDoc, setDoc } from 'firebase/firestore';
import { Product, Order, User, UserRole } from '../types';
import { MOCK_PRODUCTS } from '../data';

// --- PRODUCTS ---

export const getProducts = async (): Promise<Product[]> => {
  if (!db) return MOCK_PRODUCTS; // Fallback nếu chưa config firebase
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.docs.map(doc => ({ id: Number(doc.id) || Date.now(), ...doc.data() } as Product));
  } catch (error) {
    console.error("Error fetching products:", error);
    return MOCK_PRODUCTS;
  }
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  if (!db) return;
  await addDoc(collection(db, "products"), product);
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
  if (!db) return;
  const productRef = doc(db, "products", id);
  await updateDoc(productRef, data);
};

export const deleteProduct = async (id: string) => {
  if (!db) return;
  await deleteDoc(doc(db, "products", id));
};

// --- ORDERS ---

export const createOrder = async (order: Order) => {
  if (!db) return;
  await addDoc(collection(db, "orders"), order);
};

export const getOrders = async (): Promise<Order[]> => {
    if (!db) return [];
    const querySnapshot = await getDocs(collection(db, "orders"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
};

// --- USERS & ROLES ---

// Hàm này dùng để tạo user profile trong Firestore sau khi đăng ký Auth thành công
export const createUserProfile = async (user: User) => {
    if (!db) return;
    await setDoc(doc(db, "users", user.id.toString()), user);
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
    if (!db) return null;
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as User;
    } else {
        return null;
    }
};

// Seed Data (Chạy 1 lần để đẩy Mock Data lên Firebase)
export const seedProducts = async () => {
    if (!db) return;
    const products = await getProducts();
    if (products.length === 0) {
        console.log("Seeding data...");
        MOCK_PRODUCTS.forEach(async (p) => {
             await addDoc(collection(db, "products"), {
                 ...p,
                 // Xóa ID số vì Firestore tự sinh ID chuỗi
                 id: Date.now() + Math.random() 
             });
        });
    }
}