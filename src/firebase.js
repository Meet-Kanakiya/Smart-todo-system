import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPoa9LavVpLbzp6FeJwiTP_XVzT6lp3xs",
  authDomain: "student-b6056.firebaseapp.com",
  projectId: "student-b6056",
  storageBucket: "student-b6056.firebasestorage.app",
  messagingSenderId: "1078213522237",
  appId: "1:1078213522237:web:05e7b4c37c421486670b54",
  measurementId: "G-DTFCCGSY2E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export modules
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
