// src/pages/NotasPage.js
import { useState, useEffect } from "react";
import { getAlumnoNotas } from '../services/NotasPage.service.js';
import "@styles/NotasPage.css";


function NotasPage() {
    const [notas, setNotas] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNotas() {
            try {
                const data = await getAlumnoNotas(); // Llamada al servicio
                console.log('Notas recibidas:', data); // Depuración
                setNotas(data);
            } catch (err) {
                console.error('Error al cargar notas:', err); // Muestra errores en consola
                setError('No se pudieron cargar las notas.');
            } finally {
                setLoading(false);
            }
        }

        fetchNotas();
    }, []);

    if (loading) return <p>Cargando notas...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="notas-page">
            <h1>Notas del Alumno</h1>
            <ul className="notas-list">
                {notas.map((nota, index) => (
                    <li key={index} className="nota-item">
                        <p>Asignatura: <strong>{nota.asignatura?.nombre_asignatura}</strong></p>
                        <p>Nota: <strong>{nota.nota}</strong></p>
                        <p>Ponderación: <strong>{nota.ponderacion_nota}</strong></p>
                        <p>Puntaje: <strong>{nota.puntaje_alumno}</strong></p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NotasPage;