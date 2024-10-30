import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAlumno } from "../middlewares/authorization.middleware.js";
import { getCalificacionesAlumno } from "../controllers/calificacionAlumno.controller.js";

const router = Router();
router.use(authenticateJwt);  


router.get("/self", isAlumno, getCalificacionesAlumno);

export default router;
