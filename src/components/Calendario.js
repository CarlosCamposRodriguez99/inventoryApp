import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/es'; // Importamos el idioma español
import { getFirestore, collection, onSnapshot } from 'firebase/firestore'; // Importa las funciones necesarias de Firebase

// Configura el localizador de fechas usando moment.js
moment.locale('es');
const localizer = momentLocalizer(moment);

const Calendario = () => {
  const [expanded, setExpanded] = useState(false);
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(moment());

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const fetchCotizaciones = async () => {
      const firestore = getFirestore();
      const cotizacionesRef = collection(firestore, 'cotizaciones');
      const unsubscribe = onSnapshot(cotizacionesRef, (snapshot) => {
        const cotizaciones = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const cotizacionesEvents = cotizaciones.map((cotizacion) => ({
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
    <div className="rbc-toolbar" style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ marginRight: 'auto' }}>
          <button type="button" onClick={() => onNavigate('PREV')} style={{ fontSize: '1rem', padding: '5px' }}>
            {'⬅️'}
          </button>
        </span>
        <div className="month-year-container" style={{ textAlign: 'center', flex: 1, marginLeft: '10px', marginRight: '10px' }}>
          <h2 style={{ margin: '0', display: 'inline-block', fontSize: '1rem' }}>
            {currentDate.format('MMMM')}
          </h2>
          <h2 style={{ margin: '0', display: 'inline-block', fontSize: '1rem', marginLeft: '0.5rem' }}>
            {currentDate.format('YYYY')} {/* Formato de fecha para mostrar el año */}
          </h2>
        </div>
        <span style={{ marginLeft: 'auto' }}>
          <button type="button" onClick={() => onNavigate('NEXT')} style={{ fontSize: '1rem', padding: '5px' }}>
            {'➡️'}
          </button>
        </span>
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
    <div style={{ position: 'fixed', top: 80, right: 20, zIndex: 999 }}>
      <div
        style={{
          width: expanded ? '500px' : '250px', // Ajustamos el ancho cuando está expandido
          minWidth: '250px', // Establecemos un ancho mínimo
          height: expanded ? '400px' : '350px', // Ajustamos la altura cuando está expandido
          backgroundColor: '#fff', // Fondo blanco
          borderRadius: '10px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          transition: 'width 0.3s ease', // Animación de transición para el ancho
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
        <div style={{ height: 'calc(100% - 50px)', overflow: 'auto' }}> {/* Ajustamos la altura del calendario */}
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
    </div>
  );
};

export default Calendario;
