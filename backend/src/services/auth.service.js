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
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const profesorRepository = AppDataSource.getRepository(Profesor); // Agregar el repositorio de Profesor
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

    
    const alumno = await alumnoRepository.findOneBy({
      id_usuario: userFound.id_usuario
    });

    
    const profesor = await profesorRepository.findOneBy({
      id_usuario: userFound.id_usuario
    });

    const payload = {
      id_alumno: alumno ? alumno.id_alumno : null,
      id_profesor: profesor ? profesor.id_profesor : null, // Incluir id_profesor si es un profesor
      email: userFound.email,
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

    
    const encryptedPassword = await encryptPassword(userData.password);

    
    const newUser = userRepository.create({
      ...userData,
      password: encryptedPassword,
    });
    await userRepository.save(newUser);

    
    if (userData.rol === "alumno") {
      const newAlumno = alumnoRepository.create({
        id_usuario: newUser.id_usuario, 
        alumno_Pie: userData.alumno_Pie || false, 
      });
      await alumnoRepository.save(newAlumno);

      
      newUser.id_alumno = newAlumno.id_alumno;
      await userRepository.save(newUser);

    } else if (userData.rol === "profesor") {
      const newProfesor = profesorRepository.create({
        id_usuario: newUser.id_usuario, 
        
      });
      await profesorRepository.save(newProfesor);

      
      newUser.id_profesor = newProfesor.id_profesor;
      await userRepository.save(newUser);

    } else {
      throw new Error("Rol inválido. Solo se permiten 'alumno' o 'profesor'.");
    }

    
    return [newUser, null];
  } catch (error) {
    console.error("Error en registerService:", error.message);
    return [null, error.message];
  }
}


