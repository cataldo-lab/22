import { useState, useEffect } from "react";
import {
    getListaAlumnos,
    getCalificaciones, // Función para obtener calificaciones
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
            setCalificaciones(data.data || []);
            setSelectedAlumno(idAlumno);
        } catch (err) {
            console.error(`Error al obtener las calificaciones del alumno ${idAlumno}:`, err);
            setError("No se pudieron cargar las calificaciones.");
        } finally {
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
        return calificaciones.map((nota) => (
            <tr key={nota.id_nota}>
                <td>{nota.nota}</td>
                <td>{nota.ponderacion_nota}</td>
                <td>{nota.asignatura.nombre_asignatura}</td>
            </tr>
        ));
    };

    
    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p className="error-message">{error}</p>;

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
                            onClick={() => agregarNota()}
                        >
                            Mostrar Notas
                        </button>
                    </li>
                ))}
            </ul>

            {selectedAlumno && (
                <div className="calificaciones-section">
                    <h2>Notas del Alumno</h2>
                    <table className="calificaciones-table">
                        <thead>
                            <tr>
                                <th>Nota</th>
                                <th>Ponderación</th>
                                <th>Asignatura</th>
                            </tr>
                        </thead>
                        <tbody>{renderNotas()}</tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ListaAlumnoPage;