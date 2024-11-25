import { Router } from "express";
import { getAlumnosPorProfesor } from "../controllers/lista.controller.js";
import { isProfesor } from "../middlewares/authorization.middleware.js";

import { authenticateJwt } from "../middlewares/authentication.middleware.js";


const router = Router();
router.use(authenticateJwt);

// Ruta para obtener alumnos por profesor
router.get("/profesor/alumnos", isProfesor, getAlumnosPorProfesor);

export default router;
