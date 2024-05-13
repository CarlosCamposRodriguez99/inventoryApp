import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import OrdenForm from '../components/OrdenForm';
import TablaOrdenes from '../components/TablaOrdenes';
import PreviaOrden from '../components/PreviaOrden';

const MySwal = withReactContent(Swal);

function NuevaOrdenCompra({ mostrarBotonNuevo }) {
  const [ordenes, setOrdenes] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarPrevia, setMostrarPrevia] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [numeroOrden, setNumeroOrden] = useState(null);

  useEffect(() => {
    obtenerProvedores();
    obtenerUltimoNumeroOrden();
    obtenerOrdenes();
  }, []);

  const activarFormulario = () => {
    setMostrarFormulario(true);
  };

  const obtenerUltimoNumeroOrden = async () => {
    try {
      const ordenesRef = collection(db, 'ordenes');
      const q = query(ordenesRef, orderBy('numeroOrden', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      let ultimoNumero = 1;
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const ultimaOrden = doc.data();
          ultimoNumero = ultimaOrden.numeroOrden + 1;
        });
      }
      setNumeroOrden(ultimoNumero);
    } catch (error) {
      console.error('Error al obtener el último número de orden:', error);
    }
  };

  const obtenerOrdenes = async () => {
    try {
      const ordenesSnapshot = await getDocs(collection(db, 'ordenes'));
      const listaOrdenes = ordenesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrdenes(listaOrdenes);
    } catch (error) {
      console.error('Error al obtener las ordenes:', error);
    }
  };

  const obtenerProvedores = async () => {
    try {
      const proveedoresSnapshot = await getDocs(collection(db, 'proveedores'));
      const listaProveedores = proveedoresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProveedores(listaProveedores);
    } catch (error) {
      console.error('Error al obtener los proveedores:', error);
    }
  };

  const guardarOrden = async (ordenData) => {
    try {
      if (!ordenData.proveedor || !ordenData.asunto || !ordenData.fechaVencimiento || ordenData.productosSeleccionados.length === 0) {
        MySwal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Todos los campos son obligatorios',
        });
        return;
      }
  
      const proveedor = proveedores.find(proveedor => proveedor.id === ordenData.proveedor);
      if (!proveedor) {
        console.error('Proveedor no encontrado');
        return;
      }
  
      const orden = {
        ...ordenData,
        nombreProveedor: proveedor.empresa,
        numeroOrden,
      };
  
      const docRef = await addDoc(collection(db, 'ordenes'), orden);
      console.log('Orden guardada con ID: ', docRef.id);
      obtenerOrdenes();
      setMostrarFormulario(false);
      setNumeroOrden(prevNumero => prevNumero + 1);
    } catch (error) {
      console.error('Error al guardar la orden:', error);
    }
  };

  const verPrevia = (orden) => {
    setOrdenSeleccionada(orden);
    setMostrarPrevia(true);
  };

  return (
    <div>
      {!mostrarFormulario && mostrarBotonNuevo && ( // Aquí se condiciona la visibilidad del botón "+ Nuevo" según la prop recibida
        <div>
          <button className="action-button2" onClick={activarFormulario}>+ Nuevo</button>
        </div>
      )}
      {mostrarFormulario ? (
        <OrdenForm guardarOrden={guardarOrden} proveedores={proveedores} numeroOrden={numeroOrden}/> 
      ) : mostrarPrevia ? (
        <PreviaOrden orden={ordenSeleccionada} cerrarPrevia={() => setMostrarPrevia(false)} proveedores={proveedores} guardarOrden={guardarOrden} numeroOrden={ordenSeleccionada.numeroOrden}/> 
      ) : (
        <TablaOrdenes ordenes={ordenes} verPrevia={verPrevia} setOrdenes={setOrdenes} proveedores={proveedores} guardarOrden={guardarOrden} numeroOrden={numeroOrden} />
      )}
    </div>
  );
}

export default NuevaOrdenCompra;
