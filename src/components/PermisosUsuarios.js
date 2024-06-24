import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';


const PermisosUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rol: 'Ventas', // Valor por defecto
  });

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'usuarios'));
        const usuariosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsuarios(usuariosData);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsuarios();
  }, []);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      border: 'none',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      maxWidth: '500px',
      width: '100%',
      height: '400px',
      maxHeight: '90vh',
      overflow: 'auto',
      fontFamily: 'Roboto, sans-serif', // Aplica la fuente Roboto
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
    button: {
      width: '50%', // Centra el botón de agregar
      padding: '10px',
      borderRadius: '5px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      display: 'flex',
      justifyContent: 'center',
      margin: '0 auto',
      fontWeight: '700',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  };

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    // Limpiar los campos del formulario al cerrar el modal
    setNuevoUsuario({
      nombre: '',
      apellido: '',
      email: '',
      rol: 'Ventas',
    });
  };

  const handleInputChange = (e) => {
    setNuevoUsuario({
      ...nuevoUsuario,
      [e.target.name]: e.target.value,
    });
  };

  const handleInviteUser = () => {
    handleOpenModal();
  };

  const handleSaveUser = async () => {
    // Validación de campos
    if (nuevoUsuario.nombre.trim() === '' || nuevoUsuario.email.trim() === '') {
      alert('Por favor ingresa nombre y correo electrónico válidos.');
      return;
    }
  
    try {
      if (nuevoUsuario.id) {
        // Editar usuario existente en Firestore
        await updateDoc(doc(db, 'usuarios', nuevoUsuario.id), nuevoUsuario);
  
        // Actualizar usuario en la lista localmente
        const updatedUsuarios = usuarios.map((usuario) =>
          usuario.id === nuevoUsuario.id ? { ...usuario, ...nuevoUsuario } : usuario
        );
        setUsuarios(updatedUsuarios);
  
        // Mostrar SweetAlert de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Usuario actualizado!',
          timer: 1000,
          timerProgressBar: true,
        });
      } else {
        // Guardar el nuevo usuario en la colección 'usuarios'
        const docRef = await addDoc(collection(db, 'usuarios'), nuevoUsuario);
        console.log('Usuario guardado con ID: ', docRef.id);
  
        // Actualizar el estado de usuarios localmente si es necesario
        setUsuarios([...usuarios, { id: docRef.id, ...nuevoUsuario }]);
  
        // Mostrar SweetAlert de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Usuario agregado al equipo!',
          timer: 1000, // Mostrar por 1 segundo
          timerProgressBar: true,
          didOpen: () => {
            // Código que se ejecuta cuando se abre el alert
            Swal.showLoading();
          },
        });
      }
  
      // Cerrar el modal después de guardar
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar usuario: ', error);
      // Manejo de errores, mostrar mensaje al usuario, etc.
    }
  };
  
  

  const handleEditUser = (index) => {
    // Obtener el usuario a editar
    const usuarioAEditar = usuarios[index];
  
    // Llenar el estado 'nuevoUsuario' con los datos del usuario a editar
    setNuevoUsuario({
      nombre: usuarioAEditar.nombre,
      apellido: usuarioAEditar.apellido,
      email: usuarioAEditar.email,
      rol: usuarioAEditar.rol,
      id: usuarioAEditar.id, // Incluir el ID para identificar el usuario en Firestore
    });
  
    // Abrir el modal de edición
    setModalIsOpen(true);
  };

  const handleDeleteUser = async (index) => {
    try {
      const result = await Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará al usuario permanentemente.',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });
  
      if (result.isConfirmed) {
        // Obtener el ID del usuario a eliminar
        const userIdToDelete = usuarios[index].id;
  
        // Eliminar usuario de Firestore
        await deleteDoc(doc(db, 'usuarios', userIdToDelete));
  
        // Eliminar usuario de la lista localmente
        const updatedUsuarios = usuarios.filter((usuario, idx) => idx !== index);
        setUsuarios(updatedUsuarios);
  
        // Mostrar SweetAlert de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Usuario eliminado!',
          timer: 1000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };
  

  return (
    <div className="permisos-usuarios-container">

    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ textAlign: 'left', margin: 0 }}>Todos los usuarios</h3>
        <i className="bi bi-caret-down-fill" style={{ fontSize: '15px', marginLeft: '5px', color: "#007bff" }}></i>
    </div>

    <div className="invite-form">
        <button
        onClick={handleInviteUser}
        style={{
            position: 'absolute',
            padding: '10px',
            fontSize: '14px',
            borderRadius: '5px',
            right: '70px',
            marginBottom: '40px',
        }}
        >
        Invitar a un usuario
        </button>
    </div>

    {/* Tabla de usuarios */}
    <table className="usuarios-table">
        <thead>
        <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Opciones</th>
        </tr>
        </thead>
        <tbody>
        {usuarios.map((usuario, index) => (
            <tr key={index}>
            <td>{usuario.nombre} {usuario.apellido}</td>
            <td>{usuario.email}</td>
            <td>{usuario.rol}</td>
            <td>
                <button className='btnEditar' onClick={() => handleEditUser(index)}>Editar</button>
                <button className='btnEliminar' onClick={() => handleDeleteUser(index)}>Eliminar</button>
            </td>
            </tr>
        ))}
        </tbody>
    </table>

    {/* Modal para agregar nuevo usuario */}
    <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        style={customStyles}
        contentLabel="Modal de invitación"
        ariaHideApp={false}
    >
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
        onClick={handleCloseModal}
        style={{
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px',
            color: '#000',
        }}
        >
        &times;
        </button>
    </div>

    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Invitar a un nuevo usuario</h2>

    <div>
        {/* Campos del formulario de invitación */}
        <div style={{ display: 'flex', marginBottom: '15px', gap: '10px' }}>
        <div style={{ flex: 1 }}>
            <input
            type="text"
            name="nombre"
            placeholder="Nombre(s)"
            value={nuevoUsuario.nombre}
            onChange={handleInputChange}
            style={customStyles.input}
            />
        </div>
        <div style={{ flex: 1 }}>
            <input
            type="text"
            name="apellido"
            placeholder="Apellido(s)"
            value={nuevoUsuario.apellido}
            onChange={handleInputChange}
            style={customStyles.input}
            />
        </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
        <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={nuevoUsuario.email}
            onChange={handleInputChange}
            style={customStyles.input}
        />
        </div>

        <div style={{ marginBottom: '20px' }}>
        <label style={customStyles.label}>Rol:</label>
        <select
            name="rol"
            value={nuevoUsuario.rol}
            onChange={handleInputChange}
            style={customStyles.input}
        >
            <option value="Ventas">Ventas</option>
            <option value="Administrador">Administrador</option>
        </select>
        </div>

        {/* Botones de acción del modal */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button
            onClick={handleSaveUser}
            style={{
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: "#007bff",
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
            }}
        >
            Guardar
        </button>
        <button
            onClick={handleCloseModal}
            style={{
            padding: '10px 20px',
            borderRadius: '5px',
            border: '1px solid #d9d9d9',
            backgroundColor: '#f9f9f9',
            color: '#000',
            cursor: 'pointer',
            fontWeight: 'bold',
            }}
        >
            Cancelar
        </button>
        </div>
    </div>
    </Modal>

    </div>

  );
};

export default PermisosUsuarios;
