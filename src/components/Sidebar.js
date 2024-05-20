import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const getYear = () => {
  return new Date().getFullYear();
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenOrden, setIsOpenOrden] = useState(false);
  const [isOpenIngresos, setIsOpenIngresos] = useState(false);
  const [isOpenInventario, setIsOpenInventario] = useState(false);
  const [isOpenContacto, setIsOpenContacto] = useState(false);
  const [isOpenUsuario, setIsOpenUsuario] = useState(false);
  const location = useLocation();


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleUsuarios = () => {
    if (!isOpen) {
      // Abre el sidebar si está cerrado
      setIsOpen(true);
    }
    setIsOpenUsuario(!isOpenUsuario);
  };

  const toggleContactos = () => {
    if (!isOpen) {
      // Abre el sidebar si está cerrado
      setIsOpen(true);
    }
    setIsOpenContacto(!isOpenContacto);
  };

  const toggleInventario = () => {
    if (!isOpen) {
      // Abre el sidebar si está cerrado
      setIsOpen(true);
    }
    setIsOpenInventario(!isOpenInventario);
  };

  const toggleIngresos = () => {
    if (!isOpen) {
      // Abre el sidebar si está cerrado
      setIsOpen(true);
    }
    setIsOpenIngresos(!isOpenIngresos);
  };

  const toggleOrdenMenu = () => {
    if (!isOpen) {
      // Abre el sidebar si está cerrado
      setIsOpen(true);
    }
    setIsOpenOrden(!isOpenOrden);
  };

  // Efecto de limpieza para cerrar los submenús cuando se oculta el sidebar
  useEffect(() => {
    if (!isOpen) {
      setIsOpenOrden(false);
      setIsOpenIngresos(false);
      setIsOpenInventario(false);
      setIsOpenContacto(false);
      setIsOpenUsuario(false);
    }
  }, [isOpen]);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <img className="menu-icon" src="/img/menu.svg" alt="Menu Icon" onClick={toggleSidebar} />
      </div>
      <a className="centrar-logo" href="/">
          <img className="logo" src="/img/logo-iciamex.png" alt="ICIAMEX logo" />
      </a>
      <div className="sidebar-content">
        
        <nav id="primary-menu" className="navbar">
          <ul className="nav navbar-nav">
            <li><Link className={location.pathname === '/' ? 'active' : ''} to="/"><span className="icon">🏠</span><span className="text">Inicio</span></Link></li>
            <li className={isOpenIngresos ? 'open' : ''}>
              <Link className={`menu-item ${isOpenIngresos ? 'open' : ''}`} to="#" onClick={toggleIngresos}>
                <span className="icon">📈</span><span className="text">Ingresos</span> 
                <span className={`dropdown-arrow ${isOpen && isOpenIngresos ? 'active' : ''}`}>{isOpen ? (isOpenIngresos ? '⌵' : '⌵') : ''}</span>

              </Link>
              {isOpenIngresos && (
                <ul className="sub-menu">
                  <li>
                    <Link className="text" to="#">
                      <span className="icon">🧾</span>Facturación
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="#">
                      <span className="icon">💳</span>Pagos Recibidos
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="/cotizacion">
                      <span className="icon">💼</span>Cotizaciones
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="#">
                      <span className="icon">✉️</span>Remisiones
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="#">
                      <span className="icon">🛎️</span>Pedidos
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className={isOpenOrden ? 'open' : ''}>
              <Link className={`menu-item ${isOpenOrden ? 'open' : ''}`} to="#" onClick={toggleOrdenMenu}>
                <span className="icon">💸</span><span className="text">Gastos</span> 
                <span className={`dropdown-arrow ${isOpen && isOpenOrden ? 'active' : ''}`}>{isOpen ? (isOpenOrden ? '⌵' : '⌵') : ''}</span>

              </Link>
              {isOpenOrden && (
                <ul className="sub-menu">
                  <li>
                    <Link className="text" to="/orden">
                      <span className="icon">📋</span>Órdenes de Compra
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="#">
                      <span className="icon">🧾</span>Facturas de Proveedores
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="#">
                      <span className="icon">💲</span>Pagos
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="#">
                      <span className="icon">💳</span>Notas de Débito
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className={isOpenInventario ? 'open' : ''}>
              <Link className={`menu-item ${isOpenInventario ? 'open' : ''}`} to="#" onClick={toggleInventario}>
                <span className="icon">📦</span><span className="text">Inventario</span> 
                <span className={`dropdown-arrow ${isOpen && isOpenInventario ? 'active' : ''}`}>{isOpen ? (isOpenInventario ? '⌵' : '⌵') : ''}</span>

              </Link>
              {isOpenInventario && (
                <ul className="sub-menu">
                  <li>
                    <Link className="text" to="/articulos-venta">
                      <span className="icon">🛍️</span>Productos de Venta
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="/articulos-compra">
                      <span className="icon">🛒</span>Productos de Compra
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="#">
                      <span className="icon">🔧</span>Ajustes de Inventario
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="#">
                      <span className="icon">📋</span>Gestión de Productos
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="#">
                      <span className="icon">🗂️</span>Categorías
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="#">
                      <span className="icon">🏬</span>Almacenes
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className={isOpenUsuario ? 'open' : ''}>
              <Link className={`menu-item ${isOpenUsuario ? 'open' : ''}`} to="#" onClick={toggleUsuarios}>
                <span className="icon">👥</span><span className="text">Usuarios</span> 
                <span className={`dropdown-arrow ${isOpen && isOpenUsuario ? 'active' : ''}`}>{isOpen ? (isOpenUsuario ? '⌵' : '⌵') : ''}</span>

              </Link>
              {isOpenUsuario && (
                <ul className="sub-menu">
                  <li>
                    <Link className="text" to="#">
                      <span className="icon">👤</span>Magno Hernández
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="/clientes">
                      <span className="icon">👤</span>Victor García
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className={isOpenContacto ? 'open' : ''}>
              <Link className={`menu-item ${isOpenContacto ? 'open' : ''}`} to="#" onClick={toggleContactos}>
                <span className="icon">📞</span><span className="text">Contactos</span> 
                <span className={`dropdown-arrow ${isOpen && isOpenContacto ? 'active' : ''}`}>{isOpen ? (isOpenContacto ? '⌵' : '⌵') : ''}</span>

              </Link>
              {isOpenContacto && (
                <ul className="sub-menu">
                  <li>
                    <Link className="text" to="/todos">
                      <span className="icon">👥</span>Todos
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="/clientes">
                      <span className="icon">🤝</span>Clientes
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="/proveedores">
                      <span className="icon">🚚</span>Proveedores
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li><Link className={location.pathname === '/informes' ? 'active' : ''} to="/informes"><span className="icon">📑</span><span className="text">Informes</span></Link></li>

            <br/>

            
            <li><Link className={location.pathname === '#' ? 'active' : ''} to="#"><span className="icon">⚙️</span><span className="text">Configuración</span></Link></li>
            <li><Link className={location.pathname === '#' ? 'active' : ''} to="#"><span className="icon">🛠️</span><span className="text">Soporte</span></Link></li>

          </ul>
        </nav>
        <Outlet />
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-copyright">&copy; {getYear()} ICIAMEX</div>
      </div>
    </div>
  );
};

export default Sidebar;
