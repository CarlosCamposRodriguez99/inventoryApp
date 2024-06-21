import React, { useState } from 'react';
import moment from 'moment';

const Notificaciones = ({ proximasAVencer, proximosEventos }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="notificaciones-container">
      <div className="notification-icon-container">
        <i 
          className="bi bi-bell notification-icon" 
          onClick={handleNotificationClick}
        ></i>
        {(proximasAVencer.length > 0 || proximosEventos.length > 0) && (
          <div className="notification-badge">
            {proximasAVencer.length + proximosEventos.length}
          </div>
        )}
      </div>
      {showNotifications && (
        <div className="notifications-dropdown">
          <ul className="notifications-list">
            {proximasAVencer.length > 0 && (
              <>
                <h3 className="notification-header">Próximas a Vencer:</h3>
                {proximasAVencer.map((item, index) => (
                  <li key={index} className="notification-item">
                    <strong className="notification-title">
                      Cotización #{item.numeroCotizacion?.toString().padStart(4, '0')}
                    </strong>
                    <span className="notification-date">
                      Vence el {moment(item.fechaVencimiento).format('DD/MM/YYYY')}
                    </span>
                  </li>
                ))}
              </>
            )}
            {proximosEventos.length > 0 && (
              <>
                <h3 className="notification-header">Próximos Eventos:</h3>
                {proximosEventos.map((evento, index) => (
                  <li key={index} className="notification-item">
                    <strong className="notification-title">
                      {evento.title}
                    </strong>
                    <span className="notification-date">
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
