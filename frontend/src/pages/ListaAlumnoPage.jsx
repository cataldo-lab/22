import { useState, useEffect } from "react";
import {
    getListaAlumnos,
    getCalificaciones,
    deleteCalificaciones,
    patchCalificaciones,
    postCalificaciones,
} from "@services/ListaAlumnos.service";
import "@styles/listaAlumnos.css";
import Sidebar from "@components/Sidebar";
import "@styles/home.css";
import Swal from "sweetalert2";
import "@styles/navBar.css"
import "@styles/home.css";
//import NavBar from "@components/NavBar";




function ListaAlumnoPage() {
    
    const [alumnos, setAlumnos] = useState([]);
    const [calificaciones, setCalificaciones] = useState([]);
    const [selectedAlumno, setSelectedAlumno] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [formData, setFormData] = useState({
        rut_alumno: '',
        id_asignatura: '',
        puntaje_alumno: '',
    });
   

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    
    
    const handleEditClick = (nota) => {
        Swal.fire({
            title: "Editar Nota",
            html: `
                <label>Puntaje:</label>
                <input id="swal-input-puntaje" type="number" value="${nota.puntaje_alumno}" />
            `,
            preConfirm: () => {
                const puntaje = document.getElementById("swal-input-puntaje").value;
                if (!puntaje) {
                    Swal.showValidationMessage("El puntaje no puede estar vacío");
                }
                return { puntaje_alumno: parseInt(puntaje, 10) };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const data = result.value; // Cuerpo JSON con el puntaje actualizado
    
                    // Llamada al servicio patchCalificaciones
                    await patchCalificaciones(nota.id_nota, data);
    
                    // Actualizamos el estado local
                    const updatedCalificaciones = calificaciones.map((n) =>
                        n.id_nota === nota.id_nota ? { ...n, puntaje_alumno: data.puntaje_alumno } : n
                    );
                    setCalificaciones(updatedCalificaciones);
    
                    Swal.fire("Nota actualizada con éxito", "", "success");
                    
                } catch (error) {
                    console.error("Error al actualizar la nota:", error);
                    Swal.fire("Error al actualizar la nota", "Por favor, intenta nuevamente.", "error");
                    
                }
            }
        });
    };
    
    
    const handleDeleteClick = async (id_nota) => {
        const { isConfirmed } = await Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás recuperar esta nota",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
    
        if (isConfirmed) {
            try {
                // Llamada al servicio deleteCalificaciones
                await deleteCalificaciones(id_nota);
    
                // Actualizamos el estado local
                const updatedCalificaciones = calificaciones.filter((n) => n.id_nota !== id_nota);
                setCalificaciones(updatedCalificaciones);
    
                Swal.fire("Nota eliminada con éxito", "", "success");
                
            } catch (error) {
                console.error("Error al eliminar la nota:", error);
                Swal.fire("Error al eliminar la nota", "Por favor, intenta nuevamente.", "error");
            }
        }
    };
    
    
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;


        const { isConfirmed } = await Swal.fire({
        title: "Confirma los datos ingresados",
        html: `
            <p><strong>Rut Alumno:</strong> ${formData.rut_alumno}</p>
            <p><strong>Asignatura:</strong> ${formData.id_asignatura}</p>
            <p><strong>Puntaje:</strong> ${formData.puntaje_alumno}</p>
        `,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        customClass: {
            popup: "swal-popup",
            confirmButton: "swal-confirm-btn",
            cancelButton: "swal-cancel-btn",
        },
    });

    if (!isConfirmed) {
        Swal.fire("Envío cancelado", "", "error");
        return;
    }


        try {
            const response = await postCalificaciones(formData);
            console.log('Datos enviados con éxito:', response);
            setFormData({
                rut_alumno: '',
                id_asignatura: '',
                puntaje_alumno: '',
            });
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            alert('Error al enviar los datos de notas');
        }finally
        {
            setIsSubmitting(false);
        }
    };




    useEffect(() => {
        async function fetchAlumnos() {
            setLoading(true);
            try {
                const data = await getListaAlumnos();
                setAlumnos(data.alumnos || []);
            } catch (err) {
                console.error("Error al cargar la lista de alumnos:", err);
                setError("No se pudo cargar la lista de alumnos.");
                
            } finally {
                setLoading(false);
            }
        }
        fetchAlumnos();
    }, []);

    const fetchNotasAlumno = async (idAlumno) => {
        setLoading(true);
        try {
            const data = await getCalificaciones(idAlumno);
            console.log("Calificaciones del alumno", data);
            setCalificaciones(data.data || []);
            setSelectedAlumno(idAlumno);
            
        } catch (err) {
            console.error(`Error al obtener las calificaciones del alumno ${idAlumno}:`, err.response.status);
            setSelectedAlumno(null);
            
            
        } 
    
        finally {
            setLoading(false);
        }
    };
    
    const renderNotas = () => {
        if (calificaciones.length === 0) {
            return (
                <tr>
                    <td colSpan="3" style={{ textAlign: "center", color: "#888" }}>
                        Alumno no registra calificaciones
                    </td>
                </tr>
            );
        }
        else{
            return calificaciones.map((nota) => (
                <tr key={nota.id_nota}>
                    <td>{nota.asignatura.nombre_asignatura}</td>
                    <td>{nota.puntaje_alumno}</td>
                    <td>{nota.nota}</td>
                    
                    <td>
                    <button
                        className="edit-notas-btn"
                        onClick={() => handleEditClick(nota)}
                    >
                        Editar
                    </button>
                    <button
                        className="delete-notas-btn"
                        onClick={() => handleDeleteClick(nota.id_nota)}
                    >
                        Eliminar
                    </button>


                   
                </td>
                </tr>
            ));
        }
        
    };

    const toggleFormulario = () => {
        setMostrarFormulario(!mostrarFormulario);
    };

   
   
  



    const renderFormulario = () => {
        return (
            <div className="agregar-nota">
                <h2>Agregar Nota</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="rut_alumno">Rut Alumno:</label>
                        <input
                            type="text"
                            id="rut_alumno"
                            name="rut_alumno"
                            value={formData.rut_alumno}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="id_asignatura">Asignatura:</label>
                        <select
                            id="id_asignatura"
                            name="id_asignatura"
                            value={formData.id_asignatura}
                            onChange={handleChange}
                        >
                        <option value="">Selecciona una asignatura</option>
                        <option value="1">Matemáticas</option>
                        <option value="2">Fisica</option>
                         <option value="3">Quimica</option>
                        </select>
                        
                    </div>
                    <div>
                        <label htmlFor="puntaje">puntaje:</label>
                        <input
                            type="text"
                            id="puntaje_alumno"
                            name="puntaje_alumno"
                            value={formData.puntaje_alumno}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit">Calificar</button>
                </form>
            </div>
        );
    };

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p className="error-message">{error}</p>;

   

    return (
        <div className="lista-alumnos-page">
            <Sidebar />

            
            
           
            
            <table className="calificaciones-table">
                        <thead>
                            <tr>
                                
                                <th>Lista de Alumnos Asigandos</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            
                        </tbody>
                        
                    </table>
            
            <ul className="alumnos-list">
                {alumnos.map((alumno) => (
                    <li key={alumno.idAlumno} className="alumno-item">
                        <span>
                             {alumno.rut} {alumno.nombre} {alumno.apellido}
                        </span>
                        <button
                            className="mostrar-notas-btn"
                            onClick={() => fetchNotasAlumno(alumno.idAlumno)?true:fetchNotasAlumno(null)}
                        >
                            Mostrar Notas
                        </button>
                    </li>
                ))}
            </ul>

            {selectedAlumno && (
               
                <div className="calificaciones-section">
                
                    <h2>Notas del Alumno</h2>
                    <button onClick={toggleFormulario} className="agregar-notas-btn">
                        {mostrarFormulario ? "Cerrar" : "+"}
                    </button>
                    

                    {mostrarFormulario && renderFormulario()}
                    <table className="calificaciones-table">
                        <thead>
                            <tr>
                                <th>Asignatura</th>
                                <th>Puntaje Alumno</th>
                                <th>Notas</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>{renderNotas()}</tbody>
                        
                       

                    </table>
                    {/*reformularNota &&renderReformularNota()*/}
                </div>
                

            )}
            {!selectedAlumno && (
            <div className="calificaciones-section">
                
                <h1> </h1>

                <table className="calificaciones-table">
                        <thead>
                            <tr>
                                
                                <th>Mensaje</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>El alumno o alumna no registra notas</td>
                            </tr>
                        </tbody>
                        
                    </table>
                
                <button onClick={toggleFormulario} className="agregar-notas-btn">
                {mostrarFormulario ? "Cerrar" : "+"}
                </button>
                {mostrarFormulario && renderFormulario()}


                
                    

                

                
            </div> 
            )}
        </div>
    );
}

export default ListaAlumnoPage;