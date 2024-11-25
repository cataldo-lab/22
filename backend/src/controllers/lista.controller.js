import { getAlumnosPorProfesorService } from "../services/lista.service.js";

export async function getAlumnosPorProfesor(req, res) {
    try {
        const [alumnos, error] = await getAlumnosPorProfesorService(req);

        if (error) {
            return res.status(404).json({ mensaje: error });
        }

        res.status(200).json({
            mensaje: "Alumnos obtenidos exitosamente",
            alumnos,
        });
    } catch (error) {
        console.error("Error en getAlumnosPorProfesor:", error.message);
        res.status(500).json({ mensaje: "Error interno del servidor." });
    }
}
