import React, { useState } from 'react';
import CotizacionForm from './CotizacionForm';
import PreviaCotizacion from './PreviaCotizacion';
import Modal from 'react-modal';
import TablaCotizaciones from './TablaCotizaciones';
import { useNavigate } from 'react-router-dom';

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

const EditarCotizacionForm = ({ cotizacion, clientes, productos, setCotizacion }) => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [mostrarPrevia, setMostrarPrevia] = useState(false);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const guardarCotizacion = async (nuevosDatos) => {
    try {
      // Aquí iría la lógica para guardar los cambios
      // setCotizacion({ ...cotizacion, ...nuevosDatos });
      closeModal();
    } catch (error) {
      console.error('Error al guardar la cotización:', error);
    }
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
            guardarCotizacion={guardarCotizacion}
            setCotizacion={setCotizacion}
          />
          {mostrarPrevia && (
            <PreviaCotizacion
              cotizacion={cotizacion}
              clientes={clientes}
              productos={productos}
              continuarDesdePrevia={() => setMostrarPrevia(false)}
            />
          )}
        </div>
      </Modal>
      {!modalIsOpen && <TablaCotizaciones />}
    </>
  );
};

export default EditarCotizacionForm;
