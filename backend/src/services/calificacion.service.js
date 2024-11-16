import { AppDataSource } from "../config/configDb.js";
import Evaluado from "../entity/evaluado.entity.js";

// Obtener calificaciones propias del alumno
export async function getSelfCalificacionesService(id_alumno) {
    try {
        const evaluadoRepository = AppDataSource.getRepository(Evaluado);

        const calificaciones = await evaluadoRepository.find({
            where: { id_alumno },
            relations: ["asignatura"], // Incluir datos de asignatura si es necesario
        });

        if (calificaciones.length === 0) {
            return [null, "No se encontraron calificaciones para este alumno."];
        }

        return [calificaciones, null];
    } catch (error) {
        console.error("Error en getSelfCalificacionesService:", error.message);
        return [null, "Error al obtener las calificaciones."];
    }
}

// Crear una nueva calificación
export async function createCalificacionService(data) {
    try {
        const evaluadoRepository = AppDataSource.getRepository(Evaluado);
        const nuevaCalificacion = evaluadoRepository.create(data);
        await evaluadoRepository.save(nuevaCalificacion);
        return [nuevaCalificacion, null];
    } catch (error) {
        console.error("Error en createCalificacionService:", error.message);
        return [null, "Error al crear la calificación."];
    }
}

// Actualizar una calificación existente
export async function updateCalificacionService(id_nota, data) {
    try {
        const evaluadoRepository = AppDataSource.getRepository(Evaluado);
        const calificacion = await evaluadoRepository.findOne({ where: { id_nota } });

        if (!calificacion) {
            return [null, "La calificación no existe."];
        }

        evaluadoRepository.merge(calificacion, data);
        await evaluadoRepository.save(calificacion);

        return [calificacion, null];
    } catch (error) {
        console.error("Error en updateCalificacionService:", error.message);
        return [null, "Error al actualizar la calificación."];
    }
}

// Eliminar una calificación existente
export async function deleteCalificacionService(id_nota) {
    try {
        const evaluadoRepository = AppDataSource.getRepository(Evaluado);
        const calificacion = await evaluadoRepository.findOne({ where: { id_nota } });

        if (!calificacion) {
            return [null, "La calificación no existe."];
        }

        await evaluadoRepository.remove(calificacion);
        return [true, null];
    } catch (error) {
        console.error("Error en deleteCalificacionService:", error.message);
        return [null, "Error al eliminar la calificación."];
    }
}
