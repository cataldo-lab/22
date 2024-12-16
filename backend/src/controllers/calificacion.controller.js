
"use strict";
import {
    createCalificacionService,
    deleteCalificacionService,
    getCalificacionesByAlumnoIdService,
    updateCalificacionService,
} from "../services/calificacion.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { 
    createCalificacionSchema,
    deleteCalificacionSchema, 
    updateCalificacionSchema, 
} from "../validations/calificacion.validation.js";

const validateRequest = (schema, data, res) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => detail.message);
        handleErrorClient(res, 400, errors.join(", "));
        return false;
    }
    return true;
};



// Crear una calificaci      n
export async function createCalificacion(req, res) {
    try {
        // Validar el esquema de la solicitud
        if (!validateRequest(createCalificacionSchema, req.body, res)) return;

        const { rut_alumno, id_asignatura, puntaje_alumno, puntaje_total } = req.body;

        
        // Llamar al servicio para crear la calificación
        const [nuevaCalificacion, error] = await createCalificacionService({
            rut_alumno,
            id_asignatura,
            puntaje_alumno,
            puntaje_total,
        });

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        // Respuesta exitosa
        return handleSuccess(res, 201, "Calificación creada exitosamente", nuevaCalificacion);
    } catch (error) {
        // Manejo de errores de servidor
        console.error("Error en createCalificacion:", error.message);
        return handleErrorServer(res, 500, error.message);
    }
}

//No tocar
export async function updateCalificacion(req, res) {
    try {
        // Validación del cuerpo de la solicitud
        const { error } = updateCalificacionSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                mensaje: "Errores de validación",
                detalles: error.details.map((detail) => detail.message),
            });
        }

        const { id_nota } = req.params;
        const { puntaje_alumno, puntaje_total } = req.body;

        const [calificacionActualizada, errorService] = await updateCalificacionService({
            id_nota,
            puntaje_alumno,
            puntaje_total,
        });

        if (errorService) {
            return res.status(404).json({ mensaje: errorService });
        }

        res.status(200).json({
            mensaje: "Calificación actualizada exitosamente",
            calificacion: calificacionActualizada,
        });
    } catch (error) {
        console.error("Error en updateCalificacion:", error.message);
        res.status(500).json({ mensaje: "Error interno del servidor." });
    }
}



export async function deleteCalificacion(req, res) {
    try {
        
        const { id_nota } = req.params;

        
        //if (!validateRequest(deleteCalificacionSchema, data, res)) return;

        
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