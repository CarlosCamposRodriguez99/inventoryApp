import React, { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            <li><a className="active" href="index.html"><span className="icon">📝</span><span className="text">Ordenes de Compra</span></a></li>
            <li><a href="/"><span className="icon">📊</span><span className="text">Cotizaciones</span></a></li>
            <li><a href="/"><span className="icon">📜</span><span className="text">Facturas</span></a></li>
            <li><a href="/"><span className="icon">🛒</span><span className="text">Lista de Proveedores</span></a></li>
            <li><a href="/"><span className="icon">👥</span><span className="text">Lista de Clientes</span></a></li>
            <li><a href="/"><span className="icon">📦</span><span className="text">Lista de Artículos</span></a></li>
            <li><a href="/"><span className="icon">📈</span><span className="text">Informes</span></a></li>
          </ul>
        </nav>
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-copyright">&copy; 2024 ICIAMEX</div>
      </div>
    </div>
  );
};

export default Sidebar;
