import { AppDataSource } from "../config/configDb.js";
import Profesor from "../entity/profesor.entity.js";

async function obtenerAlumnosPorProfesor(idProfesor) {
    try {
        const profesorRepository = AppDataSource.getRepository(Profesor);

        // Buscar al profesor con sus asignaturas y alumnos asociados
        const profesor = await profesorRepository
            .createQueryBuilder("profesor")
            .leftJoinAndSelect("profesor.asignaturas", "asignatura") // Relación profesor -> asignaturas
            .leftJoinAndSelect("asignatura.alumnos", "alumno")      // Relación asignatura -> alumnos
            .where("profesor.id_profesor = :idProfesor", { idProfesor })
            .getOne();

        if (!profesor) {
            return { mensaje: `No se encontraron alumnos para el profesor con ID ${idProfesor}.` };
        }

        // Obtener alumnos únicos de todas las asignaturas del profesor
        const alumnos = profesor.asignaturas.flatMap(asignatura => asignatura.alumnos);

        return alumnos;
    } catch (error) {
        console.error("❌ Error al obtener alumnos por profesor:", error.message);
        throw error;
    }
}

export default obtenerAlumnosPorProfesor;
