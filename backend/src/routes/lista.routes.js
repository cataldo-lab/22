import express from "express";
import getAlumnosPorProfesor from "../controllers/lista.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";


const router = express.Router();

router.use(authenticateJwt);
router.get("/profesor/:idProfesor/alumnos", (req, res, next) => {
    console.log("📥 Ruta ingresada correctamente con ID Profesor:", req.params.idProfesor);
    next();
}, getAlumnosPorProfesor);

//router.get("/profesor/:idProfesor/alumnos", authorizeRoles("profesor"), getAlumnosPorProfesor);

export default router;
