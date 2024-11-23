import { AppDataSource } from "../config/configDb.js";
import Alumno from "../entity/alumno.entity.js";

export async function getAlumnosPorProfesor(profesorId) {
    try {
        const alumnos = await AppDataSource
            .getRepository(Alumno)
            .createQueryBuilder("alumno")
            .leftJoinAndSelect("alumno.usuario", "usuario") // Relación alumno-usuario
            .leftJoinAndSelect("alumno.curso", "curso") // Relación alumno-curso
            .leftJoinAndSelect("curso.asignaturas", "asignatura") // Relación curso-asignatura
            .leftJoinAndSelect("asignatura.profesor", "profesor") // Relación asignatura-profesor
            .where("profesor.id_profesor = :profesorId", { profesorId }) // Filtrar por profesor
            .getMany();

        if (!alumnos.length) {
            return {
                status: "Client error",
                message: "No se encontraron alumnos asignados a este profesor.",
            };
        }

        return {
            status: "Success",
            message: "Lista de alumnos obtenida correctamente.",
            data: alumnos,
        };
    } catch (error) {
        console.error("Error en getAlumnosPorProfesor:", error.message);
        return {
            status: "Server error",
            message: "Hubo un error al obtener los alumnos.",
        };
    }
}
