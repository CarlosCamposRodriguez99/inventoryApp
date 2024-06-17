import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from './AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Extracción del primer nombre y primer apellido
      const firstNameOnly = firstName.trim().split(' ')[0];
      const lastNameOnly = lastName.trim().split(' ')[0];

      // Construcción del displayName
      const displayName = `${firstNameOnly} ${lastNameOnly}`;

      await updateProfile(userCredential.user, { displayName });
      await sendEmailVerification(userCredential.user);
      setUser(userCredential.user);
      navigate('/');
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

  return (
    <div className="register-container">
      <div className="register-form">
        <h1>Regístrate</h1>
        <p style={{ color: "#555" }}>Completa los siguientes campos para crear tu cuenta.</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Nombre(s)"
              style={{ marginRight: '10px', width: 'calc(50% - 5px)' }}
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Apellido(s)"
              style={{ width: 'calc(50% - 5px)' }}
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
          <button style={{ borderRadius: "30px", marginTop: "10px" }} type="submit">Continuar</button>
        </form>
        <div className='register-containerLogin'>
          <p style={{ display: 'inline-block', marginRight: '5px' }}>¿Ya tienes una cuenta?</p>
          <span onClick={() => navigate('/login')} className="register-link">Login</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
