"use strict";
import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";

import { authenticateJwt } from "../middlewares/authentication.middleware.js";

import {
    createCalificacion,
    deleteCalificacion,
    getCalificacionesByAlumnoId,
    updateCalificacion,
} from "../controllers/calificacion.controller.js";


const router = Router();
router.use(authenticateJwt);

router.get("/alumno/:id_alumno", authorizeRoles("profesor"), getCalificacionesByAlumnoId);
router.post("/", authorizeRoles("profesor"), createCalificacion);
//router.patch("/:id_nota", authorizeRoles("profesor"), updateCalificacion);
router.patch("/:id_nota", (req, res, next) => {
    console.log("Parámetro recibido:", req.params.id_nota);
    next(); // Llama al siguiente middleware
  }, authorizeRoles("profesor"), updateCalificacion);
router.delete("/:id_nota", authorizeRoles("profesor"), deleteCalificacion);




export default router;
