"use strict";
import { Router } from "express";
import { getCalificacionesAlumno } from "../controllers/alumno.controller.js";
import { isAlumno } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";


const router = Router();

router.use(authenticateJwt);
router.get("/", isAlumno, getCalificacionesAlumno);

export default router;
