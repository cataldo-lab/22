/*
import { useState, useEffect } from "react";
import { getCalificaciones } from "../services/calificacionesAPI.service.jsx";
import CalificacionesList from "../components/CalificacionesList.jsx";

const CalificacionesPage = () => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [error, setError] = useState(null); // Manejo de errores

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true); // Mostrar indicador de carga
        const data = await getCalificaciones();
        setCalificaciones(data);
      } catch (err) {
        console.error(err);
        setError("Hubo un problema al obtener las calificaciones."); // Establecer error
      } finally {
        setLoading(false); // Ocultar indicador de carga
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Gestión de Calificaciones</h1>
      {loading && <p>Cargando calificaciones...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && <CalificacionesList calificaciones={calificaciones} />}
    </div>
  );
};

export default CalificacionesPage;
*/