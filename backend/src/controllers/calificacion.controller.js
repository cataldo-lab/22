
"use strict";
import {
    createCalificacionService,
    deleteCalificacionService,
    getCalificacionesByAlumnoIdService,
    updateCalificacionService,
} from "../services/calificacion.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

// Crear una calificaci      n
export async function createCalificacion(req, res) {
    try {
        // Extracción de datos del cuerpo de la solicitud
        const { id_alumno, id_asignatura, puntaje_alumno } = req.body;

        // Validación de entrada
        if (!id_alumno || !id_asignatura || puntaje_alumno === undefined) {
            return handleErrorClient(
                res,
                400,
                "Faltan datos requeridos: id_alumno, id_asignatura o puntaje_alumno."
            );
        }

        // Llamar al servicio para crear la calificación
        const [nuevaCalificacion, error] = await createCalificacionService({
            id_alumno,
            id_asignatura,
            puntaje_alumno,
        });

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        // Respuesta exitosa
        handleSuccess(res, 201, "Calificación creada exitosamente", nuevaCalificacion);
    } catch (error) {
        // Manejo de errores de servidor
        console.error("Error en createCalificacion:", error.message);
        handleErrorServer(res, 500, error.message);
    }
}

//No tocar
export async function updateCalificacion(req, res) {
    try {
        // Extraer el id_nota de los parámetros de la solicitud
        const { id_nota } = req.params;

        // Extraer el cuerpo de la solicitud
        const { id_alumno, id_asignatura, puntaje_alumno } = req.body;

        // Validar que los datos necesarios estén presentes
        if (!id_nota || !id_alumno || !id_asignatura || puntaje_alumno === undefined) {
            return handleErrorClient(
                res,
                400,
                "Faltan datos requeridos: id_nota, id_alumno, id_asignatura o puntaje_alumno."
            );
        }

        // Llamar al servicio para actualizar la calificación
        const [calificacionActualizada, error] = await updateCalificacionService(
            id_nota,
            id_alumno,
            id_asignatura,
            puntaje_alumno
        );

        // Manejar errores del servicio
        if (error) {
            return handleErrorClient(res, 400, error);
        }

        // Respuesta exitosa
        handleSuccess(res, 200, "Calificación actualizada exitosamente", calificacionActualizada);
    } catch (error) {
        // Manejo de errores del servidor
        console.error("Error en updateCalificacion:", error.message);
        handleErrorServer(res, 500, error.message);
    }
}


export async function deleteCalificacion(req, res) {
    try {
        
        const { id_nota } = req.params;

        
        if (!id_nota) {
            return handleErrorClient(res, 400, "El ID de la calificación es requerido.");
        }

        
        const [calificacionEliminada, error] = await deleteCalificacionService(id_nota);

        
        if (error) {
            return handleErrorClient(res, 404, error);
        }

       
        handleSuccess(res, 200, "Calificación eliminada exitosamente", calificacionEliminada);
    } catch (error) {
        
        console.error("Error en deleteCalificacion:", error.message);
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