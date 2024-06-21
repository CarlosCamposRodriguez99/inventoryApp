import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/es'; // Importamos el idioma español
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import Nav from './Nav';


// Configura el localizador de fechas usando moment.js
moment.locale('es');
const localizer = momentLocalizer(moment);

const Dashboard = () => {
  const [expanded, setExpanded] = useState(false);
  const [events, setEvents] = useState([]); // Array para los eventos del calendario
  const [currentDate, setCurrentDate] = useState(moment());
  const [proximasAVencer, setProximasAVencer] = useState([]);
  const [proximosEventos, setProximosEventos] = useState([]);


  const showScroll = proximosEventos.length > 3;

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
                  // Construir la fecha usando moment.js para evitar problemas de zona horaria
                  const fecha = moment(`${año}-${festivo.month}-${festivo.day}`, 'YYYY-MM-DD').toDate();
                  fechasFestivas.push({
                      id: `festivo-${festivo.title}-${año}`,
                      title: festivo.title,
                      start: fecha,
                      end: fecha,
                      allDay: true,
                      resource: 'festivo',
                      style: { backgroundColor: '#de2e03' }
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



  const CustomToolbar = ({ expanded, onNavigate, onView, views, view }) => (
    <div className="rbc-toolbar">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ marginRight: 'auto' }}>
          <span onClick={() => onNavigate('PREV')} style={{ fontSize: '20px', padding: '5px', cursor: "pointer", fontWeight: "bold"}}>
            {<i className="bi bi-arrow-left-circle"></i>}
          </span>
        </div>
        <div className="month-year-container">
          <h2 style={{ margin: '0', display: 'inline-block', fontSize: '1rem' }}>
            {currentDate.format('MMMM').charAt(0).toUpperCase() + currentDate.format('MMMM').slice(1)}
          </h2>
          <h2 style={{ margin: '0', display: 'inline-block', fontSize: '1rem', marginLeft: '0.5rem' }}>
            {currentDate.format('YYYY')} {/* Formato de fecha para mostrar el año */}
          </h2>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span type="button" onClick={() => onNavigate('NEXT')} style={{ fontSize: '20px', padding: '5px', cursor: "pointer", fontWeight: "bold" }}>
            {<i className="bi bi-arrow-right-circle"></i>}
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
    
      <Nav 
        proximasAVencer={proximasAVencer} 
        proximosEventos={proximosEventos} 
      />

      <div className="dashboard-container">
      {/* Contenedor del calendario */}
      <div className={`calendar-container ${expanded ? 'expanded' : ''}`}>
        <div className="calendar-header">
          <button className="expand-button" onClick={toggleExpand}>
            {expanded ? '-' : '+'}
          </button>
        </div>
        <div className="calendar-content">
          <Calendar
            localizer={localizer} // Asumiendo que localizer es una variable definida
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ width: '100%', height: '100%' }}
            selectable={true}
            components={{
              toolbar: (props) => <CustomToolbar {...props} expanded={expanded} />,
            }}
            eventPropGetter={(event) => ({
              style: event.style || {},
            })}
            onNavigate={(newDate, view) => {
              setCurrentDate(moment(newDate));
            }}
          />
        </div>
      </div>
      
    {/* Panel de próximos eventos */}
    <div className="upcoming-events">
      <div className="events-container">
        <h3 className="events-title">Próximos Eventos</h3>
        <ul className={`events-list ${showScroll ? 'scrollable' : ''}`}>
          {/* Mostrar solo los primeros 3 eventos */}
          {proximosEventos.slice(0, 3).map((evento) => (
            <li key={evento.id} className="event-item">
              <div className="event-time">{moment(evento.to).format('hh:mm a')}</div>
              <div className="event-details">
                <span className="event-title">{evento.title}</span>
                <span className="event-date">{moment(evento.to).format('DD/MM/YYYY')}</span>
                <span className="event-description">{evento.description}</span>
              </div>
            </li>
          ))}
          
          {/* Mostrar eventos adicionales que ocurren en los próximos 5 días */}
          {proximosEventos.slice(3).filter(evento => moment(evento.to).diff(moment(), 'days') < 15).map((evento) => (
            <li key={evento.id} className="event-item">
              <div className="event-time">{moment(evento.to).format('hh:mm a')}</div>
              <div className="event-details">
                <span className="event-title">{evento.title}</span>
                <span className="event-date">{moment(evento.to).format('DD/MM/YYYY')}</span>
                <span className="event-description">{evento.description}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    

    </div>
    </>
  );
};

export default Dashboard;
