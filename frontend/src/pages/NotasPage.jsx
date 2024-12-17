// src/pages/NotasPage.jsx
import { useState, useEffect } from "react";
import { getAlumnoNotas } from "../services/NotasPage.service.js";
import "@styles/NotasPage.css";
import Sidebar from "@components/Sidebar";
import "@styles/sidebar.css";
import React from "react";

function NotasPage() {
    const [notas, setNotas] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    
    const groupNotasByAsignatura = (notas) => {
        return notas.reduce((groups, nota) => {
            const asignatura = nota.asignatura?.nombre_asignatura || "Sin Asignatura";
            if (!groups[asignatura]) {
                groups[asignatura] = [];
            }
            groups[asignatura].push(nota);
            return groups;
        }, {});
    };

    useEffect(() => {
        async function fetchNotas() {
            try {
                const data = await getAlumnoNotas(); //Se obtienen las notas del alumno
                setNotas(data);
            } catch (err) {
                console.error("Error al cargar notas:", err);
                setError("No se pudieron cargar las notas.");
            } finally {
                setLoading(false);
            }
        }

        fetchNotas();
    }, []);

    //Se usa para agrupar notas por asignatura
    const groupedNotas = groupNotasByAsignatura(notas); 

    return (
        <div className="notas-page">
            <Sidebar />
            <h1>Notas del Alumno</h1>

           
            {loading && <p>Cargando notas...</p>}
            {error && <p className="error-message">{error}</p>}

            {/* Mostrar tabla solo si no hay errores y no está cargando */}
            {!loading && !error && (
                <table className="notas-table">
                    <thead>
                        <tr>
                            <th>Asignatura</th>
                            <th>Nota</th>
                            <th>Puntaje Alumno</th>
                            <th>Puntaje Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedNotas).map(([asignatura, notas]) => (
                            <React.Fragment key={asignatura}>
                                
                                <tr className="asignatura-header">
                                    <td colSpan="4">
                                        <strong>{asignatura}</strong>
                                    </td>
                                </tr>
                                {/* Filas de notas */}
                                {notas.map((nota, index) => (
                                    <tr key={index}>
                                        <td></td> {/* Columna vacía para alineación */}
                                        <td>{(parseFloat(nota.nota)).toFixed(1) || "N/A"}</td>
                                        <td>{nota.puntaje_alumno || "N/A"}</td>
                                        <td>{nota.puntaje_total || "N/A"}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default NotasPage;
