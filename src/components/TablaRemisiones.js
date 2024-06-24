import React, { useState, useEffect, useRef } from 'react';
import PreviaRemision from './PreviaRemision';
import ResumenRemision from './ResumenRemision';
import BandejaRemisiones from './BandejaRemisiones';
import Nav from './Nav';
import RemisionForm from './RemisionForm';
import { collection, deleteDoc, getFirestore, doc, onSnapshot } from 'firebase/firestore';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import moment from 'moment';

moment.locale('es');

const styleForm = {
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
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

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
    height: '550px',
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
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

function TablaRemisiones({ remisiones, clientes, setRemisiones, guardarRemision, modoEdicion, remision }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [remisionSeleccionada, setRemisionSeleccionada] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingRemisiones, setLoadingRemisiones] = useState(false);
  const [selectedRemisiones, setSelectedRemisiones] = useState([]);
  const [ordenamiento, setOrdenamiento] = useState({ campo: 'fechaRemision', ascendente: true });
  const [showOptions, setShowOptions] = useState(false);
  const [selectedRemisionId, setSelectedRemisionId] = useState(null);
  const [resumenVisible, setResumenVisible] = useState(false);
  const [showBandeja, setShowBandeja] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [showNuevoButton, setShowNuevoButton] = useState(true);
  const [proximasAVencer, setProximasAVencer] = useState([]);
  const [proximosEventos, setProximosEventos] = useState([]);

  useEffect(() => {
    const fetchCotizaciones = async () => {
        const firestore = getFirestore();
        const cotizacionesRef = collection(firestore, 'cotizaciones');
        const unsubscribeCotizaciones = onSnapshot(cotizacionesRef, (snapshot) => {
            const cotizaciones = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            // Filtrar las cotizaciones que tienen fecha de vencimiento a partir de hoy y ordenarlas
            const proximas = cotizaciones
                .filter(cotizacion => moment(cotizacion.fechaVencimiento) >= moment().startOf('day'))
                .sort((a, b) => moment(a.fechaVencimiento) - moment(b.fechaVencimiento));

            setProximasAVencer(proximas.slice(0, 6)); // Limitar la lista a 6 fechas próximas
        });

        return () => unsubscribeCotizaciones();
    };

    const fetchEventos = async () => {
        const firestore = getFirestore();
        const eventosRef = collection(firestore, 'eventos');
        const unsubscribeEventos = onSnapshot(eventosRef, (snapshot) => {
            const eventos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            // Filtrar eventos que ocurren a partir de hoy y ordenarlos
            const proximos = eventos
                .filter(evento => moment(evento.to) >= moment().startOf('day'))
                .sort((a, b) => moment(a.to) - moment(b.to));

            setProximosEventos(proximos.slice(0, 6)); // Limitar la lista a 6 eventos próximos

            // Filtrar fechas festivas que están a menos de una semana
            const fechasFestivasProximas = [];
            const fechasFestivasBase = [
                { title: 'Año Nuevo', month: '01', day: '01', color: '#de2e03' },
                { title: 'Día de la Constitución', month: '02', day: '05', color: '#de2e03' },
                { title: 'Natalicio de Benito Juárez', month: '03', day: '21', color: '#de2e03' },
                { title: 'Día del Trabajo', month: '05', day: '01', color: '#de2e03' },
                { title: 'Independencia de México', month: '09', day: '16', color: '#de2e03' },
                { title: 'Transición del Poder Ejecutivo', month: '10', day: '01', color: '#de2e03' },
                { title: 'Revolución Mexicana', month: '11', day: '20', color: '#de2e03' },
                { title: 'Navidad', month: '12', day: '25', color: '#de2e03' },
            ];

            const today = moment().startOf('day');
            const oneWeekFromNow = moment().add(7, 'days').startOf('day');

            fechasFestivasBase.forEach(festivo => {
                const festivoDate = moment(`${today.year()}-${festivo.month}-${festivo.day}`, 'YYYY-MM-DD');
                if (festivoDate.isBetween(today, oneWeekFromNow, null, '[]')) {
                    fechasFestivasProximas.push({
                        title: festivo.title,
                        start: festivoDate.toDate(),
                        end: festivoDate.toDate(),
                        allDay: true,
                        resource: 'festivo',
                        style: { backgroundColor: festivo.color }
                    });
                }
            });

            if (fechasFestivasProximas.length > 0) {
                // Notificar sobre fechas festivas próximas
                alert(`Fechas festivas próximas: ${fechasFestivasProximas.map(festivo => `${festivo.title} el ${moment(festivo.start).format('LL')}`).join(', ')}`);
            }
        });

        return () => unsubscribeEventos();
    };

    // Ejecutar las funciones de carga de cotizaciones y eventos
    fetchCotizaciones();
    fetchEventos();
  }, []);

  const setRemisionesRef = useRef(setRemisiones);

  const openFormulario = () => {
    setMostrarFormulario(true);
    setShowNuevoButton(false); // Oculta el botón + Nuevo al abrir el formulario
  };

  const closeModal = () => {
    setMostrarFormulario(false);
    setShowNuevoButton(true); // Vuelve a mostrar el botón + Nuevo al cerrar el formulario
  };


  useEffect(() => {
    setRemisionesRef.current = setRemisiones;
  }, [setRemisiones]);

  useEffect(() => {
    setLoadingRemisiones(true);
    const firestore = getFirestore();
    const remisionesRef = collection(firestore, 'remisiones');

    const unsubscribe = onSnapshot(remisionesRef, (snapshot) => {
      const updatedRemisiones = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRemisionesRef.current(updatedRemisiones);
      setLoadingRemisiones(false);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleDeselectAll = () => {
    setSelectedRemisiones([]);
  };

  const handleSelectAll = () => {
    setSelectedRemisiones(remisiones.map(remision => remision.id));
  };

  const handleDeleteSelected = async () => {
    try {
      const confirmed = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará las remisiones seleccionadas.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (confirmed.isConfirmed) {
        const firestore = getFirestore();
        const remisionesEliminadas = [];
        const remisionesRef = collection(firestore, 'remisiones');
        for (const remisionId of selectedRemisiones) {
          const remisionDocRef = doc(remisionesRef, remisionId);
          await deleteDoc(remisionDocRef);
          remisionesEliminadas.push(remisionId);
        }
        const remisionesRestantes = remisiones.filter(remision => !remisionesEliminadas.includes(remision.id));
        setRemisiones(remisionesRestantes);
        setSelectedRemisiones([]);
      }
    } catch (error) {
      console.error('Error al eliminar remisiones:', error);
    }
  };

  const filterRemisiones = () => {
    const remisionesFiltradas = remisiones && remisiones.filter(remision => {
      const searchableFields = [
        remision.fechaRemision,
        remision.numeroRemision?.toString().padStart(4, '0'),
        remision.asunto?.toLowerCase(),
        remision.nombreCliente?.toLowerCase(),
        remision.total?.toString()
      ];
      return searchableFields.some(field => field && field.includes(searchTerm.toLowerCase()));
    });
    return remisionesFiltradas || []; // Devuelve un array vacío si remisionesFiltradas es undefined
  };

  const abrirModalPrevia = (remision) => {
    setRemisionSeleccionada(remision);
    setModalIsOpen(true);
  };

  const cerrarModalPrevia = () => {
    setModalIsOpen(false);
  };

  const handleRowClick = (remisionId) => {
    setSelectedRemisionId(remisionId);
    setResumenVisible(true);
    setShowBandeja(true);
  };

  const handleSelectRemision = (remisionId) => {
    setSelectedRemisiones(prevSelected => {
      if (prevSelected.includes(remisionId)) {
        return prevSelected.filter(id => id !== remisionId);
      } else {
        return [...prevSelected, remisionId];
      }
    });
  };

  const handleOrdenamientoChange = (campo) => {
    setOrdenamiento(prevOrdenamiento => ({
      campo,
      ascendente: campo === prevOrdenamiento.campo ? !prevOrdenamiento.ascendente : true
    }));
  };

  const ordenarRemisiones = (remisiones, { campo, ascendente }) => {
    if (!remisiones || remisiones.length === 0) {
      return [];
    }

    const sortedRemisiones = [...remisiones];
    switch (campo) {
      case 'fechaRemision':
        sortedRemisiones.sort((a, b) => (ascendente ? 1 : -1) * (new Date(a.fechaRemision) - new Date(b.fechaRemision)));
        break;
      case 'numeroRemision':
        sortedRemisiones.sort((a, b) => (ascendente ? 1 : -1) * (a.numeroRemision - b.numeroRemision));
        break;
      case 'asunto':
        sortedRemisiones.sort((a, b) => (ascendente ? 1 : -1) * a.asunto.localeCompare(b.asunto));
        break;
      case 'nombreCliente':
        sortedRemisiones.sort((a, b) => (ascendente ? 1 : -1) * a.nombreCliente.localeCompare(b.nombreCliente));
        break;
      case 'total':
        sortedRemisiones.sort((a, b) => (ascendente ? 1 : -1) * (a.total - b.total));
        break;
      case 'fechaVencimiento':
        sortedRemisiones.sort((a, b) => (ascendente ? 1 : -1) * (new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento)));
        break;
      default:
        break;
    }
    return sortedRemisiones;
  };

  return (
    <>
      <Nav 
        handleSearch={setSearchTerm} 
        proximasAVencer={proximasAVencer} 
        proximosEventos={proximosEventos} 
      />
      <div className="cotizaciones-table">
        <h2>Lista de Remisiones</h2>
        {showBandeja && (
          <BandejaRemisiones 
            remisiones={remisiones} 
            onRowClick={handleRowClick}  
            clientes={clientes}
            guardarRemision={guardarRemision}
            remision={remision}          
          />
        )}
        {!showBandeja && (
          <div>
          <i className="bi bi-arrow-down-up image-button" onClick={handleToggleOptions}></i>
            {showOptions && (
              <div className="filtro-options">
                <button onClick={handleSelectAll}>Seleccionar Todos</button>
                <button onClick={handleDeselectAll}>Deseleccionar Todos</button>
              </div>
            )}
            
            {loadingRemisiones ? (
              <p style={{ textAlign: 'center' }}>Cargando...</p>
            ) : (
              <>
                {filterRemisiones().length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th onClick={() => handleOrdenamientoChange('estado')}>Estado</th>
                        <th onClick={() => handleOrdenamientoChange('fechaRemision')}>Fecha</th>
                        <th onClick={() => handleOrdenamientoChange('numeroRemision')}>No.</th>
                        <th onClick={() => handleOrdenamientoChange('asunto')}>Asunto</th>
                        <th onClick={() => handleOrdenamientoChange('nombreCliente')}>Cliente</th>
                        <th onClick={() => handleOrdenamientoChange('total')}>Importe</th>
                        <th onClick={() => handleOrdenamientoChange('fechaVencimiento')}>Vencimiento</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordenarRemisiones(filterRemisiones(), ordenamiento).map((remision, index) => (
                        <tr key={index} onClick={() => handleRowClick(remision.id)}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedRemisiones.includes(remision.id)}
                              onChange={() => handleSelectRemision(remision.id)}
                              style={{ marginRight: '5px' }}
                            />{remision.estado}
                          </td>
                          <td>{remision.fechaRemision}</td>
                          <td>{remision.numeroRemision?.toString().padStart(4, '0')}</td>
                          <td>{remision.asunto}</td>
                          <td>{remision.nombreCliente}</td>
                          <td>${parseFloat(remision.total)?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                          <td>{remision.fechaVencimiento}</td>
                          <td>
                            <button className='btnPrevia' onClick={() => abrirModalPrevia(remision)}>Ver</button>
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
            {selectedRemisiones.length > 0 && (
              <div className="delete-button-container">
                <img className="delete-button" onClick={handleDeleteSelected} src="/img/eliminar.svg" alt="Eliminar seleccionados" />
              </div>
            )}
            <Modal
              isOpen={mostrarFormulario}
              onRequestClose={closeModal}
              contentLabel="Nuevo Cotización"
              style={styleForm}
            >
              <button onClick={closeModal} className="cerrar-button">X</button>
              <RemisionForm
                clientes={clientes}
                guardarRemision={guardarRemision}
                modoEdicion={modoEdicion}
                remision={remision}
              />
            </Modal>

            {showNuevoButton && (
              <button className="action-button2" onClick={openFormulario}>
                + Nuevo
              </button>
            )}

          </div>
        )}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={cerrarModalPrevia}
          contentLabel="Vista Previa"
          style={customStyles}
        >
          {remisionSeleccionada && (
            <PreviaRemision
              remision={remisionSeleccionada}
              numeroRemision={remisionSeleccionada.numeroRemision}
              clientes={clientes}
              cerrarPrevia={cerrarModalPrevia}
            />
          )}
        </Modal>

        <div className={`resumen-container ${selectedRemisionId ? 'active' : ''}`}>
          <ResumenRemision
            remision={remisiones && remisiones.find(remision => remision.id === selectedRemisionId)}
            isOpen={resumenVisible}
            onClose={() => {
              setResumenVisible(false);
              setSelectedRemisionId(null);
              setShowBandeja(false);
            }}
            numeroRemision={remisionSeleccionada ? remisionSeleccionada.numeroRemision : null}
            clientes={clientes}
            mostrarBotonNuevo={false}
          />
        </div>
      </div>
    </>
  );
}

export default TablaRemisiones;
