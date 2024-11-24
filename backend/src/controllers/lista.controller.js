"use strict";
import { getAlumnosByProfesor } from "../services/lista.service.js";

export async function obtenerAlumnosPorProfesor(req, res) {
  try {
    const { id_profesor } = req.user;

    if (!id_profesor) {
      return res.status(403).json({ message: "No tienes permiso para realizar esta acción." });
    }

    const alumnos = await getAlumnosByProfesor(id_profesor);

    return res.status(200).json({
      message: "Lista de alumnos obtenida correctamente.",
      data: alumnos,
    });
  } catch (error) {
    console.error("Error en obtenerAlumnosPorProfesor:", error.message);
    return res.status(500).json({ message: error.message || "Error interno del servidor." });
  }
}
