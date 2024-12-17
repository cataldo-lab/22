"use strict";

import { getCalificacionesByAlumnoIdService } from "../services/alumno.service.js";

// Controlador donde cada alumno obtiene sus notas de todos sus ramos
export async function getCalificacionesAlumno(req, res) {
    try {
        
        const [calificaciones, error] = await getCalificacionesByAlumnoIdService(req);

        if (error) {
            return res.status(404).json({ mensaje: error });
        }

        res.status(200).json(calificaciones);
    } catch (error) {
        console.error("Error en getCalificacionesAlumno:", error.message);
        res.status(500).json({ mensaje: "Error interno del servidor." });
    }
}
