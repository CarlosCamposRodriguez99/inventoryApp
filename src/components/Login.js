// src/components/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/tareas');
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
      <div className="logo-container">
          <img src="/img/logo-iciamex.png" alt="Logotipo" className="logo" />
        </div>
        <h1>¡Bienvenido!</h1>
        <p className="login-description">Ingrese su correo electrónico y contraseña para registrarse en esta aplicación</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email"></label>
            <div className="input-container">
              <img src="/img/user.svg" alt="Email Icon" className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo Electrónico"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password"></label>
            <div className="input-container">
              <img src="/img/password.svg" alt="Password Icon" className="input-icon" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
              />
            </div>
          </div>
          <div className="login-button-container">
            <button type="submit" className="login-button">Iniciar Sesión</button>
          </div>
        </form>
      </div>
      <div className="login-background"></div>
    </div>
  );
};

export default Login;
