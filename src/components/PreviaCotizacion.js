import React from 'react';

function PreviaCotizacion({ cotizacion, numeroCotizacion, clientes, cerrarPrevia }) {
  const { asunto, fechaCotizacion, productosSeleccionados } = cotizacion;

  // Buscamos el cliente correspondiente en la lista de clientes
  const clienteEncontrado = clientes.find(cliente => cliente.id === cotizacion.cliente);

  // Verificamos si se encontró el cliente
  const nombreCliente = clienteEncontrado ? clienteEncontrado.empresa : 'Cliente no encontrado';

  // Calcular subtotal
  const subtotal = productosSeleccionados.reduce((acc, producto) => acc + parseFloat(producto.subtotal), 0);

  // Calcular descuento total (suponiendo que hay un descuento en cada producto)
  const descuentoTotal = productosSeleccionados.reduce((acc, producto) => acc + parseFloat(producto.descuento), 0);

  // Calcular IVA
  const iva = subtotal * 0.16; // Suponiendo que el IVA es del 16%

  // Calcular total
  const total = subtotal - descuentoTotal + iva;

  return (
    <div className="previa-cotizacion">
      <div className="cotizacion-header">
        <img src="/img/logo-iciamex.png" alt="ICIAMEX" className="logoCotizacion" />
        <div className="border-right"></div>
        <h1 className="cotizacion-title">Cotización</h1>
      </div>
      <h1>Previa</h1>
      <h2>Cotización: {numeroCotizacion?.toString().padStart(4, '0')}</h2>
      <hr />
      <p>Fecha de cotización: {fechaCotizacion}</p>
      <p>Asunto: {asunto}</p>
      <p>Cliente: {nombreCliente}</p>
      <h3>DESCRIPCIÓN</h3>
      <table className="productos-table">
        <thead>
          <tr>
            <th>Cantidad</th>
            <th>ID</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {productosSeleccionados.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.cantidad}</td>
              <td>{producto.productoIdEditado}</td>
              <td>{producto.nombre}</td>
              <td>${parseFloat(producto.costo).toFixed(2)}</td>
              <td>${parseFloat(producto.subtotal).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Subtotal: ${subtotal.toFixed(2)}</h3>
      <h3>Descuento: ${descuentoTotal.toFixed(2)}</h3>
      <h3>IVA: ${iva.toFixed(2)}</h3>
      <h3>Total: ${total.toFixed(2)}</h3>
      <div className="modal-buttons">
          <button onClick={cerrarPrevia} className='eliminarBtnModal'>Cerrar</button>
          <button>Enviar por Correo</button>
          <button>Descargar</button>
        </div>
    </div>
  );
}

export default PreviaCotizacion;
