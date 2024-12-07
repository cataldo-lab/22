import { useState, useEffect } from "react";
import {
    getListaAlumnos,
    getCalificaciones,
    patchCalificaciones,
    postCalificaciones,
} from "@services/ListaAlumnos.service";
import "@styles/listaAlumnos.css";
import Sidebar from "@components/Sidebar";
import "@styles/home.css";



function ListaAlumnoPage() {
    
    const [alumnos, setAlumnos] = useState([]);
    const [calificaciones, setCalificaciones] = useState([]);
    const [selectedAlumno, setSelectedAlumno] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [formData, setFormData] = useState({
        id_alumno: '',
        id_asignatura: '',
        puntaje_alumno: '',
    });
    const [patchDataForm, setPatchDataForm] = useState({
        id_nota: '',
        id_alumno: '',
        id_asignatura: '',
        puntaje_alumno: '',
    });
    const [reformularNota, setReformularNota] = useState(false);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handlePatchChange = (event) => {
        setPatchDataForm({ ...patchDataForm, [event.target.name]: event.target.value });
    };
    
    
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;
        try {
            const response = await postCalificaciones(formData);
            console.log('Datos enviados con éxito:', response);
            setFormData({
                id_alumno: '',
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

    const handlePatchSubmit = async (event) => {
        event.preventDefault(); // Evita que se recargue la página al enviar el formulario
    
        try {
            // Llama al servicio y pasa el ID junto con los datos
            const response = await patchCalificaciones(patchDataForm.id_nota, patchDataForm);
    
            console.log("Nota actualizada con éxito:", response);
    
            alert("Nota actualizada con éxito.");
            setFormData({
                id_nota: '',
                id_alumno: '',
                id_asignatura: '',
                puntaje_alumno: '',
            }); // Limpia el formulario tras el envío
        } catch (error) {
            console.error("Error al actualizar la nota:", error);
            alert("Error al actualizar la nota. Por favor, intenta nuevamente.");
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
    //console.log(fetchNotasAlumno.then(res=>res.json()).then(data=>console.log(data)));
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
                    <td>{nota.id_alumno}</td>
                    <td>{nota.id_nota}</td>
                    <td>{nota.nota}</td>
                    <td>{nota.ponderacion_nota}</td>
                    <td>{nota.id_asignatura}</td>
                    <td>{nota.asignatura.nombre_asignatura}</td>
                </tr>
            ));
        }
        
    };

    const toggleFormulario = () => {
        setMostrarFormulario(!mostrarFormulario);
    };

    const togglePatchFormulario = () => {
        setReformularNota(!reformularNota);
    };

   


    const renderFormulario = () => {
        return (
            <div className="agregar-nota">
                <h2>Agregar Nota</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="id_alumno">Id Alumno:</label>
                        <input
                            type="text"
                            id="id_alumno"
                            name="id_alumno"
                            value={formData.id_alumno}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="id_asignatura">id_asignatura:</label>
                        <input
                            type="text"
                            id="id_asignatura"
                            name="id_asignatura"
                            value={formData.id_asignatura}
                            onChange={handleChange}
                        />
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

    const renderReformularNota = () => {
        return (
            <div className="agregar-nota">
                <h2>Cambiar Nota</h2>
                <form onSubmit={handlePatchSubmit}>
                    <div>
                        <label htmlFor="id_nota">Id Nota:</label>
                        <input
                            type="text"
                            id="id_nota"
                            name="id_nota"
                            value={patchDataForm.id_nota}
                            onChange={handlePatchChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="id_alumno">Id Alumno:</label>
                        <input
                            type="text"
                            id="id_alumno"
                            name="id_alumno"
                            value={patchDataForm.id_alumno}
                            onChange={handlePatchChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="id_asignatura">Id Asignatura:</label>
                        <input
                            type="number"
                            id="id_asignatura"
                            name="id_asignatura"
                            value={patchDataForm.id_asignatura}
                            onChange={handlePatchChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="puntaje_alumno">Puntaje:</label>
                        <input
                            type="number"
                            id="puntaje_alumno"
                            name="puntaje_alumno"
                            value={patchDataForm.puntaje_alumno}
                            onChange={handlePatchChange}
                            required
                        />
                    </div>
                    <button type="submit">Subir</button>
                </form>
            </div>
        );
    };

    return (
        <div className="lista-alumnos-page">
            <Sidebar />
            
            <h1>Lista de Alumnos</h1>
            <ul className="alumnos-list">
                {alumnos.map((alumno) => (
                    <li key={alumno.idAlumno} className="alumno-item">
                        <span>
                             {alumno.nombre} {alumno.apellido}
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
                    
                    <button onClick={" "} className="borrar-notas-btn">
                        {mostrarFormulario ? "Cerrar" : "-"}
                    </button>
                    <button onClick={togglePatchFormulario} className="reformular-notas-btn">
                        {reformularNota ? "Cerrar" : "*"}
                    </button>

                    {mostrarFormulario && renderFormulario()}
                    <table className="calificaciones-table">
                        <thead>
                            <tr>
                                <th>Id alumno</th>
                                <th>Id Nota</th>
                                <th>Notas</th>
                                <th>Ponderación</th>
                                <th>Id Asignatura</th>
                                <th>Asignatura</th>
                            </tr>
                        </thead>
                        <tbody>{renderNotas()}</tbody>
                        
                       

                    </table>
                    {reformularNota &&renderReformularNota()}
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