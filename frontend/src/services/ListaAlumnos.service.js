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
    try {
        const response = await axios.get(`/calificaciones/alumno/${id}`);
        console.log('Respuesta del backend:', response.data);
        return response.data;
    }
    catch (error) {
        console.error('Error en la solicitud de notas:', error.response.status);
        throw error; 
    }
    
};

export const postCalificaciones = async (formData) => {
    const response = await axios.post('/calificaciones', formData);
    return response.data;
};






export const patchCalificaciones = async (formData) => {
    const response = await axios.put('/calificaciones', formData);
    return response.data;
};



export const deleteCalificaciones = async (id) => {
    const response = await axios.delete(`/calificaciones/${id}`);
    return response.data;
};

