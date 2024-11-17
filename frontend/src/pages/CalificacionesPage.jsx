import React, { useEffect, useState } from "react";
import { getCalificaciones } from "../services/calificacionesAPI.service.jsx";
import CalificacionesList from "../components/CalificacionesList.jsx";

const CalificacionesPage = () => {
  const [calificaciones, setCalificaciones] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getCalificaciones();
      setCalificaciones(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Gestión de Calificaciones</h1>
      <CalificacionesList calificaciones={calificaciones} />
    </div>
  );
};

export default CalificacionesPage;