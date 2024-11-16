import { 
    createCalificacionService, 
    deleteCalificacionService ,
    getSelfCalificacionesService, 
    updateCalificacionService, 
    
} from "../services/calificacion.service.js";
import { handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

// Obtener las calificaciones del alumno autenticado
export async function getSelfCalificaciones(req, res) {
    try {
        const id_alumno = req.user.id; // ID del alumno autenticado
        const [calificaciones, error] = await getSelfCalificacionesService(id_alumno);

        if (error) {
            return handleErrorClient(res, 404, "No se encontraron calificaciones.");
        }

        return res.status(200).json({
            status: "Success",
            message: "Calificaciones obtenidas exitosamente.",
            data: calificaciones,
        });
    } catch (error) {
        console.error("Error en getSelfCalificaciones:", error.message);
        return handleErrorServer(res, 500, "Error interno del servidor.");
    }
}

// Crear una nueva calificación
export async function createCalificacion(req, res) {
    try {
        const [calificacion, error] = await createCalificacionService(req.body);

        if (error) {
            return handleErrorClient(res, 400, "Error al crear la calificación.", error);
        }

        return res.status(201).json({
            status: "Success",
            message: "Calificación creada exitosamente.",
            data: calificacion,
        });
    } catch (error) {
        console.error("Error en createCalificacion:", error.message);
        return handleErrorServer(res, 500, "Error interno del servidor.");
    }
}

// Actualizar una calificación existente
export async function updateCalificacion(req, res) {
    try {
        const { id_nota } = req.params;
        const [calificacion, error] = await updateCalificacionService(id_nota, req.body);

        if (error) {
            return handleErrorClient(res, 404, "No se encontró la calificación a actualizar.", error);
        }

        return res.status(200).json({
            status: "Success",
            message: "Calificación actualizada exitosamente.",
            data: calificacion,
        });
    } catch (error) {
        console.error("Error en updateCalificacion:", error.message);
        return handleErrorServer(res, 500, "Error interno del servidor.");
    }
}

// Eliminar una calificación existente
export async function deleteCalificacion(req, res) {
    try {
        const { id_nota } = req.params;
        const [deleted, error] = await deleteCalificacionService(id_nota);

        if (error) {
            return handleErrorClient(res, 404, "No se encontró la calificación a eliminar.", error);
        }

        return res.status(200).json({
            status: "Success",
            message: "Calificación eliminada exitosamente.",
        });
    } catch (error) {
        console.error("Error en deleteCalificacion:", error.message);
        return handleErrorServer(res, 500, "Error interno del servidor.");
    }
}
