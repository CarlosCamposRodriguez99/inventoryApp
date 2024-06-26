import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { collection, getDocs, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Modal from 'react-modal';
import TablaRemisiones from './TablaRemisiones';


// Establece la función de inicialización de react-modal para evitar un aviso de desenfoque de accesibilidad
Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    maxWidth: '800px',
    width: '100%',
    height: "500px",
    maxHeight: '90vh',
    overflow: 'auto',
    fontFamily: 'Roboto, sans-serif', // Aplica la fuente Roboto
  },
  label: {
    display: 'block',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  button: {
    width: '50%', // Centra el botón de agregar
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    justifyContent: 'center',
    margin: "0 auto",
    fontWeight: "700"
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

function RemisionForm(props) {
  const [cliente, setCliente] = useState('');
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [observacion, setObservacion] = useState('');
  const [asunto, setAsunto] = useState('');
  const [fechaRemision] = useState(getCurrentDate());
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [mostrarPrevia, setMostrarPrevia] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [ultimaInteraccion, setUltimaInteraccion] = useState('');
  const [estado, setEstado] = useState('pendiente');
  const { remision } = props;
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    // Si recibimos una cotización para editar, llenamos el formulario con sus datos
    if (remision) {
      setModoEdicion(true);
      // Llenar el formulario con los datos de la cotización
      setCliente(remision.cliente);
      setAsunto(remision.asunto);
      setObservacion(remision.observacion)
      setFechaVencimiento(remision.fechaVencimiento);
      setEstado(remision.estado);
      setProductosSeleccionados(remision.productosSeleccionados);
      // Resto de los campos...
    }
  }, [remision]);


  useEffect(() => {
    // Al cargar la página, intenta obtener la última interacción del almacenamiento local
    const ultimaInteraccionGuardada = localStorage.getItem('ultimaInteraccion');
    if (ultimaInteraccionGuardada) {
      setUltimaInteraccion(ultimaInteraccionGuardada);
    } else {
      actualizarUltimaInteraccion(); // Si no hay ninguna guardada, muestra la hora actual
    }
  }, []);
  

  useEffect(() => {
    obtenerClientes();
    obtenerProductos();
  }, []);

  const abrirModalPrevia = () => {
    setMostrarPrevia(true); 
    setModalIsOpen(true);
    actualizarUltimaInteraccion();
  };

  const cerrarModalPrevia = () => {
    setMostrarPrevia(false);
    setModalIsOpen(false);
  };

  const calcularTotal = () => {
    return productosSeleccionados.reduce((total, producto) => {
      return total + producto.subtotal;
    }, 0);
  };

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

  const continuarDesdePrevia = () => {
    setMostrarTabla(true);
  };

  function getCurrentDate() {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }

  /*function agregarProducto() {
    if (productoSeleccionado) {
      const producto = productos.find(p => p.id === productoSeleccionado);
      if (producto) {
        setProductosSeleccionados([...productosSeleccionados, { ...producto, productoIdEditado: producto.id }]);
        setProductoSeleccionado('');
      }
    }
  }*/

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

  function agregarProductoAutomatico(e) {
    const productoId = e.target.value;
    const producto = productos.find(p => p.id === productoId);
    if (producto) {
      const productoExistente = productosSeleccionados.find(p => p.id === productoId);
      if (productoExistente) {
        const nuevaCantidad = productoExistente.cantidad + 1;
        actualizarCantidad(productoExistente.id, nuevaCantidad);
      } else {
        const subtotal = producto.costo;
        const productoConCantidad = { ...producto, cantidad: 1, subtotal, productoIdEditado: producto.id };
        setProductosSeleccionados([...productosSeleccionados, productoConCantidad]);
        setProductoSeleccionado('');
      }
    }
  }

  // Función para actualizar la última interacción
  const actualizarUltimaInteraccion = () => {
    const ahora = new Date();
    const hora = ahora.getHours();
    const minutos = ahora.getMinutes();
    const periodo = hora >= 12 ? 'p.m.' : 'a.m.';
    const horaFormato12 = hora > 12 ? hora - 12 : hora;
    const horaString = horaFormato12.toString().padStart(2, '0');
    const minutosString = minutos.toString().padStart(2, '0');
    const ultimaInteraccionString = `Hoy a las ${horaString}:${minutosString} ${periodo}`;

    // Guarda la hora en el almacenamiento local
    localStorage.setItem('ultimaInteraccion', ultimaInteraccionString);

    // Actualiza el estado para mostrar la última interacción al usuario
    setUltimaInteraccion(ultimaInteraccionString);
  };


  const actualizarRemisionExistente = async (remisionId, remisionData) => {
    try {
      // Aquí debes realizar la lógica para actualizar la remision existente en tu base de datos
      // Por ejemplo, podrías utilizar Firebase Firestore para actualizar el documento de la remision
  
      // Primero, obtén la referencia al documento de la remision que deseas actualizar
      const remisionRef = doc(db, 'remisiones', remisionId);
  
      // Luego, utiliza la función `updateDoc` para actualizar los datos de la remision
      await updateDoc(remisionRef, remisionData);
  
      // Si la actualización se realiza correctamente, no es necesario hacer nada más
    } catch (error) {
      // Manejo de errores
      console.error('Error al actualizar la remisión:', error);
      throw error; // Puedes lanzar el error para que sea manejado por la función `guardar`
    }
  };


  const guardar = async () => {
    try {
      // Validación de campos obligatorios
      if (!cliente || !asunto || !fechaVencimiento || productosSeleccionados.length === 0) {
        // Muestra una alerta si algún campo obligatorio está vacío
        Swal.fire({
          icon: 'warning',
          title: 'Campos Incompletos',
          text: 'Por favor, complete todos los campos obligatorios.',
          confirmButtonColor: '#007bff',
          confirmButtonText: 'Aceptar'
        });
        return; // Detiene la ejecución de la función si hay campos incompletos
      }
  
      // Si todos los campos están completos, procede con el guardado
      const remisionData = {
        cliente,
        asunto,
        observacion,
        fechaRemision,
        fechaVencimiento,
        estado,
        productosSeleccionados,
        total: calcularTotal(),
        createdAt: serverTimestamp()
      };
  
      if (modoEdicion) {
        // Si estamos en modo de edición, actualiza la cotización existente
        await actualizarRemisionExistente(remision.id, remisionData);
      } else {
        // Si no estamos en modo de edición, guarda una nueva cotización
        await props.guardarRemision(remisionData);
      }
  
      setMostrarPrevia(true);
      actualizarUltimaInteraccion(); // Llama a la función para actualizar la última interacción al guardar
      // Muestra la alerta de éxito
      Swal.fire({
        icon: 'success',
        title: 'Remisión Guardada',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        // Después de mostrar la alerta de éxito, recarga la página
        window.location.reload();
      });
    } catch (error) {
      // Manejo de errores
      console.error('Error al guardar la remisión:', error);
    }
  };
  
  
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
        producto.id === idProducto ? { ...producto, productoIdEditado: nuevoId } : producto
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

  const actualizarPrecio = (idProducto, nuevoPrecio) => {
    setProductosSeleccionados(prevProductos =>
      prevProductos.map(producto =>
        producto.id === idProducto ? { ...producto, costo: parseFloat(nuevoPrecio), subtotal: parseFloat(nuevoPrecio) * producto.cantidad } : producto
      )
    );
  };

  return (
    <div className="cotizacion-form">
      <form>
        <div className="cotizacion-header">
          <img src="/img/logo-iciamex.png" alt="ICIAMEX" className="logoCotizacion" />
          <div className="border-right"></div>
          <h1 className="cotizacion-title">Remisión</h1>
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

          <label htmlFor="fecha-cotizacion">Fecha de remisión:</label>
          <input type="text" id="fecha-cotizacion" name="fecha-cotizacion" value={getCurrentDate()} readOnly /><br />

          <label htmlFor="fecha-vencimiento">Fecha de vencimiento:</label>
          <input type="date" id="fecha-vencimiento" name="fecha-vencimiento" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} /><br />

          <label htmlFor="estado">Estado:</label>
          <select id="estado" name="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="pendiente">Pendiente</option>
            <option value="completado">Completado</option>
          </select><br />

          <label htmlFor="observaciones">Observaciones:</label>
          <textarea type="text" id="observacion" name="observacion" value={observacion} onChange={(e) => setObservacion(e.target.value)}></textarea>

          <label htmlFor="productos">Agregar Producto:</label>
          <select id="productos" name="productos" value={productoSeleccionado} onChange={agregarProductoAutomatico}>
            <option value="">Seleccionar producto</option>
            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre}
              </option>
            ))}
          </select>
          {/*<button type="button" onClick={agregarProducto}>Agregar</button>*/}

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
                      value={producto.productoIdEditado}
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
                    type="text"
                    value={parseFloat(producto.costo).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    onChange={(e) => {
                      actualizarPrecio(producto.id, e.target.value);
                    }}
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
                  <td>${parseFloat(producto.subtotal).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                  <td>
                    <button onClick={() => eliminarProducto(producto.id)}>✘</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{textAlign: "center"}}>
            <p>Guardado por última vez: {ultimaInteraccion}</p>
            <button type="button" onClick={abrirModalPrevia}>Vista Previa</button>
            <button type="button" onClick={guardar}>
              {modoEdicion ? 'Guardar' : 'Guardar Remisión'}
            </button>
          </div>
        </div>
      </form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={cerrarModalPrevia}
        contentLabel="Vista Previa"
        style={customStyles}
      >
        {mostrarPrevia && (
          <PreviaRemision
            cliente={cliente}
            clientes={clientes}
            observacion={observacion}
            asunto={asunto}
            fechaRemision={fechaRemision}
            productosSeleccionados={productosSeleccionados}
            continuarDesdePrevia={continuarDesdePrevia}
            numeroRemision={props.numeroRemision}
          />
        )}
        <div className="modal-buttons">
          <button onClick={cerrarModalPrevia} className='eliminarBtnModal'>Cerrar</button>
        </div>
      </Modal>

      {mostrarTabla && (
        <TablaRemisiones remisiones={props.remisiones} />
      )}
    </div>
  );
}

function PreviaRemision({ observacion, cliente, clientes, asunto, fechaRemision, productosSeleccionados, numeroRemision }) { 
  
    const nombreCliente = clientes.find(c => c.id === cliente)?.empresa || '';
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
          <h1 className="cotizacion-title">Remisión</h1>
      </div>
      <h1>Previa</h1>
      <h2>Remisión: {numeroRemision?.toString().padStart(4, '0')}</h2>
      <hr />
      <p>Fecha de remisión: {fechaRemision}</p>
      <p>Asunto: {asunto}</p>
      <p>Cliente: {nombreCliente}</p>
      <p>Observaciones: {observacion}</p>
      <h3>DESCRIPCIÓN</h3>
      <table className="productos-table">
        <thead>
          <tr>
            <th>Cantidad</th>
            <th>ID</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Descuento</th>
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
              <td>${parseFloat(producto.descuento).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
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
    
  );
}

export default RemisionForm;
