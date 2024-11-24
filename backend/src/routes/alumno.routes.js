"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { getOwnCalificaciones } from "../controllers/alumno.controller.js";
import { isAlumno } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);
router.get("/calificaciones", isAlumno, getOwnCalificaciones);

export default router;
