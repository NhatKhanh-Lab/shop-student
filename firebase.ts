import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Cấu hình từ Firebase Console (Project: shopstudent-d7f55)
const firebaseConfig = {
  apiKey: "AIzaSyBGf7U5d-Qu1WenzNGc13lgX7QedqRsLEE",
  authDomain: "shopstudent-d7f55.firebaseapp.com",
  projectId: "shopstudent-d7f55",
  storageBucket: "shopstudent-d7f55.firebasestorage.app",
  messagingSenderId: "223523775623",
  appId: "1:223523775623:web:b2288f6508aa9fa6794422",
  measurementId: "G-W7836TDDBR"
};

// Khởi tạo Firebase App với cơ chế an toàn (Safe Mode)
let app;
let dbInstance = null;
let storageInstance = null;

try {
    app = initializeApp(firebaseConfig);

    // Initialize Firestore safely
    try {
        dbInstance = getFirestore(app);
    } catch (error) {
        console.warn("Firebase Firestore failed to initialize (using Mock Data instead):", error);
    }

    // Initialize Storage safely
    try {
        storageInstance = getStorage(app);
    } catch (error) {
        console.warn("Firebase Storage failed to initialize:", error);
    }

} catch (error) {
    console.error("Firebase App initialization failed completely:", error);
}

// Export các service (sẽ là null nếu lỗi, App sẽ tự fallback sang Mock Data)
export const auth = null; 
export const db = dbInstance;
export const storage = storageInstance;
export const analytics = null;