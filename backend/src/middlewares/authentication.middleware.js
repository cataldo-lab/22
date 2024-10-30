"use strict";// authentication.middleware.js""
import jwt from "jsonwebtoken";
import { handleErrorClient } from "../handlers/responseHandlers.js";

export function authenticateJwt(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return handleErrorClient(res, 401, "Acceso denegado. No se proporcionó un token.");
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Contenido de decoded:", decoded); // <-- Verifica que el rol está presente
        req.user = decoded;
        next();
    } catch (error) {
        return handleErrorClient(res, 403, "Token inválido o expirado.");
    }
}
