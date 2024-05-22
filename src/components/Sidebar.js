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
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleContactos = () => {
    if (!isOpen) setIsOpen(true);
    setIsOpenContacto(!isOpenContacto);
  };

  const toggleInventario = () => {
    if (!isOpen) setIsOpen(true);
    setIsOpenInventario(!isOpenInventario);
  };

  const toggleIngresos = () => {
    if (!isOpen) setIsOpen(true);
    setIsOpenIngresos(!isOpenIngresos);
  };

  const toggleOrdenMenu = () => {
    if (!isOpen) setIsOpen(true);
    setIsOpenOrden(!isOpenOrden);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsOpenOrden(false);
      setIsOpenIngresos(false);
      setIsOpenInventario(false);
      setIsOpenContacto(false);
    }
  }, [isOpen]);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        {isOpen && (
          <a href="/">
            <img className="logo" src="/img/logo-iciamex.png" alt="ICIAMEX logo" />
          </a>
        )}
        <img className="menu-icon" src="/img/menu.svg" alt="Menu Icon" onClick={toggleSidebar} />
      </div>
      <div className="sidebar-content">
        <nav id="primary-menu" className="navbar">
          <ul className="nav navbar-nav">
            <li><Link className={location.pathname === '/tareas' ? 'active' : ''} to="/tareas"><span className="icon">📝</span><span className="text">Tareas</span></Link></li>
            <li><Link className={location.pathname === '/calendario' ? 'active' : ''} to="/calendario"><span className="icon">📅</span><span className="text">Calendario</span></Link></li>
            <li><Link className={location.pathname === '/factura-electronica' ? 'active' : ''} to="/factura-electronica"><span className="icon">📄</span><span className="text">Factura Electrónica</span></Link></li>

            <br/>

            {isOpen && (
              <li>
                <span className="main-text">Main</span>
                <Link className={location.pathname === '/' ? 'active' : ''} to="/">
                  <span className="icon">🏠</span><span className="text">Inicio</span>
                </Link>
              </li>
            )}

            <li className={isOpenIngresos ? 'open' : ''}>
              <Link className={`menu-item ${isOpenIngresos ? 'open' : ''}`} to="#" onClick={toggleIngresos}>
                <span className="icon">📈</span><span className="text">Ingresos</span> 
                <span className={`dropdown-arrow ${isOpen && isOpenIngresos ? 'active' : ''}`}>{isOpen ? (isOpenIngresos ? '∧' : '∨') : ''}</span>
              </Link>
              {isOpenIngresos && (
                <ul className="sub-menu">
                  <li><Link className="text" to="#"><span className="icon">🧾</span>Facturación</Link></li>
                  <li><Link className="text" to="#"><span className="icon">💳</span>Pagos Recibidos</Link></li>
                  <li><Link className="text" to="/cotizacion"><span className="icon">💼</span>Cotizaciones</Link></li>
                  <li><Link className="text" to="#"><span className="icon">✉️</span>Remisiones</Link></li>
                  <li><Link className="text" to="#"><span className="icon">🛎️</span>Pedidos</Link></li>
                </ul>
              )}
            </li>

            <li className={isOpenOrden ? 'open' : ''}>
              <Link className={`menu-item ${isOpenOrden ? 'open' : ''}`} to="#" onClick={toggleOrdenMenu}>
                <span className="icon">💸</span><span className="text">Gastos</span> 
                <span className={`dropdown-arrow ${isOpen && isOpenOrden ? 'active' : ''}`}>{isOpen ? (isOpenOrden ? '∧' : '∨') : ''}</span>
              </Link>
              {isOpenOrden && (
                <ul className="sub-menu">
                  <li><Link className="text" to="/orden"><span className="icon">📋</span>Órdenes de Compra</Link></li>
                  <li><Link className="text" to="#"><span className="icon">🧾</span>Facturas de Proveedores</Link></li>
                  <li><Link className="text" to="#"><span className="icon">💲</span>Pagos</Link></li>
                  <li><Link className="text" to="#"><span className="icon">💳</span>Notas de Débito</Link></li>
                </ul>
              )}
            </li>

            <li className={isOpenInventario ? 'open' : ''}>
              <Link className={`menu-item ${isOpenInventario ? 'open' : ''}`} to="#" onClick={toggleInventario}>
                <span className="icon">📦</span><span className="text">Inventario</span> 
                <span className={`dropdown-arrow ${isOpen && isOpenInventario ? 'active' : ''}`}>{isOpen ? (isOpenInventario ? '∧' : '∨') : ''}</span>
              </Link>
              {isOpenInventario && (
                <ul className="sub-menu">
                  <li><Link className="text" to="/articulos-venta"><span className="icon">🛍️</span>Productos de Venta</Link></li>
                  <li><Link className="text" to="/articulos-compra"><span className="icon">🛒</span>Productos de Compra</Link></li>
                  <li><Link className="text" to="#"><span className="icon">🔧</span>Ajustes de Inventario</Link></li>
                  <li><Link className="text" to="#"><span className="icon">📋</span>Gestión de Productos</Link></li>
                  <li><Link className="text" to="#"><span className="icon">🗂️</span>Categorías</Link></li>
                  <li><Link className="text" to="#"><span className="icon">🏬</span>Almacenes</Link></li>
                </ul>
              )}
            </li>

            <br/>
            
            {isOpen && (
            <li className={isOpenContacto ? 'open' : ''}>
              <span className="main-text">Registros</span>
              <Link className={`menu-item ${isOpenContacto ? 'open' : ''}`} to="#" onClick={toggleContactos}>
                <span className="icon">📞</span><span className="text">Contactos</span> 
                <span className={`dropdown-arrow ${isOpen && isOpenContacto ? 'active' : ''}`}>{isOpen ? (isOpenContacto ? '∧' : '∨') : ''}</span>
              </Link>
              {isOpenContacto && (
                <ul className="sub-menu">
                  <li><Link className="text" to="/todos"><span className="icon">👥</span>Todos</Link></li>
                  <li><Link className="text" to="/clientes"><span className="icon">🤝</span>Clientes</Link></li>
                  <li><Link className="text" to="/proveedores"><span className="icon">🚚</span>Proveedores</Link></li>
                </ul>
              )}
            </li>
            )}
            
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
