import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Modal from 'react-modal';


// Establece la función de inicialización de react-modal para evitar un aviso de desenfoque de accesibilidad
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
    height: '500px',
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
    margin: "0 auto",
    fontWeight: "700"
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const AddProductModal = ({ isOpen, onClose, onSubmit, editingProduct }) => {
  const [productDetails, setProductDetails] = useState({
    numeroDeParte: '',
    nombre: '',
    costo: '',
    imagen: null
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  useEffect(() => {
    // Restablece el estado del formulario solo cuando el modal se abre y no hay un producto para editar
    if (isOpen && !editingProduct) {
      setProductDetails({
        numeroDeParte: '',
        nombre: '',
        costo: '',
        imagen: null
      });
      setImagePreviewUrl('');
      setErrorMessage(''); // También limpia los mensajes de error previos
    } else if (editingProduct) {
      // Si hay un producto para editar, establece los detalles del producto en el estado
      setProductDetails(editingProduct);
      setImagePreviewUrl(editingProduct.imagen || '');
      setErrorMessage(''); // Asegúrate de limpiar los mensajes de error aquí también
    }
  }, [isOpen, editingProduct]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'imagen' && files.length > 0) {
      const imageFile = files[0];
      if (!isValidImageFile(imageFile)) {
        setErrorMessage('Seleccione un archivo de imagen válido.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setImagePreviewUrl(imageUrl);
        setProductDetails(prevState => ({
          ...prevState,
          imagen: imageUrl
        }));
      };
      reader.readAsDataURL(imageFile);
    } else {
      setProductDetails(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Verifica si alguno de los campos está vacío
    if (!productDetails.numeroDeParte || !productDetails.nombre || !productDetails.costo || !productDetails.imagen) {
      // Usa SweetAlert2 para mostrar un mensaje de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son obligatorios.', // Mensaje de error
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      });
      return; // Detiene la ejecución adicional de la función
    }
  
    // Si todos los campos están llenos, procede con la lógica de envío
    onSubmit(productDetails);
    onClose();
  
    // Muestra un mensaje de éxito con SweetAlert2
    Swal.fire({
      icon: 'success',
      title: '¡Producto agregado!',
      showConfirmButton: false,
      timer: 1500
    });
  };

  const isValidImageFile = (file) => {
    return file.type.startsWith('image/');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose} // Método de cierre proporcionado por react-modal
      style={customStyles}
      contentLabel={editingProduct ? "Editar Producto" : "Agregar Producto"}
    >
      <button className="modal-close" onClick={onClose}>x</button>
      <h2 style={{textAlign: "center"}}>{editingProduct ? "Editar Producto" : "Agregar Producto"}</h2>
      <form onSubmit={handleSubmit}>
        <label style={customStyles.label}>
          Número de Parte:
          <input type="text" name="numeroDeParte" value={productDetails.numeroDeParte} onChange={handleChange} style={customStyles.input} />
        </label>
        <label style={customStyles.label}>
          Descripción:
          <input type="text" name="nombre" value={productDetails.nombre} onChange={handleChange} style={customStyles.input} />
        </label>
        <label style={customStyles.label}>
          Costo:
          <input type="number" name="costo" value={productDetails.costo} onChange={handleChange} style={customStyles.input} />
        </label>
        <label style={customStyles.label}>
          Imagen:
          <input type="file" name="imagen" onChange={handleChange} accept="image/*" style={customStyles.input} />
        </label>
        {imagePreviewUrl && <img src={imagePreviewUrl} alt="Vista previa de la imagen" style={{ width: '30%', margin: "0 auto", display: "flex", paddingBottom: "20px" }} />}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" style={customStyles.button}>{editingProduct ? "Guardar Cambios" : "Agregar"}</button>
      </form>
    </Modal>
  );
};

export default AddProductModal;
