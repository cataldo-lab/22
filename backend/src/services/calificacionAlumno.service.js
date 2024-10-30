"use strict";
import Calificacion from "../entity/calificacion.entity.js";
import { AppDataSource } from "../config/configDb.js";


export async function getCalificacionesAlumnoService(id_alumno) {
    try {
        const calificacionRepository = AppDataSource.getRepository(Calificacion);

        const calificacionesFound = await calificacionRepository.find({ where: { id_alumno } });

        if (calificacionesFound.length === 0) {
            return [null, "Calificaciones no encontradas."];
        }

        return [calificacionesFound, null];
    } catch (error) {
        console.error("Error al obtener las calificaciones:", error);
        return [null, "Error al obtener las calificaciones."];
    }
}
