import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Swal from 'sweetalert2';

const ListaProveedores = () => {
    const [formData, setFormData] = useState({
        empresa: '',
        rfc: '',
        regimenFiscal: '',
        moneda: '',
        telefono: '',
        correo: '',
        imagenURL: null, // Cambiar el valor inicial a null
        domicilio: '',
        numeroExt: '',
        numeroInt: '',
        colonia: '',
        codigoPostal: '',
        ciudad: '',
        estado: ''
    });

    const [step, setStep] = useState(1); // Estado para controlar el paso del formulario

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 1) {
            // Validar que el campo "Nombre de la Empresa" no esté vacío
            if (formData.empresa.trim() === '') {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'El campo "Nombre de la Empresa" es obligatorio!'
                });
                return; // Detener el envío del formulario
            }
            // Avanzar al segundo paso
            setStep(2);
        } else {
            // Enviar los datos a Firebase
            try {
                const proveedorData = { ...formData };
                await addDoc(collection(db, 'proveedores'), proveedorData);
                Swal.fire({
                    icon: 'success',
                    title: '¡Proveedor registrado con éxito!',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    // Reiniciar el formulario después de enviar los datos
                    setFormData({
                        empresa: '',
                        rfc: '',
                        regimenFiscal: '',
                        moneda: '',
                        telefono: '',
                        correo: '',
                        imagenURL: null,
                        domicilio: '',
                        numeroExt: '',
                        numeroInt: '',
                        colonia: '',
                        codigoPostal: '',
                        ciudad: '',
                        estado: ''
                    });
                    // Volver al primer paso
                    setStep(1);
                });
            } catch (error) {
                console.error("Error al agregar proveedor: ", error);
            }
        }
    };
    
    return (
        <div>
        <h1>Lista de Proveedores</h1>
            {step === 1 && (
                <form onSubmit={handleSubmit} className="client-form">
                    <input type="text" name="empresa" placeholder="Nombre de la Empresa" value={formData.empresa} onChange={handleChange} />
                    <input type="text" name="rfc" placeholder="RFC" value={formData.rfc} onChange={handleChange} />
                    <input type="text" name="regimenFiscal" placeholder="Régimen Fiscal" value={formData.regimenFiscal} onChange={handleChange} />
                    <input type="text" name="moneda" placeholder="Moneda" value={formData.moneda} onChange={handleChange} />
                    <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
                    <input type="email" name="correo" placeholder="Correo Electrónico" value={formData.correo} onChange={handleChange} />
                    <input type="file" name="imagen" onChange={handleChange} />
                    <button type="submit">Siguiente</button>
                </form>
            )}
            {step === 2 && (
                <form onSubmit={handleSubmit} className="client-form">
                    <input type="text" name="domicilio" placeholder="Domicilio" value={formData.domicilio} onChange={handleChange} />
                    <input type="text" name="numeroExt" placeholder="No. Ext" value={formData.numeroExt} onChange={handleChange} />
                    <input type="text" name="numeroInt" placeholder="No. Int" value={formData.numeroInt} onChange={handleChange} />
                    <input type="text" name="colonia" placeholder="Colonia" value={formData.colonia} onChange={handleChange} />
                    <input type="text" name="codigoPostal" placeholder="C.P." value={formData.codigoPostal} onChange={handleChange} />
                    <input type="text" name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} />
                    <input type="text" name="estado" placeholder="Estado" value={formData.estado} onChange={handleChange} />
                    <button type="submit">Agregar Cliente</button>
                </form>
            )}
        </div>
    );
};

export default ListaProveedores;
