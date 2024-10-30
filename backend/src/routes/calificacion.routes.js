"use strict";
import { Router } from "express";
import { isAlumno, isProfesor } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createCalificacion,
    deleteCalificacion,
    getCalificacionesByAlumnoId,
    getCalificacionesSelf,
    updateCalificacion,
} from "../controllers/calificacion.controller.js";


const router = Router();
router.use(authenticateJwt);
// Rutas CRUD de calificaciones para profesores con validaciones
router.post("/", isProfesor, createCalificacion);
router.get("/:id_alumno", isProfesor, getCalificacionesByAlumnoId);
router.patch("/:id_nota", isProfesor, updateCalificacion);
router.delete("/:id_nota", isProfesor, deleteCalificacion);

//router.get("/self", isAlumno, getCalificacionesSelf);

//cambiar 
export default router;
