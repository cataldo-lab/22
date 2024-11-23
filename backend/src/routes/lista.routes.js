import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";
import { obtenerAlumnosPorProfesor } from "../controllers/lista.controller.js";

const router = Router();

router.use(authenticateJwt);

router.get("/alumnos", authorizeRoles("profesor"), obtenerAlumnosPorProfesor);

export default router;
