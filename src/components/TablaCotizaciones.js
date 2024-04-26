import React from 'react';

function TablaCotizaciones({ cotizaciones, verPrevia }) {
  if (!cotizaciones || cotizaciones.length === 0) {
    return <div>No hay cotizaciones disponibles.</div>;
  }

  return (
    <div className="cotizaciones-table">
      <h2>Lista de Cotizaciones</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha de Cotización</th>
            <th>No. Cotización</th>
            <th>Asunto</th>
            <th>Nombre del Cliente</th>
            <th>Total</th>
            <th>Status</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cotizaciones.map((cotizacion, index) => (
            <tr key={index}>
              <td>{cotizacion.fechaCotizacion}</td>
              <td>{cotizacion.numeroCotizacion?.toString().padStart(4, '0')}</td>
              <td>{cotizacion.asunto}</td>
              <td>{cotizacion.nombreCliente}</td>
              <td>${cotizacion.total?.toFixed(2)}</td>
              <td>{cotizacion.estado}</td>
              <td>
                <button onClick={() => verPrevia(cotizacion)}>Ver Previa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaCotizaciones;
