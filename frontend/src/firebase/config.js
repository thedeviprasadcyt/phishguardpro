import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCrUrFCVv_2QEZQon5llrAN-cvtCT9Si08",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "phishguard-pro-a3295.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "phishguard-pro-a3295",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "phishguard-pro-a3295.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "494886921466",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:494886921466:web:e11b91384e8edc0d335543",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-FQZ4M22W9B",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
