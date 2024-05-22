import React, { useState } from 'react';
import moment from 'moment';

const Notificaciones = ({ proximasAVencer }) => {
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
        {proximasAVencer.length > 0 && (
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
            {proximasAVencer.length}
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
                  Próxima fecha a vencer:
                </strong>
                <span style={{ fontSize: '0.9rem', color: '#555' }}>
                  {item.title}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#777', fontWeight: "600" }}>
                  {moment(item.fechaVencimiento).format('DD/MM/YYYY')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notificaciones;
