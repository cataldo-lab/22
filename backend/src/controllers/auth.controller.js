"use strict";
import { loginService, registerService } from "../services/auth.service.js";
import {
  loginValidation,
  registerValidation,
} from "../validations/auth.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";


// Controlador para iniciar sesión con rol alumno o profesor
export async function login(req, res) {
  try {
    const { body } = req;

    const { error } = loginValidation.validate(body);

    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }
    const [accessToken, errorToken] = await loginService(body);

    if (errorToken) return handleErrorClient(res, 400, "Error iniciando sesión", errorToken);

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    handleSuccess(res, 200, "Inicio de sesión exitoso", { token: accessToken });
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para registrar un nuevo usuario en la base de datos
export async function register(req, res) {
  try {
      const { body } = req;
      console.log("Datos recibidos en register:", body);

      const { error } = registerValidation.validate(body, { abortEarly: false });
      if (error) {
          console.log("Error de validación:", error.details);
          return handleErrorClient(
              res,
              400,
              "Error de validación. Por favor, revisa los datos enviados.",
              error.details.map((detail) => detail.message).join(", ")
          );
      }

      const [newUser, errorNewUser] = await registerService(body);
      if (errorNewUser) {
          console.log("Error al crear el usuario:", errorNewUser);
          return handleErrorClient(res, 400, "Error registrando al usuario", errorNewUser);
      }

      handleSuccess(res, 201, "Usuario registrado con éxito", newUser);
  } catch (error) {
      console.error("Error en register:", error.message, error.stack);
      handleErrorServer(res, 500, "Error interno del servidor.");
  }
}

// Controlador para cerrar sesión
export async function logout(req, res) {
  try {
    res.clearCookie("jwt", { httpOnly: true });
    handleSuccess(res, 200, "Sesión cerrada exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Controlador para obtener el perfil del alumno
export function generarTokenAlumno(alumno) {
  const payload = {
      id_alumno: alumno.id_alumno, 
      email: alumno.email,
      rut: alumno.rut,
      rol: alumno.rol,
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
}