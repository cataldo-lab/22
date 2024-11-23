"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import calificacionesRoutes from "./calificacion.routes.js";
import listaRoutes from "./lista.routes.js";


const router = Router();

// Registro de rutas principales
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/calificaciones", calificacionesRoutes);
router.use("/lista", listaRoutes);


export default router;
