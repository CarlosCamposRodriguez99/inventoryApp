import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import RemisionForm from '../components/RemisionForm';
import TablaRemisiones from '../components/TablaRemisiones';
import PreviaRemision from '../components/PreviaRemision';

const MySwal = withReactContent(Swal);

function Remisiones({ mostrarBotonNuevo }) {
  const [remisiones, setRemisiones] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarPrevia, setMostrarPrevia] = useState(false);
  const [remisionSeleccionada, setRemisionSeleccionada] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [numeroRemision, setNumeroRemision] = useState(null);

  useEffect(() => {
    obtenerClientes();
    obtenerUltimoNumeroRemision();
    obtenerRemisiones();
  }, []);

  const activarFormulario = () => {
    setMostrarFormulario(true);
  };

  const obtenerUltimoNumeroRemision = async () => {
    try {
      const remisionesRef = collection(db, 'remisiones');
      const q = query(remisionesRef, orderBy('numeroRemision', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      let ultimoNumero = 1;
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const ultimaRemision = doc.data();
          ultimoNumero = ultimaRemision.numeroRemision + 1;
        });
      }
      setNumeroRemision(ultimoNumero);
    } catch (error) {
      console.error('Error al obtener el último número de remisión:', error);
    }
  };

  const obtenerRemisiones = async () => {
    try {
      const remisionesSnapshot = await getDocs(collection(db, 'remisiones'));
      const listaRemisiones = remisionesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRemisiones(listaRemisiones);
    } catch (error) {
      console.error('Error al obtener las remisiones:', error);
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

  const guardarRemision = async (remisionData) => {
    try {
      if (!remisionData.cliente || !remisionData.asunto || !remisionData.fechaVencimiento || remisionData.productosSeleccionados.length === 0) {
        MySwal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Todos los campos son obligatorios',
        });
        return;
      }
  
      const cliente = clientes.find(cliente => cliente.id === remisionData.cliente);
      if (!cliente) {
        console.error('Cliente no encontrado');
        return;
      }
  
      const remision = {
        ...remisionData,
        nombreCliente: cliente.empresa,
        numeroRemision,
      };
  
      const docRef = await addDoc(collection(db, 'remisiones'), remision);
      console.log('Remisión guardada con ID: ', docRef.id);
      obtenerRemisiones();
      setMostrarFormulario(false);
      setNumeroRemision(prevNumero => prevNumero + 1);
    } catch (error) {
      console.error('Error al guardar la remisión:', error);
    }
  };

  const verPrevia = (remision) => {
    setRemisionSeleccionada(remision);
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
        <RemisionForm guardarRemision={guardarRemision} clientes={clientes} numeroRemision={numeroRemision}/> 
      ) : mostrarPrevia ? (
        <PreviaRemision remision={remisionSeleccionada} cerrarPrevia={() => setMostrarPrevia(false)} clientes={clientes} guardarRemision={guardarRemision} numeroRemision={remisionSeleccionada.numeroRemision}/> 
      ) : (
        <TablaRemisiones remisiones={remisiones} verPrevia={verPrevia} setRemisiones={setRemisiones} clientes={clientes} guardarRemision={guardarRemision} numeroRemision={numeroRemision} />
      )}
    </div>
  );
}

export default Remisiones;
