import axios from './root.service.js'; // Usa el servicio base

export async function getAlumnoNotas() {
    try {
        const response = await axios.get('/alumno');
        console.log('Respuesta del backend:', response.data); // Depuración
        return response.data; // Devuelve los datos
    } catch (error) {
        console.error('Error en la solicitud de notas:', error);
        throw error; // Lanza el error para manejarlo en el componente
    }
}
