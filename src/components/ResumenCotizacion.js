// ResumenCotizacion.js
import React from 'react';

const ResumenCotizacion = ({ cotizacion, isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="resumen-cotizacion-container">
          <div className="resumen-cotizacion-header">
            <h2 className="resumen-cotizacion-title">Resumen de la Cotización</h2>
            <div className="resumen-cotizacion-actions">
              <button>Imprimir</button>
              <button>Descargar</button>
              <button>Editar</button>
              <button onClick={onClose}>Cerrar</button>
            </div>
          </div>
          <div className="resumen-cotizacion-content">
            <p>Número de Cotización: {cotizacion?.numeroCotizacion}</p>
            <p>Asunto: {cotizacion?.asunto}</p>
            <p>Cliente: {cotizacion?.nombreCliente}</p>
            <p>Fecha de Cotización: {cotizacion?.fechaCotizacion}</p>
            <p>Importe Total: ${cotizacion?.total}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ResumenCotizacion;
