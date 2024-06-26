import React, { useState, useEffect, useCallback } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const getYear = () => new Date().getFullYear();

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleMenu = useCallback((menu) => {
    setIsOpen(true);
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  }, []);

  const closeSidebar = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setOpenMenus({});
    }
  }, [isOpen]);

  const isMenuOpen = (menu) => openMenus[menu] || false;

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
            {isOpen && (
              <span className="main-text">Principal</span>
            )}
            <li>
              <Link className={location.pathname === '/' ? 'active' : ''} to="/" onClick={closeSidebar}>
                <span className="icon"><i className="bi bi-house"></i></span>
                <span className="text">Inicio</span>
              </Link>
            </li> 
            <li>
              <Link className={location.pathname === '/tareas' ? 'active' : ''} to="/tareas" onClick={closeSidebar}>
                <span className="icon"><i className="bi bi-check2-square"></i></span>
                <span className="text">Tareas</span>
              </Link>
            </li>
            <li>
              <Link className={location.pathname === '/calendario' ? 'active' : ''} to="/calendario" onClick={closeSidebar}>
                <span className="icon"><i className="bi bi-calendar2-day"></i></span>
                <span className="text">Calendario</span>
              </Link>
            </li>
            <li>
              <Link className={location.pathname === '/factura-electronica' ? 'active' : ''} to="/factura-electronica" onClick={closeSidebar}>
                <span className="icon"><i className="bi bi-file-earmark-text"></i></span>
                <span className="text">Factura Electrónica</span>
              </Link>
            </li>

            <br/>

            {isOpen && (
              <span className="main-text">Utilidades</span>
            )}
            <li className={isMenuOpen('Ingresos') ? 'open' : ''}>
              <Link className={`menu-item ${isMenuOpen('Ingresos') ? 'open' : ''}`} to="#" onClick={() => toggleMenu('Ingresos')}>
                <span className="icon"><i className="bi bi-graph-up-arrow"></i></span><span className="text">Ingresos</span> 
                <div className="dropdown-arrow-container">
                  <span className={`dropdown-arrow ${isOpen && isMenuOpen('Ingresos') ? 'active' : ''}`}>
                    {isOpen ? (
                      isMenuOpen('Ingresos') ? (
                        <i className="bi bi-chevron-up"></i>
                      ) : (
                        <i className="bi bi-chevron-right"></i>
                      )
                    ) : ''}
                  </span>
                </div>
              </Link>
              {isMenuOpen('Ingresos') && (
                <ul className={`sub-menu ${isMenuOpen('Ingresos') ? 'open' : 'closed'}`}>
                  <li>
                    <Link className="text" to="#" onClick={closeSidebar}>
                      <span className="icon"><i className="bi bi-file-earmark-text"></i></span>Facturación
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="#" onClick={closeSidebar}>
                      <span className="icon"><i className="bi bi-credit-card-2-back"></i></span>Pagos Recibidos
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="/cotizacion" onClick={closeSidebar}>
                      <span className="icon"><i className="bi bi-cash-coin"></i></span>Cotizaciones
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="/remisiones" onClick={closeSidebar}>
                      <span className="icon"><i className="bi bi-receipt"></i></span>Remisiones
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="#" onClick={closeSidebar}>
                      <span className="icon"><i className="bi bi-cart4"></i></span>Pedidos
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className={isMenuOpen('Gastos') ? 'open' : ''}>
              <Link className={`menu-item ${isMenuOpen('Gastos') ? 'open' : ''}`} to="#" onClick={() => toggleMenu('Gastos')}>
                <span className="icon"><i className="bi bi-currency-dollar"></i></span><span className="text">Gastos</span> 
                <div className="dropdown-arrow-container">
                  <span className={`dropdown-arrow ${isOpen && isMenuOpen('Gastos') ? 'active' : ''}`}>
                    {isOpen ? (
                      isMenuOpen('Gastos') ? (
                        <i className="bi bi-chevron-up"></i>
                      ) : (
                        <i className="bi bi-chevron-right"></i>
                      )
                    ) : ''}
                  </span>
                </div>
              </Link>
              {isMenuOpen('Gastos') && (
                <ul className={`sub-menu ${isMenuOpen('Gastos') ? 'open' : 'closed'}`}>
                  <li>
                    <Link className="text" to="/orden" onClick={closeSidebar}>
                      <span className="icon"><i className="bi bi-receipt-cutoff"></i></span>Órdenes de Compra
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="#" onClick={closeSidebar}>
                      <span className="icon"><i className="bi bi-file-earmark"></i></span>Facturas de Proveedores
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="#" onClick={closeSidebar}>
                      <span className="icon"><i className="bi bi-cash-stack"></i></span>Pagos
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="#" onClick={closeSidebar}>
                      <span className="icon"><i className="bi bi-credit-card"></i></span>Notas de Débito
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className={isMenuOpen('Inventario') ? 'open' : ''}>
              <Link className={`menu-item ${isMenuOpen('Inventario') ? 'open' : ''}`} to="#" onClick={() => toggleMenu('Inventario')}>
                <span className="icon"><i className="bi bi-box"></i></span><span className="text">Inventario</span> 
                <div className="dropdown-arrow-container">
                  <span className={`dropdown-arrow ${isOpen && isMenuOpen('Inventario') ? 'active' : ''}`}>
                    {isOpen ? (
                      isMenuOpen('Inventario') ? (
                        <i className="bi bi-chevron-up"></i>
                      ) : (
                        <i className="bi bi-chevron-right"></i>
                      )
                    ) : ''}
                  </span>
                </div>
              </Link>
              {isMenuOpen('Inventario') && (
                <ul className={`sub-menu ${isMenuOpen('Inventario') ? 'open' : 'closed'}`}>
                  <li>
                    <Link className="text" to="/articulos-venta" onClick={closeSidebar}>
                      <span className="icon"><i className="bi bi-bag"></i></span>Productos de Venta
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="/articulos-compra" onClick={closeSidebar}>
                      <span className="icon"><i className="bi bi-cart"></i></span>Productos de Compra
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="#" onClick={closeSidebar}>
                      <span className="icon"><i className="bi bi-gear"></i></span>Ajustes de Inventario
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="#" onClick={closeSidebar}>
                      <span className="icon"><i className="bi bi-clipboard2-check"></i></span>Gestión de Productos
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="#" onClick={closeSidebar}>
                      <span className="icon"><i className="bi bi-folder"></i></span>Categorías
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="#" onClick={closeSidebar}>
                      <span className="icon"><i className="bi bi-archive"></i></span>Almacenes
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className={isMenuOpen('Reportes') ? 'open' : ''}>
              <Link className={`menu-item ${isMenuOpen('Reportes') ? 'open' : ''}`} to="#" onClick={() => toggleMenu('Reportes')}>
                <span className="icon"><i className="bi bi-file-earmark-bar-graph"></i></span><span className="text">Reportes</span> 
                <div className="dropdown-arrow-container">
                  <span className={`dropdown-arrow ${isOpen && isMenuOpen('Reportes') ? 'active' : ''}`}>
                    {isOpen ? (
                      isMenuOpen('Reportes') ? (
                        <i className="bi bi-chevron-up"></i>
                      ) : (
                        <i className="bi bi-chevron-right"></i>
                      )
                    ) : ''}
                  </span>
                </div>
              </Link>
              {isMenuOpen('Reportes') && (
                <ul className={`sub-menu ${isMenuOpen('Reportes') ? 'open' : 'closed'}`}>
                <li>
                  <Link className="text" to="#" onClick={closeSidebar}>
                    <span className="icon"><i className="bi bi-question-diamond"></i></span>Opción 1
                  </Link>
                </li>
                <li>
                  <Link className="text" to="#" onClick={closeSidebar}>
                    <span className="icon"><i className="bi bi-question-diamond"></i></span>Opción 2
                  </Link>
                </li>
                </ul>
              )}
            </li>

            <br/>
            
            {isOpen && (
              <span className="main-text">Registros</span>
            )}
            <li className={isMenuOpen('Contactos') ? 'open' : ''}>
              <Link className={`menu-item ${isMenuOpen('Contactos') ? 'open' : ''}`} to="#" onClick={() => toggleMenu('Contactos')}>
                <span className="icon"><i className="bi bi-telephone"></i></span><span className="text">Contactos</span> 
                <div className="dropdown-arrow-container">
                  <span className={`dropdown-arrow ${isOpen && isMenuOpen('Contactos') ? 'active' : ''}`}>
                    {isOpen ? (
                      isMenuOpen('Contactos') ? (
                        <i className="bi bi-chevron-up"></i>
                      ) : (
                        <i className="bi bi-chevron-right"></i>
                      )
                    ) : ''}
                  </span>
                </div>
              </Link>
              {isMenuOpen('Contactos') && (
                <ul className={`sub-menu ${isMenuOpen('Contactos') ? 'open' : 'closed'}`}>
                  <li>
                    <Link className="text" to="/todos" onClick={closeSidebar}>
                      <span className="icon"><i className="bi bi-people"></i></span>Todos
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="/clientes" onClick={closeSidebar}>
                      <span className="icon"><i className="bi bi-person-check"></i></span>Clientes
                    </Link>
                  </li>
                  <li>
                    <Link className="text" to="/proveedores" onClick={closeSidebar}>
                      <span className="icon"><i className="bi bi-truck"></i></span>Proveedores
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            
            <br/>

            {isOpen && (
              <span className="main-text">Soporte</span>
            )}
            <li className={isMenuOpen('Configuracion') ? 'open' : ''}>
              <Link className={`menu-item ${isMenuOpen('Configuracion') ? 'open' : ''}`} to="#" onClick={() => toggleMenu('Configuracion')}>
                <span className="icon"><i className="bi bi-gear"></i></span><span className="text">Configuración</span> 
                <div className="dropdown-arrow-container">
                  <span className={`dropdown-arrow ${isOpen && isMenuOpen('Configuracion') ? 'active' : ''}`}>
                    {isOpen ? (
                      isMenuOpen('Configuracion') ? (
                        <i className="bi bi-chevron-up"></i>
                      ) : (
                        <i className="bi bi-chevron-right"></i>
                      )
                    ) : ''}
                  </span>
                </div>
              </Link>
              {isMenuOpen('Configuracion') && (
                <ul className={`sub-menu ${isMenuOpen('Configuracion') ? 'open' : 'closed'}`}>
                  <li>
                    <Link className="text" to="/usuarios" onClick={closeSidebar}>
                      <span className="icon"><i className="bi bi-people-fill"></i></span>Usuarios
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link className={location.pathname === '#' ? 'active' : ''} to="#" onClick={closeSidebar}>
                <span className="icon"><i className="bi bi-question-circle"></i></span>
                <span className="text">Ayuda</span>
              </Link>
            </li>
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
