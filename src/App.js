
import './App.css';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
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

function App() {

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
    </Routes>
    <Sidebar />
    
    </div>
  );
}

export default App;
