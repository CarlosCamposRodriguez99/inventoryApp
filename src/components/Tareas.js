import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import SearchBar from './SearchBar';
import Notificaciones from './Notificaciones';
import FileUpload from './FileUpload';
import moment from 'moment';
import Swal from 'sweetalert2';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';

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
  const [priority, setPriority] = useState('Baja');
  const [proximasAVencer, setProximasAVencer] = useState([]);
  const [comment, setComment] = useState('');
  const [newAttachment, setNewAttachment] = useState(null);
  const [editCommentIndex, setEditCommentIndex] = useState(-1);
  const [editedComment, setEditedComment] = useState('');
  const editCommentRef = useRef(null);
  const [isAttachModalOpen, setAttachModalOpen] = useState(false);
  const [commentDates, setCommentDates] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isNewListModalOpen, setNewListModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [lists, setLists] = useState([]);

  const openNewListModal = () => {
    setNewListModalOpen(true);
  };

  const closeNewListModal = () => {
    setNewListModalOpen(false);
    setNewListName('');
  };

  const handleAddNewList = async () => {
    if (newListName.trim() !== '') {
      const newLists = [...lists, newListName.trim()];
  
      try {
        const db = getFirestore();
        const listsDocRef = doc(db, 'config', 'lists');
  
        // Verifica si el documento existe
        const docSnapshot = await getDoc(listsDocRef);
        if (docSnapshot.exists()) {
          // Actualiza el documento si existe
          await updateDoc(listsDocRef, { lists: newLists });
        } else {
          // Crea el documento si no existe
          await setDoc(listsDocRef, { lists: newLists });
        }
  
        setLists(newLists);
        closeNewListModal();
      } catch (error) {
        console.error("Error al guardar la nueva lista en Firebase:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al guardar la nueva lista. Por favor, inténtalo de nuevo.',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre de la lista no puede estar vacío.',
      });
    }
  };
  
  useEffect(() => {
    const db = getFirestore();
    const listsDocRef = doc(db, 'config', 'lists');

    const unsubscribe = onSnapshot(listsDocRef, (doc) => {
      if (doc.exists()) {
        setLists(doc.data().lists || []);
      } else {
        setLists(['en-proceso', 'revision', 'completado']);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    moment(task.date).format('DD-MM-YY').includes(searchTerm.toLowerCase()) ||
    task.user.toLowerCase().includes(searchTerm.toLowerCase())
    
  );

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDeleteAttachment = async (taskId, fileId) => {
    try {
      const firestore = getFirestore();
      const tareaRef = doc(firestore, 'tareas', taskId);
      const task = tasks.find(t => t.id === taskId);

      if (!task) {
        console.error('Task not found');
        return;
      }

      const updatedAttachments = task.attachments.filter(attachment => attachment.id !== fileId);

      await updateDoc(tareaRef, { attachments: updatedAttachments });

      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === taskId ? { ...t, attachments: updatedAttachments } : t
        )
      );
    } catch (error) {
      console.error('Error deleting attachment:', error);
    }
  };
  
  const openAttachModal = (task) => {
    setSelectedTask(task);
    setAttachModalOpen(true);
  };
  // Función para cerrar el modal de adjuntos
  const closeAttachModal = () => {
    setAttachModalOpen(false);
    setSelectedTask(null);
  };

  const handleUpload = async (taskId, files) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, attachments: [...task.attachments, ...files] };
      }
      return task;
    });

    setTasks(updatedTasks);
    
    try {
      const firestore = getFirestore();
      const taskRef = doc(firestore, 'tareas', taskId);
      await updateDoc(taskRef, {
        attachments: updatedTasks.find(task => task.id === taskId).attachments
      });
    } catch (error) {
      console.error('Error al actualizar los archivos adjuntos:', error);
    }
  };

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
          setIsLoading(false);
          // Guardar las fechas y horas de los comentarios en el estado
          const commentDatesMap = {};
          tareas.forEach(task => {
            task.comments.forEach((comment, index) => {
              if (!commentDatesMap[task.id]) {
                commentDatesMap[task.id] = {};
              }
              commentDatesMap[task.id][index] = moment(comment.timestamp).format('DD/MM/YYYY HH:mm');
            });
          });
          setCommentDates(commentDatesMap);
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
    setPriority('Baja');
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedTask(null);
    setComment('');
    setNewAttachment(null);
  };

  const handleAddTask = async () => {
    const newTask = { title, date, user, priority, status: 'en-proceso', comments: [], attachments: [] };
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

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
  
    const { source, destination } = result;
  
    if (source.droppableId !== destination.droppableId) {
      const updatedTasks = tasks.map(task => {
        if (task.id === result.draggableId) {
          return { ...task, status: destination.droppableId };
        }
        return task;
      });
  
      setTasks(updatedTasks);
      
      try {
        const firestore = getFirestore();
        const taskRef = doc(firestore, 'tareas', result.draggableId);
        await updateDoc(taskRef, { status: destination.droppableId });
      } catch (error) {
        console.error('Error al actualizar la tarea en la base de datos:', error);
      }
    } else {
      // Si la tarea se mueve dentro del mismo contenedor, actualizamos el orden de las tareas.
      const updatedTasks = Array.from(tasks);
      const [reorderedItem] = updatedTasks.splice(source.index, 1);
      updatedTasks.splice(destination.index, 0, reorderedItem);
      
      setTasks(updatedTasks);
      
      // Puedes hacer aquí cualquier otra actualización necesaria para reflejar el nuevo orden en la base de datos.
    }
  
    setIsDragging(false);
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
  
    // Crear un objeto de comentario con el texto y la fecha y hora actual
    const newComment = {
      text: comment,
      timestamp: new Date().toISOString() // Usar la fecha y hora actual en formato ISO
    };
  
    // Crear una copia de los comentarios existentes y agregar el nuevo comentario
    const updatedComments = [...selectedTask.comments, newComment];
  
    // Crear una copia de los adjuntos existentes
    const updatedAttachments = [...selectedTask.attachments];
  
    // Si hay un nuevo adjunto, agregarlo a la lista de adjuntos actualizada
    if (newAttachment) {
      const attachmentURL = URL.createObjectURL(newAttachment);
      updatedAttachments.push({ name: newAttachment.name, url: attachmentURL });
    }
  
    // Crear una copia de la tarea actualizada con los comentarios y adjuntos actualizados
    const updatedTask = {
      ...selectedTask,
      comments: updatedComments,
      attachments: updatedAttachments
    };
  
    try {
      // Actualizar la tarea en la base de datos
      const firestore = getFirestore();
      const taskRef = doc(firestore, 'tareas', selectedTask.id);
      await updateDoc(taskRef, { comments: updatedComments, attachments: updatedAttachments });
  
      // Actualizar la lista de tareas en el estado local
      setTasks(tasks.map(task => task.id === selectedTask.id ? updatedTask : task));
  
      // Cerrar el modal de detalles y mostrar una notificación de éxito
      closeDetailModal();
      Swal.fire({
        icon: 'success',
        title: 'Comentario agregado',
        text: 'El comentario se ha agregado correctamente.',
        timer: 1000,
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
    updatedComments[index].text = editedComment; // Actualiza el texto del comentario
    updatedComments[index].timestamp = new Date().toISOString(); // Actualiza la marca de tiempo
  
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
    setEditedComment(selectedTask.comments[index].text);
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

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const getGradientColors = (status) => {
    switch (status) {
      case 'en-proceso':
        return '#ff9985, #ffb74e';
      case 'revision':
        return '#9ea7fc, #6eb4f7';
      case 'completado':
        return '#81d5ee, #7ed492';
      default:
        return '#ee8199, #d47ec4'; // Color por defecto para nuevas listas
    }
  };

  return (
    <>
      <section className="kanban__main">
        <Notificaciones proximasAVencer={proximasAVencer} />
        <SearchBar handleSearch={handleSearch} />
       
        <div className="kanban__main-wrapper">      
          <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            {lists.map((status, index) => {
              const statusCapitalized = status === 'revision' ? 'Revisión' : status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ');

              const backgroundStyle = {
              backgroundImage: `linear-gradient(#f6f8fc, #f6f8fc), radial-gradient(circle at top left, ${getGradientColors(status)})`,
            };

              return (
                <Droppable key={index} droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`${status.replace(/ /g, '-')}-color card-wrapper ${isDragging ? 'dragging' : ''}`}
                      style={{ border: snapshot.isDraggingOver ? '2px dashed #e9e9e9' : '', ...backgroundStyle, }}
                    >
                      <div className="card-wrapper__header">
                        <div className="backlog-name">{statusCapitalized}</div>
                        <div className="backlog-dots">
                          <i className='iconoTarea'>⌵</i>
                        </div>
                      </div>
                      {!isLoading && filteredTasks.length === 0 ? (
                        <p>No hay búsquedas disponibles</p>
                      ) : (
                        filteredTasks
                          .filter(task => task.status === status)
                          .map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="card"
                                style={{
                                  ...provided.draggableProps.style,
                                  backgroundColor: snapshot.isDragging ? '#f4f4f4' : '#fff'
                                }}
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
                                    <div className="attach-wrapper" onClick={() => openAttachModal(task)}>
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
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                      <div className="card-wrapper__footer">
                        <div className="add-task" onClick={openModal}>Add task</div>
                        <div className="add-task-ico">
                          <i className="iconoTarea">+</i>
                        </div>
                      </div>
                    </div>
                  )}
                </Droppable>
              );
            })}
          </DragDropContext>
        </div>

        <div>
            <button style={{
              fontFamily: "Gilroy, sans-serif",
              border: "2px dashed #cecece",
              borderRadius: "6px",
              padding: "15px 50px",
              fontSize: "16px",
              fontWeight: "normal",
            }} onClick={openNewListModal}>+ Add New List</button>
          </div>

          <Modal
            isOpen={isNewListModalOpen}
            onRequestClose={closeNewListModal}
            style={customStyles}
          >
            <h2>Crear Nueva Lista</h2>
            <input 
              type="text" 
              value={newListName} 
              onChange={(e) => setNewListName(e.target.value)} 
              style={customStyles.input} 
              placeholder="Nombre de la lista" 
            />
            <button onClick={handleAddNewList} style={customStyles.button}>Crear</button>
            <button onClick={closeNewListModal} style={customStyles.button}>Cancelar</button>
          </Modal>
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
                  {moment(selectedTask.date).format('DD-MM-YY')}
                </div>
              </div>
            </div>
            <div className="comments-container">
              <h4 style={{ fontFamily: 'Montserrat, sans-serif' }}>Comentarios:</h4>
              {selectedTask.comments?.length > 0 ? (selectedTask.comments.map((comment, index) => (
              <div key={index} className="comment">
                <div className="user">
                  <img src="/img/avatar.jpg" alt="Avatar" />
                  <div className="name">{selectedTask.user}</div>
                  <div className="time">
                    {commentDates[selectedTask.id] && commentDates[selectedTask.id][index]}
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
                    {comment.text}
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

      {selectedTask && (
        <FileUpload taskId={selectedTask.id} onUpload={handleUpload} onDeleteAttachment={handleDeleteAttachment} />
      )}

    </Modal>

    </>
  );
};

export default Tareas;