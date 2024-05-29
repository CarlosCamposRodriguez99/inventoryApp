import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import SearchBar from './SearchBar';
import Notificaciones from './Notificaciones';
import FileUpload from './FileUpload';
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

const customStyles2 = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    maxWidth: '600px',
    maxHeight: '80%',
    overflowY: 'auto',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 10px 50px rgba(0, 0, 0, 0.2)',
    border: 'none',
    background: '#ffffff',
    position: 'relative',
    fontFamily: 'Roboto, sans-serif',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  closeButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#888',
    transition: 'color 0.3s',
  },
  closeButtonHover: {
    color: '#555',
  },
  title: {
    fontSize: '36px',
    marginBottom: '30px',
    fontWeight: 'bold',
    color: '#333',
    borderBottom: '2px solid #ccc',
    paddingBottom: '20px',
  },
  subtitle: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#666',
  },
  comment: {
    fontSize: '20px',
    marginBottom: '20px',
    color: '#777',
  },
  attachmentLink: {
    color: '#007bff',
    textDecoration: 'none',
    marginRight: '15px',
    cursor: 'pointer',
    fontSize: '20px',
    transition: 'color 0.3s',
  },
  attachmentLinkHover: {
    color: '#00468c',
  },
  attachmentImage: {
    maxWidth: '200px',
    maxHeight: '200px',
    marginRight: '15px',
    marginBottom: '15px',
  },
  attachmentsList: {
    listStyleType: 'none',
    padding: '0',
    marginBottom: '20px',
  },
  addButton: {
    padding: '20px 40px',
    borderRadius: '30px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#ffffff',
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: '0 5px 20px rgba(0, 123, 255, 0.3)',
    transition: 'background-color 0.3s, transform 0.2s',
  },
  addButtonHover: {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)',
  },
};

const Tareas = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [user, setUser] = useState('');
  const [priority, setPriority] = useState('baja');
  const [proximasAVencer, setProximasAVencer] = useState([]);
  const [comment, setComment] = useState('');
  const [newAttachment, setNewAttachment] = useState(null);
  const [editCommentIndex, setEditCommentIndex] = useState(-1);
  const [editedComment, setEditedComment] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isAttachModalOpen, setAttachModalOpen] = useState(false);

  const editCommentRef = useRef(null);

  const openAttachModal = () => {
    setAttachModalOpen(true);
  };

  // Función para cerrar el modal de adjuntos
  const closeAttachModal = () => {
    setAttachModalOpen(false);
  };

  const updateTime = () => {
    setCurrentTime(Date.now());
  };

  // Efecto para actualizar el tiempo cada segundo
  useEffect(() => {
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (editCommentIndex !== -1 && editCommentRef.current) {
      editCommentRef.current.focus();
      editCommentRef.current.setSelectionRange(editCommentRef.current.value.length, editCommentRef.current.value.length);
    }
  }, [editCommentIndex]);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const firestore = getFirestore();
        const tareasRef = collection(firestore, 'tareas');
  
        const unsubscribe = onSnapshot(tareasRef, (snapshot) => {
          const tareas = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            comments: doc.data().comments || [],
            attachments: doc.data().attachments || []
          }));
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

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedTask(null);
    setComment('');
    setNewAttachment(null);
  };

  const handleAddTask = async () => {
    const newTask = { title, date, user, priority, status: 'backlog', comments: [], attachments: [] };
    try {
      const firestore = getFirestore();
      const docRef = await addDoc(collection(firestore, 'tareas'), newTask);
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

  const openDetailModal = (task) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
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

  const handleAddComment = async () => {
    if (!selectedTask) return;
    const updatedTask = { ...selectedTask, comments: [...selectedTask.comments, comment] };
    if (newAttachment) {
      const attachmentURL = URL.createObjectURL(newAttachment);
      updatedTask.attachments.push({ name: newAttachment.name, url: attachmentURL });
    }
    try {
      const firestore = getFirestore();
      const taskRef = doc(firestore, 'tareas', selectedTask.id);
      await updateDoc(taskRef, { comments: updatedTask.comments, attachments: updatedTask.attachments });
      setTasks(tasks.map(task => task.id === selectedTask.id ? updatedTask : task));
      closeDetailModal();
      Swal.fire({
        icon: 'success',
        title: 'Comentario agregado',
        text: 'El comentario se ha agregado correctamente.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  const handleSaveEditedComment = async (index) => {
    // Evita editar si no hay tarea seleccionada o si no hay comentarios
    if (!selectedTask || !selectedTask.comments) {
      console.error('Error: selectedTask or comments are undefined.');
      return;
    }
  
    // Crea una copia actualizada de los comentarios
    const updatedComments = [...selectedTask.comments];
    updatedComments[index] = editedComment;
  
    try {
      // Actualiza la base de datos
      const firestore = getFirestore();
      const taskRef = doc(firestore, 'tareas', selectedTask.id);
      await updateDoc(taskRef, { comments: updatedComments });
  
      // Actualiza el estado local y restablece los estados de edición de comentarios
      setSelectedTask({
        ...selectedTask,
        comments: updatedComments
      });
      setEditCommentIndex(-1);
      setEditedComment('');
    } catch (error) {
      console.error('Error al guardar el comentario editado en la base de datos:', error);
      // Manejar el error según sea necesario
    }
  };

  const handleEditCommentToggle = (index) => {
    setEditCommentIndex(index);
    setEditedComment(selectedTask.comments[index]);
  };

  
  const handleDeleteComment = (index) => {
    const updatedComments = [...selectedTask.comments];
    updatedComments.splice(index, 1);
  
    // Actualizar la base de datos
    try {
      const firestore = getFirestore();
      const taskRef = doc(firestore, 'tareas', selectedTask.id);
      updateDoc(taskRef, { comments: updatedComments });
    } catch (error) {
      console.error('Error al eliminar el comentario en la base de datos:', error);
      // Manejar el error según sea necesario
    }
  
    // Actualizar el estado local
    setSelectedTask({
      ...selectedTask,
      comments: updatedComments
    });
  };

  const handleCancelEdit = () => {
    setEditCommentIndex(-1);
    setEditedComment('');
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
                          <div className="card__header-clear" onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}>
                            <i className="iconoTarea">x</i>
                          </div>
                        </div>
                        <div className="card__fecha">{moment(task.date).format('DD-MM-YY')}</div>
                        <br />
                        <div className="card__text">{task.title}</div>
                        <div className="card__menu">
                          <div className="card__menu-left">
                            <div className="comments-wrapper" onClick={() => openDetailModal(task)}>
                              <div className="comments-ico"><img src='/img/comentario.png' style={{ width: "20px", height: "20px" }} alt='comentario' /></div>
                              <div className="comments-num">{task.comments.length}</div>
                            </div>
                            <div className="attach-wrapper" onClick={openAttachModal}>
                              <div className="attach-ico"><img src='/img/adjuntar.png' style={{ width: "20px", height: "20px" }} alt='adjuntar' /></div>
                              <div className="attach-num">{task.attachments.length}</div>
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

      <Modal
        isOpen={isDetailModalOpen}
        onRequestClose={closeDetailModal}
        style={customStyles2}
        contentLabel="Detalles de la Tarea"
      > 
      <div className="modal-header">
        <button className='closeButton' onClick={closeDetailModal}>x</button>
      </div>
      {selectedTask && (
        <div className="task-details">
          <div className="user-comment-container">
            <div className="user">
              <img src="/img/avatar.jpg" alt="Avatar" />
              <div className="user-info">
                <div className="name">{selectedTask.user}</div>
                <div className="time">
                  {moment(comment.timestamp).fromNow()}
                </div>
              </div>
            </div>
            <div className="comments-container">
              <h4 style={{ fontFamily: 'Montserrat, sans-serif' }}>Comentarios:</h4>
              {selectedTask.comments?.length > 0 ? (
              selectedTask.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <div className="user">
                    <img src="/img/avatar.jpg" alt="Avatar" />
                    <div className="name">{selectedTask.user}</div>
                    <div className="time">
                      {moment(comment.timestamp).fromNow()}
                    </div>
                  </div>
                  {editCommentIndex === index ? (
                    <input
                      type="text"
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                      className="custom-input"
                      ref={editCommentRef}
                    />
                  ) : (
                    <div className="comentario">
                      {comment}
                    </div>
                  )}
                  {
                    editCommentIndex === index ? (
                      <div className="comment-buttons-container">
                        <button className="comment-button" onClick={() => handleSaveEditedComment(index)}>Guardar</button>
                        <button className="comment-button" onClick={handleCancelEdit}>Cancelar</button>
                      </div>
                    ) : (
                      <div className="comment-buttons-container">
                        <button className="comment-button" onClick={() => handleEditCommentToggle(index)}>Editar</button>
                        <button className="comment-button" onClick={() => handleDeleteComment(index)}>Eliminar</button>
                      </div>
                    )
                  }
                </div>
              ))
            ) : (
              <p>No hay comentarios.</p>
            )}

              <div className="write-comment">
                <input
                  type="text"
                  placeholder="Haz un comentario..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddComment();
                    }
                  }}
                />
                <button className="send-button" onClick={handleAddComment}>Enviar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>

    <Modal
      isOpen={isAttachModalOpen}
      onRequestClose={closeAttachModal}
      contentLabel="Adjuntos"
      style={customStyles2}
    >
    <div className="modal-header">
        <button className='closeButton' onClick={closeAttachModal}>x</button>
    </div>
      <h2>Sube y Adjunta Archivos</h2>

      <FileUpload />

    </Modal>

    </>
  );
};

export default Tareas;
