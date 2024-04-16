
import React, { useState, useEffect, useCallback } from 'react';
import ProductTable from '../components/ProductTable';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import ActionButton from '../components/ActionButton';
import AddProductModal from '../components/AddProductModal';
import ProductButton from '../components/ProductButton';
import { db } from '../firebaseConfig';
import { getDocs, addDoc, updateDoc, deleteDoc, collection, doc } from 'firebase/firestore';

const ListaArticulos = () => {

    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);

    
    const filterProducts = useCallback((searchTerm) => {
      const filtered = products.filter(product =>
        (product.numeroDeParte?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }, [products]);
  
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const productsSnapshot = await getDocs(collection(db, 'productos'));
          const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProducts(productsData);
        } catch (error) {
          console.error('Error al obtener los productos:', error);
        }
      };
  
      fetchProducts();
    }, []);
  
    useEffect(() => {
      filterProducts('');
    }, [products, filterProducts]);
  
    const handleAddProduct = async (newProduct) => {
      try {
        const docRef = await addDoc(collection(db, 'productos'), newProduct);
        setProducts(prevProducts => [...prevProducts, { id: docRef.id, ...newProduct }]);
        setIsModalOpen(false);
        setEditingProduct(null);
      } catch (error) {
        console.error('Error al agregar el producto:', error);
      }
    };
  
    const handleEditProduct = async (updatedProduct) => {
      try {
        await updateDoc(doc(db, 'productos', updatedProduct.id), updatedProduct);
        const updatedProducts = products.map(product =>
          product.id === updatedProduct.id ? updatedProduct : product
        );
        setProducts(updatedProducts);
        setIsModalOpen(false);
        setEditingProduct(null);
      } catch (error) {
        console.error('Error al editar el producto:', error);
      }
    };
  
    const handleDeleteProduct = async (productId) => {
      try {
        await deleteDoc(doc(db, 'productos', productId));
        const updatedProducts = products.filter(product => product.id !== productId);
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      }
    };
  
    const handleSearch = (searchTerm) => {
      filterProducts(searchTerm);
    };


  return (
    <>
    <h1 style={{ fontFamily: "Montserrat, sans-serif" }}>Lista de Artículos</h1>

    <SearchBar handleSearch={handleSearch} />
      <Sidebar />
      <ProductTable
        products={filteredProducts}
        onEditProduct={(productId) => {
          const productToEdit = products.find(product => product.id === productId);
          setEditingProduct(productToEdit);
          setIsModalOpen(true);
        }}
        onDeleteProduct={handleDeleteProduct}
      />
      <ActionButton text="Agregar Producto" onClick={() => {
        setIsModalOpen(true);
        setEditingProduct(null);
      }} />
      <ProductButton products={products} setProducts={setProducts} />
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
        editingProduct={editingProduct}
      />

    </>

  )
}

export default ListaArticulos;