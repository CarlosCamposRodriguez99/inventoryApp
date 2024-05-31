import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Campos obligatorios',
        text: 'Por favor, complete todos los campos.',
      });
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/tareas');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el inicio de sesión',
        text: "Las credenciales son incorrectas",
      });
    }
  };

  const handleRegister = () => {
    navigate('/registro'); // Redirige al usuario al componente de registro
  };

  return (
    <div className='contenedor'>
      <div className="login-container">
        <div className="login-form">
          <div className="logo-container">
            <img src="/img/logo-iciamex.png" alt="Logotipo" className="logo-login" />
          </div>
          <h1>¡Bienvenido!</h1>
          <p className="login-description">Ingrese su correo electrónico y contraseña para iniciar sesión en esta aplicación</p>
          <form onSubmit={handleLogin}>
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
          <div className='containerLoginBottom'>
            <p>¿No tienes una cuenta? <button onClick={handleRegister} className="loginBoton">Regístrate</button></p>
          </div>
        </div>
        <div className="login-background"></div>
      </div>
    </div>
  );
};

export default Login;
