import React, { useState } from 'react';
import RemisionForm from './RemisionForm';
import Modal from 'react-modal';
import ResumenRemision from './ResumenRemision';

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
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const EditarRemisionForm = ({ remision, clientes, productos, onClose }) => {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [mostrarResumen] = useState(false);

  const closeModal = () => {
    setModalIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
        <button onClick={closeModal} className="cerrar-button">X</button>
        <div className="editar-cotizacion-form">
          <h1 style={{ textAlign: "center" }}>Editar Remisión</h1>
          <RemisionForm
            remision={remision}
            clientes={clientes}
            productos={productos}
          />
        </div>
      </Modal>
      {mostrarResumen && (
        <ResumenRemision remision={remision} onClose={onClose} />
      )}
    </>
  );
};

export default EditarRemisionForm;
