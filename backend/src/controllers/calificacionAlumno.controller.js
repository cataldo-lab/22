"use strict";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { getCalificacionesAlumnoService } from "../services/calificacionAlumno.service.js";


export async function getCalificacionesAlumno(req, res) {
    try {
        const id_alumno = req.user.id;  

        if (!id_alumno) {
            return handleErrorClient(res, 400, "El ID del alumno es requerido.");
        }

        const [calificaciones, errorCalificacion] = await getCalificacionesAlumnoService(id_alumno);
        if (errorCalificacion) return handleErrorClient(res, 404, errorCalificacion);

        handleSuccess(res, 200, "Calificaciones obtenidas exitosamente", calificaciones);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

