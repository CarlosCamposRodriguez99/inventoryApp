import React, { useState, useEffect, useCallback } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useDropzone } from 'react-dropzone';

// Configuración de Firebase
const firestore = getFirestore();
const storage = getStorage();

const FileUpload = ({ taskId, onUpload }) => {
  const [fileInfo, setFileInfo] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [fileCount, setFileCount] = useState(0);

  // Cargar archivos existentes para la tarea actual al iniciar el componente
  useEffect(() => {
    const loadFiles = async () => {
      try {
        if (taskId) {
          const q = query(collection(firestore, 'files'), where('taskId', '==', taskId));
          const querySnapshot = await getDocs(q);
          const files = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setFileInfo(files);
          setFileCount(files.length);
        }
      } catch (error) {
        console.error('Error al cargar archivos:', error);
      }
    };
  
    loadFiles();
  }, [taskId]);

  const handleUpload = useCallback(async (file) => {
    if (!file) return;

    setUploading(true);

    try {
      // Subir archivo a Firebase Storage
      const fileURL = await uploadFileToStorage(file);
      const fileName = file.name;

      // Guardar la información del archivo en Firestore
      const docRef = await addDoc(collection(firestore, 'files'), {
        url: fileURL,
        name: fileName,
        taskId: taskId,
        createdAt: serverTimestamp()
      });

      // Actualizar el estado con el nuevo archivo
      const newFile = { id: docRef.id, url: fileURL, name: fileName };
      setFileInfo([...fileInfo, newFile]);
      setFileCount(fileInfo.length + 1);

      // Llamar a la función de callback para actualizar los archivos adjuntos de la tarea
      onUpload(taskId, [newFile]);

      setProgress(0);
      setUploading(false);
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setError('Error al subir el archivo. Inténtelo de nuevo.');
      setUploading(false);
      setProgress(0);
    }
  }, [fileInfo, taskId, onUpload]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      handleUpload(file);
    } else {
      setError('El archivo excede el tamaño máximo permitido (5MB)');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const uploadFileToStorage = async (file) => {
    const storageRef = ref(storage, 'carpeta_en_tu_bucket/' + file.name);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error('Error al subir el archivo:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error('Error al obtener la URL de descarga:', error);
            reject(error);
          }
        }
      );
    });
  };

  const handleDownload = (fileURL, fileName) => {
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', fileName);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (fileId) => {
    try {
      await deleteDoc(doc(firestore, 'files', fileId));
      setFileInfo(fileInfo.filter(file => file.id !== fileId));
      setFileCount(fileInfo.length - 1);
    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
      setError('Error al eliminar el archivo. Inténtelo de nuevo.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h4 style={{ fontWeight: "400", color: "#757575" }}>Cargar un archivo</h4>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Suelta el archivo aquí...</p>
        ) : (
          <>
            <p>Arrastra y suelta un archivo aquí, o haz clic para seleccionar un archivo</p>
            <p style={{ color: "#007bff" }}>(Max. File size: 5MB)</p>
          </>
        )}
      </div>
      {uploading && (
        <div className="progress-container">
          <progress value={progress} max="100" />
          <span style={{ marginLeft: "10px" }}>{`${Math.round(progress)}%`}</span>
        </div>
      )}
      {fileCount === 0 && <p>No hay archivos</p>}
      {fileInfo.map((file) => (
        <div key={file.id} className="file-info">
          <div className="file-container">
            <div className="file-image">
              <img src="/img/file.svg" alt="Archivo Subido" />
            </div>
            <div className="file-content">
              <div className="file-comment">
                <p style={{ fontSize: "14px", marginBottom: "20px" }}>Archivo: {file.name}</p>
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
