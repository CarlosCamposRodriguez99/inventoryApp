
import './App.css';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import ListadoArticulos from "./pages/articulos"
import ListadoClientes from "./pages/clientes"
import ListadoProveedores from "./pages/proveedores"
import Cotizacion from "./pages/cotizacion"


function App() {

  return (
    <div className="App">
    <Routes>
      <Route path='/articulos' element={<ListadoArticulos />}></Route>
      <Route path='/clientes' element={<ListadoClientes />}></Route>
      <Route path='/proveedores' element={<ListadoProveedores />}></Route>
      <Route path='/cotizacion' element={<Cotizacion />}></Route>
    </Routes>
    <Sidebar />
    
    </div>
  );
}

export default App;
