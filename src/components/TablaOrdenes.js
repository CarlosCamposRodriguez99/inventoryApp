import React, { useState, useEffect, useRef } from 'react';
import PreviaOrden from './PreviaOrden';
import ResumenOrden from './ResumenOrden';
import BandejaOrdenes from './BandejaOrdenes';
import Nav from './Nav';
import OrdenForm from './OrdenForm';
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

function TablaOrdenes({ ordenes, proveedores, setOrdenes, guardarOrden, modoEdicion, orden,  }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [selectedOrdenes, setSelectedOrdenes] = useState([]);
  const [ordenamiento, setOrdenamiento] = useState({ campo: 'fechaOrden', ascendente: true });
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOrdenId, setSelectedOrdenId] = useState(null);
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

  const setOrdenesRef = useRef(setOrdenes);

  const openFormulario = () => {
    setMostrarFormulario(true);
    setShowNuevoButton(false); // Oculta el botón + Nuevo al abrir el formulario
  };

  const closeModal = () => {
    setMostrarFormulario(false);
    setShowNuevoButton(true); // Vuelve a mostrar el botón + Nuevo al cerrar el formulario
  };


  useEffect(() => {
    setOrdenesRef.current = setOrdenes;
  }, [setOrdenes]);

  useEffect(() => {
    setLoadingOrdenes(true);
    const firestore = getFirestore();
    const ordenesRef = collection(firestore, 'ordenes');

    const unsubscribe = onSnapshot(ordenesRef, (snapshot) => {
      const updatedOrdenes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrdenesRef.current(updatedOrdenes);
      setLoadingOrdenes(false);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleDeselectAll = () => {
    setSelectedOrdenes([]);
  };

  const handleSelectAll = () => {
    setSelectedOrdenes(ordenes.map(orden => orden.id));
  };

  const handleDeleteSelected = async () => {
    try {
      const confirmed = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará las ordenes seleccionadas.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (confirmed.isConfirmed) {
        const firestore = getFirestore();
        const ordenesEliminadas = [];
        const ordenesRef = collection(firestore, 'ordenes');
        for (const ordenId of selectedOrdenes) {
          const ordenDocRef = doc(ordenesRef, ordenId);
          await deleteDoc(ordenDocRef);
          ordenesEliminadas.push(ordenId);
        }
        const ordenesRestantes = ordenes.filter(orden => !ordenesEliminadas.includes(orden.id));
        setOrdenes(ordenesRestantes);
        setSelectedOrdenes([]);
      }
    } catch (error) {
      console.error('Error al eliminar orden:', error);
    }
  };

  const filterOrdenes = () => {
    const ordenesFiltradas = ordenes && ordenes.filter(orden => {
      const searchableFields = [
        orden.fechaOrden,
        orden.numeroOrden?.toString().padStart(4, '0'),
        orden.asunto?.toLowerCase(),
        orden.nombreProveedor?.toLowerCase(),
        orden.total?.toString(),
        orden.condicion?.toString()
      ];
      return searchableFields.some(field => field && field.includes(searchTerm.toLowerCase()));
    });
    return ordenesFiltradas || [];
  };

  const abrirModalPrevia = (orden) => {
    setOrdenSeleccionada(orden);
    setModalIsOpen(true);
  };

  const cerrarModalPrevia = () => {
    setModalIsOpen(false);
  };

  const handleRowClick = (ordenId) => {
    setSelectedOrdenId(ordenId);
    setResumenVisible(true);
    setShowBandeja(true);
  };

  const handleSelectOrden = (ordenId) => {
    setSelectedOrdenes(prevSelected => {
      if (prevSelected.includes(ordenId)) {
        return prevSelected.filter(id => id !== ordenId);
      } else {
        return [...prevSelected, ordenId];
      }
    });
  };

  const handleOrdenamientoChange = (campo) => {
    setOrdenamiento(prevOrdenamiento => ({
      campo,
      ascendente: campo === prevOrdenamiento.campo ? !prevOrdenamiento.ascendente : true
    }));
  };

  const ordenarOrdenes = (ordenes, { campo, ascendente }) => {
    if (!ordenes || ordenes.length === 0) {
      return [];
    }

    const sortedOrdenes = [...ordenes];
    switch (campo) {
      case 'fechaOrden':
        sortedOrdenes.sort((a, b) => (ascendente ? 1 : -1) * (new Date(a.fechaOrden) - new Date(b.fechaOrden)));
        break;
      case 'numeroOrden':
        sortedOrdenes.sort((a, b) => (ascendente ? 1 : -1) * (a.numeroOrden - b.numeroOrden));
        break;
      case 'asunto':
        sortedOrdenes.sort((a, b) => (ascendente ? 1 : -1) * a.asunto.localeCompare(b.asunto));
        break;
      case 'nombreProveedor':
        sortedOrdenes.sort((a, b) => (ascendente ? 1 : -1) * a.nombreProveedor.localeCompare(b.nombreProveedor));
        break;
      case 'total':
        sortedOrdenes.sort((a, b) => (ascendente ? 1 : -1) * (a.total - b.total));
        break;
      case 'fechaVencimiento':
        sortedOrdenes.sort((a, b) => (ascendente ? 1 : -1) * (new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento)));
        break;
      default:
        break;
    }
    return sortedOrdenes;
  };

  return (
    <>
      <Nav 
        handleSearch={setSearchTerm} 
        proximasAVencer={proximasAVencer} 
        proximosEventos={proximosEventos} 
      />
      <div className="cotizaciones-table">
        <h2>Lista de Ordenes de Compra</h2>
        {showBandeja && (
          <BandejaOrdenes 
            ordenes={ordenes} 
            onRowClick={handleRowClick}  
            proveedores={proveedores}
            guardarOrden={guardarOrden}
            orden={orden}          
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
            {loadingOrdenes ? (
              <p style={{ textAlign: 'center' }}>Cargando...</p>
            ) : (
              <>
                {filterOrdenes().length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th onClick={() => handleOrdenamientoChange('estado')}>Estado</th>
                        <th onClick={() => handleOrdenamientoChange('fechaCotizacion')}>Fecha</th>
                        <th onClick={() => handleOrdenamientoChange('numeroOrden')}>No.</th>
                        <th onClick={() => handleOrdenamientoChange('asunto')}>Asunto</th>
                        <th onClick={() => handleOrdenamientoChange('nombreProveedor')}>Proveedor</th>
                        <th onClick={() => handleOrdenamientoChange('total')}>Importe</th>
                        <th onClick={() => handleOrdenamientoChange('condicion')}>Cond. De Pago</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordenarOrdenes(filterOrdenes(), ordenamiento).map((orden, index) => (
                        <tr key={index} onClick={() => handleRowClick(orden.id)}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedOrdenes.includes(orden.id)}
                              onChange={() => handleSelectOrden(orden.id)}
                              style={{ marginRight: '5px' }}
                            />{orden.estado}
                          </td>
                          <td>{orden.fechaOrden}</td>
                          <td>{orden.numeroOrden?.toString().padStart(4, '0')}</td>
                          <td>{orden.asunto}</td>
                          <td>{orden.nombreProveedor}</td>
                          <td>${parseFloat(orden.total)?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                          <td>{orden.condicion}</td>
                          <td>
                            <button className='btnPrevia' onClick={() => abrirModalPrevia(orden)}>Ver</button>
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
            {selectedOrdenes.length > 0 && (
              <div className="delete-button-container">
                <img className="delete-button" onClick={handleDeleteSelected} src="/img/eliminar.svg" alt="Eliminar seleccionados" />
              </div>
            )}
            <Modal
              isOpen={mostrarFormulario}
              onRequestClose={closeModal}
              contentLabel="Nueva Orden"
              style={styleForm}
            >
              <button onClick={closeModal} className="cerrar-button">X</button>
              <OrdenForm
                proveedores={proveedores}
                guardarOrden={guardarOrden}
                modoEdicion={modoEdicion}
                orden={orden}
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
          {ordenSeleccionada && (
            <PreviaOrden
              orden={ordenSeleccionada}
              numeroOrden={ordenSeleccionada.numeroOrden}
              proveedores={proveedores}
              cerrarPrevia={cerrarModalPrevia}
            />
          )}
        </Modal>

        <div className={`resumen-container ${selectedOrdenId ? 'active' : ''}`}>
          <ResumenOrden
            orden={ordenes && ordenes.find(orden => orden.id === selectedOrdenId)}
            isOpen={resumenVisible}
            onClose={() => {
              setResumenVisible(false);
              setSelectedOrdenId(null);
              setShowBandeja(false);
            }}
            numeroOrden={ordenSeleccionada ? ordenSeleccionada.numeroOrden : null}
            proveedores={proveedores}
            mostrarBotonNuevo={false}
          />
        </div>
      </div>
    </>
  );
}

export default TablaOrdenes;
