// Importa las funciones necesarias desde los SDKs de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNmmcu-Qjn-gSbDFmkLA4MD5b9J8eeo4g",
  authDomain: "inventarioapp-bd2ea.firebaseapp.com",
  projectId: "inventarioapp-bd2ea",
  storageBucket: "inventarioapp-bd2ea.appspot.com",
  messagingSenderId: "733957247600",
  appId: "1:733957247600:web:cd7a96705a5e20e1369ab5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const functions = getFunctions(app);

export { app, db, storage, auth, functions, firebaseConfig, collection, addDoc, query, where, getDocs, updateDoc };
