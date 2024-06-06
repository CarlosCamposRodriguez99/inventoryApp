import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  section: {
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    fontSize: 12,
    borderColor: '#000',
    padding: 5,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  logo: {
    width: 100,
    marginRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  details: {
    fontSize: 14,
    marginBottom: 5,
  },
});

function PreviaOrden({ orden, numeroOrden, proveedores, cerrarPrevia }) {

  const { asunto, fechaOrden, productosSeleccionados } = orden;

  // Buscamos el cliente correspondiente en la lista de clientes
  const proveedorEncontrado = proveedores.find(proveedor => proveedor.id === orden.proveedor);

  // Verificamos si se encontró el cliente
  const nombreProveedor = proveedorEncontrado ? proveedorEncontrado.empresa : 'Proveedor no encontrado';

  // Calcular subtotal
  const subtotal = productosSeleccionados.reduce((acc, producto) => acc + parseFloat(producto.subtotal), 0);

  // Calcular descuento total (suponiendo que hay un descuento en cada producto)
  const descuentoTotal = productosSeleccionados.reduce((acc, producto) => acc + (producto.descuento ? parseFloat(producto.descuento) : 0), 0);

  // Calcular IVA
  const iva = subtotal * 0.16; // Suponiendo que el IVA es del 16%

  // Calcular total
  const total = subtotal - descuentoTotal + iva;

  const generatePDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.logoContainer}>
            <Image src="/img/logo-iciamex.png" style={styles.logo} />
            <Text style={styles.title}>Orden de Compra</Text>
          </View>
          <Text style={styles.title}>Previa de la Orden</Text>
          <Text style={styles.details}>Orden: {numeroOrden?.toString().padStart(4, '0')}</Text>
          <Text style={styles.details}>Fecha de orden: {fechaOrden}</Text>
          <Text style={styles.details}>Asunto: {asunto}</Text>
          <Text style={styles.details}>Proveedor: {nombreProveedor}</Text>
          <Text style={styles.subtitle}>DESCRIPCIÓN</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Cantidad</Text>
              <Text style={styles.tableCell}>ID</Text>
              <Text style={styles.tableCell}>Descripción</Text>
              <Text style={styles.tableCell}>Precio</Text>
              <Text style={styles.tableCell}>Subtotal</Text>
            </View>
            {productosSeleccionados.map((producto) => (
              <View style={styles.tableRow} key={producto.id}>
                <Text style={styles.tableCell}>{producto.cantidad}</Text>
                <Text style={styles.tableCell}>{producto.productoIdEditado}</Text>
                <Text style={styles.tableCell}>{producto.nombre}</Text>
                <Text style={styles.tableCell}>${parseFloat(producto.costo).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
                <Text style={styles.tableCell}>${parseFloat(producto.subtotal).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>

              </View>
            ))}
          </View>
         
          <Text style={styles.text}>Descuento: ${parseFloat(descuentoTotal).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
          <Text style={styles.text}>IVA: ${parseFloat(iva).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
          <Text style={styles.text}>Subtotal: ${parseFloat(subtotal).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
          <Text style={styles.text}>Total: ${parseFloat(total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>

        </View>
      </Page>
    </Document>
  );

  return (
    <div className="previa-cotizacion">
      <div className="cotizacion-header">
          <img src="/img/logo-iciamex.png" alt="ICIAMEX" className="logoCotizacion" />
          <div className="border-right"></div>
          <h1 className="cotizacion-title">Orden de Compra</h1>
      </div>
      <h1>Previa</h1>
      <h2>No. {numeroOrden?.toString().padStart(4, '0')}</h2>
      <hr />
      <p>Fecha de orden: {fechaOrden}</p>
      <p>Asunto: {asunto}</p>
      <p>Proveedor: {nombreProveedor}</p>
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
              <td>${parseFloat(producto.costo).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
              <td>${parseFloat(producto.subtotal).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h3>Subtotal: ${parseFloat(subtotal).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h3>
      <h3>Descuento: ${parseFloat(descuentoTotal).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h3>
      <h3>IVA: ${parseFloat(iva).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h3>
      <h3>Total: ${parseFloat(total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h3>

      <div className="modal-buttons">
        <button onClick={cerrarPrevia} className='eliminarBtnModal'>Cerrar</button>
        <button>Enviar por Correo</button>
        <PDFDownloadLink document={generatePDF()} fileName="previa_orden.pdf">
          {({ loading }) => (loading ? <button disabled>Descargando...</button> : <button>Descargar</button>)}
        </PDFDownloadLink>
      </div>
    </div>
  );
}

export default PreviaOrden;
