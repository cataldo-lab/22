import axios from "./root.service";


export const getListaAlumnos=async()=>{
  const response= await axios.get("lista/profesor/alumnos");
  return response.data;
}

// Obtener calificaciones
export const getCalificaciones = async (id) => {
    const response = await axios.get(`/calificaciones/alumno/${id}`);
    return response.data;
};

// Crear una nueva calificación
/*
{
  "id_alumno": 1,
  "id_asignatura": 1,
  "puntaje_alumno": 60
}

*/
export const createCalificacion = async (calificacion) => {
    const response = await axios.post("/calificaciones", calificacion);
    return response.data;
};

// Actualizar una calificación
export const updateCalificacion = async (id, calificacion) => {
    const response = await axios.put(`/calificaciones/${id}`, calificacion);
    return response.data;
};

// Eliminar una calificación
export const deleteCalificacion = async (id) => {
    const response = await axios.delete(`/calificaciones/${id}`);
    return response.data;
};
