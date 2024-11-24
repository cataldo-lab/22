import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isProfesor } from "../middlewares/authorization.middleware.js";
import { obtenerAlumnosPorProfesor } from "../controllers/lista.controller.js";


const router = Router();
router.get(
    "/alumnos",
    authenticateJwt, // Valida el token JWT y establece `req.user`
    isProfesor, // Verifica que el rol del usuario sea "profesor"
    obtenerAlumnosPorProfesor // Controlador que maneja la solicitud
  );
  

export default router;
