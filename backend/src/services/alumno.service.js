"use strict";
import { AppDataSource } from "../config/configDb.js";
import Evaluado from "../entity/evaluado.entity.js";

export async function getCalificacionesByAlumnoIdService(req) {
    try {
        const evaluadoRepository = AppDataSource.getRepository(Evaluado);

        // Obtener el id_alumno desde req.user (set por el middleware authenticateJwt)
        const { id_alumno } = req.user;

        if (!id_alumno) throw new Error("No se pudo determinar el ID del alumno.");

        // Consultar las calificaciones del alumno
        const calificaciones = await evaluadoRepository.find({
            where: { id_alumno },
            relations: ["asignatura", "alumno"], // Incluir detalles de las relaciones asignatura y alumno
        });

        if (calificaciones.length === 0) throw new Error("No se encontraron calificaciones para este alumno.");

        return [calificaciones, null];
    } catch (error) {
        console.error("Error al obtener las calificaciones:", error.message);
        return [null, error.message];
    }
}
