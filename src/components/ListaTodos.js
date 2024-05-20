import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import SearchBar from './SearchBar';
import { db } from '../firebaseConfig';
import Swal from 'sweetalert2';
import Modal from 'react-modal';

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
    height: '450px',
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
  select: {
    width: '100%',
    padding: '8px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    appearance: 'none', /* Para eliminar los estilos nativos del selector */
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'8\' height=\'8\' viewBox=\'0 0 8 8\'%3E%3Cpath fill=\'%23444444\' d=\'M0 2l4 4 4-4H0z\'/%3E%3C/svg%3E")', /* Agrega una flecha personalizada */
    backgroundPosition: 'right 8px top 50%', /* Posiciona la flecha */
    backgroundRepeat: 'no-repeat', /* Evita que se repita la flecha */
    backgroundColor: '#fff', /* Color de fondo */
    color: '#333', /* Color del texto */
  },
};

const ListaTodos = () => {
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [formData, setFormData] = useState({
    tipo: 'Cliente', // Cambiado a 'tipo' en lugar de 'empresa'
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
  const [editingProveedorId, setEditingProveedorId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  

  const resetFormData = () => {
    setFormData({
      tipo: 'Cliente',
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
    resetFormData(); // Limpia los campos del formulario
    setEditingClientId(null); // Restablece el estado de edición del cliente
    setEditingProveedorId(null); // Restablece el estado de edición del proveedor
    setModalIsOpen(true); // Abre el modal
  };


  useEffect(() => {
    obtenerClientes();
    obtenerProveedores();
  }, []);

  const obtenerClientes = async () => {
    const clientesSnapshot = await getDocs(collection(db, 'clientes'));
    const listaClientes = clientesSnapshot.docs.map((doc) => ({ id: doc.id, tipo: 'Cliente', ...doc.data() }));
    setClientes(listaClientes);
    setIsLoading(false);
  };

  const obtenerProveedores = async () => {
    const proveedoresSnapshot = await getDocs(collection(db, 'proveedores'));
    const listaProveedores = proveedoresSnapshot.docs.map((doc) => ({ id: doc.id, tipo: 'Proveedor', ...doc.data() }));
    setProveedores(listaProveedores);
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    // Si el nombre del campo es "imagen" y hay archivos seleccionados
    if (name === "imagen" && files.length > 0) {
      // Procesar la imagen seleccionada
      const image = files[0]; // Obtener el primer archivo seleccionado
      // Aquí puedes realizar operaciones adicionales, como subir la imagen a Firebase Storage, etc.
      // Por ahora, solo actualizaremos el estado con la URL de la imagen seleccionada
      setFormData((prevFormData) => ({
        ...prevFormData,
        imagenURL: URL.createObjectURL(image), // Crear una URL local para previsualizar la imagen
      }));
    } else {
      // Si no es un campo de imagen o no hay archivos seleccionados, actualizar como antes
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredClientes = clientes.filter((cliente) => {
    const searchData = cliente.tipo.toLowerCase() + cliente.empresa.toLowerCase() + cliente.rfc.toLowerCase();
    return searchData.includes(searchQuery.toLowerCase());
  });

  const filteredProveedores = proveedores.filter((proveedor) => {
    const searchData = proveedor.tipo.toLowerCase() + proveedor.empresa.toLowerCase() + proveedor.rfc.toLowerCase();
    return searchData.includes(searchQuery.toLowerCase());
  });

  const handleSubmit = async () => {
    // Validar campos obligatorios para ambos pasos
    if (
      formData.tipo.trim() === '' ||
      formData.empresa.trim() === '' ||
      formData.rfc.trim() === '' ||
      formData.regimenFiscal.trim() === '' ||
      formData.moneda.trim() === '' ||
      formData.telefono.trim() === '' ||
      formData.correo.trim() === '' ||
      formData.domicilio.trim() === '' ||
      formData.numeroExt.trim() === '' ||
      formData.colonia.trim() === '' ||
      formData.codigoPostal.trim() === '' ||
      formData.ciudad.trim() === '' ||
      formData.estado.trim() === ''
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Todos los campos son obligatorios',
      });
      return;
    }
  
    if (step === 1) {
      setStep(2);
    } else {
      try {
        const data = { ...formData };
        if (editingClientId) {
          await updateDoc(doc(db, 'clientes', editingClientId), data);
          setEditingClientId(null);
          Swal.fire({
            icon: 'success',
            title: '¡Cliente actualizado con éxito!',
            showConfirmButton: false,
            timer: 1000,
          });
        } else if (editingProveedorId) {
          await updateDoc(doc(db, 'proveedores', editingProveedorId), data);
          setEditingProveedorId(null);
          Swal.fire({
            icon: 'success',
            title: '¡Proveedor actualizado con éxito!',
            showConfirmButton: false,
            timer: 1000,
          });
        } else {
          // Agregar documento con el tipo seleccionado
          await addDoc(collection(db, formData.tipo === 'Cliente' ? 'clientes' : 'proveedores'), data);
          Swal.fire({
            icon: 'success',
            title: `¡${formData.tipo} registrado con éxito!`,
            showConfirmButton: false,
            timer: 1000,
          });
        }
        // Limpiar el formulario y actualizar las listas
        setFormData({
          tipo: 'Cliente', // Restaurar el tipo a 'Cliente' por defecto
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
        obtenerProveedores();
        setModalIsOpen(false);
      } catch (error) {
        console.error('Error al agregar:', error);
      }
    }
  };
  

  const handleEditClient = (id) => {
    const clientToEdit = clientes.find((cliente) => cliente.id === id);
    setFormData(clientToEdit);
    setEditingClientId(id);
    setEditingProveedorId(null);
    setStep(1);
    setModalIsOpen(true);
  };

  const handleEditProveedor = (id) => {
    const proveedorToEdit = proveedores.find((proveedor) => proveedor.id === id);
    setFormData(proveedorToEdit);
    setEditingProveedorId(id);
    setEditingClientId(null);
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

  return (
    <div>
      <h1>Lista de Clientes y Proveedores</h1>
      <SearchBar handleSearch={handleSearch} />
      {isLoading ? ( // Mostrar mensaje de carga si isLoading es true
        <p>Cargando...</p>
      ) : (
        <>
          <button style={{ fontWeight: '700' }} className="prices-button" onClick={handleOpenModal}>
            + Nuevo
          </button>
          <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={customStyles}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <button className="modal-close" onClick={() => setModalIsOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}>
                x
              </button>
            </div>
            {step === 1 && (
              <>
                <h2 style={{ textAlign: 'center' }}>
                  {editingClientId ? 'Editar Cliente' : editingProveedorId ? 'Editar Proveedor' : 'Agregar Nuevo Cliente o Proveedor'}
                </h2>
                <form className="client-form">
                  <label style={customStyles.label}>Tipo:</label>
                  <select style={customStyles.select} name="tipo" value={formData.tipo} onChange={handleChange}>
                    <option value="Cliente">Cliente</option>
                    <option value="Proveedor">Proveedor</option>
                  </select>
                  <label style={customStyles.label}>Nombre de la Empresa:</label>
                  <input style={customStyles.input} type="text" name="empresa" placeholder="Nombre de la Empresa" value={formData.empresa} onChange={handleChange} />
                  <label style={customStyles.label}>RFC:</label>
                  <input style={customStyles.input} type="text" name="rfc" placeholder="RFC" value={formData.rfc} onChange={handleChange} />
                  <label style={customStyles.label}>Régimen Fiscal:</label>
                  <input style={customStyles.input} type="text" name="regimenFiscal" placeholder="Régimen Fiscal" value={formData.regimenFiscal} onChange={handleChange} />
                  <label style={customStyles.label}>Moneda:</label>
                  <input style={customStyles.input} type="text" name="moneda" placeholder="Moneda" value={formData.moneda} onChange={handleChange} />
                  <label style={customStyles.label}>Teléfono:</label>
                  <input style={customStyles.input} type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
                  <label style={customStyles.label}>Email:</label>
                  <input style={customStyles.input} type="email" name="correo" placeholder="Correo Electrónico" value={formData.correo} onChange={handleChange} />
                  <label style={customStyles.label}>Imagen:</label>
                  <input style={customStyles.input} type="file" name="imagen" onChange={handleChange} />
                  <button type="button" onClick={() => setStep(2)}>Siguiente</button>
                </form>
              </>
            )}
            {step === 2 && (
              <>
                <h2 style={{ textAlign: 'center' }}>Agrega los últimos datos</h2>
                <form className="client-form">
                  <label style={customStyles.label}>Domicilio:</label>
                  <input type="text" name="domicilio" placeholder="Domicilio" value={formData.domicilio} onChange={handleChange} />
                  <label style={customStyles.label}>No. Exterior:</label>
                  <input type="text" name="numeroExt" placeholder="No. Ext" value={formData.numeroExt} onChange={handleChange} />
                  <label style={customStyles.label}>No. Interior:</label>
                  <input type="text" name="numeroInt" placeholder="No. Int" value={formData.numeroInt} onChange={handleChange} />
                  <label style={customStyles.label}>Colonia:</label>
                  <input type="text" name="colonia" placeholder="Colonia" value={formData.colonia} onChange={handleChange} />
                  <label style={customStyles.label}>Código Postal:</label>
                  <input type="text" name="codigoPostal" placeholder="C.P." value={formData.codigoPostal} onChange={handleChange} />
                  <label style={customStyles.label}>Ciudad:</label>
                  <input type="text" name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} />
                  <label style={customStyles.label}>Estado:</label>
                  <input type="text" name="estado" placeholder="Estado" value={formData.estado} onChange={handleChange} />
                  <button type="button" onClick={() => setStep(1)}>Anterior</button>
                  <br/>
                  <button type="button" onClick={handleSubmit}>Finalizar</button>
                </form>
              </>
            )}
          </Modal>
          {(filteredClientes.length > 0 || filteredProveedores.length > 0) ? (
            <table>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Nombre</th>
                  <th>RFC</th>
                  <th>Telefono</th>
                  <th>Correo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.tipo}</td>
                    <td>{cliente.empresa}</td>
                    <td>{cliente.rfc}</td>
                    <td>{cliente.telefono}</td>
                    <td>{cliente.correo}</td>
                    <td>
                      <button className='btnEditar' onClick={() => handleEditClient(cliente.id)}>Editar</button>
                      <button className='btnEliminar' onClick={() => handleDeleteClient(cliente.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
                {filteredProveedores.map((proveedor) => (
                  <tr key={proveedor.id}>
                    <td>{proveedor.tipo}</td>
                    <td>{proveedor.empresa}</td>
                    <td>{proveedor.rfc}</td>
                    <td>{proveedor.telefono}</td>
                    <td>{proveedor.correo}</td>
                    <td>
                      <button className='btnEditar' onClick={() => handleEditProveedor(proveedor.id)}>Editar</button>
                      <button className='btnEliminar' onClick={() => handleDeleteProveedor(proveedor.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay búsquedas disponibles</p>
          )}
        </>
      )}
    </div>
  );
  
};

export default ListaTodos;
