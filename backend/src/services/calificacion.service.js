"use strict";
import { getRepository } from "typeorm";
import Alumno from "../entity/alumno.entity.js";
import Asignatura from "../entity/asignatura.entity.js";
import Evaluado from "../entity/evaluado.entity.js";
import { AppDataSource } from "../config/configDb.js";




export async function createCalificacionService({ id_alumno, id_asignatura, puntaje_alumno }) {
    try {
        const alumnoRepository = AppDataSource.getRepository(Alumno);
        const asignaturaRepository = AppDataSource.getRepository(Asignatura);
        const evaluadoRepository = AppDataSource.getRepository(Evaluado);

        // Validar existencia de alumno
        const alumno = await alumnoRepository.findOneBy({ id_alumno });
        if (!alumno) throw new Error("Alumno no encontrado.");

        // Validar si pertenece al programa PIE
        const tipo_evaluacion = alumno.alumno_Pie ? "PIE" : "ESTÁNDAR";

        // Validar existencia de asignatura
        const asignatura = await asignaturaRepository.findOneBy({ id_asignatura });
        if (!asignatura) throw new Error("Asignatura no encontrada.");

        // Calcular la nota
        const puntaje_total = 70;
        const ponderacion = tipo_evaluacion === "PIE" ? 0.5 : 0.6;
        const porcentaje_logrado = (puntaje_alumno / puntaje_total) * 100;
        let nota = ((porcentaje_logrado - (ponderacion * 10)) / (100 - (ponderacion * 10))) * 6 + 1;
        nota = parseFloat(nota.toFixed(2));

        // Crear y guardar la calificación
        const nuevaCalificacion = evaluadoRepository.create({
            id_alumno,
            id_asignatura,
            tipo_evaluacion,
            puntaje_alumno,
            nota,
            fecha: new Date(),
        });
        await evaluadoRepository.save(nuevaCalificacion);

        return [nuevaCalificacion, null];
    } catch (error) {
        console.error("Error al crear la calificación:", error.message);
        return [null, error.message];
    }
}

export async function getCalificacionesByAlumnoIdService(id_alumno) {
    try {
        const evaluadoRepository = AppDataSource.getRepository(Evaluado);

        const calificaciones = await evaluadoRepository.find({
            where: { id_alumno },
            relations: ["asignatura", "alumno"],
        });

        if (calificaciones.length === 0) throw new Error("No se encontraron calificaciones para este alumno.");

        return [calificaciones, null];
    } catch (error) {
        console.error("Error al obtener las calificaciones:", error.message);
        return [null, error.message];
    }
}

export async function updateCalificacionService(id_nota, id_alumno, id_asignatura, puntaje_alumno) {
    try {
        const alumnoRepository = AppDataSource.getRepository(Alumno);
        const asignaturaRepository = AppDataSource.getRepository(Asignatura);
        const evaluadoRepository = AppDataSource.getRepository(Evaluado);

        // Validar existencia de la calificación
        const calificacion = await evaluadoRepository.findOneBy({ id_nota });
        if (!calificacion) throw new Error("Calificación no encontrada.");

        // Validar existencia del alumno
        const alumno = await alumnoRepository.findOneBy({ id_alumno });
        if (!alumno) throw new Error("Alumno no encontrado.");

        // Determinar si pertenece al programa PIE
        const tipo_evaluacion = alumno.alumno_Pie ? "PIE" : "ESTÁNDAR";

        // Validar existencia de la asignatura
        const asignatura = await asignaturaRepository.findOneBy({ id_asignatura });
        if (!asignatura) throw new Error("Asignatura no encontrada.");

        // Recalcular la nota
        const puntaje_total = 70;
        const ponderacion = tipo_evaluacion === "PIE" ? 0.5 : 0.6;
        const porcentaje_logrado = (puntaje_alumno / puntaje_total) * 100;
        let nuevaNota = ((porcentaje_logrado - (ponderacion * 10)) / (100 - (ponderacion * 10))) * 6 + 1;
        nuevaNota = parseFloat(nuevaNota.toFixed(2));

        // Actualizar la calificación existente
        Object.assign(calificacion, {
            id_alumno,
            id_asignatura,
            tipo_evaluacion,
            puntaje_alumno,
            nota: nuevaNota,
            updatedAt: new Date(),
        });

        await evaluadoRepository.save(calificacion);

        return [calificacion, null];
    } catch (error) {
        console.error("Error al actualizar la calificación:", error.message);
        return [null, error.message];
    }
}


export async function deleteCalificacionService(id_nota) {
    try {
        const evaluadoRepository = AppDataSource.getRepository(Evaluado);

        // Buscar la calificación por su ID
        const calificacion = await evaluadoRepository.findOneBy({ id_nota });
        if (!calificacion) {
            return [null, "Calificación no encontrada."];
        }

        // Eliminar la calificación
        await evaluadoRepository.remove(calificacion);

        return [calificacion, null];
    } catch (error) {
        console.error("Error al eliminar la calificación:", error.message);
        return [null, "Error al eliminar la calificación."];
    }
}