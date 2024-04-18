import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function CotizacionForm() {
  const [cliente, setCliente] = useState('');
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [asunto, setAsunto] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  useEffect(() => {
    obtenerClientes();
    obtenerProductos();
  }, []);

  const obtenerClientes = async () => {
    try {
      const clientesSnapshot = await getDocs(collection(db, 'clientes'));
      const listaClientes = clientesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClientes(listaClientes);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const obtenerProductos = async () => {
    try {
      const productosSnapshot = await getDocs(collection(db, 'productos'));
      const listaProductos = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProductos(listaProductos);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  function getCurrentDate() {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }

  function agregarProducto() {
    if (productoSeleccionado) {
      const producto = productos.find(p => p.id === productoSeleccionado);
      if (producto) {
        setProductosSeleccionados([...productosSeleccionados, producto]);
        setProductoSeleccionado('');
      }
    }
  }

  const eliminarProducto = (idProducto) => {
    setProductosSeleccionados(prevProductos => prevProductos.filter(producto => producto.id !== idProducto));
  };

  const actualizarCantidad = (idProducto, cantidad) => {
    setProductosSeleccionados(prevProductos =>
      prevProductos.map(producto =>
        producto.id === idProducto ? { ...producto, cantidad: cantidad !== '' ? Number(cantidad) : 0 } : producto
      )
    );
  };

  return (
    <div className="cotizacion-form">
      <form>
        <div className="cotizacion-header">
          <img src="/img/logo-iciamex.png" alt="ICIAMEX" className="logoCotizacion" />
          <div className="border-right"></div>
          <h1 className="cotizacion-title">Cotización</h1>
        </div>

        <div className="cotizacion-body">
          <label htmlFor="cliente">Cliente:</label>
          <select id="cliente" name="cliente" value={cliente} onChange={(e) => setCliente(e.target.value)}>
            <option value="">Seleccionar cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.empresa}
              </option>
            ))}
          </select><br />

          <label htmlFor="asunto">Asunto:</label>
          <input type="text" id="asunto" name="asunto" value={asunto} onChange={(e) => setAsunto(e.target.value)} /><br />

          <label htmlFor="fecha-cotizacion">Fecha de cotización:</label>
          <input type="text" id="fecha-cotizacion" name="fecha-cotizacion" value={getCurrentDate()} readOnly /><br />

          <label htmlFor="fecha-vencimiento">Fecha de vencimiento:</label>
          <input type="date" id="fecha-vencimiento" name="fecha-vencimiento" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} /><br />

          <label htmlFor="productos">Agregar Producto:</label>
          <select id="productos" name="productos" value={productoSeleccionado} onChange={(e) => setProductoSeleccionado(e.target.value)}>
            <option value="">Seleccionar producto</option>
            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre}
              </option>
            ))}
          </select>
          <button type="button" onClick={agregarProducto}>Agregar</button>

          <h2>Productos:</h2>
          <table className="productos-table">
            <thead>
              <tr>
                <th>Artículo</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosSeleccionados.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.nombre}</td>
                  <td>
                  <input
                    type="number"
                    value={producto.cantidad !== undefined ? producto.cantidad : ''}
                    onChange={(e) => actualizarCantidad(producto.id, e.target.value)}
                  />
                  </td>
                  <td>${parseFloat(producto.costo).toFixed(2)}</td>
                  <td>
                    <button onClick={() => eliminarProducto(producto.id)}>✘</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <p>Guardado por última vez: Hoy a las 4:30 p.m</p>
          <button type="button">Cancelar</button>
          <button type="button">Guardar</button>
        </div>
      </form>
    </div>
  );
}

export default CotizacionForm;
