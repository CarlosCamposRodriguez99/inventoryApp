import React, { useState } from 'react';
import CotizacionForm from './CotizacionForm';
import Modal from 'react-modal';
import TablaCotizaciones from './TablaCotizaciones';

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

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
        <button onClick={closeModal} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', background: 'none', border: 'none' }}>X</button>
        <div className="editar-cotizacion-form">
          <h1 style={{ textAlign: "center" }}>Editar Cotización</h1>
          <CotizacionForm
            cotizacion={cotizacion}
            clientes={clientes}
            productos={productos}
          />
        </div>
      </Modal>
      {!modalIsOpen && Array.isArray(cotizaciones) && cotizaciones.length > 0 && (
        <TablaCotizaciones 
          cotizaciones={cotizaciones} 
          clientes={clientes} 
          productos={productos} 
          setCotizaciones={setCotizaciones} 
        />
      )}
    </>
  );
};

export default EditarCotizacionForm;
