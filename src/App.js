
import './App.css';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import ListadoArticulos from "./pages/lista-de-articulos"
import ListadoClientes from "./pages/lista-de-clientes"
import ListadoProveedores from "./pages/lista-de-proveedores"
import Cotizacion from "./pages/cotizacion"


function App() {

  return (
    <div className="App">
    <Routes>
      <Route path='/lista-de-articulos' element={<ListadoArticulos />}></Route>
      <Route path='/lista-de-clientes' element={<ListadoClientes />}></Route>
      <Route path='/lista-de-proveedores' element={<ListadoProveedores />}></Route>
      <Route path='/cotizacion' element={<Cotizacion />}></Route>
    </Routes>
    <Sidebar />
    
    </div>
  );
}

export default App;
