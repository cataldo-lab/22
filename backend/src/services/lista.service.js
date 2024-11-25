import { AppDataSource } from "../config/configDb.js";
import ProfesorSchema from "../entity/profesor.entity.js";

export async function getAlumnosPorProfesorService(req) {
    try {
        // Extraer el ID del profesor desde el token del usuario autenticado
        const { id_profesor } = req.user;

        if (!id_profesor) {
            throw new Error("El token no contiene un ID de profesor válido.");
        }

        // Obtener el repositorio de Profesores
        const profesorRepository = AppDataSource.getRepository(ProfesorSchema);

        // Buscar al profesor con sus asignaturas y alumnos relacionados
        const profesor = await profesorRepository.findOne({
            where: { id_profesor },
            relations: ["asignaturas.alumnos"], // Relación anidada
        });

        if (!profesor) {
            throw new Error("Profesor no encontrado.");
        }

        // Extraer los alumnos de las asignaturas relacionadas con el profesor
        const alumnos = profesor.asignaturas.flatMap(asignatura => asignatura.alumnos);

        // Eliminar duplicados en caso de que un alumno esté en varias asignaturas
        const alumnosUnicos = Array.from(new Map(alumnos.map(a => [a.id_alumno, a])).values());

        return [alumnosUnicos, null];
    } catch (error) {
        console.error("Error al obtener alumnos por profesor:", error.message);
        return [null, error.message];
    }
}
