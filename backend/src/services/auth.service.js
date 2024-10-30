"use strict";
import User from "../entity/user.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

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
      nombreCompleto: userFound.nombreCompleto,
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


export async function registerService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const { nombre,apellido, rut, email } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const existingEmailUser = await userRepository.findOne({
      where: {
        email,
      },
    });
    
    if (existingEmailUser) return [null, createErrorMessage("email", "Correo electrónico en uso")];

    const existingRutUser = await userRepository.findOne({
      where: {
        rut,
      },
    });

    if (existingRutUser) return [null, createErrorMessage("rut", "Rut ya asociado a una cuenta")];

    const newUser = userRepository.create({
      nombre,
      apellido,
      email,
      rut,
      password: await encryptPassword(user.password),
      rol: "alumno",
    });

    await userRepository.save(newUser);

    const { password, ...dataUser } = newUser;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al registrar un usuario", error);
    return [null, "Error interno del servidor"];
  }
}