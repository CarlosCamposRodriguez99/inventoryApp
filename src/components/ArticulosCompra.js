import React, { useState, useEffect, useCallback } from 'react';
import ProductTable from './ProductTable';
import Sidebar from './Sidebar';
import Nav from './Nav';
import ActionButton from './ActionButton';
import AddProductModal from './AddProductModal';
import ProductButton from './ProductButton';
import { db } from '../firebaseConfig';
import { getDocs, addDoc, updateDoc, deleteDoc, collection, doc, getFirestore, onSnapshot } from 'firebase/firestore';
import Swal from 'sweetalert2';
import moment from 'moment';

moment.locale('es');

const ArticulosCompra = () => {

    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [proximasAVencer, setProximasAVencer] = useState([]);
    const [proximosEventos, setProximosEventos] = useState([]);

    useEffect(() => {
      const fetchCotizaciones = async () => {
          const firestore = getFirestore();
          const cotizacionesRef = collection(firestore, 'cotizaciones');
          const unsubscribeCotizaciones = onSnapshot(cotizacionesRef, (snapshot) => {
              const cotizaciones = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
              // Filtrar las cotizaciones que tienen fecha de vencimiento a partir de hoy y ordenarlas
              const proximas = cotizaciones
                  .filter(cotizacion => moment(cotizacion.fechaVencimiento) >= moment().startOf('day'))
                  .sort((a, b) => moment(a.fechaVencimiento) - moment(b.fechaVencimiento));
  
              setProximasAVencer(proximas.slice(0, 6)); // Limitar la lista a 6 fechas próximas
          });
  
          return () => unsubscribeCotizaciones();
      };
  
      const fetchEventos = async () => {
          const firestore = getFirestore();
          const eventosRef = collection(firestore, 'eventos');
          const unsubscribeEventos = onSnapshot(eventosRef, (snapshot) => {
              const eventos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
              // Filtrar eventos que ocurren a partir de hoy y ordenarlos
              const proximos = eventos
                  .filter(evento => moment(evento.to) >= moment().startOf('day'))
                  .sort((a, b) => moment(a.to) - moment(b.to));
  
              setProximosEventos(proximos.slice(0, 6)); // Limitar la lista a 6 eventos próximos
  
              // Filtrar fechas festivas que están a menos de una semana
              const fechasFestivasProximas = [];
              const fechasFestivasBase = [
                  { title: 'Año Nuevo', month: '01', day: '01', color: '#de2e03' },
                  { title: 'Día de la Constitución', month: '02', day: '05', color: '#de2e03' },
                  { title: 'Natalicio de Benito Juárez', month: '03', day: '21', color: '#de2e03' },
                  { title: 'Día del Trabajo', month: '05', day: '01', color: '#de2e03' },
                  { title: 'Independencia de México', month: '09', day: '16', color: '#de2e03' },
                  { title: 'Transición del Poder Ejecutivo', month: '10', day: '01', color: '#de2e03' },
                  { title: 'Revolución Mexicana', month: '11', day: '20', color: '#de2e03' },
                  { title: 'Navidad', month: '12', day: '25', color: '#de2e03' },
              ];
  
              const today = moment().startOf('day');
              const oneWeekFromNow = moment().add(7, 'days').startOf('day');
  
              fechasFestivasBase.forEach(festivo => {
                  const festivoDate = moment(`${today.year()}-${festivo.month}-${festivo.day}`, 'YYYY-MM-DD');
                  if (festivoDate.isBetween(today, oneWeekFromNow, null, '[]')) {
                      fechasFestivasProximas.push({
                          title: festivo.title,
                          start: festivoDate.toDate(),
                          end: festivoDate.toDate(),
                          allDay: true,
                          resource: 'festivo',
                          style: { backgroundColor: festivo.color }
                      });
                  }
              });
  
              if (fechasFestivasProximas.length > 0) {
                  // Notificar sobre fechas festivas próximas
                  alert(`Fechas festivas próximas: ${fechasFestivasProximas.map(festivo => `${festivo.title} el ${moment(festivo.start).format('LL')}`).join(', ')}`);
              }
          });
  
          return () => unsubscribeEventos();
      };
  
      // Ejecutar las funciones de carga de cotizaciones y eventos
      fetchCotizaciones();
      fetchEventos();
    }, []);

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
          setIsLoading(false);
        } catch (error) {
          console.error('Error al obtener los productos:', error);
          setIsLoading(false);
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
      // Primero, mostramos la alerta de confirmación
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás deshacer esta acción!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // Si el usuario confirma, procedemos con la eliminación
            await deleteDoc(doc(db, 'productos', productId));
            const updatedProducts = products.filter(product => product.id !== productId);
            setProducts(updatedProducts);
            Swal.fire(
              '¡Eliminado!',
              'El producto ha sido eliminado.',
              'success'
            );
          } catch (error) {
            console.error('Error al eliminar el producto:', error);
            Swal.fire(
              '¡Error!',
              'Ha ocurrido un error al intentar eliminar el producto.',
              'error'
            );
          }
        }
      });
    };
  
    const handleSearch = (searchTerm) => {
      filterProducts(searchTerm);
    };


  return (
    <>
      <Nav 
        handleSearch={handleSearch}
        proximasAVencer={proximasAVencer} 
        proximosEventos={proximosEventos} 
      />
      <h1>Lista de Artículos de Compra</h1>
      <Sidebar />
      {isLoading ? (
        <p>Cargando...</p>
      ) : filteredProducts.length === 0 ? (
        <p>No hay productos</p>
      ) : (
        <>
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
      )}
    </>

  )
}

export default ArticulosCompra;