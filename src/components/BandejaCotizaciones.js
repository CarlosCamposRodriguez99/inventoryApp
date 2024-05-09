import React, { useState } from 'react';
import SearchBar from './SearchBar';

const BandejaCotizaciones = ({ cotizaciones, onRowClick, openFormulario  }) => {
  const [filteredCotizaciones, setFilteredCotizaciones] = useState(cotizaciones);

  const handleSearch = (searchTerm) => {
    const filtered = cotizaciones.filter(cotizacion => {
      // Lógica de búsqueda: puedes ajustar esto según tus necesidades
      return (
        cotizacion.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cotizacion.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cotizacion.fechaCotizacion.includes(searchTerm) ||
        cotizacion.estado.toLowerCase().includes(searchTerm)
      );
    });
    setFilteredCotizaciones(filtered);
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
                <p>Cliente: {cotizacion.nombreCliente}</p>
                <p>Importe: ${parseFloat(cotizacion?.total)?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
              </div>
              <div className="info-column">
                <p>No. Cotización: {cotizacion.numeroCotizacion}</p>
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
    </div>
  );
};

export default BandejaCotizaciones;
