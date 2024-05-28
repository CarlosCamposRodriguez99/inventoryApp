import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ProgressBar from 'react-progress-bar-plus';

function FileUpload() {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => {
      setFiles([...files, ...acceptedFiles]);
    },
  });

  const handleUpload = async (file) => {
    setUploadProgress({ [file.name]: 0 }); // Inicializa el progreso

    try {
      // Simulamos la carga del archivo con un temporizador
      const uploadTask = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });

      uploadTask.then(() => {
        // La carga se completó exitosamente
        setUploadProgress({ [file.name]: 100 });
      });

    } catch (error) {
      console.error('Error uploading:', error);
    }
  };

  return (
    <div className="file-upload">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>

      <ul className="uploaded-files">
        {files.map((file) => (
          <li key={file.name}>
            <div>
              {file.type.startsWith('image/') && (
                <img src={URL.createObjectURL(file)} alt={file.name} />
              )}
              {file.type !== 'image/' && (
                <div className="file-icon">{/* Display appropriate icon */}</div>
              )}
              <span>{file.name}</span>
              {uploadProgress[file.name] !== undefined && (
                <ProgressBar completed={uploadProgress[file.name]} />
              )}
            </div>
            <button onClick={() => handleUpload(file)}>Upload</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileUpload;
