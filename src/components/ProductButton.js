import React, { useState } from 'react';
import Modal from 'react-modal';
import { doc, updateDoc } from 'firebase/firestore';
import db from '../firebaseConfig';
import Swal from 'sweetalert2';

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
};

const ProductButton = ({ products, setProducts }) => {
  const [percentage, setPercentage] = useState(10);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const updatePrices = async (increase) => {
    // Muestra un mensaje de confirmación con SweetAlert
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Estás a punto de " + (increase ? "aumentar" : "disminuir") + " los precios.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡hazlo!',
      cancelButtonText: 'No, cancelar'
    });
  
    if (result.isConfirmed) {
      const adjustFactor = parseFloat((1 + (increase ? percentage : -percentage) / 100).toFixed(2));
    
      const updatePromises = products.map(product => {
        const newCost = parseFloat((product.costo * adjustFactor).toFixed(2));
        const productRef = doc(db, "productos", product.id);
        return updateDoc(productRef, { costo: newCost });
      });
    
      try {
        // Espera a que todas las actualizaciones se completen
        await Promise.all(updatePromises);
        
        // Muestra un mensaje de éxito con SweetAlert
        Swal.fire({
          title: '¡Éxito!',
          text: 'Precios actualizados correctamente en Firebase.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } catch (error) {
        console.error('Error al actualizar precios en Firebase:', error);
        
        // Muestra un mensaje de error con SweetAlert
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al actualizar los precios.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } else {
      // Acción cancelada
      Swal.fire({
        title: 'Cancelado',
        text: 'Los cambios en los precios han sido cancelados.',
        icon: 'info',
        confirmButtonText: 'OK'
      });
    }
  
    // Cierra el modal una vez completada la actualización o cancelación
    setModalIsOpen(false);
  };
  
  const handlePercentageChange = (e) => {
    let newValue = e.target.value;
    // Si el nuevo valor es igual a cero, reemplazarlo por una cadena vacía
    if (newValue === '0') {
      newValue = '';
    }
    setPercentage(newValue);
  };

  return (
    <div style={{ position: 'fixed', top: '20px', right: '100px', zIndex: '9999' }}>
      <button className="prices-button" onClick={() => setModalIsOpen(true)}>Ajustar precios</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{...customStyles, content: { ...customStyles.content, width: '50%' }}}
        contentLabel="Ajuste de Precios"
      >
        <button className="modal-close" onClick={() => setModalIsOpen(false)}>x</button>
        <h2 style={{textAlign: "center"}}>Editar Ajuste de Precios</h2>
        <label style={customStyles.label}>
          Porcentaje:
          <input type="number" value={percentage} onChange={handlePercentageChange} style={customStyles.input} />
        </label>
        <button className="modal-apply-button" onClick={() => updatePrices(true)}>Aumentar Precio</button>
        <button className="modal-apply-button" onClick={() => updatePrices(false)}>Disminuir Precio</button>
      </Modal>
    </div>
  );
};

export default ProductButton;