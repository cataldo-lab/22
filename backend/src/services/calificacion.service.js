"use strict";
import { getRepository } from "typeorm";
import Alumno from "../entity/alumno.entity.js";
import Asignatura from "../entity/asignatura.entity.js";
import Evaluado from "../entity/evaluado.entity.js";

const calcularNota = (puntaje_alumno, tipo_evaluacion) => {
    const puntaje_total = 70;
    const ponderacion = tipo_evaluacion === "PIE" ? 0.5 : 0.6;
    const porcentaje_logrado = (puntaje_alumno / puntaje_total) * 100;
    const nota = ((porcentaje_logrado - (ponderacion * 10)) / (100 - (ponderacion * 10))) * 6 + 1;
    return parseFloat(nota.toFixed(2));
};

const obtenerEntidadPorId = async (repository, id, nombreEntidad) => {
    const entidad = await repository.findOne(id);
    if (!entidad) throw new Error(`${nombreEntidad} no encontrado.`);
    return entidad;
};

export async function createCalificacionService({ id_alumno, id_asignatura, tipo_evaluacion, puntaje_alumno }) {
    try {
        const alumnoRepository = AppDataSource.getRepository(Alumno);
        const asignaturaRepository = AppDataSource.getRepository(Asignatura);
        const evaluadoRepository = AppDataSource.getRepository(Evaluado);

        // Validar existencia de alumno y asignatura
        const alumno = await alumnoRepository.findOneBy({ id_alumno });
        if (!alumno) throw new Error("Alumno no encontrado.");

        const asignatura = await asignaturaRepository.findOneBy({ id_asignatura });
        if (!asignatura) throw new Error("Asignatura no encontrada.");

        // Calcular la nota
        const nota = calcularNota(puntaje_alumno, tipo_evaluacion);

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

export async function updateCalificacionService(id_nota, id_alumno, id_asignatura, tipo_evaluacion, puntaje_alumno) {
    try {
        const evaluadoRepository = getRepository(Evaluado);

        // Buscar la calificación existente
        const calificacion = await obtenerEntidadPorId(evaluadoRepository, id_nota, "Calificación");

        // Calcular nueva nota
        const nuevaNota = calcularNota(puntaje_alumno, tipo_evaluacion);

        // Actualizar la calificación
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
        const evaluadoRepository = getRepository(Evaluado);

        // Buscar la calificación
        const calificacion = await obtenerEntidadPorId(evaluadoRepository, id_nota, "Calificación");

        // Eliminar la calificación
        await evaluadoRepository.remove(calificacion);

        return [calificacion, null];
    } catch (error) {
        console.error("Error al eliminar la calificación:", error.message);
        return [null, error.message];
    }
}
