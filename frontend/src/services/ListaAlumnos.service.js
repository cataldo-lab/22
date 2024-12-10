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






export const patchCalificaciones = async (id_nota, data) => {
    const response = await axios.patch(`/calificaciones/${id_nota}`,data);
    return response.data;
};



export const deleteCalificaciones = async (id_nota) => {
    const response = await axios.delete(`/calificaciones/${id_nota}`);
    return response.data;
};

