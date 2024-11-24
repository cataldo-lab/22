"use strict";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { getOwnCalificacionesService } from "../services/alumno.service.js";


export async function getOwnCalificaciones(req, res) {
    try {
        const id_alumno = req.user?.id;
        if (!id_alumno) {
            return handleErrorClient(res, 401, "Acceso denegado. ID del alumno no encontrado en el token.");
        }
        const [calificaciones, error] = await getOwnCalificacionesService(req);
        if (error) {
            return handleErrorClient(res, 404, error);
        }
        handleSuccess(res, 200, "Calificaciones obtenidas exitosamente", calificaciones);
    } catch (error) {
        console.error("Error en getOwnCalificaciones:", error.message);
        handleErrorServer(res, 500, error.message);
    }
}

