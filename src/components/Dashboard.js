import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/es'; // Importamos el idioma español
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import Notificaciones from './Notificaciones';

// Configura el localizador de fechas usando moment.js
moment.locale('es');
const localizer = momentLocalizer(moment);

const Dashboard = () => {
  const [expanded, setExpanded] = useState(false);
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(moment());
  const [proximasAVencer, setProximasAVencer] = useState([]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const fetchCotizaciones = async () => {
      const firestore = getFirestore();
      const cotizacionesRef = collection(firestore, 'cotizaciones');
      const unsubscribe = onSnapshot(cotizacionesRef, (snapshot) => {
        const cotizaciones = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
        // Filtrar las cotizaciones que tienen fecha de vencimiento a partir de hoy y ordenarlas
        const proximas = cotizaciones
          .filter(cotizacion => moment(cotizacion.fechaVencimiento) >= moment().startOf('day'))
          .sort((a, b) => moment(a.fechaVencimiento) - moment(b.fechaVencimiento));
          
        setProximasAVencer(proximas.slice(0, 6)); // Limitar la lista a 6 fechas próximas
  
        // Crear los eventos solo para las cotizaciones próximas a vencer
        const cotizacionesEvents = proximas.map((cotizacion) => ({
          id: cotizacion.id,
          title: `Cotización #${cotizacion.numeroCotizacion}`,
          start: moment(cotizacion.fechaVencimiento).startOf('day').toDate(), // Ajustar a la hora 0 del día
          end: moment(cotizacion.fechaVencimiento).startOf('day').toDate(), // Ajustar a la hora 0 del día
          allDay: true,
          resource: 'cotizacion',
        }));
        setEvents(cotizacionesEvents);
      });
  
      return () => unsubscribe();
    };
  
    fetchCotizaciones();
  }, []);

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
    <Notificaciones proximasAVencer={proximasAVencer} />
    <div style={{ position: 'fixed', top: 80, right: 20 }}>
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
            // Manejo de la navegación
            onNavigate={(newDate, view) => {
              setCurrentDate(moment(newDate)); // Actualiza la fecha actual
            }}
          />
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 25, right: 20, backgroundColor: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
        <h3>Tareas Pendientes:</h3>
        <ul>
          {proximasAVencer.map(cotizacion => (
            <li key={cotizacion.id}>
              Cotización #{cotizacion.numeroCotizacion} - {moment(cotizacion.fechaVencimiento).format('DD/MM/YYYY')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </>
  );
};

export default Dashboard;
