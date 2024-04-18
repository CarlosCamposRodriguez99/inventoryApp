import React, { useState } from 'react';

function CotizacionForm(  ) {
  const [cliente, setCliente] = useState('');
  const [asunto, setAsunto] = useState('');
  const [fechaCotizacion, setFechaCotizacion] = useState(getCurrentDate());
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [productos, setProductos] = useState([
    { articulo: '', cantidad: 1, impuesto: '' }
  ]);

  // Función para obtener la fecha actual
  function getCurrentDate() {
    const date = new Date();
    return date.toISOString().split('T')[0]; // Formato yyyy-mm-dd
  }

  // Función para agregar otro producto
  function agregarProducto() {
    setProductos([...productos, { articulo: '', cantidad: 1, impuesto: '' }]);
  }

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
        <option value="cliente1">Cliente 1</option>
        <option value="cliente2">Cliente 2</option>
        {/* Agregar opciones dinámicamente desde la base de datos */}
      </select><br />

      <label htmlFor="asunto">Asunto:</label>
      <input type="text" id="asunto" name="asunto" value={asunto} onChange={(e) => setAsunto(e.target.value)} /><br />

      <label htmlFor="fecha-cotizacion">Fecha de cotización:</label>
      <input type="text" id="fecha-cotizacion" name="fecha-cotizacion" value={fechaCotizacion} readOnly /><br />

      <label htmlFor="fecha-vencimiento">Fecha de vencimiento:</label>
      <input type="date" id="fecha-vencimiento" name="fecha-vencimiento" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} /><br />

      {/* Aquí puedes agregar campos para productos dinámicamente */}
      <h2>Productos:</h2>
      <table className="productos-table">
        <thead>
          <tr>
            <th>Artículo</th>
            <th>Cantidad</th>
            <th>Impuesto</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto, index) => (
            <tr key={index}>
              <td><input type="text" value={producto.articulo} onChange={(e) => setProductos([...productos.slice(0, index), { ...producto, articulo: e.target.value }, ...productos.slice(index + 1)])} /></td>
              <td><input type="number" value={producto.cantidad} onChange={(e) => setProductos([...productos.slice(0, index), { ...producto, cantidad: parseInt(e.target.value, 10) }, ...productos.slice(index + 1)])} /></td>
              <td><input type="text" value={producto.impuesto} onChange={(e) => setProductos([...productos.slice(0, index), { ...producto, impuesto: e.target.value }, ...productos.slice(index + 1)])} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={agregarProducto}>Agregar otro producto</button><br />

      {/* Separador */}
      <hr />

      {/* Datos de guardado */}
      <p>Guardado por última vez: Hoy a las 4:30 p.m</p>
      <button type="button">Cancelar</button>
      <button type="button">Guardar</button>
    </div>
  </form>
</div>



  );
}

export default CotizacionForm;
