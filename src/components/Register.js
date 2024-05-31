import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendSignInLinkToEmail, updateProfile } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    try {
      // Enviar enlace de inicio de sesión por correo electrónico
      await sendSignInLinkToEmail(auth, email, {
        url: 'http://localhost:3000', // URL temporal para entorno de desarrollo local
        handleCodeInApp: true,
      });
      // Redireccionar al usuario a la página de tareas después del registro exitoso
      navigate('/tareas');
    } catch (error) {
      console.error("Error sending email verification:", error);
    }
  };
  

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h1>Regístrate</h1>
        <p style={{color: "#555"}}>Completa los siguientes campos para crear tu cuenta.</p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nombre(s)"
              style={{ marginRight: '10px' }}
            />
            <input
              type="text"
              placeholder="Apellido(s)"
            />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repetir Contraseña"
          />
          <button type="submit">Continuar</button>
        </form>
        <div className='register-containerLogin'>
          <p style={{ display: 'inline-block', marginRight: '5px' }}>¿Ya tienes una cuenta?</p>
          <span onClick={handleLogin} className="register-link">Login</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
