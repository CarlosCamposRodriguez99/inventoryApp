import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Obtener la ubicación actual

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <img className="menu-icon" src="/img/menu.svg" alt="Menu Icon" onClick={toggleSidebar} />
      </div>
      <div className="sidebar-content">
        <a className="centrar-logo" href="/">
          <img className="logo" src="/img/logo-iciamex.png" alt="ICIAMEX logo" />
        </a>
        <nav id="primary-menu" className="navbar">
          <ul className="nav navbar-nav">
            <li><Link className={location.pathname === '/orden' ? 'active' : ''} to="/orden"><span className="icon">📝</span><span className="text">Ordenes de Compra</span></Link></li>
            <li><Link className={location.pathname === '/cotizacion' ? 'active' : ''} to="/cotizacion"><span className="icon">📊</span><span className="text">Cotizaciones</span></Link></li>
            <li><Link className={location.pathname === '/facturas' ? 'active' : ''} to="/facturas"><span className="icon">📜</span><span className="text">Facturas</span></Link></li>
            <li><Link className={location.pathname === '/proveedores' ? 'active' : ''} to="/proveedores"><span className="icon">🛒</span><span className="text">Lista de Proveedores</span></Link></li>
            <li><Link className={location.pathname === '/clientes' ? 'active' : ''} to="/clientes"><span className="icon">👥</span><span className="text">Lista de Clientes</span></Link></li>
            <li><Link className={location.pathname === '/articulos' ? 'active' : ''} to="/articulos"><span className="icon">📦</span><span className="text">Lista de Artículos</span></Link></li>
            <li><Link className={location.pathname === '/informes' ? 'active' : ''} to="/informes"><span className="icon">📈</span><span className="text">Informes</span></Link></li>
          </ul>
        </nav>
        <Outlet />
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-copyright">&copy; 2024 ICIAMEX</div>
      </div>
    </div>
  );
};

export default Sidebar;
