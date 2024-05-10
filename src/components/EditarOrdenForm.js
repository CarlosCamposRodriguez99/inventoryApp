import React, { useState } from 'react';
import OrdenForm from './OrdenForm';
import Modal from 'react-modal';
import ResumenOrden from './ResumenOrden';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: 'none',
    borderRadius: '0',
    padding: '20px',
    overflow: 'auto',
    fontFamily: 'Roboto, sans-serif',
  },
};

const EditarOrdenForm = ({ cotizacion, clientes, productos, onClose }) => {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [mostrarResumen] = useState(false);

  const closeModal = () => {
    setModalIsOpen(false);
    // Llamar a la función onClose para cerrar el ResumenOrden
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
        <button onClick={closeModal} className="cerrar-button">X</button>
        <div className="editar-cotizacion-form">
          <h1 style={{ textAlign: "center" }}>Editar Orden de Compra</h1>
          <OrdenForm
            cotizacion={cotizacion}
            clientes={clientes}
            productos={productos}
          />
        </div>
      </Modal>
      {mostrarResumen && (
        <ResumenOrden cotizacion={cotizacion} onClose={onClose} />
      )}
    </>
  );
};

export default EditarOrdenForm;
