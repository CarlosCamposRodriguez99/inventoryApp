import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendSignInLinkToEmail, updateProfile, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!displayName || !email || !password || !confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Todos los campos son obligatorios',
      });
      return;
    }
    if (password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'La contraseña debe tener al menos 6 caracteres',
      });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Las contraseñas no coinciden',
      });
      return;
    }
    try {
      // Crear usuario con correo y contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar el perfil del usuario
      await updateProfile(userCredential.user, {
        displayName: displayName.trim(),
      });
  
      // Enviar enlace de verificación por correo electrónico
      await sendEmailVerification(userCredential.user);
  
      // Redireccionar al usuario a la página de tareas después del registro exitoso
      navigate('/tareas');
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Estas credenciales ya existen. Por favor, intenta con otras.',
        });
      } else {
        console.error("Error registrando usuario:", error);
      }
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