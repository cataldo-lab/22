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
            relations: ["asignaturas.alumnos.usuario"], // Relación completa
        });

        if (!profesor) {
            throw new Error("Profesor no encontrado.");
        }

        // Extraer los alumnos con sus asignaturas
        const datos = profesor.asignaturas.flatMap(asignatura =>
            asignatura.alumnos.map(alumno => ({
                idAlumno: alumno.id_alumno,
                rut: alumno.usuario.rut,
                nombre: alumno.usuario.nombre,
                apellido: alumno.usuario.apellido,
                nombreAsignatura: asignatura.nombre_asignatura,
                idAsignatura: asignatura.id_asignatura,
            }))
        );

        return [datos, null];
    } catch (error) {
        console.error("Error al obtener alumnos por profesor:", error.message);
        return [null, error.message];
    }
}
