import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import PreviaCotizacion from './PreviaCotizacion';
import ResumenCotizacion from './ResumenCotizacion';
import SearchBar from './SearchBar';
import { collection, deleteDoc, getFirestore, doc } from 'firebase/firestore';
import Swal from 'sweetalert2';

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
    height: '450px',
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

function TablaCotizaciones({ cotizaciones, clientes, setCotizaciones, onRowClick }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingCotizaciones, setLoadingCotizaciones] = useState(true);
  const [selectedCotizaciones, setSelectedCotizaciones] = useState([]);
  const [ordenamiento, setOrdenamiento] = useState('fechaCotizacion');
  const [showOptions, setShowOptions] = useState(false);
  const [selectedCotizacionId, setSelectedCotizacionId] = useState(null);
  const [resumenVisible, setResumenVisible] = useState(false);

  useEffect(() => {
    if (cotizaciones.length > 0) {
      setLoadingCotizaciones(false);
    }
  }, [cotizaciones]);

  const cerrarResumen = () => {
    setResumenVisible(false); // Función para cerrar el resumen
  };

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleDeselectAll = () => {
    setSelectedCotizaciones([]);
  };

  const handleSelectAll = () => {
    setSelectedCotizaciones(cotizaciones.map(cotizacion => cotizacion.id));
  };

  const handleDeleteSelected = async () => {
    try {
      const confirmed = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará las cotizaciones seleccionadas.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });
  
      if (confirmed.isConfirmed) {
        const firestore = getFirestore();
        const cotizacionesEliminadas = [];
        const cotizacionesRef = collection(firestore, 'cotizaciones');
        for (const cotizacionId of selectedCotizaciones) {
          const cotizacionDocRef = doc(cotizacionesRef, cotizacionId);
          await deleteDoc(cotizacionDocRef);
          cotizacionesEliminadas.push(cotizacionId);
        }
        const cotizacionesRestantes = cotizaciones.filter(cotizacion => !cotizacionesEliminadas.includes(cotizacion.id));
        setCotizaciones(cotizacionesRestantes);
        setSelectedCotizaciones([]);
      }
    } catch (error) {
      console.error('Error al eliminar cotizaciones:', error);
    }
  };

  const filterCotizaciones = (cotizaciones) => {
    return cotizaciones.filter((cotizacion) => {
      return (
        cotizacion.fechaCotizacion.includes(searchTerm) ||
        cotizacion.numeroCotizacion.toString().includes(searchTerm) ||
        cotizacion.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cotizacion.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cotizacion.total.toString().includes(searchTerm)
      );
    });
  };

  const abrirModalPrevia = (cotizacion) => {
    setCotizacionSeleccionada(cotizacion);
    setModalIsOpen(true);
  };

  const cerrarModalPrevia = () => {
    setModalIsOpen(false);
  };

  const handleRowClick = (cotizacionId) => {
    setSelectedCotizacionId(cotizacionId);
    setResumenVisible(true); // Aquí establecemos resumenVisible a true al hacer clic en una fila
  };
  

  const handleSelectCotizacion = (cotizacionId) => {
    setSelectedCotizaciones((prevSelected) => {
      if (prevSelected.includes(cotizacionId)) {
        return prevSelected.filter((id) => id !== cotizacionId);
      } else {
        return [...prevSelected, cotizacionId];
      }
    });
  };

  const handleOrdenamientoChange = (tipoOrdenamiento) => {
    setOrdenamiento(tipoOrdenamiento);
  };

  // Función para ordenar las cotizaciones según el tipo de ordenamiento seleccionado
  const ordenarCotizaciones = (cotizaciones, ordenamiento) => {
    if (ordenamiento === 'fechaCotizacion') {
      return cotizaciones.slice().sort((a, b) => new Date(b.fechaCotizacion) - new Date(a.fechaCotizacion));
    } else if (ordenamiento === 'nombreCliente') {
      return cotizaciones.slice().sort((a, b) => a.nombreCliente.localeCompare(b.nombreCliente));
    } else if (ordenamiento === 'total') {
      return cotizaciones.slice().sort((a, b) => a.total - b.total);
    } else {
      return cotizaciones;
    }
  };

  return (
    <div className="cotizaciones-table">
      <h2>Lista de Cotizaciones</h2>
      
      <div className="button-container">
        <button
          className={ordenamiento === 'fechaCotizacion' ? 'active' : ''}
          onClick={() => handleOrdenamientoChange('fechaCotizacion')}
        >
          Ordenar por fecha
        </button>
        <button
          className={ordenamiento === 'nombreCliente' ? 'active' : ''}
          onClick={() => handleOrdenamientoChange('nombreCliente')}
        >
          Ordenar por nombre
        </button>
        <button
          className={ordenamiento === 'total' ? 'active' : ''}
          onClick={() => handleOrdenamientoChange('total')}
        >
          Ordenar por total
        </button>
      </div>
      <img
        src="/img/checkbox.svg"
        alt="Icono"
        className="image-button"
        onClick={handleToggleOptions}
      />
      {showOptions && (
        <div className="filtro-options">
          <button onClick={handleSelectAll}>Seleccionar Todos</button>
          <button onClick={handleDeselectAll}>Deseleccionar Todos</button>
          
        </div>
      )}
      <SearchBar handleSearch={setSearchTerm} />
      {loadingCotizaciones ? (
        <p style={{ textAlign: 'center' }}>Cargando...</p>
      ) : (
        <>
          {filterCotizaciones(cotizaciones).length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>No.</th>
                  <th>Asunto</th>
                  <th>Cliente</th>
                  <th>Importe</th>
                  <th>Vencimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
              {ordenarCotizaciones(filterCotizaciones(cotizaciones), ordenamiento).map((cotizacion, index) => (
                <tr key={index} onClick={() => handleRowClick(cotizacion.id)}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedCotizaciones.includes(cotizacion.id)}
                      onChange={() => handleSelectCotizacion(cotizacion.id)}
                      style={{ marginRight: '5px' }}
                    />{cotizacion.estado}
                  </td>
                  <td>{cotizacion.fechaCotizacion}</td>
                  <td>{cotizacion.numeroCotizacion?.toString().padStart(4, '0')}</td>
                  <td>{cotizacion.asunto}</td>
                  <td>{cotizacion.nombreCliente}</td>
                  <td>${parseFloat(cotizacion.total)?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                  <td>{cotizacion.fechaVencimiento}</td>
                  <td>
                    <button className='btnPrevia' onClick={() => abrirModalPrevia(cotizacion)}>Ver</button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center' }}>No hay resultados disponibles</p>
          )}
        </>
      )}
      {selectedCotizaciones.length > 0 && (
        <div className="delete-button-container">
          <img className="delete-button" onClick={handleDeleteSelected} src="/img/eliminar.svg" alt="Eliminar seleccionados" />
        </div>
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
            clientes={clientes}
            cerrarPrevia={cerrarModalPrevia}
          />
        )}
      </Modal>

      {selectedCotizacionId && cotizaciones.some(cotizacion => cotizacion.id === selectedCotizacionId) && (
        <ResumenCotizacion
          cotizacion={cotizaciones.find(cotizacion => cotizacion.id === selectedCotizacionId)}
          isOpen={resumenVisible} // Pasamos el estado de visibilidad
          onClose={cerrarResumen} // Pasamos la función para cerrar el resumen
        />
      )}
    </div>
  );
}

export default TablaCotizaciones;
