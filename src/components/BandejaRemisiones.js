import React, { useState } from 'react';
import SearchBar from './SearchBar';
import Modal from 'react-modal';
import RemisionForm from './RemisionForm';

Modal.setAppElement('#root');

const BandejaRemisiones = ({ remisiones, onRowClick, guardarRemision, modoEdicion, remision, clientes }) => {
  const [filteredRemisiones, setFilteredRemisiones] = useState(remisiones);
  const [showModal, setShowModal] = useState(false);


  const handleSearch = (searchTerm) => {
    const filtered = remisiones.filter(remision => {
      return (
        remision.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        remision.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        remision.fechaRemision.includes(searchTerm) ||
        remision.estado.toLowerCase().includes(searchTerm)
      );
    });
    setFilteredRemisiones(filtered);
  };

  const openFormulario = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="cotizaciones-bandeja">
      <div className="search-bar">
        <SearchBar handleSearch={handleSearch} />
      </div>

      <div className="encabezado bandeja-cotizaciones">
        <button className="boton-accion" onClick={openFormulario}>+ Nuevo</button>
      </div>

      {filteredRemisiones.length > 0 ? (
        filteredRemisiones.map(remision => (
          <div key={remision.id} className="mensaje-cotizacion" onClick={() => onRowClick(remision.id)}>
            <input type="checkbox" />
            <div className="info-container">
              <div className="info-column">
                <p>Cliente: {remision.nombreCliente}</p>
                <p>Importe: ${parseFloat(remision?.total)?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
              </div>
              <div className="info-column">
                <p>No. Remisión: {remision.numeroRemision}</p>
                <p>Fecha: {remision.fechaRemision}</p>
                <p>Estado: {remision.estado}</p>
                <p>Asunto: {remision.asunto}</p>
                <p>Observaciones: {remision.observacion}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p style={{position: "relative", right: "25%"}}>No existe ninguna remisión que coincida con esta búsqueda.</p>
      )}

      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Nueva Remisión"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
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
        }}
      >
        <button onClick={closeModal} className="cerrar-button">X</button>

        <RemisionForm
          clientes={clientes}
          guardarRemision={guardarRemision}
          remision={remision}
        />
      </Modal>
    </div>
  );
};

export default BandejaRemisiones;
