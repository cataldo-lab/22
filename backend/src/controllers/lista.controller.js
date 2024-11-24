import obtenerAlumnosPorProfesor from "../services/lista.service.js";

async function getAlumnosPorProfesor(req, res) {
    console.log("📥 Controlador ingresado correctamente con ID Profesor:", req.params.idProfesor);
    const { idProfesor } = req.params; // Extraer el ID del profesor de los parámetros

    try {
        const alumnos = await obtenerAlumnosPorProfesor(idProfesor);

        if (!alumnos || alumnos.length === 0) {
            return res.status(404).json({ mensaje: "No se encontraron alumnos asociados a este profesor." });
        }

        res.status(200).json(alumnos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error interno al obtener los alumnos.", error: error.message });
    }
}

export default getAlumnosPorProfesor;
