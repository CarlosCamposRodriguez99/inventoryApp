import React, { useState, useEffect } from 'react';
import Calendar from 'react-awesome-calendar';
import Modal from 'react-modal';
import moment from 'moment';
import 'moment/locale/es'; // Importamos el idioma español
import { getFirestore, collection, onSnapshot, addDoc, getDocs } from 'firebase/firestore';
import Notificaciones from './Notificaciones';

Modal.setAppElement('#root'); // Ajusta esto según el id del elemento root de tu aplicación

const CalendarioGd = () => {
    const [events, setEvents] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        from: getCurrentDateTime(),
        to: getCurrentDateTime(),
        color: '#229954', // Inicializar el color en verde para los nuevos eventos
    });

    const [proximasAVencer, setProximasAVencer] = useState([]);

    useEffect(() => {
        const fetchCotizaciones = async () => {
            const firestore = getFirestore();
            const cotizacionesRef = collection(firestore, 'cotizaciones');
            const unsubscribe = onSnapshot(cotizacionesRef, (snapshot) => {
                const cotizaciones = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

                // Obtener todas las cotizaciones
                const todasCotizaciones = cotizaciones.map((cotizacion, index) => ({
                    ...cotizacion,
                    fechaVencimiento: moment(cotizacion.fechaVencimiento).toDate(),
                    key: `cotizacion_${cotizacion.id}_${index}`, // Usar un identificador único de la cotización junto con el índice
                }));

                // Filtrar las cotizaciones próximas a vencer
                const proximas = todasCotizaciones.filter(cotizacion => moment(cotizacion.fechaVencimiento) >= moment().startOf('day'));

                // Ordenar las cotizaciones próximas por fecha de vencimiento
                proximas.sort((a, b) => moment(a.fechaVencimiento) - moment(b.fechaVencimiento));

                // Establecer las cotizaciones próximas en el estado
                setProximasAVencer(proximas);

                // Crear los eventos para todas las cotizaciones
                const cotizacionesEvents = todasCotizaciones.map(cotizacion => ({
                    id: cotizacion.id,
                    color: 'blue',
                    from: cotizacion.fechaVencimiento,
                    to: cotizacion.fechaVencimiento,
                    title: `Cotización #${cotizacion.numeroCotizacion}`,
                    key: cotizacion.key,
                }));

                // Fusionar los eventos de cotizaciones con los eventos ya existentes
                setEvents(prevEvents => {
                    const existingEventIds = prevEvents.map(event => event.id);
                    const newCotizacionesEvents = cotizacionesEvents.filter(event => !existingEventIds.includes(event.id));
                    return [...prevEvents, ...newCotizacionesEvents];
                });
            });

            return () => unsubscribe();
        };

        fetchCotizaciones();
    }, []);

    function getCurrentDateTime() {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Ajuste para zona horaria
        return now.toISOString().slice(0, 16); // Formato para input datetime-local
    }

    const openModal = () => {
        const currentDateTime = getCurrentDateTime();
        setNewEvent({ ...newEvent, from: currentDateTime, to: currentDateTime });
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const firestore = getFirestore();
                const eventosRef = collection(firestore, 'eventos');
                const snapshot = await getDocs(eventosRef);
                const eventos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
                // Mapear eventos y asignar solo la fecha de finalización como fecha del evento
                const eventosWithColor = eventos.map((event, index) => ({
                    ...event,
                    color: '#229954',
                    from: event.to, // Asigna la fecha de finalización como fecha del evento
                    to: event.to, // Asigna la fecha de finalización como fecha del evento
                    key: `evento_${event.id}_${index}`, // Usar un identificador único del evento junto con el índice
                }));
    
                // Filtrar y fusionar los eventos ya existentes con los nuevos eventos
                setEvents(prevEvents => {
                    const existingEventIds = prevEvents.map(event => event.id);
                    const newEvents = eventosWithColor.filter(event => !existingEventIds.includes(event.id));
                    return [...prevEvents, ...newEvents];
                });
            } catch (error) {
                console.error('Error al cargar eventos:', error);
            }
        };
    
        fetchEvents();
    }, []);

    

    const handleAddEvent = async () => {
        try {
            // Guardar el nuevo evento en Firestore
            const firestore = getFirestore();
            const eventosRef = collection(firestore, 'eventos');
            const docRef = await addDoc(eventosRef, newEvent);
    
            // Agregar el nuevo evento al estado local con el id generado por Firestore
            const eventWithId = { ...newEvent, id: docRef.id, key: `evento_${docRef.id}`, from: newEvent.to };
            setEvents(prevEvents => [...prevEvents, eventWithId]);
    
            // Cerrar el modal
            closeModal();
        } catch (error) {
            console.error('Error al agregar evento:', error);
        }
    };

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #ccc',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
            fontFamily: 'Montserrat, sans-serif',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        input: {
            width: '100%',
            padding: '8px',
            marginBottom: '20px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
        },
        buttonAgregar: {
            padding: '10px 10px',
            margin: '10px 5px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer',
            position: 'fixed',
            top: '20px',
            left: '80px'
        },
        button : {
            padding: '10px 20px',
            margin: '10px 5px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer',

        },
        buttonCancel: {
            padding: '10px 20px',
            margin: '10px 5px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#6c757d',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer',
        }
    };

    return (
        <div className='calendario-gd'>
            <button onClick={openModal} style={customStyles.buttonAgregar}>Agregar evento</button>
            <Calendar events={events} />
    
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Agregar Evento"
                style={customStyles}
            >
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', textAlign: "center" }}>Agregar nuevo evento</h2>
                <form>
                    <label>
                        Título:
                        <input
                            type="text"
                            name="title"
                            value={newEvent.title}
                            onChange={handleInputChange}
                            required
                            style={customStyles.input}
                        />
                    </label>
                    <br />
                    <label>
                        Fecha y hora de finalización:
                        <input
                            type="datetime-local"
                            name="to"
                            value={newEvent.to}
                            onChange={handleInputChange}
                            required
                            style={customStyles.input}
                        />
                    </label>
                    <br />
                    <div style={{ textAlign: "center" }}>
                        <button type="button" onClick={handleAddEvent} style={customStyles.button}>Agregar</button>
                        <button type="button" onClick={closeModal} style={customStyles.buttonCancel}>Cancelar</button>
                    </div>
                </form>
            </Modal>
    
            <Notificaciones proximasAVencer={proximasAVencer} />
        </div>
    );
};

export default CalendarioGd;
