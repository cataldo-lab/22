import { getAlumnosPorProfesor } from "../services/lista.service.js";

export async function obtenerAlumnosPorProfesor(req, res) {
    try {
        const profesorId = req.user.id_profesor; // Extraer el id_profesor del token JWT

        // Validar si el id_profesor está presente
        if (!profesorId) {
            return res.status(403).json({
                status: "Client error",
                message: "No tienes permisos para acceder a esta información.",
            });
        }

        // Llamar al servicio para obtener la lista de alumnos
        const response = await getAlumnosPorProfesor(profesorId);

        // Responder al cliente con el resultado
        if (response.status === "Success") {
            return res.status(200).json(response);
        } else {
            return res.status(404).json(response);
        }
    } catch (error) {
        console.error("Error en obtenerAlumnosPorProfesor:", error.message);
        return res.status(500).json({
            status: "Server error",
            message: "Error interno al obtener los alumnos.",
        });
    }
}
