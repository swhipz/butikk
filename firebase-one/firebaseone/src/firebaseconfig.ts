
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';


export const firebaseConfig = {
  apiKey: "AIzaSyAQ8iqA30Rxmbt8N9IIxd0uozDPDuPBmSs",
  authDomain: "fir-one-2f11d.firebaseapp.com",
  projectId: "fir-one-2f11d",
  storageBucket: "fir-one-2f11d.firebasestorage.app",
  messagingSenderId: "1033439247398",
  appId: "1:1033439247398:web:c9c8515c1e3153c1d23ae7",
  measurementId: "G-TNE70JKDBR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Get Auth instance from the initialized app
const db = getFirestore(app); // Get Firestore instance from the initialized app


onAuthStateChanged(auth, (user) => { // Note the parenthesis around user
  if (user !== null) {
    console.log('logged in:', user); // added user for better debugging
  } else {
    console.log('no user detected, dickhead');
  }
});