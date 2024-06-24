import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import { Routes, Route, useLocation } from 'react-router-dom';
import ListadoArticulosVenta from "./pages/articulos-venta";
import ListadoArticulosCompra from "./pages/articulos-compra";
import ListadoClientes from "./pages/clientes";
import ListadoProveedores from "./pages/proveedores";
import ListadoTodos from "./pages/todos";
import Cotizacion from "./pages/cotizacion";
import OrdenDeCompra from "./pages/orden";
import CalendarioGd from "./pages/calendario";
import Tareas from "./pages/tareas";
import Remisiones from "./pages/remisiones";
import Usuarios from "./pages/usuarios";
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './components/AuthContext';
import Dashboard from "./pages/inicio";

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/registro' element={<Register />} />
          <Route path='/' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path='/orden' element={<PrivateRoute><OrdenDeCompra /></PrivateRoute>} />
          <Route path='/cotizacion' element={<PrivateRoute><Cotizacion /></PrivateRoute>} />
          <Route path='/proveedores' element={<PrivateRoute><ListadoProveedores /></PrivateRoute>} />
          <Route path='/clientes' element={<PrivateRoute><ListadoClientes /></PrivateRoute>} />
          <Route path='/todos' element={<PrivateRoute><ListadoTodos /></PrivateRoute>} />
          <Route path='/articulos-venta' element={<PrivateRoute><ListadoArticulosVenta /></PrivateRoute>} />
          <Route path='/articulos-compra' element={<PrivateRoute><ListadoArticulosCompra /></PrivateRoute>} />
          <Route path='/calendario' element={<PrivateRoute><CalendarioGd /></PrivateRoute>} />
          <Route path='/tareas' element={<PrivateRoute><Tareas /></PrivateRoute>} />
          <Route path='/remisiones' element={<PrivateRoute><Remisiones /></PrivateRoute>} />
          <Route path='/usuarios' element={<PrivateRoute><Usuarios /></PrivateRoute>} />
        </Routes>
        {location.pathname !== '/login' && location.pathname !== '/registro' && <Sidebar />}
      </div>
    </AuthProvider>
  );
}

export default App;
