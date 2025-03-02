import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAQ8iqA30Rxmbt8N9IIxd0uozDPDuPBmSs",
  authDomain: "fir-one-2f11d.firebaseapp.com",
  databaseURL:
    "https://fir-one-2f11d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fir-one-2f11d",
  storageBucket: "fir-one-2f11d.firebasestorage.app",
  messagingSenderId: "1033439247398",
  appId: "1:1033439247398:web:c9c8515c1e3153c1d23ae7",
  measurementId: "G-TNE70JKDBR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
