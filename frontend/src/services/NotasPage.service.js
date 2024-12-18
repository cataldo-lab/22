import axios from './root.service.js'; 

export async function getAlumnoNotas() {
    try {
        const response = await axios.get('/alumno');
        console.log('Respuesta del backend:', response.data); 
        return response.data; 
    } catch (error) {
        console.error('Error en la solicitud de notas:', error);
        throw error; 
    }
}
