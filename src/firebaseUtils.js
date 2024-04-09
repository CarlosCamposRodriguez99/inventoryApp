import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Asegúrate de importar la instancia de Firebase que configuraste anteriormente

// Función para agregar un nuevo producto a la colección de productos
const addProduct = async (numeroDeParte, descripcion, costo, imagenUrl) => {
  try {
    // Añadir un nuevo documento a la colección "productos"
    const docRef = await addDoc(collection(db, "productos"), {
      numeroDeParte: numeroDeParte,
      descripcion: descripcion,
      costo: costo,
      imagenUrl: imagenUrl
    });
    console.log("Producto agregado con ID: ", docRef.id);
    return docRef.id; // Retorna el ID del nuevo documento agregado
  } catch (error) {
    console.error("Error al agregar el producto: ", error);
    return null;
  }
};

// Uso de la función para agregar un nuevo producto
addProduct("NP001", "Producto de ejemplo", 100, "https://example.com/image.jpg");
