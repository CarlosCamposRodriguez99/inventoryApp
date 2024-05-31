import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from "./pages/inicio"
import ListadoArticulosVenta from "./pages/articulos-venta"
import ListadoArticulosCompra from "./pages/articulos-compra"
import ListadoClientes from "./pages/clientes"
import ListadoProveedores from "./pages/proveedores"
import ListadoTodos from "./pages/todos"
import Cotizacion from "./pages/cotizacion"
import OrdenDeCompra from "./pages/orden"
import CalendarioGd from "./pages/calendario"
import Tareas from "./pages/tareas"
import Remisiones from "./pages/remisiones"
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    // Lógica de autenticación, por ejemplo, verificar credenciales
    // Si la autenticación es exitosa, establece loggedIn en true
    setLoggedIn(true);
  };

  const handleLogout = () => {
    // Lógica de cierre de sesión
    // Establece loggedIn en false
    setLoggedIn(false);
  };

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/orden' element={<OrdenDeCompra />}></Route>
        <Route path='/cotizacion' element={<Cotizacion />}></Route>
        <Route path='/proveedores' element={<ListadoProveedores />}></Route>
        <Route path='/clientes' element={<ListadoClientes />}></Route>
        <Route path='/todos' element={<ListadoTodos />}></Route>
        <Route path='/articulos-venta' element={<ListadoArticulosVenta />}></Route>
        <Route path='/articulos-compra' element={<ListadoArticulosCompra />}></Route>
        <Route path='/calendario' element={<CalendarioGd />}></Route>
        <Route path='/tareas' element={<Tareas />}></Route>
        <Route path='/remisiones' element={<Remisiones />}></Route>
        <Route path='/login' element={<Login onLogin={handleLogin} />} />
        <Route path='/registro' element={<Register />} />
        <Route path='/' element={<PrivateRoute loggedIn={loggedIn} />} />

      </Routes>
      {location.pathname !== '/login' && location.pathname !== '/registro' && <Sidebar />}

    </div>
  );
}

export default App;
