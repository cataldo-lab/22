import {
    getUserService,
    getUsersService,
    updateUserService,
} from "../services/user.service.js";
import { handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { createUserValidationSchema } from "../validations/user.validation.js";



export async function getUser(req, res) {
    try {
        const { id_usuario } = req.params; // Supone que id_usuario viene en los parámetros de la ruta
        const { status, message, data } = await getUserService(id_usuario);

        return res.status(status).json({
            status: status === 200 ? "Success" : "Client error",
            message,
            data,
        });
    } catch (error) {
        console.error("Error en getUser:", error.message);
        return res.status(500).json({
            status: "Server error",
            message: "Error interno del servidor.",
        });
    }
}

// Actualizar un usuario existente
export async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { status, message, data } = await updateUserService(req.user, id, req.body);

        return res.status(status).json({
            status: status === 200 ? "Success" : "Client error",
            message,
            data,
        });
    } catch (error) {
        console.error("Error en updateUser:", error.message);
        return handleErrorServer(res, 500, "Error interno del servidor.");
    }
}



// Controlador genérico para obtener usuarios por rol o condición
export async function getUsers(req, res) {
    try {
        const { rol } = req.query; // Ejemplo: ?rol=profesor o ?rol=alumno
        const { user } = req; // Usuario autenticado, si es necesario

        // Verificar permisos según el rol del usuario autenticado
        if (rol === "alumno" && user.rol !== "profesor") {
            return res.status(403).json({
                status: "Client error",
                message: "Acceso denegado. Solo los profesores pueden obtener alumnos.",
            });
        }

        if (rol === "profesor" && user.rol !== "administrador") {
            return res.status(403).json({
                status: "Client error",
                message: "Acceso denegado. Solo los administradores pueden obtener profesores.",
            });
        }

        // Llamar al servicio para obtener los usuarios según el rol
        const { status, message, data } = await getUsersService(rol);

        // Responder con los datos o manejar errores
        return res.status(status).json({
            status: status === 200 ? "Success" : "Client error",
            message,
            data,
        });
    } catch (error) {
        console.error("Error en getUsers:", error.message);
        return handleErrorServer(res, 500, "Error interno del servidor.");
    }
}




