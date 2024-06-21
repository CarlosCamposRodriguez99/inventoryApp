import React from 'react';
import SearchBar from './SearchBar';
import Notificaciones from './Notificaciones';
import { useAuth } from './AuthContext';

const Nav = ({ proximasAVencer, proximosEventos, handleSearch }) => {
  const { user } = useAuth();
  const displayNameParts = user?.displayName?.split(' ') || [];
  const firstName = displayNameParts[0] || '';
  const lastName = displayNameParts.length > 1 ? displayNameParts[1] : '';


  return (
    <div className="nav-container">
      <div style={{ position: 'absolute', top: 0, left: 80 }}>
        <h3 style={{ fontWeight: 'normal', marginTop: '40px' }}>
          Bienvenido, <span style={{ fontWeight: 'bold' }}>{firstName} {lastName}</span>
        </h3>
      </div>
      <div style={{ marginTop: "40px" }}>
        <div>
          <SearchBar handleSearch={handleSearch}/>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 80, right: 20, zIndex: 999 }}>
        <Notificaciones proximasAVencer={proximasAVencer} proximosEventos={proximosEventos} />
      </div>
    </div>
  );
};

export default Nav;
