"use strict";
import { getRepository } from "typeorm";
import Alumno from "../entity/alumno.entity.js";
import Asignatura from "../entity/asignatura.entity.js";
import Evaluado from "../entity/evaluado.entity.js";
import Usuarios from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";




export async function createCalificacionService({ rut_alumno, id_asignatura, puntaje_alumno, puntaje_total }) {
    try {
        const usuarioRepository = AppDataSource.getRepository(Usuarios);
        const alumnoRepository = AppDataSource.getRepository(Alumno);
        const asignaturaRepository = AppDataSource.getRepository(Asignatura);
        const evaluadoRepository = AppDataSource.getRepository(Evaluado);

       
        const usuario = await usuarioRepository.findOneBy({ rut: rut_alumno });
        if (!usuario) throw new Error("Alumno no encontrado con el rut proporcionado.");

        const id_alumno = usuario.id_alumno;

        
        const alumno = await alumnoRepository.findOneBy({ id_alumno });
        if (!alumno) throw new Error("Alumno no encontrado en la base de datos.");

        // Alumno pertenerce al programa PIE?
        const tipo_evaluacion = alumno.alumno_Pie ? "PIE" : "ESTÁNDAR";

        // Asignatura existe?
        const asignatura = await asignaturaRepository.findOneBy({ id_asignatura });
        if (!asignatura) throw new Error("Asignatura no encontrada.");

        // Calcular la nota
        
        const exigencia = tipo_evaluacion === "PIE" ? 0.5 : 0.6;
        const porcentaje_logrado = (puntaje_alumno / puntaje_total)*100;
        const umbral_exigencia = exigencia * 10;
        const escala_logro = 100 - umbral_exigencia;
        let nota = ((porcentaje_logrado - umbral_exigencia) / escala_logro) * 6 + 1;
        nota = Math.max(1, Math.min(7, nota));

        //Codigo anterior de nota
        //let nota = ((porcentaje_logrado - (exigencia * 10)) / (100 - (exigencia * 10))) * 6 + 1;
        nota = parseFloat(nota.toFixed(2));

        
        const nuevaCalificacion = evaluadoRepository.create({
            id_alumno,
            id_asignatura,
            tipo_evaluacion,
            puntaje_alumno,
            puntaje_total,
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

export async function updateCalificacionService({ id_nota, id_alumno, id_asignatura, puntaje_alumno, puntaje_total }) {
    try {
        const alumnoRepository = AppDataSource.getRepository(Alumno);
        const asignaturaRepository = AppDataSource.getRepository(Asignatura);
        const evaluadoRepository = AppDataSource.getRepository(Evaluado);

        
        const calificacion = await evaluadoRepository.findOneBy({ id_nota });
        if (!calificacion) throw new Error("Calificación no encontrada.");

        
        const alumno = await alumnoRepository.findOneBy({ id_alumno });
        if (!alumno) throw new Error("Alumno no encontrado.");

        // Alumno pertenece al programa PIE?
        const tipo_evaluacion = alumno.alumno_Pie ? "PIE" : "ESTÁNDAR";

        // Validar existencia de la asignatura
        const asignatura = await asignaturaRepository.findOneBy({ id_asignatura });
        if (!asignatura) throw new Error("Asignatura no encontrada.");

        // Calcular la nota
        const exigencia = tipo_evaluacion === "PIE" ? 0.5 : 0.6;
        const porcentaje_logrado = (puntaje_alumno / puntaje_total)*100;
        const umbral_exigencia = exigencia * 10;
        const escala_logro = 100 - umbral_exigencia;
        let nota = ((porcentaje_logrado - umbral_exigencia) / escala_logro) * 6 + 1;
        nota = Math.max(1, Math.min(7, nota));

        //Codigo anterior de nota
        //let nota = ((porcentaje_logrado - (exigencia * 10)) / (100 - (exigencia * 10))) * 6 + 1;
        nota = parseFloat(nota.toFixed(2));

        Object.assign(calificacion, {
            id_alumno,
            id_asignatura,
            tipo_evaluacion,
            puntaje_alumno,
            puntaje_total,
            nota,
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

        
        const calificacion = await evaluadoRepository.findOneBy({ id_nota });
        if (!calificacion) {
            return [null, "Calificación no encontrada."];
        }

        
        await evaluadoRepository.remove(calificacion);

        return [calificacion, null];
    } catch (error) {
        console.error("Error al eliminar la calificación:", error.message);
        return [null, "Error al eliminar la calificación."];
    }
}