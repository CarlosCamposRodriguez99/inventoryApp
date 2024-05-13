
import './App.css';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/inicio"
import ListadoArticulos from "./pages/articulos"
import ListadoClientes from "./pages/clientes"
import ListadoProveedores from "./pages/proveedores"
import Cotizacion from "./pages/cotizacion"
import OrdenDeCompra from "./pages/orden"

function App() {

  return (
    <div className="App">
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/orden' element={<OrdenDeCompra />}></Route>
      <Route path='/cotizacion' element={<Cotizacion />}></Route>
      <Route path='/proveedores' element={<ListadoProveedores />}></Route>
      <Route path='/clientes' element={<ListadoClientes />}></Route>
      <Route path='/articulos' element={<ListadoArticulos />}></Route>
    </Routes>
    <Sidebar />
    
    </div>
  );
}

export default App;
