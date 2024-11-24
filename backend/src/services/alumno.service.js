"use strict";
import { AppDataSource } from "../config/configDb.js";
import Evaluado from "../entity/evaluado.entity.js";

export async function getOwnCalificacionesService(req) {
    try {
        const id_alumno = req.user?.id; // Extraer el ID del alumno del token JWT

        // Validar que el ID del alumno esté presente en el token
        if (!id_alumno) {
            throw new Error("Acceso denegado. No se encontró el ID del alumno en el token.");
        }

        const evaluadoRepository = AppDataSource.getRepository(Evaluado);

        // Buscar las calificaciones del alumno
        const calificaciones = await evaluadoRepository.find({
            where: { id_alumno },
            relations: ["asignatura"], // Relacionar con la tabla de asignaturas
        });

        if (!calificaciones.length) {
            throw new Error(`No se encontraron calificaciones para el alumno con ID ${id_alumno}.`);
        }

        return [calificaciones, null];
    } catch (error) {
        console.error("Error en getOwnCalificacionesService:", error.message);
        return [null, error.message];
    }
}