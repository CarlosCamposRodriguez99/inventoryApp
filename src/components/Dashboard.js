import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/es'; // Importamos el idioma español
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import Notificaciones from './Notificaciones';
import SearchBar from './SearchBar';
import { useAuth } from './AuthContext';

// Configura el localizador de fechas usando moment.js
moment.locale('es');
const localizer = momentLocalizer(moment);

const Dashboard = () => {
  const [expanded, setExpanded] = useState(false);
  const [events, setEvents] = useState([]); // Array para los eventos del calendario
  const [currentDate, setCurrentDate] = useState(moment());
  const [proximasAVencer, setProximasAVencer] = useState([]);
  const [proximosEventos, setProximosEventos] = useState([]);
  const { user } = useAuth();

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

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

            // Crear los eventos solo para las cotizaciones próximas a vencer
            const cotizacionesEvents = proximas.map((cotizacion) => ({
                id: `cotizacion-${cotizacion.id}`, // Prefijo para distinguir cotizaciones
                title: `Cotización #${cotizacion.numeroCotizacion}`,
                start: moment(cotizacion.fechaVencimiento).startOf('day').toDate(), // Ajustar a la hora 0 del día
                end: moment(cotizacion.fechaVencimiento).startOf('day').toDate(), // Ajustar a la hora 0 del día
                allDay: true,
                resource: 'cotizacion',
                style: { backgroundColor: 'blue' } // Color para cotizaciones (azul)
            }));

            // Actualizar el estado eliminando duplicados
            setEvents(prevEvents => {
                const eventMap = new Map(prevEvents.map(event => [event.id, event]));
                cotizacionesEvents.forEach(event => eventMap.set(event.id, event));
                return Array.from(eventMap.values());
            });
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

            // Crear los eventos solo para los próximos eventos
            const eventosCalendario = proximos.map((evento) => ({
                id: `evento-${evento.id}`, // Prefijo para distinguir eventos
                title: evento.title,
                start: moment(evento.to).startOf('day').toDate(), // Ajustar a la hora 0 del día
                end: moment(evento.to).startOf('day').toDate(), // Ajustar a la hora 0 del día
                allDay: true,
                resource: 'evento',
                style: { backgroundColor: '#229954' } // Color para eventos (verde)
            }));

            // Actualizar el estado eliminando duplicados
            setEvents(prevEvents => {
                const eventMap = new Map(prevEvents.map(event => [event.id, event]));
                eventosCalendario.forEach(event => eventMap.set(event.id, event));
                return Array.from(eventMap.values());
            });
        });

        return () => unsubscribeEventos();
    };

    // Función para obtener las fechas festivas con un color rojo
    const getFechasFestivas = () => {
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

        const generarFechasFestivas = (años) => {
            const fechasFestivas = [];

            años.forEach(año => {
                fechasFestivasBase.forEach(festivo => {
                    fechasFestivas.push({
                        id: `festivo-${festivo.title}-${año}`, // Prefijo para distinguir festivos
                        title: festivo.title,
                        start: new Date(`${año}-${festivo.month}-${festivo.day}`),
                        end: new Date(`${año}-${festivo.month}-${festivo.day}`),
                        allDay: true,
                        resource: 'festivo',
                        style: { backgroundColor: '#de2e03' } // Color para festivos (rojo)
                    });
                });
            });

            return fechasFestivas;
        };

        const años = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i);
        return generarFechasFestivas(años);
    };

    // Obtener fechas festivas y fusionarlas con los eventos existentes
    const fechasFestivas = getFechasFestivas();
    setEvents(prevEvents => [...prevEvents, ...fechasFestivas]);

    // Ejecutar las funciones de carga de cotizaciones y eventos
    fetchCotizaciones();
    fetchEventos();
}, []);

  const displayNameParts = user?.displayName?.split(' ') || [];
  const firstName = displayNameParts[0] || '';
  const lastName = displayNameParts.length > 1 ? displayNameParts[1] : '';


  const CustomToolbar = ({ expanded, onNavigate, onView, views, view }) => (
    <div className="rbc-toolbar">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ marginRight: 'auto' }}>
          <span onClick={() => onNavigate('PREV')} style={{ fontSize: '1rem', padding: '5px', cursor: "pointer", color: '#007bff' }}>
            {'❮'}
          </span>
        </div>
        <div className="month-year-container">
          <h2 style={{ margin: '0', display: 'inline-block', fontSize: '1rem' }}>
            {currentDate.format('MMMM')}
          </h2>
          <h2 style={{ margin: '0', display: 'inline-block', fontSize: '1rem', marginLeft: '0.5rem' }}>
            {currentDate.format('YYYY')} {/* Formato de fecha para mostrar el año */}
          </h2>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span type="button" onClick={() => onNavigate('NEXT')} style={{ fontSize: '1rem', padding: '5px', cursor: "pointer", color: '#007bff' }}>
            {'❯'}
          </span>
        </div>
      </div>
      {expanded && (
        <span className="rbc-btn-group">
          {views.map(v => (
            // Se omite el renderizado de "Agenda"
            v !== 'agenda' && (
              <button
                key={v}
                type="button"
                onClick={() => onView(v)}
                className={`rbc-btn${view === v ? ' rbc-active' : ''}`}
              >
                {v === 'month' ? 'Mes' : v === 'week' ? 'Semana' : v === 'day' ? 'Día' : 'Agenda'}
              </button>
            )
          ))}
        </span>
      )}
    </div>
  );

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 80 }}>
        <h3 style={{ fontWeight: "normal", marginTop: "40px"}}>
          Bienvenido, <span style={{ fontWeight: 'bold' }}>{firstName} {lastName}</span>
        </h3>
      </div>
      <div style={{marginTop: "40px"}}>
        <div>
          <SearchBar />
        </div>
      </div>
      <div style={{ position: 'fixed', top: 80, right: 20, zIndex: 999 }}>
        <Notificaciones proximasAVencer={proximasAVencer} />
      </div>
  
      <div style={{ position: 'fixed', top: 160, right: 20 }}>
        <div
          style={{
            width: expanded ? '400px' : '200px',
            minWidth: '250px',
            height: expanded ? '300px' : '250px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            transition: 'width 0.3s ease',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#007bff',
                fontSize: '1.5rem',
                padding: '5px',
              }}
              onClick={toggleExpand}
            >
              {expanded ? '_' : '+'}
            </button>
          </div>
          <div style={{ height: 'calc(100% - 50px)', overflow: 'auto' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ width: '100%', height: '100%' }}
              selectable={true}
              components={{
                toolbar: props => <CustomToolbar {...props} expanded={expanded} />,
              }}
              eventPropGetter={(event) => ({
                style: event.style || {},
              })}
              // Manejo de la navegación
              onNavigate={(newDate, view) => {
                setCurrentDate(moment(newDate)); // Actualiza la fecha actual
              }}
            />
          </div>
        </div>
  
        <div style={{ position: 'fixed', bottom: 25, right: 20, backgroundColor: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
          <h3>Próximos Eventos:</h3>
          <ul>
            {proximosEventos.map(evento => (
              <li key={evento.id}>
                {evento.title} - {moment(evento.to).format('DD/MM/YYYY')}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
