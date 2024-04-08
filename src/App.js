import React, { useState, useEffect } from 'react';
import './App.css';
import ProductTable from './components/ProductTable';
import SearchBar from './components/SearchBar';
import ActionButton from './components/ActionButton';
import AddProductModal from './components/AddProductModal';

function App() {
  const [products, setProducts] = useState(() => {
    const storedProducts = JSON.parse(localStorage.getItem('productos'));
    return storedProducts || [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    localStorage.setItem('productos', JSON.stringify(products));
  }, [products]);

  const handleAddProduct = (newProduct) => {
    setProducts(prevProducts => [...prevProducts, { ...newProduct, id: prevProducts.length + 1 }]);
    setIsModalOpen(false); // Cerrar el modal después de agregar un producto
    setEditingProduct(null); // Restablecer editingProduct a null
  };

  const handleEditProduct = (updatedProduct) => {
    const updatedProducts = products.map(product => {
      if (product.id === updatedProduct.id) {
        return updatedProduct; // Actualizar el producto existente
      }
      return product; // Mantener los otros productos sin cambios
    });
    setProducts(updatedProducts);
    setIsModalOpen(false); // Cerrar el modal después de editar un producto
    setEditingProduct(null); // Restablecer editingProduct a null
  };

  const handleDeleteProduct = (productId) => {
    // Filtrar los productos para excluir el producto que se va a eliminar
    const updatedProducts = products.filter(product => product.id !== productId);
    // Actualizar el estado con la nueva lista de productos
    setProducts(updatedProducts);
  };

  return (
    <div className="App">
      <h1 style={{ fontFamily: "Montserrat, sans-serif" }}>Inventario de Productos ICIAMEX</h1>
      <SearchBar />
      <ProductTable
        products={products}
        onEditProduct={(productId) => {
          const productToEdit = products.find(product => product.id === productId);
          setEditingProduct(productToEdit);
          setIsModalOpen(true);
        }}
        onDeleteProduct={handleDeleteProduct}
      />
      <ActionButton text="Agregar Producto" onClick={() => {
        setIsModalOpen(true);
        setEditingProduct(null); // Asegurarse de que estamos agregando un nuevo producto
      }} />
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
        editingProduct={editingProduct}
      />
    </div>
  );
}

export default App;
