import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import SearchBar from './SearchBar';
import Notificaciones from './Notificaciones';
import moment from 'moment';
import Swal from 'sweetalert2';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    width: "30%",
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    fontFamily: 'Montserrat, sans-serif',
    position: 'relative'
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
    padding: '10px 20px',
    margin: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '14px',
    cursor: 'pointer',
    position: 'absolute',
    top: '10px',
    left: '60px'
  },
  button: {
    padding: '10px 20px',
    margin: '10px 5px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '14px',
    cursor: 'pointer',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  },
  taskItem: {
    position: 'relative',
    padding: '10px',
    borderBottom: '1px solid #ccc',
    marginBottom: '10px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  taskDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  taskOptions: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  select: {
    display: 'none',
    marginTop: '5px',
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Montserrat, sans-serif',
    backgroundColor: '#fff',
    position: 'absolute',
    top: '25px',
    right: '0'
  },
  selectVisible: {
    display: 'block'
  }
};

const Tareas = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [user, setUser] = useState('');
  const [priority, setPriority] = useState('baja');
  const [proximasAVencer, setProximasAVencer] = useState([]);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const firestore = getFirestore();
        const tareasRef = collection(firestore, 'tareas');
  
        const unsubscribe = onSnapshot(tareasRef, (snapshot) => {
          const tareas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setTasks(tareas);
        });
  
        return () => unsubscribe();
      } catch (error) {
        console.error('Error al cargar tareas:', error);
      }
    };
  
    fetchTareas();
  }, []);

  useEffect(() => {
    const fetchCotizaciones = async () => {
      try {
        const firestore = getFirestore();
        const cotizacionesRef = collection(firestore, 'cotizaciones');

        const unsubscribe = onSnapshot(cotizacionesRef, (snapshot) => {
          const cotizaciones = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

          const today = moment();
          const upcomingCotizaciones = cotizaciones.filter(cotizacion => moment(cotizacion.fechaVencimiento).isBefore(today.clone().add(7, 'days')));
          setProximasAVencer(upcomingCotizaciones);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error al cargar cotizaciones:', error);
      }
    };

    fetchCotizaciones();
  }, []);

  const closeModal = () => {
    setModalOpen(false);
    setTitle('');
    setDate(moment().format('YYYY-MM-DD'));
    setUser('');
    setPriority('baja');
  };

  const handleAddTask = async () => {
    const newTask = { title, date, user, priority, status: 'backlog' };
    try {
      const firestore = getFirestore();
      console.time('addDoc');
      const docRef = await addDoc(collection(firestore, 'tareas'), newTask);
      console.timeEnd('addDoc');
      setTasks([...tasks, { id: docRef.id, ...newTask }]);
      closeModal();
      Swal.fire({
        icon: 'success',
        title: 'Tarea agregada',
        text: 'La nueva tarea se ha agregado correctamente.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al agregar tarea:', error);
    }
  };

  const openModal = () => {
    setDate(moment().format('YYYY-MM-DD'));
    setModalOpen(true);
  };

  const getBackgroundColor = (priority) => {
    switch (priority) {
      case 'Baja':
        return 'linear-gradient(90deg, #9ea7fc 17%, #6eb4f7 83%)';
      case 'Media':
        return 'linear-gradient(138.6789deg, #c781ff 17%, #e57373 83%)';
      case 'Alta':
        return 'linear-gradient(138.6789deg, #81d5ee 17%, #7ed492 83%)';
      default:
        return 'linear-gradient(90deg, #9ea7fc 17%, #6eb4f7 83%)';
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, status };
      }
      return task;
    });
    setTasks(updatedTasks); // Actualiza localmente primero para una experiencia de usuario más receptiva
  
    try {
      const firestore = getFirestore();
      const taskRef = doc(firestore, 'tareas', taskId);
      await updateDoc(taskRef, { status }); // Actualiza en la base de datos
    } catch (error) {
      console.error('Error al actualizar la tarea en la base de datos:', error);
      // Maneja el error según tus necesidades
    }
  };

  const handleDeleteTask = async (taskId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const firestore = getFirestore();
          const taskRef = doc(firestore, 'tareas', taskId);
          await deleteDoc(taskRef); // Elimina la tarea de la base de datos
          setTasks(tasks.filter(task => task.id !== taskId)); // Actualiza el estado local
          Swal.fire(
            'Eliminado!',
            'La tarea ha sido eliminada.',
            'success'
          );
        } catch (error) {
          console.error('Error al eliminar la tarea:', error);
          Swal.fire(
            'Error!',
            'Hubo un problema al eliminar la tarea.',
            'error'
          );
        }
      }
    });
  };

  return (
    <>
      <SearchBar />
      <Notificaciones proximasAVencer={proximasAVencer} />
      <section className="kanban__main">
        <div className="kanban__main-wrapper">
          {['backlog', 'en-proceso', 'revision', 'hecho'].map((status, index) => {
            const statusCapitalized = status === 'revision' ? 'Revisión' : status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ');
            return (
              <div 
                key={index}
                className={`${status.replace(/ /g, '-')}-color card-wrapper`} 
                onDragOver={(e) => handleDragOver(e)} 
                onDrop={(e) => handleDrop(e, status)}
              >
                <div className="card-wrapper__header">
                  <div className="backlog-name">{statusCapitalized}</div>
                  <div className="backlog-dots">
                    <i className='iconoTarea'>⌵</i>
                  </div>
                </div>
                <div className="cards">
                  {tasks
                    .filter(task => task.status === status)
                    .map(task => (
                      <div 
                        className="card" 
                        key={task.id} 
                        draggable="true" 
                        onDragStart={(e) => handleDragStart(e, task.id)}
                      >
                        <div className="card__header">
                          <div className="card-container-color" style={{ background: getBackgroundColor(task.priority) }}>
                            <div className="card__header-priority">{task.priority}</div>
                          </div>
                          <div className="card__header-clear" onClick={() => handleDeleteTask(task.id)}><i className="iconoTarea">x</i></div>
                        </div>
                        <div className="card__fecha">{moment(task.date).format('DD-MM-YY')}</div>
                        <br />
                        <div className="card__text">{task.title}</div>
                        <div className="card__menu">
                          <div className="card__menu-left">
                            <div className="comments-wrapper">
                              <div className="comments-ico"><img src='/img/comentario.png' style={{ width: "20px", height: "20px" }} alt='comentario' /></div>
                              <div className="comments-num">1</div>
                            </div>
                            <div className="attach-wrapper">
                              <div className="attach-ico"><img src='/img/adjuntar.png' style={{ width: "20px", height: "20px" }} alt='adjuntar' /></div>
                              <div className="attach-num">2</div>
                            </div>
                          </div>
                          <div className="card__menu-right">
                            <div className="usuario">{task.user}</div>
                            <div className="img-avatar">
                              <img style={{ borderRadius: "50%" }} src="/img/avatar.jpg" alt="Avatar" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="card-wrapper__footer">
                  <div className="add-task" onClick={openModal}>Add task</div>
                  <div className="add-task-ico">
                    <i className="iconoTarea">+</i>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
  
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Agregar Tarea"
        style={customStyles}
      >
        <button style={customStyles.closeButton} onClick={closeModal}>x</button>
        <h2 style={{ textAlign: "center" }}>Agregar Tarea</h2>
        <label>Título:
          <input type="text" style={customStyles.input} placeholder="Agrega un título" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>Fecha:
          <input type="date" style={customStyles.input} value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label>Prioridad:
          <select style={customStyles.input} value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </label>
        <label>Usuario:
          <input type="text" placeholder="Agrega el usuario" style={customStyles.input} value={user} onChange={(e) => setUser(e.target.value)} />
        </label>
        <div style={{ textAlign: "center" }}>
          <button style={customStyles.button} onClick={handleAddTask}>Guardar</button>
        </div>
      </Modal>
    </>
  );
};

export default Tareas;
