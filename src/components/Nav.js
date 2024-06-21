import React from 'react';
import SearchBar from './SearchBar';
import Notificaciones from './Notificaciones';
import { useAuth } from './AuthContext';

const Nav = ({ proximasAVencer, proximosEventos, handleSearch }) => {
  const { user } = useAuth();
  const displayNameParts = user?.displayName?.split(' ') || [];
  const firstName = displayNameParts[0] || '';
  const lastName = displayNameParts.length > 1 ? displayNameParts[1] : '';
  const userRole = user?.role || 'Usuario';

  return (
    <div style={{ position: 'relative', padding: '10px', boxShadow: '0 1px 5px rgba(0,0,0,0.1)', backgroundColor: '#FFFFFF' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
        <div style={{ marginLeft: '80px' }}>
          <h3 style={{ fontWeight: 'normal', margin: 0 }}>
            Bienvenido, <span style={{ fontWeight: 'bold' }}>{firstName} {lastName}</span>
          </h3>
        </div>
        <div style={{ flex: 1 }}>
          <SearchBar handleSearch={handleSearch} style={{ width: '100%' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginRight: '20px' }}>
          <Notificaciones proximasAVencer={proximasAVencer} proximosEventos={proximosEventos} />
          <i className="bi bi-moon" style={{ cursor: 'pointer', fontSize: '1.5rem' }}></i>
          <i className="bi bi-arrows-fullscreen" style={{ cursor: 'pointer', fontSize: '1.5rem' }}></i>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: "#FAFAFD", width: "200px", padding: '5px', borderRadius: '5px' }}>
            <img src={user?.avatarUrl || '/img/avatar.jpg'} alt="Avatar" style={{ width: '45px', height: '45px', borderRadius: '50%' }} />
            <div style={{ marginLeft: '10px' }}>
              <div style={{ fontWeight: "bold" }}>{firstName} {lastName}</div>
              <div style={{ fontSize: '0.9rem' }}>{userRole}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
