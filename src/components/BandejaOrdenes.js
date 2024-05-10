import React, { useState } from 'react';
import SearchBar from './SearchBar';
import Modal from 'react-modal';
import OrdenForm from './OrdenForm';

Modal.setAppElement('#root');

const BandejaOrdenes = ({ cotizaciones, onRowClick, guardarCotizacion, modoEdicion, cotizacion, clientes }) => {
  const [filteredCotizaciones, setFilteredCotizaciones] = useState(cotizaciones);
  const [showModal, setShowModal] = useState(false);


  const handleSearch = (searchTerm) => {
    const filtered = cotizaciones.filter(cotizacion => {
      return (
        cotizacion.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cotizacion.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cotizacion.fechaCotizacion.includes(searchTerm) ||
        cotizacion.estado.toLowerCase().includes(searchTerm)
      );
    });
    setFilteredCotizaciones(filtered);
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

      {filteredCotizaciones.length > 0 ? (
        filteredCotizaciones.map(cotizacion => (
          <div key={cotizacion.id} className="mensaje-cotizacion" onClick={() => onRowClick(cotizacion.id)}>
            <input type="checkbox" />
            <div className="info-container">
              <div className="info-column">
                <p>Proveedor: {cotizacion.nombreCliente}</p>
                <p>Importe: ${parseFloat(cotizacion?.total)?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
              </div>
              <div className="info-column">
                <p>No. Orden: {cotizacion.numeroCotizacion}</p>
                <p>Fecha: {cotizacion.fechaCotizacion}</p>
                <p>Estado: {cotizacion.estado}</p>
                <p>Asunto: {cotizacion.asunto}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p style={{position: "relative", right: "25%"}}>No existe ninguna cotización que coincida con esta búsqueda.</p>
      )}

      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Nuevo Cotización"
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
        {/* Pasamos `guardarCotizacion` como prop a CotizacionForm */}
        <OrdenForm
          clientes={clientes}
          guardarCotizacion={guardarCotizacion}
          cotizacion={cotizacion}
        />
      </Modal>
    </div>
  );
};

export default BandejaOrdenes;
