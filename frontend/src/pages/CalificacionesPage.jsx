import { useState, useEffect } from "react";
import {
    getListaAlumnos,
    getCalificaciones,
    createCalificacion,
    updateCalificacion,
    deleteCalificacion,
} from "@services/calificacionesAPI.service";
import "@styles/gestionNotas.css";

function ListaAlumnosPage() {
    const [alumnos, setAlumnos] = useState([]);
    const [selectedAlumno, setSelectedAlumno] = useState(null);
    const [calificaciones, setCalificaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newCalificacion, setNewCalificacion] = useState({
        nota: "",
        asignatura: "",
    });
    const [editCalificacion, setEditCalificacion] = useState(null);

    // Cargar lista de alumnos al montar el componente
    useEffect(() => {
        async function fetchAlumnos() {
            setLoading(true);
            try {
                const response = await getListaAlumnos();
                setAlumnos(response.alumnos); // Usar los datos de "alumnos"
            } catch (err) {
              console.error("Error al cargar calificaciones:", err); 
              setError("Error al cargar calificaciones.");
            } finally {
                setLoading(false);
            }
        }
        fetchAlumnos();
    }, []);

    // Obtener calificaciones del alumno seleccionado
    const fetchCalificaciones = async (idAlumno) => {
        setLoading(true);
        try {
            const data = await getCalificaciones(idAlumno); // Usar "idAlumno" para obtener calificaciones
            setCalificaciones(data);
        } catch (err) {
          console.error("Error al cargar calificaciones:", err); 
          setError("Error al cargar calificaciones.");
        } finally {
            setLoading(false);
        }
    };

    // Manejar selección del alumno
    const handleSelectAlumno = (alumno) => {
        setSelectedAlumno(alumno);
        fetchCalificaciones(alumno.idAlumno);
    };

    // Crear nueva calificación
    const handleCreate = async () => {
        try {
            const data = await createCalificacion({
                ...newCalificacion,
                alumnoId: selectedAlumno.idAlumno,
            });
            setCalificaciones((prev) => [...prev, data]);
            setNewCalificacion({ nota: "", asignatura: "" });
        } catch (err) {
          console.error("Error al cargar calificaciones:", err); 
          setError("Error al cargar calificaciones.");
        }
    };

    // Actualizar calificación existente
    const handleUpdate = async () => {
        try {
            const data = await updateCalificacion(editCalificacion.id, editCalificacion);
            setCalificaciones((prev) =>
                prev.map((cal) => (cal.id === data.id ? data : cal))
            );
            setEditCalificacion(null);
        } catch (err) {
          console.error("Error al cargar calificaciones:", err); 
          setError("Error al cargar calificaciones.");
        }
    };

    // Eliminar calificación
    const handleDelete = async (id) => {
        try {
            await deleteCalificacion(id);
            setCalificaciones((prev) => prev.filter((cal) => cal.id !== id));
        } catch (err) {
          console.error("Error al cargar calificaciones:", err); 
          setError("Error al cargar calificaciones.");
        }
    };

    return (
        <div className="lista-alumnos-page">
            <h1>Gestión de Alumnos y Calificaciones</h1>
            {error && <p className="error-message">{error}</p>}
            {loading && <p>Cargando...</p>}

            {/* Lista de Alumnos */}
            <div className="alumnos-section">
                <h2>Alumnos</h2>
                <ul>
                    {alumnos.map((alumno) => (
                        <li key={alumno.idAlumno}>
                            {alumno.nombre} {alumno.apellido}
                            <button onClick={() => handleSelectAlumno(alumno)}>Notas del Alumno</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Notas del Alumno Seleccionado */}
            {selectedAlumno && (
                <div className="calificaciones-section">
                    <h2>Calificaciones de {selectedAlumno.nombre} {selectedAlumno.apellido}</h2>
                    <table className="calificaciones-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Asignatura</th>
                                <th>Nota</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {calificaciones.map((calificacion) => (
                                <tr key={calificacion.id}>
                                    <td>{calificacion.id}</td>
                                    <td>{calificacion.asignatura}</td>
                                    <td>{calificacion.nota}</td>
                                    <td>
                                        <button onClick={() => setEditCalificacion(calificacion)}>Actualizar Nota</button>
                                        <button onClick={() => handleDelete(calificacion.id)}>Eliminar Nota</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Formulario para Crear/Actualizar Calificaciones */}
                    <div className="form-section">
                        <h3>{editCalificacion ? "Actualizar Calificación" : "Nueva Calificación"}</h3>
                        <input
                            type="text"
                            placeholder="Asignatura"
                            value={editCalificacion ? editCalificacion.asignatura : newCalificacion.asignatura}
                            onChange={(e) =>
                                editCalificacion
                                    ? setEditCalificacion({ ...editCalificacion, asignatura: e.target.value })
                                    : setNewCalificacion({ ...newCalificacion, asignatura: e.target.value })
                            }
                        />
                        <input
                            type="number"
                            placeholder="Nota"
                            value={editCalificacion ? editCalificacion.nota : newCalificacion.nota}
                            onChange={(e) =>
                                editCalificacion
                                    ? setEditCalificacion({ ...editCalificacion, nota: e.target.value })
                                    : setNewCalificacion({ ...newCalificacion, nota: e.target.value })
                            }
                        />
                        <button onClick={editCalificacion ? handleUpdate : handleCreate}>
                            {editCalificacion ? "Actualizar" : "Agregar"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListaAlumnosPage;
