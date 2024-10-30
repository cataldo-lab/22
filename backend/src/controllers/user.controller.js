"use strict";
import {
    createUserService,
    deleteUserService,
    getUserService,
    getUsersService,
    updateUserService
} from "../services/user.service.js";
import {
    userBodyValidation,
    userQueryValidation,
} from "../validations/user.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

// Obtener un usuario (alumno solo puede ver su propia información, profesor puede ver cualquier alumno)
export async function getUser(req, res) {
    try {
        const { rut } = req.query;

        // Validar parámetros de la solicitud
        const { error } = userQueryValidation.validate({ rut });
        if (error) return handleErrorClient(res, 400, error.message);

        const [user, errorUser] = await getUserService({ rut });
        if (errorUser) return handleErrorClient(res, 404, errorUser);

        // Verificar si el usuario autenticado es un alumno y solo puede ver su propia información
        if (req.user.rol === "alumno" && req.user.rut !== rut) {
            return handleErrorClient(res, 403, "Acceso denegado. Los alumnos solo pueden ver su propia información.");
        }

        // Si el usuario autenticado es profesor, puede ver la información de los alumnos
        handleSuccess(res, 200, "Usuario encontrado", user);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Obtener todos los usuarios (solo profesores pueden ver a los alumnos)
export async function getUsers(req, res) {
    try {
        if (req.user.rol !== "profesor") {
            return handleErrorClient(res, 403, "Acceso denegado. Solo los profesores pueden ver a los alumnos.");
        }

        const [users, errorUsers] = await getUsersService({ rol: "alumno" }); // Solo traer alumnos
        if (errorUsers) return handleErrorClient(res, 404, errorUsers);

        users.length === 0
            ? handleSuccess(res, 204, "No se encontraron usuarios.")
            : handleSuccess(res, 200, "Usuarios encontrados", users);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Crear un nuevo usuario (solo profesores pueden crear alumnos)
export async function createUser(req, res) {
    try {
        if (req.user.rol !== "profesor") {
            return handleErrorClient(res, 403, "Acceso denegado. Solo los profesores pueden crear alumnos.");
        }

        const { body } = req;
        const { error: bodyError } = userBodyValidation.validate(body);
        if (bodyError) {
            return handleErrorClient(res, 400, "Error de validación en los datos enviados", bodyError.message);
        }

        // Asegurarse de que el rol del nuevo usuario sea "alumno"
        if (body.rol !== "alumno") {
            return handleErrorClient(res, 403, "Solo se pueden crear usuarios con rol de alumno.");
        }

        const [newUser, createError] = await createUserService(body);
        if (createError) return handleErrorClient(res, 500, "Error al crear el usuario", createError);

        handleSuccess(res, 201, "Usuario alumno creado exitosamente", newUser);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Actualizar un usuario (solo profesores pueden actualizar alumnos)
export async function updateUser(req, res) {
    try {
        if (req.user.rol !== "profesor") {
            return handleErrorClient(res, 403, "Acceso denegado. Solo los profesores pueden actualizar alumnos.");
        }

        const { rut } = req.query;
        const { body } = req;

        // Validar el rut y el cuerpo de la solicitud
        const { error: queryError } = userQueryValidation.validate({ rut });
        if (queryError) {
            return handleErrorClient(res, 400, "Error de validación en la consulta", queryError.message);
        }

        const { error: bodyError } = userBodyValidation.validate(body);
        if (bodyError) {
            return handleErrorClient(res, 400, "Error de validación en los datos enviados", bodyError.message);
        }

        const [userToUpdate, errorUser] = await getUserService({ rut });
        if (errorUser) return handleErrorClient(res, 404, "Usuario no encontrado.");

        // Verificar si el usuario a actualizar es un alumno
        if (userToUpdate.rol !== "alumno") {
            return handleErrorClient(res, 403, "Acceso denegado.");
        }

        const [updatedUser, updateError] = await updateUserService({ rut }, body);
        if (updateError) return handleErrorClient(res, 500, "Error al actualizar el usuario", updateError);

        handleSuccess(res, 200, "Usuario alumno actualizado correctamente", updatedUser);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Eliminar un usuario (solo profesores pueden eliminar alumnos)
export async function deleteUser(req, res) {
    try {
        if (req.user.rol !== "profesor") {
            return handleErrorClient(res, 403, "Acceso denegado. Solo los profesores pueden eliminar alumnos.");
        }

        const { rut } = req.query;
        const { error: queryError } = userQueryValidation.validate({ rut });
        if (queryError) {
            return handleErrorClient(res, 400, "Error de validación en la consulta", queryError.message);
        }

        const [userToDelete, errorUser] = await getUserService({ rut });
        if (errorUser) return handleErrorClient(res, 404, "Usuario no encontrado.");

        // Verificar si el usuario a eliminar es un alumno
        if (userToDelete.rol !== "alumno") {
            return handleErrorClient(res, 403, "Acceso denegado. Solo se pueden eliminar usuarios con rol de alumno.");
        }

        const [userDeleted, deleteError] = await deleteUserService({ rut });
        if (deleteError) return handleErrorClient(res, 500, "Error eliminando al usuario", deleteError);

        handleSuccess(res, 200, "Usuario alumno eliminado correctamente", userDeleted);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}