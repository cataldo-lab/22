"use strict";
import { AppDataSource } from "../config/configDb.js";
import ProfesorAlumnosView from "../entity/ProfesorAlumnos.view.js";

export async function getAlumnosByProfesor(idProfesor) {
  try {
    const vistaRepository = AppDataSource.getRepository(ProfesorAlumnosView);

    // Filtrar por el ID del profesor autenticado
    const alumnos = await vistaRepository.find({
      where: { id_profesor: idProfesor },
      select: [
        "id_alumno",
        "alumno_nombre",
        "alumno_apellido",
        "nivel_curso",
        "seccion_curso",
      ],
    });

    if (!alumnos.length) {
      throw new Error("No se encontraron alumnos asignados para este profesor.");
    }

    return alumnos;
  } catch (error) {
    console.error("Error en getAlumnosByProfesor:", error.message);
    throw new Error("Error al obtener alumnos asignados.");
  }
}
