import React, { useState } from 'react';
import CotizacionForm from './CotizacionForm';
import Modal from 'react-modal';
import ResumenCotizacion from './ResumenCotizacion';

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

const EditarCotizacionForm = ({ cotizacion, clientes, productos, cotizaciones, setCotizaciones }) => {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [mostrarResumen, setMostrarResumen] = useState(false);

  const closeModal = () => {
    setModalIsOpen(false);
    setMostrarResumen(true);
  };

  return (
    <>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
        <button onClick={closeModal} className="cerrar-button">X</button>
        <div className="editar-cotizacion-form">
          <h1 style={{ textAlign: "center" }}>Editar Cotización</h1>
          <CotizacionForm
            cotizacion={cotizacion}
            clientes={clientes}
            productos={productos}
          />
        </div>
      </Modal>
      {mostrarResumen && (
        <ResumenCotizacion cotizacion={cotizacion} />
      )}
    </>
  );
};

export default EditarCotizacionForm;
