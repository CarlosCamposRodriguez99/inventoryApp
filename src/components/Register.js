import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { auth, db, collection, addDoc, query, where, getDocs, updateDoc } from '../firebaseConfig';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
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

    // Validación básica de campos
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Todos los campos son obligatorios',
      });
      return;
    }

    // Verificación de longitud de contraseña
    if (password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'La contraseña debe tener al menos 6 caracteres',
      });
      return;
    }

    // Verificación de coincidencia de contraseñas
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Las contraseñas no coinciden',
      });
      return;
    }

    try {
      // Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Extracción del primer nombre y primer apellido
      const firstNameOnly = firstName.trim().split(' ')[0];
      const lastNameOnly = lastName.trim().split(' ')[0];

      // Construcción del displayName
      const displayName = `${firstNameOnly} ${lastNameOnly}`;

      // Actualizar el perfil del usuario con el displayName
      await updateProfile(userCredential.user, { displayName });

      // Enviar correo de verificación
      await sendEmailVerification(auth.currentUser);

      // Verificar si el usuario ya existe en Firestore
      const userQuery = query(collection(db, 'usuarios'), where('email', '==', email));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(userDoc.ref, { registrado: true });
        console.log('Usuario actualizado en Firestore con ID: ', userDoc.id);
      } else {
        await addDoc(collection(db, 'usuarios'), { email, registrado: true });
      }

      // Mostrar mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Usuario registrado!',
        text: 'Se ha enviado un correo de verificación.',
      });

      // Setear el usuario en el contexto de autenticación
      setUser(userCredential.user);

      // Redirigir a la página principal
      navigate('/');
    } catch (error) {
      console.error('Error registrando usuario:', error);
      // Manejo de errores, mostrar mensaje al usuario, etc.
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un error al registrar el usuario. Por favor, inténtalo nuevamente.',
      });
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h1>Regístrate</h1>
        <p style={{ color: '#555' }}>Completa los siguientes campos para crear tu cuenta.</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Nombre(s)"
              style={{ marginRight: '10px', width: 'calc(50% - 5px)' }}
              required
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Apellido(s)"
              style={{ width: 'calc(50% - 5px)' }}
              required
            />
          </div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repetir Contraseña"
            required
          />
          <button style={{ borderRadius: '30px', marginTop: '10px' }} type="submit">
            Continuar
          </button>
        </form>
        <div className="register-containerLogin">
          <p style={{ display: 'inline-block', marginRight: '5px' }}>¿Ya tienes una cuenta?</p>
          <span onClick={() => navigate('/login')} className="register-link">
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
