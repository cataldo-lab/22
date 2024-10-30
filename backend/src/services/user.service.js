"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

// Servicio para crear un nuevo usuario
export async function createUserService(userData) {
    try {
        const userRepository = AppDataSource.getRepository(User);
        userData.password = await encryptPassword(userData.password);

        // Crear el nuevo usuario
        const newUser = userRepository.create(userData);
        await userRepository.save(newUser);
        return [newUser, null];
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        return [null, "Error interno del servidor"];
    }
}

// Servicio para obtener un usuario por rut
export async function getUserService(query) {
    try {
        const { rut } = query;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { rut } });
        if (!user) return [null, "Usuario no encontrado"];
        return [user, null];
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        return [null, "Error interno del servidor"];
    }
}

// Servicio para obtener todos los usuarios con rol de alumno
export async function getUsersService() {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find({
            where: { rol: "alumno" }, // Solo traer usuarios con rol de alumno
        });
        return [users, null];
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        return [null, "Error interno del servidor"];
    }
}

// Servicio para actualizar un usuario
export async function updateUserService(query, body) {
    try {
        const { rut } = query;
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({ where: { rut } });
        if (!user) return [null, "Usuario no encontrado"];

        // Actualizar la información del usuario
        if (body.password) {
            body.password = await encryptPassword(body.password);
        }

        await userRepository.update({ rut: user.rut }, body);
        const updatedUser = await userRepository.findOne({ where: { rut } });

        return [updatedUser, null];
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        return [null, "Error interno del servidor"];
    }
}

// Servicio para eliminar un usuario (solo se elimina si es alumno)
export async function deleteUserService(query) {
    try {
        const { rut } = query;
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({ where: { rut } });
        if (!user) return [null, "Usuario no encontrado"];

        // Verificar si el usuario es un alumno antes de eliminarlo
        if (user.rol !== "alumno") {
            return [null, "Solo se pueden eliminar usuarios con rol de alumno"];
        }

        await userRepository.remove(user);
        return [user, null];
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        return [null, "Error interno del servidor"];
    }
}