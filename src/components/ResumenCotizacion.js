import React, { useState, useEffect } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import EditarCotizacionForm from './EditarCotizacionForm';

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

const ResumenCotizacion = ({ 
  cotizacion, 
  isOpen, 
  onClose,
  clientes,
  setCotizaciones,
  cotizaciones
}) => {
  
  const [showOptions, setShowOptions] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showSummary, setShowSummary] = useState(true);

  const handlePrint = () => {
    // Función handlePrint omitida para mayor claridad
  };

  useEffect(() => {
    if (!isOpen && onClose) {
      onClose();
    }
  }, [isOpen, onClose]);

  const generatePDF = () => {
    // Verificamos si la cotización está disponible
    if (!cotizacion) {
      return null;
    }

    // Calcular subtotal, descuento total, IVA y total
    const subtotal = cotizacion.productosSeleccionados.reduce((acc, producto) => acc + parseFloat(producto.subtotal), 0);
    const descuentoTotal = cotizacion.productosSeleccionados.reduce((acc, producto) => acc + (producto.descuento ? parseFloat(producto.descuento) : 0), 0);
    const iva = subtotal * 0.16; // Suponiendo que el IVA es del 16%
    const total = subtotal - descuentoTotal + iva;

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <View style={styles.logoContainer}>
              <Image src="/img/logo-iciamex.png" style={styles.logo} />
              <Text style={styles.title}>Cotización</Text>
            </View>
            <Text style={styles.title}>Previa de Cotización</Text>
            <Text style={styles.details}>Cotización: {cotizacion.numeroCotizacion?.toString().padStart(4, '0')}</Text>
            <Text style={styles.details}>Fecha de cotización: {cotizacion.fechaCotizacion}</Text>
            <Text style={styles.details}>Asunto: {cotizacion.asunto}</Text>
            <Text style={styles.details}>Cliente: {cotizacion.nombreCliente}</Text>
            <Text style={styles.subtitle}>DESCRIPCIÓN</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Cantidad</Text>
                <Text style={styles.tableCell}>ID</Text>
                <Text style={styles.tableCell}>Descripción</Text>
                <Text style={styles.tableCell}>Precio</Text>
                <Text style={styles.tableCell}>Subtotal</Text>
              </View>
              {cotizacion.productosSeleccionados.map((producto) => (
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
  };

  const handleEdit = () => {
    setEditMode(true);
    setShowSummary(false);
  };

  const closeModal = () => {
    setEditMode(false);
    setShowSummary(true); // Mostramos el resumen al cerrar el formulario de edición
    onClose();
  };

  if (editMode) {
    return (
      <EditarCotizacionForm
        cotizacion={cotizacion}
        clientes={clientes}
        productos={cotizacion && cotizacion.productosSeleccionados}
        setCotizaciones={setCotizaciones}
        cotizaciones={cotizaciones}
        onClose={closeModal}
      />
    );
  }

  // Si el resumen debe mostrarse y la cotización y los productos están disponibles
  if (showSummary && cotizacion && cotizacion.productosSeleccionados) {
    const { asunto, fechaCotizacion, productosSeleccionados } = cotizacion;

    // Buscamos el cliente correspondiente en la lista de clientes
    const clienteEncontrado = clientes && clientes.find(cliente => cliente.id === cotizacion.cliente);

    // Verificamos si se encontró el cliente
    const nombreCliente = clienteEncontrado ? clienteEncontrado.empresa : 'Cliente no encontrado';

    // Calcular subtotal, descuento total, IVA y total
    const subtotal = productosSeleccionados.reduce((acc, producto) => acc + parseFloat(producto.subtotal), 0);
    const descuentoTotal = productosSeleccionados.reduce((acc, producto) => acc + (producto.descuento ? parseFloat(producto.descuento) : 0), 0);
    const iva = subtotal * 0.16; // Suponiendo que el IVA es del 16%
    const total = subtotal - descuentoTotal + iva;

    return (
      <div className="resumen-cotizacion-container">
        <button className="cerrar-button" onClick={onClose}>X</button>
        <div className="resumen-cotizacion-actions">
          <div className="dropdown" onMouseEnter={() => setShowOptions(true)} onMouseLeave={() => setShowOptions(false)}>
            <button className="dropbtn">
              <img src="/img/impresion.svg" alt="Imprimir" className="iconResumen" /> Imprimir / PDF
            </button>
            {showOptions && (
              <div className="dropdown-content">
                <button onClick={handlePrint}>Imprimir</button>
                <PDFDownloadLink style={{textDecoration: "none"}} document={generatePDF()} fileName="previa_cotizacion.pdf">
                  {({ loading }) => (loading ? <button disabled>Descargando...</button> : <button>Descargar PDF</button>)}
                </PDFDownloadLink>
              </div>
            )}
          </div>
          <button><img src="/img/correo.svg" alt="Correo" className="iconResumen" /> Correo</button>
          <button onClick={handleEdit}><img src="/img/edit.svg" alt="Editar" className="iconResumen" /> Editar</button>
          <button><img src="/img/factura.svg" alt="Convertir" className="iconResumen" /> Convertir en Factura</button>
        </div>
        <div className="cotizacion-header">
          <img src="/img/logo-iciamex.png" alt="ICIAMEX" className="logoCotizacion" />
          <div className="border-right"></div>
          <h1 className="cotizacion-title">Cotización</h1>
        </div>
        <div className="resumen-cotizacion-content">
          <h2>No. {cotizacion.numeroCotizacion.toString().padStart(4, '0')}</h2>
          <div style={{borderBottom: "2px solid #cecece"}}></div>
          <p>Fecha de Cotización: {fechaCotizacion}</p>
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
        </div>
      </div>
    );
  }

  return null;
};

export default ResumenCotizacion;
