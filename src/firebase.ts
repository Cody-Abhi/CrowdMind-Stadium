import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore,
  doc, 
  setDoc, 
  getDoc,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  getDocs,
  where
} from 'firebase/firestore';

// Configuration injected by AI Studio
const firebaseConfig = {
  apiKey: "AIzaSyCx8X2bHI89JGsJSxKxI9MPtiPiXK4YA8U",
  authDomain: "crowdmind-stadium.firebaseapp.com",
  databaseURL: "https://crowdmind-stadium-default-rtdb.firebaseio.com",
  projectId: "crowdmind-stadium",
  storageBucket: "crowdmind-stadium.firebasestorage.app",
  messagingSenderId: "402017132721",
  appId: "1:402017132721:web:9ae68a6b9ece61ec75c290",
  measurementId: "G-CLNYS56SDD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services with Offline Persistence fallback
export const auth = getAuth(app);

let dbInstance;
try {
  dbInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
} catch (e) {
  console.warn("Firestore persistence failed to load, falling back to standard Firestore:", e);
  dbInstance = getFirestore(app);
}

export const db = dbInstance;

export const googleProvider = new GoogleAuthProvider();

export { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  getDocs,
  where
};
export type { FirebaseUser };
