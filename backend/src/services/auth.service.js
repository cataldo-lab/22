"use strict";
import User from "../entity/user.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";
import Alumno from "../entity/alumno.entity.js";
import Profesor from "../entity/profesor.entity.js";

export async function loginService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { rut, password } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const userFound = await userRepository.findOne({
      where: { rut }
    });

    if (!userFound) {
      return [null, createErrorMessage("rut", "El rut es incorrecto")];
    }

    const isMatch = await comparePassword(password, userFound.password);

    if (!isMatch) {
      return [null, createErrorMessage("password", "La contraseña es incorrecta")];
    }

    const payload = {
      id_profesor: userFound.id_profesor || null, 
      id_alumno: userFound.id_alumno || null,    
      rut: userFound.rut,
      rol: userFound.rol, 
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return [accessToken, null];
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function registerService(userData) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const profesorRepository = AppDataSource.getRepository(Profesor);

    // Encriptar la contraseña
    const encryptedPassword = await encryptPassword(userData.password);

    // Crear el usuario en la tabla `User`
    const newUser = userRepository.create({
      ...userData,
      password: encryptedPassword,
    });
    await userRepository.save(newUser);

    // Asociar el usuario al rol correspondiente
    if (userData.rol === "alumno") {
      const newAlumno = alumnoRepository.create({
        id_usuario: newUser.id_usuario, // Asociar el ID del usuario
        alumno_Pie: userData.alumno_Pie || false, // Campo adicional si existe
      });
      await alumnoRepository.save(newAlumno);

      // Actualizar el `id_alumno` en la tabla `users`
      newUser.id_alumno = newAlumno.id_alumno;
      await userRepository.save(newUser);

    } else if (userData.rol === "profesor") {
      const newProfesor = profesorRepository.create({
        id_usuario: newUser.id_usuario, // Asociar el ID del usuario
        
      });
      await profesorRepository.save(newProfesor);

      // Actualizar el `id_profesor` en la tabla `users`
      newUser.id_profesor = newProfesor.id_profesor;
      await userRepository.save(newUser);

    } else {
      throw new Error("Rol inválido. Solo se permiten 'alumno' o 'profesor'.");
    }

    // Retornar el usuario creado
    return [newUser, null];
  } catch (error) {
    console.error("Error en registerService:", error.message);
    return [null, error.message];
  }
}


