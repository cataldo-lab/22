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

router.get("/alumno/:id_alumno", authorizeRoles("alumno", "profesor"), getCalificacionesByAlumnoId);
router.post("/", authorizeRoles("profesor"), createCalificacion);
router.patch("/", authorizeRoles("profesor"), updateCalificacion);
router.delete("/:id_nota", authorizeRoles("profesor"), deleteCalificacion);




export default router;
