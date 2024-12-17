import { useState, useEffect } from "react";
import {
    getListaAlumnos,
    getCalificaciones,
    deleteCalificaciones,
    patchCalificaciones,
    postCalificaciones,
} from "@services/ListaAlumnos.service";
import "@styles/ListaAlumnos.css";
import Sidebar from "@components/Sidebar";
import "@styles/home.css";
import Swal from "sweetalert2";
import "@styles/navbar.css"
import "@styles/home.css";
import { useForm } from "react-hook-form";




function ListaAlumnoPage() {

    const { register, trigger, formState: { errors } } = useForm();
    const [alumnos, setAlumnos] = useState([]);
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
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
        puntaje_total:'',
    });
    
   
   

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });

    };

    
    
    const handleEditClick = (nota) => {
        Swal.fire({
            title: "Editar Nota",
            html: `
                <label>Puntaje Alumno:</label>
                <input id="swal-input-puntaje-alumno" type="number" class="swal2-input" value="${nota.puntaje_alumno}" />
                <br>
                <label>Puntaje Total:</label>
                <input id="swal-input-puntaje-total" type="number" class="swal2-input" value="${nota.puntaje_total}" />
            `,
            preConfirm: () => {
                const puntajeAlumno = parseFloat(document.getElementById("swal-input-puntaje-alumno").value);
                const puntajeTotal = parseFloat(document.getElementById("swal-input-puntaje-total").value);
    
                // Ambos campos deben estar completos
                if (isNaN(puntajeAlumno) || isNaN(puntajeTotal)) {
                    Swal.showValidationMessage("Ambos campos son obligatorios.");
                    return null;
                }
    
                // Valida los valores ingresados sean mayores o iguales a 1
                if (puntajeAlumno < 1 || puntajeTotal < 1) {
                    Swal.showValidationMessage("Ambos valores deben ser mayores o iguales a 1.");
                    return null;
                }
    
                // Validar que puntajeAlumno <= puntajeTotal
                if (puntajeAlumno > puntajeTotal) {
                    Swal.showValidationMessage("El puntaje del alumno no puede ser mayor al puntaje total.");
                    return null;
                }
    
                return {
                    puntaje_alumno: puntajeAlumno,
                    puntaje_total: puntajeTotal,
                };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const data = result.value; 
    
                    
                    await patchCalificaciones(nota.id_nota, data);
    
                    
                    const updatedCalificaciones = calificaciones.map((n) =>
                        n.id_nota === nota.id_nota
                            ? {
                                  ...n,
                                  puntaje_alumno: data.puntaje_alumno,
                                  puntaje_total: data.puntaje_total,
                                  nota: ((data.puntaje_alumno / data.puntaje_total) * 7).toFixed(1),
                              }
                            : n
                    );
                    //Actualiza las calificaciones de forma local
                    setCalificaciones(updatedCalificaciones);
    
                    Swal.fire("Nota actualizada con éxito", "", "success");
                } catch (error) {
                    console.error("Error al actualizar la nota:", error);
                    Swal.fire("Error al actualizar la nota", "Por favor, intenta nuevamente.", "error");
                }
            }
        });
    };
    
    
    // Función para eliminar una nota
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
                // Llama deleteCalificaciones
                await deleteCalificaciones(id_nota);
    
                // Actualizamos localmente la pagina
                const updatedCalificaciones = calificaciones.filter((n) => n.id_nota !== id_nota);
                console.log(updatedCalificaciones)
                 setCalificaciones(updatedCalificaciones);
                
                Swal.fire("Nota eliminada con éxito", "", "success");
                
            } catch (error) {
                console.error("Error al eliminar la nota:", error);
                Swal.fire("Error al eliminar la nota", "Por favor, intenta nuevamente.", "error");
            }
        }
    };
    
    


const handleSubmit1 = async (event) => {
    event.preventDefault(); // Prevenir comportamiento predeterminado del formulario
    if (isSubmitting) return;

    // Ejecuta validaciones de React Hook Form
    const isValid = await trigger(); // trigger() sirve para validar todos los campos registrados
    if (!isValid) {
        Swal.fire("Error en el formulario", "Por favor corrige los campos destacados", "error");
        return;
    }

    // Muestra la confirmación con SweetAlert2
    const { isConfirmed } = await Swal.fire({
        title: "Confirma los datos ingresados",
        html: `
            <p><strong>Rut Alumno:</strong> ${formData.rut_alumno}</p>
            <p><strong>Asignatura:</strong> ${formData.id_asignatura}</p>
            <p><strong>Puntaje:</strong> ${formData.puntaje_alumno}</p>
            <p><strong>Puntaje Total:</strong> ${formData.puntaje_total}</p>
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

    // Envía los datos al backend
    setIsSubmitting(true);
    try {
        const response = await postCalificaciones(formData);
        console.log("Datos enviados con éxito:", response);

        // Datos usados postear notas
        setFormData({
            rut_alumno: "",
            id_asignatura: "",
            puntaje_alumno: "",
            puntaje_total: "",
        });

        // Recarga las notas del alumno 
        if (selectedAlumno) {
            fetchNotasAlumno(selectedAlumno);
        }

        Swal.fire("Nota agregada con éxito", "", "success");
    } catch (error) {
        console.error("Error al enviar los datos:", error);
        Swal.fire("Error", "Error al enviar los datos de notas", "error");
    } finally {
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
    
    const handleFetchNotas = async (idAlumno) => {
        try {
            //console.log(`Intentando obtener las notas del alumno con ID: ${idAlumno}`); usado para debuggear
            await fetchNotasAlumno(idAlumno);
        } catch (err) {
            console.error("Error al llamar a fetchNotasAlumno:", err);
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
                    <td>{nota.puntaje_total}</td>
                    
                    <td>{(parseFloat(nota.nota)).toFixed(1)}</td>
                    
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
        setMostrarFormulario((prev) => !prev);
    };

   
   
  
    const renderFormulario = () => {
        return (
            <div className="agregar-nota">
                <h2>Agregar Nota</h2>
                <form onSubmit={handleSubmit1}>
                    <div>
                        <label htmlFor="rut_alumno">Rut Alumno:</label>
                        <select
                            id="rut_alumno"
                            name="rut_alumno"
                            {...register("rut_alumno", { required: "El RUT del alumno es obligatorio" })}
                            value={formData.rut_alumno}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona un alumno</option>
                            {alumnos.map((alumno) => (
                                <option key={alumno.idAlumno} value={alumno.rut}>
                                    {alumno.rut}
                                </option>
                            ))}
                        </select>
                        {errors?.rut_alumno && <p className="error-message">{errors.rut_alumno.message}</p>}
                    </div>
    
                    <div>
                        <label htmlFor="id_asignatura">Asignatura:</label>
                        <select
                            id="id_asignatura"
                            name="id_asignatura"
                            {...register("id_asignatura", { required: "La asignatura es obligatoria" })}
                            value={formData.id_asignatura}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona una asignatura</option>
                            <option value="1">Matemáticas</option>
                            <option value="2">Física</option>
                            <option value="3">Química</option>
                        </select>
                        {errors?.id_asignatura && <p className="error-message">{errors.id_asignatura.message}</p>}
                    </div>
    
                    <div>
                        <label htmlFor="puntaje_alumno">Puntaje del Alumno:</label>
                        <input
                            type="number"
                            id="puntaje_alumno"
                            name="puntaje_alumno"
                            {...register("puntaje_alumno", {
                                required: "El puntaje del alumno es obligatorio",
                                min: { value: 1, message: "Debe ser mayor o igual a 1" },
                                validate: (value) => {
                                    const total = parseFloat(formData.puntaje_total) || 0; // Puntaje total
                                    if (value > total) {
                                        return "El puntaje del alumno no puede ser mayor al puntaje total";
                                    }
                                    return true;
                                }
                            })}
                            value={formData.puntaje_alumno}
                            onChange={handleChange}
                        />
                        {errors?.puntaje_alumno && <p className="error-message">{errors.puntaje_alumno.message}</p>}
                    </div>
    
                    <div>
                        <label htmlFor="puntaje_total">Puntaje Total:</label>
                        <input
                            type="number"
                            id="puntaje_total"
                            name="puntaje_total"
                            {...register("puntaje_total", {
                                required: "El puntaje total es obligatorio",
                                min: { value: 1, message: "Debe ser mayor o igual a 1" },
                            })}
                            value={formData.puntaje_total}
                            onChange={handleChange}
                        />
                        {errors?.puntaje_total && <p className="error-message">{errors.puntaje_total.message}</p>}
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

        <h1>Lista de Alumnos</h1>

         <table className="calificaciones-table">
            <thead>
                <tr>
                    <th>Rut</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {alumnos.map((alumno) => (
                    <tr key={alumno.idAlumno}>
                        <td>{alumno.rut}</td>
                        <td>{alumno.nombre}</td>
                        <td>{alumno.apellido}</td>
                        <td>
                        <button
                        className="mostrar-notas-btn"
                        onClick={() => {
                        fetchNotasAlumno(alumno.idAlumno); 
                        handleFetchNotas(alumno.idAlumno);

                        
                        setAlumnoSeleccionado(`${alumno.nombre} ${alumno.apellido}`); 
    }}
>
    Mostrar Notas
</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

            {selectedAlumno && (
               
                <div className="calificaciones-section">
                
                    
                    <button onClick={toggleFormulario} className="agregar-notas-btn">
                        {mostrarFormulario ? "Cerrar" : "Añadir Nota"}
                    </button>
                    
                    <h1></h1> 
                    {mostrarFormulario && renderFormulario()}
                    <h3>Notas: {alumnoSeleccionado}</h3>
                    <table className="calificaciones-table">
                        <thead>
                            <tr>
                                <th>Asignatura</th>
                                <th>Puntaje Alumno</th>
                                <th>Puntaje Total</th>
                                <th>Notas</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        
                        <tbody>{renderNotas()}</tbody>
                        
                       

                    </table>
                    
                </div>
                

            )}
            {!selectedAlumno && (
            <div className="calificaciones-section">
                
               
                <button onClick={toggleFormulario} className="agregar-notas-btn">
                {mostrarFormulario ? "Cerrar" : "Añadir Nota"}
                
                </button>
                <h3>Notas: {alumnoSeleccionado || "Sin seleccionar"}</h3>
                {/*<h3>Notas: {alumnoSeleccionado}</h3>*/}
                
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
                
                
                {mostrarFormulario && renderFormulario()}


                
            </div> 
            )}
        </div>
    );
}

export default ListaAlumnoPage;