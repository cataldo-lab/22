"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";
/*
export async function isProfesor(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: { rut: req.user.rut },
    });

    if (!userFound) {
      return handleErrorClient(
        res,
        404,
        "Usuario no encontrado en la base de datos"
      );
    }

    const rolUser = userFound.rol;

    if (rolUser !== "profesor") {
      return handleErrorClient(
        res,
        403,
        "Error al acceder al recurso",
        "Se requiere un rol de profesor para realizar esta acción."
      );
    }
    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}*/

export async function isAlumno(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: { rut: req.user.rut },
    });

    if (!userFound) {
      return handleErrorClient(
        res,
        404,
        "Usuario no encontrado en la base de datos"
      );
    }

    const rolUser = userFound.rol;

    if (rolUser !== "alumno") {
      return handleErrorClient(
        res,
        403,
        "Error al acceder al recurso",
        "Se requiere un rol de alumno para realizar esta acción."
      );
    }
    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function isAdmin(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: { rut: req.user.rut },
    });

    if (!userFound) {
      return handleErrorClient(
        res,
        404,
        "Usuario no encontrado en la base de datos"
      );
    }

    const rolUser = userFound.rol;

    if (rolUser !== "administrador") {
      return handleErrorClient(
        res,
        403,
        "Error al acceder al recurso",
        "Se requiere un rol de administrador para realizar esta acción."
      );
    }
    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

async function checkRole(req, res, next, rolesToCheck) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userRoles = Array.isArray(user.rol) ? user.rol : [user.rol];

    const hasRole = userRoles.some((role) => rolesToCheck.includes(role));

    if (hasRole) {
      return next();
    }

    return res.status(401).json({
      message: "No tienes los permisos necesarios para realizar esta acción",
    });
  } catch (error) {
    return res.status(500).json({
      message: "authorization.middleware -> checkRole()",
      error: error.message,
    });
  }
}

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    checkRole(req, res, next, roles);
  };
}

export async function isProfesor(req, res, next) {
  try {
    console.log("Contenido de req.user en isProfesor:", req.user);

    // Verificar que el token incluye `id_profesor`
    if (!req.user || !req.user.id_profesor) {
      return res.status(403).json({
        message: "Acceso denegado. El token no contiene un ID de profesor válido.",
      });
    }
    if (typeof req.user.id_profesor !== "number") {
      return res.status(400).json({
        message: "Formato inválido de ID de profesor. Se esperaba un número.",
      });
    }

    console.log("Acceso autorizado para profesor con ID:", req.user.id_profesor);
    next();
  } catch (error) {
    console.error("Error en isProfesor:", error.message);
    res.status(500).json({
      message: "Error interno del servidor.",
      error: error.message,
    });
  }
}
