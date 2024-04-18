import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function CotizacionForm() {
  const [cliente, setCliente] = useState('');
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [asunto, setAsunto] = useState('');
  const [fechaCotizacion, setFechaCotizacion] = useState(getCurrentDate());
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [mostrarPrevia, setMostrarPrevia] = useState(false);

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
      const listaProductos = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), tipoDescuento: 'cantidad', valorDescuento: 0 }));
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
        producto.id === idProducto ? { ...producto, cantidad: cantidad !== '' ? Number(cantidad) : 0, subtotal: (cantidad !== '' ? Number(cantidad) : 0) * producto.costo } : producto
      )
    );
  };
  
  const guardarCotizacion = () => {
    // Aquí podrías agregar lógica para guardar la cotización en la base de datos
    setMostrarPrevia(true); // Mostrar previa después de guardar
  };

  function agregarProductoAutomatico(e) {
    const productoId = e.target.value;
    const producto = productos.find(p => p.id === productoId);
    if (producto) {
      // Calcular subtotal para 1 cantidad
      const subtotal = producto.costo;
      // Establecer la cantidad en 1 por defecto
      const productoConCantidad = { ...producto, cantidad: 1, subtotal };
      setProductosSeleccionados([...productosSeleccionados, productoConCantidad]);
      setProductoSeleccionado('');
    }
  }
  

  const actualizarDescuento = (idProducto, tipoDescuento, valorDescuento) => {
    setProductosSeleccionados(prevProductos =>
      prevProductos.map(producto =>
        producto.id === idProducto ? calcularDescuento(producto, tipoDescuento, valorDescuento) : producto
      )
    );
  };
  

  const calcularDescuento = (producto, tipoDescuento, valorDescuento) => {
    let subtotal = producto.cantidad * producto.costo;
    let descuentoAplicado = 0;
  
    if (tipoDescuento === 'cantidad') {
      subtotal -= valorDescuento;
      descuentoAplicado = valorDescuento;
    } else if (tipoDescuento === 'porcentaje') {
      const descuento = (subtotal * valorDescuento) / 100;
      subtotal -= descuento;
      descuentoAplicado = descuento;
    }
  
    return { ...producto, tipoDescuento, valorDescuento, subtotal, descuento: descuentoAplicado };
  };

  const actualizarIdProducto = (idProducto, nuevoId) => {
    setProductosSeleccionados(prevProductos =>
      prevProductos.map(producto =>
        producto.id === idProducto ? { ...producto, id: nuevoId } : producto
      )
    );
  };

  const actualizarNombreProducto = (idProducto, nuevoNombre) => {
    setProductosSeleccionados(prevProductos =>
      prevProductos.map(producto =>
        producto.id === idProducto ? { ...producto, nombre: nuevoNombre } : producto
      )
    );
  };

  const actualizarPrecioProducto = (idProducto, nuevoPrecio) => {
    setProductosSeleccionados(prevProductos =>
      prevProductos.map(producto =>
        producto.id === idProducto ? { ...producto, costo: nuevoPrecio } : producto
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
          <select id="productos" name="productos" value={productoSeleccionado} onChange={agregarProductoAutomatico}>
            <option value="">Seleccionar producto</option>
            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre}
              </option>
            ))}
          </select>
          <button type="button" onClick={agregarProducto}>Agregar</button>

          <h2>Resumen:</h2>
          <table className="productos-table">
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>ID</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Descuento</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
            {productosSeleccionados.map((producto) => (
  <tr key={producto.id}>
    <td>
      <input
        type="number"
        value={producto.cantidad !== undefined ? producto.cantidad : ''}
        onChange={(e) => actualizarCantidad(producto.id, e.target.value)}
      />
    </td>
    <td>
      <input
        type="text"
        value={producto.id}
        onChange={(e) => actualizarIdProducto(producto.id, e.target.value)}
      />
    </td>
    <td>
      <input
        type="text"
        value={producto.nombre}
        onChange={(e) => actualizarNombreProducto(producto.id, e.target.value)}
      />
    </td>
    <td>
      <input
        type="number"
        value={parseFloat(producto.costo).toFixed(2)}
        onChange={(e) => actualizarPrecioProducto(producto.id, e.target.value)}
      />
    </td>
    <td>
      <select
        value={producto.tipoDescuento}
        onChange={(e) => actualizarDescuento(producto.id, e.target.value, producto.valorDescuento)}
      >
        <option value="cantidad">$</option>
        <option value="porcentaje">%</option>
      </select>
      {producto.tipoDescuento === 'porcentaje' && '%'}
      <input
        type="text"
        value={producto.valorDescuento}
        onChange={(e) => actualizarDescuento(producto.id, producto.tipoDescuento, e.target.value)}
      />
    </td>
    <td>${parseFloat(producto.subtotal).toFixed(2)}</td>
    <td>
      <button onClick={() => eliminarProducto(producto.id)}>✘</button>
    </td>
  </tr>
))}

            </tbody>
          </table>
          
          <p>Guardado por última vez: Hoy a las 4:30 p.m</p>
          <button type="button">Cancelar</button>
          <button type="button" onClick={guardarCotizacion}>Guardar</button>
        </div>
      </form>

      {mostrarPrevia && (
        <PreviaCotizacion
          cliente={cliente}
          clientes={clientes}
          asunto={asunto}
          fechaCotizacion={fechaCotizacion}
          productosSeleccionados={productosSeleccionados}
          eliminarProducto={eliminarProducto}
          actualizarCantidad={actualizarCantidad}
        />
      )}
    </div>
  );
}

function PreviaCotizacion({ cliente, clientes, asunto, fechaCotizacion, productosSeleccionados, eliminarProducto, actualizarDescuento }) {
  // Obtener el nombre del cliente
  const nombreCliente = clientes.find(c => c.id === cliente)?.empresa || '';

  // Función para calcular los totales, incluyendo el descuento
  const calcularTotales = () => {
    let subtotal = 0;
    let descuentoTotal = 0;

    productosSeleccionados.forEach(producto => {
      subtotal += producto.subtotal;
      descuentoTotal += producto.descuento || 0;
    });

    const iva = subtotal * 0.16;
    const total = subtotal + iva - descuentoTotal;

    return { subtotal, iva, total, descuentoTotal };
  };

  const { subtotal, iva, total, descuentoTotal } = calcularTotales();

  return (
    <div className="previa-cotizacion">
      <h1>Previa</h1>
      <h2>Cotización: 0001</h2>
      <hr />
      <p>Fecha de cotización: {fechaCotizacion}</p>
      <p>Asunto: {asunto}</p>
      <p>Cliente: {nombreCliente}</p> {/* Mostrar nombre del cliente */}
      <h3>DESCRIPCIÓN</h3>
      {/* Aquí puedes agregar los productos seleccionados */}
      <h3>Subtotal: ${subtotal.toFixed(2)}</h3>
      <h3>Descuento: ${descuentoTotal.toFixed(2)}</h3>
      <h3>IVA: ${iva.toFixed(2)}</h3>
      <h3>Total: ${total.toFixed(2)}</h3>
    </div>
  );
}

export default CotizacionForm;