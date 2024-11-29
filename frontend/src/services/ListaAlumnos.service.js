import axios from './root.service.js'; 

export async function getListaAlumnos() {
    try {
        const response = await axios.get('lista/profesor/alumnos');
        console.log('Respuesta del backend:', response.data); 
        return response.data; 
    } catch (error) {
        console.error('Error en la solicitud de notas:', error);
        throw error; 
    }
}

export const getCalificaciones = async (id) => {
    const response = await axios.get(`/calificaciones/alumno/${id}`);
    return response.data;
};