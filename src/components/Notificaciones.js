import React, { useState } from 'react';
import moment from 'moment';

const Notificaciones = ({ proximasAVencer, proximosEventos }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999 }}>
      <div style={{ position: 'relative' }}>
        <img
          src="/img/notification.svg"
          alt="Notificaciones"
          style={{ width: '40px', height: 'auto', cursor: 'pointer' }}
          onClick={handleNotificationClick}
        />
        {(proximasAVencer.length > 0 || proximosEventos.length > 0) && (
          <div
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              backgroundColor: 'red',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              fontSize: '0.8rem',
            }}
          >
            {proximasAVencer.length + proximosEventos.length}
          </div>
        )}
      </div>
      {showNotifications && (
        <div
          style={{
            position: 'absolute',
            top: '50px',
            right: '0',
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            width: '300px',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          <ul style={{ listStyleType: 'none', margin: 0, padding: '10px' }}>
            {proximasAVencer.length > 0 && (
              <>
                <h3 style={{ marginBottom: '10px', color: '#333', textAlign: "left" }}>Próximas a Vencer:</h3>
                {proximasAVencer.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      borderBottom: '1px solid #eaeaea',
                      padding: '10px 0',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <strong style={{ color: '#333', marginBottom: '5px' }}>
                      Cotización #{item.numeroCotizacion?.toString().padStart(4, '0')}
                    </strong>
                    <span style={{ fontSize: '0.9rem', color: '#555' }}>
                      Vence el {moment(item.fechaVencimiento).format('DD/MM/YYYY')}
                    </span>
                  </li>
                ))}
              </>
            )}
            {proximosEventos.length > 0 && (
              <>
                <h3 style={{ marginBottom: '10px', color: '#333', textAlign: "left" }}>Próximos Eventos:</h3>
                {proximosEventos.map((evento, index) => (
                  <li
                    key={index}
                    style={{
                      borderBottom: '1px solid #eaeaea',
                      padding: '10px 0',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <strong style={{ color: '#333', marginBottom: '5px' }}>
                      {evento.title}
                    </strong>
                    <span style={{ fontSize: '0.9rem', color: '#555' }}>
                      Vence el {moment(evento.to).format('DD/MM/YYYY')}
                    </span>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notificaciones;
