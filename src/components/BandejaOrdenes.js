import React, { useState } from 'react';
import SearchBar from './SearchBar';
import Modal from 'react-modal';
import OrdenForm from './OrdenForm';

Modal.setAppElement('#root');

const BandejaOrdenes = ({ ordenes, onRowClick, guardarOrden, modoEdicion, orden, proveedores }) => {
  const [filteredOrdenes, setFilteredOrdenes] = useState(ordenes);
  const [showModal, setShowModal] = useState(false);


  const handleSearch = (searchTerm) => {
    const filtered = ordenes.filter(orden => {
      return (
        orden.nombreProveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orden.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orden.fechaOrden.includes(searchTerm) ||
        orden.estado.toLowerCase().includes(searchTerm)
      );
    });
    setFilteredOrdenes(filtered);
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

      {filteredOrdenes.length > 0 ? (
        filteredOrdenes.map(orden => (
          <div key={orden.id} className="mensaje-cotizacion" onClick={() => onRowClick(orden.id)}>
            <input type="checkbox" />
            <div className="info-container">
              <div className="info-column">
                <p>Proveedor: {orden.nombreProveedor}</p>
                <p>Importe: ${parseFloat(orden?.total)?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
              </div>
              <div className="info-column">
                <p>No. Orden: {orden.numeroOrden.toString().padStart(4, '0')}</p>
                <p>Fecha: {orden.fechaOrden}</p>
                <p>Estado: {orden.estado}</p>
                <p>Asunto: {orden.asunto}</p>
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
        contentLabel="Nueva Orden"
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
          proveedores={proveedores}
          guardarOrden={guardarOrden}
          orden={orden}
        />
      </Modal>
    </div>
  );
};

export default BandejaOrdenes;
