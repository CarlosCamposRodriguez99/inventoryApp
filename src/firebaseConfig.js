// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';
// Importa Firestore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Function to get documents from Firestore (POSIBLE SOLUCIÓN A ERROR CUANDO DEJABAS SIN UTILIZAR LA APP)
async function getItems() {
  try {
    const querySnapshot = await getDocs(collection(db, "items"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
  } catch (error) {
    console.error("Error fetching documents: ", error);
  }
}

// Call the function to get items
getItems();

// Exporta db para su uso en otras partes de la aplicación
export { db, storage, firebaseConfig, auth  };