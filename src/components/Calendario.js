import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/es'; // Importamos el idioma español
import { v4 as uuidv4 } from 'uuid';

// Configura el localizador de fechas usando moment.js
moment.locale('es');
const localizer = momentLocalizer(moment);

const Calendario = () => {
  const [expanded, setExpanded] = useState(false);
  const [events, setEvents] = useState(() => {
    const storedEvents = localStorage.getItem('calendarEvents');
    return storedEvents ? JSON.parse(storedEvents) : [];
  });
  const [currentDate, setCurrentDate] = useState(moment());

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleAddEvent = ({ start, end }) => {
    const title = window.prompt('Ingrese el título del evento:');
    if (title) {
      const newEvent = {
        id: uuidv4(),
        title: title,
        start: start.getTime(), // Convertir a timestamp
        end: end.getTime(), // Convertir a timestamp
      };
      setEvents(prevEvents => [...prevEvents, newEvent]);
    }
  };

  const handleDeleteEvent = event => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este evento?');
    if (confirmDelete) {
      setEvents(prevEvents => prevEvents.filter(e => e.id !== event.id));
    }
  };

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

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
            events={events.map(event => ({
              ...event,
              start: new Date(event.start), // Convertir a Date
              end: new Date(event.end), // Convertir a Date
            }))}
            startAccessor="start"
            endAccessor="end"
            style={{ width: '100%', height: '100%' }}
            selectable={true}
            onSelectSlot={handleAddEvent}
            onSelectEvent={handleDeleteEvent}
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
