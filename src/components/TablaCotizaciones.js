import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import PreviaCotizacion from './PreviaCotizacion';
import ResumenCotizacion from './ResumenCotizacion';
import BandejaCotizaciones from './BandejaCotizaciones';
import SearchBar from './SearchBar';
import { collection, deleteDoc, getFirestore, doc, onSnapshot } from 'firebase/firestore';
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

function TablaCotizaciones({ cotizaciones, clientes, setCotizaciones }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingCotizaciones, setLoadingCotizaciones] = useState(false);
  const [selectedCotizaciones, setSelectedCotizaciones] = useState([]);
  const [ordenamiento, setOrdenamiento] = useState({ campo: 'fechaCotizacion', ascendente: true });
  const [showOptions, setShowOptions] = useState(false);
  const [selectedCotizacionId, setSelectedCotizacionId] = useState(null);
  const [resumenVisible, setResumenVisible] = useState(false);
  const [showBandeja, setShowBandeja] = useState(false);

  const setCotizacionesRef = useRef(setCotizaciones);

  useEffect(() => {
    setCotizacionesRef.current = setCotizaciones;
  }, [setCotizaciones]);

  useEffect(() => {
    setLoadingCotizaciones(true);
    const firestore = getFirestore();
    const cotizacionesRef = collection(firestore, 'cotizaciones');

    const unsubscribe = onSnapshot(cotizacionesRef, (snapshot) => {
      const updatedCotizaciones = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCotizacionesRef.current(updatedCotizaciones);
      setLoadingCotizaciones(false);
    });

    return () => unsubscribe();
  }, []);

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

  const filterCotizaciones = () => {
    const cotizacionesFiltradas = cotizaciones && cotizaciones.filter(cotizacion => {
      const searchableFields = [
        cotizacion.fechaCotizacion,
        cotizacion.numeroCotizacion?.toString(),
        cotizacion.asunto?.toLowerCase(),
        cotizacion.nombreCliente?.toLowerCase(),
        cotizacion.total?.toString()
      ];
      return searchableFields.some(field => field && field.includes(searchTerm.toLowerCase()));
    });
    return cotizacionesFiltradas || []; // Devuelve un array vacío si cotizacionesFiltradas es undefined
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
    setResumenVisible(true);
    setShowBandeja(true);
  };

  const handleSelectCotizacion = (cotizacionId) => {
    setSelectedCotizaciones(prevSelected => {
      if (prevSelected.includes(cotizacionId)) {
        return prevSelected.filter(id => id !== cotizacionId);
      } else {
        return [...prevSelected, cotizacionId];
      }
    });
  };

  const handleOrdenamientoChange = (campo) => {
    setOrdenamiento(prevOrdenamiento => ({
      campo,
      ascendente: campo === prevOrdenamiento.campo ? !prevOrdenamiento.ascendente : true
    }));
  };

  const ordenarCotizaciones = (cotizaciones, { campo, ascendente }) => {
    if (!cotizaciones || cotizaciones.length === 0) {
      return [];
    }

    const sortedCotizaciones = [...cotizaciones];
    switch (campo) {
      case 'fechaCotizacion':
        sortedCotizaciones.sort((a, b) => (ascendente ? 1 : -1) * (new Date(a.fechaCotizacion) - new Date(b.fechaCotizacion)));
        break;
      case 'numeroCotizacion':
        sortedCotizaciones.sort((a, b) => (ascendente ? 1 : -1) * (a.numeroCotizacion - b.numeroCotizacion));
        break;
      case 'asunto':
        sortedCotizaciones.sort((a, b) => (ascendente ? 1 : -1) * a.asunto.localeCompare(b.asunto));
        break;
      case 'nombreCliente':
        sortedCotizaciones.sort((a, b) => (ascendente ? 1 : -1) * a.nombreCliente.localeCompare(b.nombreCliente));
        break;
      case 'total':
        sortedCotizaciones.sort((a, b) => (ascendente ? 1 : -1) * (a.total - b.total));
        break;
      case 'fechaVencimiento':
        sortedCotizaciones.sort((a, b) => (ascendente ? 1 : -1) * (new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento)));
        break;
      default:
        break;
    }
    return sortedCotizaciones;
  };

  return (
    <div className="cotizaciones-table">
      <h2>Lista de Cotizaciones</h2>
      {showBandeja && (
        <BandejaCotizaciones cotizaciones={cotizaciones} onRowClick={handleRowClick} />
      )}
      {!showBandeja && (
        <div>
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
              {filterCotizaciones().length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th onClick={() => handleOrdenamientoChange('estado')}>Estado</th>
                      <th onClick={() => handleOrdenamientoChange('fechaCotizacion')}>Fecha</th>
                      <th onClick={() => handleOrdenamientoChange('numeroCotizacion')}>No.</th>
                      <th onClick={() => handleOrdenamientoChange('asunto')}>Asunto</th>
                      <th onClick={() => handleOrdenamientoChange('nombreCliente')}>Cliente</th>
                      <th onClick={() => handleOrdenamientoChange('total')}>Importe</th>
                      <th onClick={() => handleOrdenamientoChange('fechaVencimiento')}>Vencimiento</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenarCotizaciones(filterCotizaciones(), ordenamiento).map((cotizacion, index) => (
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

      <div className={`resumen-container ${selectedCotizacionId ? 'active' : ''}`}>
        <ResumenCotizacion
          cotizacion={cotizaciones && cotizaciones.find(cotizacion => cotizacion.id === selectedCotizacionId)}
          isOpen={resumenVisible}
          onClose={() => {
            setResumenVisible(false);
            setSelectedCotizacionId(null);
            setShowBandeja(false);
          }}
          numeroCotizacion={cotizacionSeleccionada ? cotizacionSeleccionada.numeroCotizacion : null}
          clientes={clientes}

        />
      </div>
    </div>
  );
}

export default TablaCotizaciones;
