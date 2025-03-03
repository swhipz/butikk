import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCLmyry3AHEADUf2iwRfbzlWeVTebdZ5jA",
  authDomain: "fir-coach-c5175.firebaseapp.com",
  projectId: "fir-coach-c5175",
  storageBucket: "fir-coach-c5175.firebasestorage.app",
  messagingSenderId: "161626121927",
  appId: "1:161626121927:web:adadb6d9377016423980e2",
  measurementId: "G-CVBG1XXKR3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
