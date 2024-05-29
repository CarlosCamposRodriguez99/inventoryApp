import React from 'react';
import { createRoot } from 'react-dom/client'; // Importa createRoot desde 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { firebaseConfig } from './firebaseConfig';
import { initializeApp } from 'firebase/app';
import App from './App';

// Inicializar Firebase
initializeApp(firebaseConfig);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
