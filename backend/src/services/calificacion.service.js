"use strict";
import Calificacion from "../entity/calificacion.entity.js";
import Asignatura from "../entity/asignatura.entity.js";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";

//no se Toca
export async function createCalificacionService({ id_alumno, id_asignatura, programa_Pie, puntaje_alumno }) {
    try {
        const puntaje_total=70;
        const ponderacion=programa_Pie ? 0.5:0.6;
        const porcentaje_logrado=(puntaje_alumno/puntaje_total)*100;
        let nota = ((porcentaje_logrado-(ponderacion*10))/(100-(ponderacion*10)))*6+1;
        nota=parseFloat(nota.toFixed(2));
        const asignaturaRepository = AppDataSource.getRepository(Asignatura);
        const existeAsignatura = await asignaturaRepository.findOne({ where: { id_asignatura: id_asignatura } });
        if (!existeAsignatura) {
            return [null, "Asignatura no encontrada."];
        }

        const userRepository = AppDataSource.getRepository(User);

        const profesoresAsignatura=await userRepository.find({ 
            where:{ rol:"profesor", 
            },
            select:["id_asignatura"],
         });

        if (!profesoresAsignatura || profesoresAsignatura.length === 0) {
            return [null, "No se encontraron profesores asignados a asignaturas en BD."];
        }

        const idAsignaturasProfe = profesoresAsignatura.map(profesor => profesor.id_asignatura);

        if (!idAsignaturasProfe.includes(id_asignatura)) {
            return [null, "La asignatura no está asociada a un profesor."];
         }


        const alumnoAsignatura=await userRepository.find({ 
            where:{ rol:"alumno", 
            },
            select:["id_asignatura"],
         });

        const idAlumnoAsignatura = alumnoAsignatura.map(alumno => alumno.id_asignatura);
        
        if (!idAlumnoAsignatura.includes(id_asignatura)) {
            return [null, "La asignatura no está asociada a el alumno."];
        }
        const calificacionRepository = AppDataSource.getRepository(Calificacion);


        if (!existeAsignatura) {
            console.log("Error: Asignatura no encontrada");
            return [null, "Asignatura no encontrada."];
        }
        
        if (!profesoresAsignatura || profesoresAsignatura.length === 0) {
            console.log("Error: No se encontraron profesores asignados a asignaturas en BD");
            return [null, "No se encontraron profesores asignados a asignaturas en BD."];
        }
        
        if (!idAsignaturasProfe.includes(id_asignatura)) {
            console.log("Error: La asignatura no está asociada a un profesor");
            return [null, "La asignatura no está asociada a un profesor."];
        }
        
        if (!idAlumnoAsignatura.includes(id_asignatura)) {
            console.log("Error: La asignatura no está asociada al alumno");
            return [null, "La asignatura no está asociada al alumno."];
        }
        const date= new Date();

        const nuevaCalificacion = calificacionRepository.create({
            nota,
            id_alumno,
            id_asignatura,
            programa_Pie,
            puntaje_alumno,
            fecha: date,
        });

        await calificacionRepository.save(nuevaCalificacion);
        return [nuevaCalificacion, null];
    } catch (error) {
        console.error("Error al crear la calificación:", error);
        return [null, "Error al crear la calificación."];
    }
}

export async function getCalificacionesByAlumnoIdService(id_alumno) {
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










export async function updateCalificacionService(id_nota, id_alumno, id_asignatura, programa_Pie, puntaje_alumno) {
    try {
        // Convertimos puntaje_alumno a número y validamos
        const puntaje = parseFloat(puntaje_alumno);
        if (isNaN(puntaje) || puntaje < 0) {
            return [null, "El puntaje del alumno debe ser un número válido y no negativo."];
        }

        // Cálculo de la nueva nota
        const puntaje_total = 70;
        const ponderacion = programa_Pie ? 0.5 : 0.6;
        const porcentaje_logrado = (puntaje / puntaje_total) * 100;
        const nuevaNota = ((porcentaje_logrado - (ponderacion * 10)) / (100 - (ponderacion * 10))) * 6 + 1;

        if (isNaN(nuevaNota) || nuevaNota < 1 || nuevaNota > 7) {
            return [null, "Error en el cálculo de la nota. Verifique los datos proporcionados."];
        }

        const calificacionRepository = AppDataSource.getRepository(Calificacion);

        // Buscar la calificación
        const calificacion = await calificacionRepository.findOne({ where: { id_nota } });
        if (!calificacion) {
            return [null, "Calificación no encontrada."];
        }

        // Actualizar los campos de la calificación
        calificacion.id_alumno = id_alumno;
        calificacion.id_asignatura = id_asignatura;
        calificacion.programa_Pie = programa_Pie;
        calificacion.puntaje_alumno = puntaje;
        calificacion.nota = parseFloat(nuevaNota.toFixed(2));  // Aseguramos que es un número con 2 decimales
        calificacion.updatedAt = new Date();

        // Guardar cambios
        await calificacionRepository.save(calificacion);

        return [calificacion, null];
    } catch (error) {
        console.error("Error al actualizar la calificación:", error);
        return [null, "Error al actualizar la calificación."];
    }
}





export async function deleteCalificacionService(id_nota) {
    try {
        const calificacionRepository = AppDataSource.getRepository(Calificacion);

        const calificacion = await calificacionRepository.findOne({ where: { id_nota } });
        if (!calificacion) {
            return [null, "Calificación no encontrada."];
        }

        await calificacionRepository.remove(calificacion);

        return [calificacion, null];
    } catch (error) {
        console.error("Error al eliminar la calificación:", error);
        return [null, "Error al eliminar la calificación."];
    }
}
