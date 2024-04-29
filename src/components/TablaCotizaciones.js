import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import PreviaCotizacion from './PreviaCotizacion';
import SearchBar from './SearchBar';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    maxWidth: '800px',
    width: '100%',
    height: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    fontFamily: 'Roboto, sans-serif', // Aplica la fuente Roboto
  },
  label: {
    display: 'block',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  button: {
    width: '50%', // Centra el botón de agregar
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    justifyContent: 'center',
    margin: '0 auto',
    fontWeight: '700',
  },
};

function TablaCotizaciones({ cotizaciones, verPrevia, clientes }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingCotizaciones, setLoadingCotizaciones] = useState(true);

  // Función para filtrar las cotizaciones según el término de búsqueda
  const filterCotizaciones = (cotizaciones) => {
    return cotizaciones.filter((cotizacion) => {
      // Aplica la lógica de filtrado según los campos que desees buscar
      return (
        cotizacion.fechaCotizacion.includes(searchTerm) ||
        cotizacion.numeroCotizacion.toString().includes(searchTerm) ||
        cotizacion.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cotizacion.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cotizacion.total.toString().includes(searchTerm)
      );
    });
  };

  useEffect(() => {
    if (cotizaciones.length > 0) {
      setLoadingCotizaciones(false);
    }
  }, [cotizaciones]);

  const abrirModalPrevia = (cotizacion) => {
    setCotizacionSeleccionada(cotizacion);
    setModalIsOpen(true);
  };

  const cerrarModalPrevia = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="cotizaciones-table">
      <h2>Lista de Cotizaciones</h2>
      <SearchBar handleSearch={setSearchTerm} />
      {loadingCotizaciones ? (
        <p style={{ textAlign: 'center' }}>Cargando...</p>
      ) : (
        <>
          {filterCotizaciones(cotizaciones).length > 0 ? (
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
                {filterCotizaciones(cotizaciones).map((cotizacion, index) => (
                  <tr key={index}>
                    <td>{cotizacion.fechaCotizacion}</td>
                    <td>{cotizacion.numeroCotizacion?.toString().padStart(4, '0')}</td>
                    <td>{cotizacion.asunto}</td>
                    <td>{cotizacion.nombreCliente}</td>
                    <td>${cotizacion.total?.toFixed(2)}</td>
                    <td>{cotizacion.estado}</td>
                    <td>
                      <button className='btnPrevia' onClick={() => abrirModalPrevia(cotizacion)}>Ver Previa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Mostrar el mensaje "No hay resultados disponibles" cuando no haya resultados
            <p style={{ textAlign: 'center' }}>No hay resultados disponibles</p>
          )}
        </>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={cerrarModalPrevia}
        contentLabel="Vista Previa"
        style={customStyles}
      >
        {cotizacionSeleccionada && (
          <PreviaCotizacion
            cotizacion={cotizacionSeleccionada}
            numeroCotizacion={cotizacionSeleccionada.numeroCotizacion}
            clientes={clientes} // Asegúrate de pasar el prop correcto si lo necesitas
            cerrarPrevia={cerrarModalPrevia}
          />
        )}
      </Modal>
    </div>
  );
}

export default TablaCotizaciones;
