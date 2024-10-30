"use strict";
import {
    createCalificacionService,
    deleteCalificacionService,
    getCalificacionesByAlumnoIdService,
    updateCalificacionService,
} from "../services/calificacion.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

// Crear una calificación
export async function createCalificacion(req, res) {
    try {
        const { id_alumno, id_asignatura, programa_Pie, puntaje_alumno } = req.body; 

        if (!id_alumno || !id_asignatura || programa_Pie === undefined || puntaje_alumno === undefined) {
            return handleErrorClient(res, 400, "Faltan datos requeridos para crear la calificación.");
        }

        const [createdCalificacion, error] = await createCalificacionService({
            id_alumno,
            id_asignatura,
            programa_Pie,
            puntaje_alumno,
        });
        if (error){ return handleErrorClient(res, 400, error);}
        
        handleSuccess(res, 201, "Calificación creada exitosamente", createdCalificacion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}



export async function getCalificacionesByAlumnoId(req, res) {
    try {
        const { id_alumno } = req.params;  // Cambiado de req.query a req.params

        if (!id_alumno) {
            return handleErrorClient(res, 400, "El ID del alumno es requerido.");
        }

        const [calificaciones, errorCalificacion] = await getCalificacionesByAlumnoIdService(id_alumno);
        if (errorCalificacion) return handleErrorClient(res, 404, errorCalificacion);

        handleSuccess(res, 200, "Calificaciones obtenidas exitosamente", calificaciones);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getCalificacionesSelf(req, res) {
    try {
        const id_alumno = req.user.id;  

        if (!id_alumno) {
            return handleErrorClient(res, 400, "El ID del alumno es requerido.");
        }

        
        const [calificaciones, errorCalificacion] = await getCalificacionesByAlumnoIdService(id_alumno);
        if (errorCalificacion) return handleErrorClient(res, 404, errorCalificacion);

        
        handleSuccess(res, 200, "Calificaciones obtenidas exitosamente", calificaciones);
    } catch (error) {
        
        handleErrorServer(res, 500, error.message);
    }
}





//No tocar
export async function updateCalificacion(req, res) {
    try {
        const { id_nota } = req.params;
        const { id_alumno, id_asignatura, programa_Pie, puntaje_alumno } = req.body;

        console.log("Datos recibidos:", { id_nota, id_alumno, id_asignatura, programa_Pie, puntaje_alumno });

        const [updatedCalificacion, error] = await updateCalificacionService(
            id_nota,
            id_alumno,
            id_asignatura,
            programa_Pie === true,  // Aseguramos que sea booleano
            parseFloat(puntaje_alumno)  // Convertimos puntaje_alumno a número
        );

        if (error) return handleErrorClient(res, 400, error);

        handleSuccess(res, 200, "Calificación actualizada exitosamente", updatedCalificacion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}


export async function deleteCalificacion(req, res) {
    try {
        const { id_nota } = req.params;

        const [deletedCalificacion, error] = await deleteCalificacionService(id_nota);

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Calificación eliminada exitosamente", deletedCalificacion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}