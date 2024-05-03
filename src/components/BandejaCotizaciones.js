// TablaCotizacionesBandeja.js
import React from 'react';

const BandejaCotizaciones = ({ cotizaciones }) => {
  return (
    <div className="cotizaciones-bandeja">
      {cotizaciones.map(cotizacion => (
        <div key={cotizacion.id} className="mensaje-cotizacion">
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
      ))}
    </div>
  );
};

export default BandejaCotizaciones;
