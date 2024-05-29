import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useDropzone } from 'react-dropzone';

// Configuración de Firebase
const firestore = getFirestore();
const storage = getStorage();

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInfo, setFileInfo] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  // Cargar archivos existentes al iniciar el componente
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'files'));
        const files = [];
        querySnapshot.forEach((doc) => {
          files.push({ id: doc.id, ...doc.data() });
        });
        setFileInfo(files);
      } catch (error) {
        console.error('Error al cargar archivos:', error);
      }
    };

    loadFiles();
  }, []);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    // Verificar si el tamaño del archivo es menor o igual a 5MB (5 * 1024 * 1024 bytes)
    if (file && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file);
      handleUpload(); // Llamar a handleUpload después de asignar el archivo seleccionado
    } else {
      setError('El archivo excede el tamaño máximo permitido (5MB)');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      // Subir archivo a Firebase Storage
      const fileURL = await uploadFileToStorage(selectedFile);
      const fileName = selectedFile.name;

      // Guardar la información del archivo en Firestore
      const docRef = await addDoc(collection(firestore, 'files'), {
        url: fileURL,
        name: fileName,
        createdAt: serverTimestamp()
      });

      // Actualizar el estado con el nuevo archivo
      setFileInfo([...fileInfo, { id: docRef.id, url: fileURL, name: fileName }]);

      setUploading(false);
      setProgress(0); // Restablecer el progreso después de cargar el archivo
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setError('Error al subir el archivo. Inténtelo de nuevo.');
      setUploading(false);
      setProgress(0); // Restablecer el progreso en caso de error
    }
  };

  const uploadFileToStorage = async (file) => {
    const storageRef = ref(storage, 'carpeta_en_tu_bucket/' + file.name);
  
    try {
      // Subir el archivo a Firebase Storage con seguimiento de progreso
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Manejar el evento de estado cambiado para obtener el progreso
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Calcular el progreso y actualizar el estado
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          // Manejar errores durante la carga
          console.error('Error al subir el archivo:', error);
          throw new Error('Error al subir el archivo: ' + error.message); // Lanzar el error con un mensaje más detallado
        },
        () => {
          // Manejar la carga completada
          console.log('Carga completada');
        }
      );

      // Esperar a que se complete la carga
      await uploadTask;

      // Obtener la URL de descarga del archivo
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Archivo subido:', downloadURL);
      return downloadURL;

    } catch (error) {
      console.error('Error al subir el archivo:', error);
      throw new Error('Error al subir el archivo: ' + error.message); // Lanzar el error con un mensaje más detallado
    }
  };

  const handleDownload = async (fileURL, fileName) => {
    try {
      // Descargar el archivo
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', fileName);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      setError('Error al descargar el archivo. Inténtelo de nuevo.');
    }
  };

  const handleDelete = async (fileId) => {
    try {
      // Eliminar el archivo de Firestore
      await deleteDoc(doc(firestore, 'files', fileId));

      // Actualizar el estado para reflejar los cambios
      const updatedFiles = fileInfo.filter((file) => file.id !== fileId);
      setFileInfo(updatedFiles);
    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
      setError('Error al eliminar el archivo. Inténtelo de nuevo.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h4 style={{fontWeight: "400", color: "#757575"}}>Cargar un archivo</h4>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Suelta el archivo aquí...</p>
        ) : (
          <>
            <p>Arrastra y suelta un archivo aquí, o haz clic para seleccionar un archivo</p>
            <p style={{color: "#007bff"}}>(Max. File size: 5MB)</p>
          </>
        )}
      </div>
      {selectedFile && (
        <div>
          <div className="file-name">
            <p>Archivo seleccionado: {selectedFile.name}</p>
            <button onClick={handleUpload} disabled={uploading}>{uploading ? 'Cargando...' : 'Cargar'}</button>
          </div>
        </div>
      )}
      <div className="progress-container">
        <progress value={progress} max="100" />
        <span style={{ marginLeft: "10px" }}>{`${Math.round(progress)}%`}</span>
      </div>
      {fileInfo.map((file) => (
      <div key={file.id} className="file-info">
        <div className="file-container">
          <div className="file-image">
            <img src="/img/file.svg" alt="Archivo Subido" />
          </div>
          <div className="file-content">
            <div className="file-comment">
              <p>Archivo: {file.name}</p>
            </div>
            <div className="file-actions">
              <button onClick={() => handleDownload(file.url, file.name)}>Descargar</button>
              <button onClick={() => handleDelete(file.id)}>Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    ))}

      {error && <p>{error}</p>}
    </div>
  );
}

export default FileUpload;
