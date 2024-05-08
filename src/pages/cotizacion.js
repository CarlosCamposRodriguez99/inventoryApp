import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CotizacionForm from '../components/CotizacionForm';
import TablaCotizaciones from '../components/TablaCotizaciones';
import PreviaCotizacion from '../components/PreviaCotizacion';

const MySwal = withReactContent(Swal);

function CotizacionesContainer() {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarPrevia, setMostrarPrevia] = useState(false);
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [numeroCotizacion, setNumeroCotizacion] = useState(null);

  useEffect(() => {
    obtenerClientes();
    obtenerUltimoNumeroCotizacion(); // Obtener el último número de cotización al cargar la página
    obtenerCotizaciones();
  }, []);

  const activarFormulario = () => {
    setMostrarFormulario(true); // Activar el formulario al hacer clic en el botón
  };

  const obtenerUltimoNumeroCotizacion = async () => {
    try {
      const cotizacionesRef = collection(db, 'cotizaciones');
      const q = query(cotizacionesRef, orderBy('numeroCotizacion', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      let ultimoNumero = 1; // Por defecto, el número de cotización será 1 si no hay cotizaciones previas
      if (!querySnapshot.empty) {
        // Si hay cotizaciones previas, obtener el número de cotización de la última
        querySnapshot.forEach((doc) => {
          const ultimaCotizacion = doc.data();
          ultimoNumero = ultimaCotizacion.numeroCotizacion + 1;
        });
      }
      setNumeroCotizacion(ultimoNumero);
    } catch (error) {
      console.error('Error al obtener el último número de cotización:', error);
    }
  };

  const obtenerCotizaciones = async () => {
    try {
      const cotizacionesSnapshot = await getDocs(collection(db, 'cotizaciones'));
      const listaCotizaciones = cotizacionesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCotizaciones(listaCotizaciones);
    } catch (error) {
      console.error('Error al obtener las cotizaciones:', error);
    }
  };

  const obtenerClientes = async () => {
    try {
      const clientesSnapshot = await getDocs(collection(db, 'clientes'));
      const listaClientes = clientesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClientes(listaClientes);
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }
  };

  const guardarCotizacion = async (cotizacionData) => {
    try {
      if (!cotizacionData.cliente || !cotizacionData.asunto || !cotizacionData.fechaVencimiento || cotizacionData.productosSeleccionados.length === 0) {
        MySwal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Todos los campos son obligatorios',
        });
        return;
      }
  
      const cliente = clientes.find(cliente => cliente.id === cotizacionData.cliente);
      if (!cliente) {
        console.error('Cliente no encontrado');
        return;
      }
  
      const cotizacion = {
        ...cotizacionData,
        nombreCliente: cliente.empresa,
        numeroCotizacion, // Usar el número de cotización obtenido previamente
      };
  
      const docRef = await addDoc(collection(db, 'cotizaciones'), cotizacion);
      console.log('Cotización guardada con ID: ', docRef.id);
      obtenerCotizaciones();
      setMostrarFormulario(false);
      setNumeroCotizacion(prevNumero => prevNumero + 1); // Incrementar el número de cotización para la próxima cotización
    } catch (error) {
      console.error('Error al guardar la cotización:', error);
    }
  };

  const verPrevia = (cotizacion) => {
    setCotizacionSeleccionada(cotizacion);
    setMostrarPrevia(true);
  };

  return (
    <div>
      {!mostrarFormulario && (
        <div>
          <button className="action-button2" onClick={activarFormulario}>+ Nuevo</button>
        </div>
      )}
      {mostrarFormulario ? (
        <CotizacionForm guardarCotizacion={guardarCotizacion} clientes={clientes} numeroCotizacion={numeroCotizacion}/> 
      ) : mostrarPrevia ? (
        <PreviaCotizacion cotizacion={cotizacionSeleccionada} cerrarPrevia={() => setMostrarPrevia(false)} clientes={clientes} guardarCotizacion={guardarCotizacion} numeroCotizacion={cotizacionSeleccionada.numeroCotizacion}/> 
      ) : (
        <TablaCotizaciones cotizaciones={cotizaciones} verPrevia={verPrevia} setCotizaciones={setCotizaciones} clientes={clientes} guardarCotizacion={guardarCotizacion} numeroCotizacion={numeroCotizacion} />
      )}
    </div>
  );
}
export default CotizacionesContainer;
