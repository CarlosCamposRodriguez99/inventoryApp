import React, { useState } from 'react';
import CotizacionForm from './CotizacionForm'; // Importa el componente CotizacionForm
import PreviaCotizacion from './PreviaCotizacion';
import { db } from '../firebaseConfig'; // Importa tu instancia de Firestore
import { updateDoc, doc } from 'firebase/firestore';

const EditarCotizacionForm = ({ cotizacion, clientes, productos, setCotizacion }) => {
  const [mostrarPrevia, setMostrarPrevia] = useState(false); // Define mostrarPrevia y su setter
  

  // Función para guardar los cambios
  const guardarCotizacion = async (nuevosDatos) => {
    try {
      const cotizacionRef = doc(db, 'cotizaciones', cotizacion.id);
      await updateDoc(cotizacionRef, nuevosDatos);
      console.log('Cotización actualizada:', nuevosDatos);
  
      // Actualiza el estado local con los nuevos datos
      setCotizacion({ ...cotizacion, ...nuevosDatos });
  
      // Si necesitas realizar alguna acción adicional después de guardar, aquí es el lugar adecuado
    } catch (error) {
      console.error('Error al guardar la cotización:', error);
      // Maneja el error según sea necesario
    }
  };

  return (
    <div className="editar-cotizacion-form">
      {/* Agrega el componente CotizacionForm aquí y pasa las props necesarias */}
      <CotizacionForm
        cotizacion={cotizacion}
        clientes={clientes}
        productos={productos}
        guardarCotizacion={guardarCotizacion} // Pasa la función guardarCotizacion como prop
        mostrarPrevia={mostrarPrevia} // Pasar mostrarPrevia como prop
        setMostrarPrevia={setMostrarPrevia} // Pasar el setter de mostrarPrevia como prop
      />
      {/* Agrega el componente PreviaCotizacion aquí */}
      {mostrarPrevia && (
        <PreviaCotizacion
          cotizacion={cotizacion}
          clientes={clientes}
          productos={productos}
          continuarDesdePrevia={() => setMostrarPrevia(false)}
        />
      )}
    </div>
  );
};

export default EditarCotizacionForm;
