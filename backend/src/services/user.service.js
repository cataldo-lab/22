"use strict";
import User from "../entity/user.entity.js";
import Alumno from "../entity/alumno.entity.js";
import Profesor from "../entity/profesor.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";





export async function getUserService(id_usuario) {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({
            where: { id_usuario },
        });

        if (!user) {
            return { status: 404, message: "Usuario no encontrado." };
        }

        // Retornar usuario encontrado
        return { status: 200, message: "Usuario encontrado.", data: user };
    } catch (error) {
        console.error("Error al obtener el usuario:", error.message);
        return { status: 500, message: "Error interno del servidor." };
    }
}


// Servicio para actualizar un usuario
export async function updateUserService(authenticatedUser, id_usuario, updateData) {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({ where: { id_usuario } });
        if (!user) {
            return { status: 404, message: "Usuario no encontrado." };
        }

        // Validar permisos del usuario autenticado
        if (authenticatedUser.rol !== "administrador" && authenticatedUser.rol !== "profesor") {
            return { status: 403, message: "Acceso denegado." };
        }

        // Un profesor solo puede actualizar alumnos
        if (authenticatedUser.rol === "profesor" && user.rol !== "alumno") {
            return { status: 403, message: "Los profesores solo pueden actualizar alumnos." };
        }

        // Encriptar nueva contraseña si se proporciona
        if (updateData.password) {
            updateData.password = await encryptPassword(updateData.password);
        }

        // Actualizar usuario
        await userRepository.update({ id_usuario }, updateData);

        const updatedUser = await userRepository.findOne({ where: { id_usuario } });
        return { status: 200, message: "Usuario actualizado correctamente.", data: updatedUser };
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        return { status: 500, message: "Error interno del servidor." };
    }
}


export async function getUsersService(rol) {
    try {
        const userRepository = AppDataSource.getRepository(User);

        // Filtrar usuarios según el rol proporcionado
        const users = await userRepository.find({
            where: { rol },
            relations: rol === "alumno" ? ["alumno"] : ["profesor"], // Relación dinámica
        });

        // Si no se encuentran usuarios con el rol especificado
        if (users.length === 0) {
            return { status: 404, message: `No se encontraron usuarios con el rol de ${rol}.` };
        }

        // Retornar los datos de los usuarios encontrados
        return { status: 200, message: `${rol === "alumno" ? "Alumnos" : "Profesores"} encontrados.`, data: users };
    } catch (error) {
        console.error("Error en getUsersService:", error.message);
        return { status: 500, message: "Error interno del servidor." };
    }
}
