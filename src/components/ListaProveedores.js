import React, { useState, useEffect } from 'react';
import { getDocs, addDoc, updateDoc, deleteDoc, collection, doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import ProveedorTable from './ProveedorTable';
import Nav from './Nav';
import moment from 'moment';

moment.locale('es');

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
    height: '550px',
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
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const ListaProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
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
  const [editingProveedorId, setEditingProveedorId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

  const searchProveedores = (term) => {
    return proveedores.filter((proveedor) =>
      proveedor.empresa.toLowerCase().includes(term.toLowerCase()) ||
      proveedor.rfc.toLowerCase().includes(term.toLowerCase()) ||
      proveedor.regimenFiscal.toLowerCase().includes(term.toLowerCase())
      // Agrega más campos de búsqueda según tus necesidades
    );
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    obtenerProveedores();
  }, []);

  const obtenerProveedores = async () => {
    const proveedoresSnapshot = await getDocs(collection(db, 'proveedores'));
    const listaProveedores = proveedoresSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProveedores(listaProveedores);
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios para el primer paso
    if (step === 1) {
      const requiredFields = ['empresa', 'rfc', 'regimenFiscal', 'moneda', 'telefono', 'correo'];
      for (let field of requiredFields) {
        if (formData[field].trim() === '') {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `El campo "${field}" es obligatorio!`,
          });
          return;
        }
      }
      setStep(2);
      return;
    }

    // Validar campos obligatorios para el segundo paso
    if (step === 2) {
      const requiredFields = ['domicilio', 'numeroExt', 'colonia', 'codigoPostal', 'ciudad', 'estado'];
      for (let field of requiredFields) {
        if (formData[field].trim() === '') {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `El campo "${field}" es obligatorio!`,
          });
          return;
        }
      }
    }

    // Procesar el envío del formulario
    try {
      const proveedorData = { ...formData };
      if (editingProveedorId) {
        await updateDoc(doc(db, 'proveedores', editingProveedorId), proveedorData);
        setEditingProveedorId(null);
        Swal.fire({
          icon: 'success',
          title: '¡Proveedor actualizado con éxito!',
          showConfirmButton: false,
          timer: 1000,
        });
      } else {
        await addDoc(collection(db, 'proveedores'), proveedorData);
        Swal.fire({
          icon: 'success',
          title: 'Proveedor registrado con éxito!',
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
      obtenerProveedores();
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error al agregar proveedor:', error);
    }
  };

  const handleEditProveedor = (id) => {
    const proveedorToEdit = proveedores.find((proveedor) => proveedor.id === id);
    setFormData(proveedorToEdit);
    setEditingProveedorId(id);
    setStep(1);
    setModalIsOpen(true);
  };

  const handleDeleteProveedor = async (id) => {
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
          await deleteDoc(doc(db, 'proveedores', id));
          Swal.fire({
            icon: 'success',
            title: '¡Proveedor eliminado con éxito!',
            showConfirmButton: false,
            timer: 1000,
          });
          obtenerProveedores();
        } catch (error) {
          console.error('Error al eliminar proveedor:', error);
        }
      }
    });
  };

  const resetFormData = () => {
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
  };

  const handleOpenModal = () => {
    resetFormData();
    setEditingProveedorId(null);
    setModalIsOpen(true);
  };

  return (
    <>
      <Nav 
        handleSearch={handleSearch}
        proximasAVencer={proximasAVencer} 
        proximosEventos={proximosEventos} 
      />
      <div className='centrar'>
        <h1>Lista de Proveedores</h1>
        <button style={{ fontWeight: '700' }} className="prices-button2" onClick={handleOpenModal}>+ Nuevo</button>
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
              <h2 style={{ textAlign: 'center' }}>{editingProveedorId ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor'}</h2>
              <form onSubmit={handleSubmit} className="client-form">
                <label style={customStyles.label}>
                  Nombre del Proveedor:
                  <input style={customStyles.input} type="text" name="empresa" placeholder="Nombre del Proveedor" value={formData.empresa} onChange={handleChange} />
                </label>
                <label style={customStyles.label}>
                  RFC:
                  <input style={customStyles.input} type="text" name="rfc" placeholder="RFC" value={formData.rfc} onChange={handleChange} />
                </label>
                <label style={customStyles.label}>
                  Régimen Fiscal:
                  <input style={customStyles.input} type="text" name="regimenFiscal" placeholder="Régimen Fiscal" value={formData.regimenFiscal} onChange={handleChange} />
                </label>
                <label style={customStyles.label}>
                  Moneda:
                  <input style={customStyles.input} type="text" name="moneda" placeholder="Moneda" value={formData.moneda} onChange={handleChange} />
                </label>
                <label style={customStyles.label}>
                  Teléfono:
                  <input style={customStyles.input} type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
                </label>
                <label style={customStyles.label}>
                  Email:
                  <input style={customStyles.input} type="email" name="correo" placeholder="Correo Electrónico" value={formData.correo} onChange={handleChange} />
                </label>
                <label style={customStyles.label}>
                  Imagen:
                  <input style={customStyles.input} type="file" name="imagen" onChange={handleChange} />
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
                  <input style={customStyles.input} type="text" name="domicilio" placeholder="Domicilio" value={formData.domicilio} onChange={handleChange} />
                </label>
                <label style={customStyles.label}>
                  No. Exterior:
                  <input style={customStyles.input} type="text" name="numeroExt" placeholder="No. Ext" value={formData.numeroExt} onChange={handleChange} />
                </label>
                <label style={customStyles.label}>
                  No. Interior:
                  <input style={customStyles.input} type="text" name="numeroInt" placeholder="No. Int" value={formData.numeroInt} onChange={handleChange} />
                </label>
                <label style={customStyles.label}>
                  Colonia:
                  <input style={customStyles.input} type="text" name="colonia" placeholder="Colonia" value={formData.colonia} onChange={handleChange} />
                </label>
                <label style={customStyles.label}>
                  Código Postal:
                  <input style={customStyles.input} type="text" name="codigoPostal" placeholder="C.P." value={formData.codigoPostal} onChange={handleChange} />
                </label>
                <label style={customStyles.label}>
                  Ciudad:
                  <input style={customStyles.input} type="text" name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} />
                </label>
                <label style={customStyles.label}>
                  Estado:
                  <input style={customStyles.input} type="text" name="estado" placeholder="Estado" value={formData.estado} onChange={handleChange} />
                </label>
                <button type="button" onClick={() => setStep(1)}>Anterior</button>
                <br />
                <button type="submit">Guardar</button>
              </form>
            </>
          )}
        </Modal>
        {isLoading ? (
          <p>Cargando...</p>
        ) : searchTerm !== '' && searchProveedores(searchTerm).length === 0 ? (
          <p>No hay búsquedas disponibles</p>
        ) : (
          <ProveedorTable proveedores={searchProveedores(searchTerm)} onEditProveedor={handleEditProveedor} onDeleteProveedor={handleDeleteProveedor} />
        )}
      </div>
    </>
  );
};

export default ListaProveedores;
