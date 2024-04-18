import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import ClientsTable from '../components/ClientsTable';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    maxWidth: '400px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    fontFamily: 'Roboto, sans-serif',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
};

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    empresa: '',
    rfc: '',
    regimenFiscal: '',
    moneda: '',
    telefono: '',
    correo: '',
    imagenURL: null,
    domicilio: '',
    numeroExt: '',
    numeroInt: '',
    colonia: '',
    codigoPostal: '',
    ciudad: '',
    estado: '',
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [editingClientId, setEditingClientId] = useState(null);

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    const clientesSnapshot = await getDocs(collection(db, 'clientes'));
    const listaClientes = clientesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setClientes(listaClientes);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      if (formData.empresa.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'El campo "Nombre de la Empresa" es obligatorio!',
        });
        return;
      }
      setStep(2);
    } else {
      try {
        const clienteData = { ...formData };
        if (editingClientId) {
          await updateDoc(doc(db, 'clientes', editingClientId), clienteData);
          setEditingClientId(null);
          Swal.fire({
            icon: 'success',
            title: '¡Cliente actualizado con éxito!',
            showConfirmButton: false,
            timer: 1000,
          });
        } else {
          await addDoc(collection(db, 'clientes'), clienteData);
          Swal.fire({
            icon: 'success',
            title: '¡Cliente registrado con éxito!',
            showConfirmButton: false,
            timer: 1000,
          });
        }
        setFormData({
          empresa: '',
          rfc: '',
          regimenFiscal: '',
          moneda: '',
          telefono: '',
          correo: '',
          imagenURL: null,
          domicilio: '',
          numeroExt: '',
          numeroInt: '',
          colonia: '',
          codigoPostal: '',
          ciudad: '',
          estado: '',
        });
        setStep(1);
        obtenerClientes();
        setModalIsOpen(false);
      } catch (error) {
        console.error('Error al agregar cliente:', error);
      }
    }
  };

  const handleEditClient = (id) => {
    const clientToEdit = clientes.find((cliente) => cliente.id === id);
    setFormData(clientToEdit);
    setEditingClientId(id);
    setStep(1);
    setModalIsOpen(true);
  };

  const handleDeleteClient = async (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, 'clientes', id));
          Swal.fire({
            icon: 'success',
            title: '¡Cliente eliminado con éxito!',
            showConfirmButton: false,
            timer: 1000,
          });
          obtenerClientes();
        } catch (error) {
          console.error('Error al eliminar cliente:', error);
        }
      }
    });
  };

  return (
    <div>
      <h1>Lista de Clientes</h1>
      <button style={{ fontWeight: '700' }} className="prices-button" onClick={() => setModalIsOpen(true)}>+ Nuevo</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button className="modal-close" onClick={() => setModalIsOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}>x</button>
        </div>
        {step === 1 && (
          <>
            <h2 style={{ textAlign: 'center' }}>Agregar Nuevo Cliente</h2>
            <form onSubmit={handleSubmit} className="client-form">
              <label style={customStyles.label}>
                Nombre de la Empresa:
                <input type="text" name="empresa" placeholder="Nombre de la Empresa" value={formData.empresa} onChange={handleChange} />
              </label>
              <label style={customStyles.label}>
                RFC:
                <input type="text" name="rfc" placeholder="RFC" value={formData.rfc} onChange={handleChange} />
              </label>
              <label style={customStyles.label}>
                Régimen Fiscal:
                <input type="text" name="regimenFiscal" placeholder="Régimen Fiscal" value={formData.regimenFiscal} onChange={handleChange} />
              </label>
              <label style={customStyles.label}>
                Moneda:
                <input type="text" name="moneda" placeholder="Moneda" value={formData.moneda} onChange={handleChange} />
              </label>
              <label style={customStyles.label}>
                Teléfono:
                <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
              </label>
              <label style={customStyles.label}>
                Email:
                <input type="email" name="correo" placeholder="Correo Electrónico" value={formData.correo} onChange={handleChange} />
              </label>
              <label style={customStyles.label}>
                Imagen:
                <input type="file" name="imagen" onChange={handleChange} />
              </label>
              <button type="submit">Siguiente</button>
            </form>
          </>
        )}
        {step === 2 && (
          <>
            <h2 style={{ textAlign: 'center' }}>Agrega los últimos datos</h2>
            <form onSubmit={handleSubmit} className="client-form">
              <label style={customStyles.label}>
                Domicilio:
                <input type="text" name="domicilio" placeholder="Domicilio" value={formData.domicilio} onChange={handleChange} />
              </label>
              <label style={customStyles.label}>
                No. Exterior:
                <input type="text" name="numeroExt" placeholder="No. Ext" value={formData.numeroExt} onChange={handleChange} />
              </label>
              <label style={customStyles.label}>
                No. Interior:
                <input type="text" name="numeroInt" placeholder="No. Int" value={formData.numeroInt} onChange={handleChange} />
              </label>
              <label style={customStyles.label}>
                Colonia:
                <input type="text" name="colonia" placeholder="Colonia" value={formData.colonia} onChange={handleChange} />
              </label>
              <label style={customStyles.label}>
                Código Postal:
                <input type="text" name="codigoPostal" placeholder="C.P." value={formData.codigoPostal} onChange={handleChange} />
              </label>
              <label style={customStyles.label}>
                Ciudad:
                <input type="text" name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} />
              </label>
              <label style={customStyles.label}>
                Estado:
                <input type="text" name="estado" placeholder="Estado" value={formData.estado} onChange={handleChange} />
              </label>
              <button type="submit">Agregar Cliente</button>
            </form>
          </>
        )}
      </Modal>
      <ClientsTable clientes={clientes} onEditClient={handleEditClient} onDeleteClient={handleDeleteClient} />
      
    </div>
  );
};

export default ListaClientes;
