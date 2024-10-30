"use strict";
import Joi from "joi";

// Esquema de validación para el inicio de sesión
export const loginValidation = Joi.object({
    rut: Joi.string()
        .min(9)
        .max(12)
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
        .required()
        .messages({
            "string.empty": "El rut no puede estar vacío.",
            "string.base": "El rut debe ser de tipo string.",
            "string.min": "El rut debe tener como mínimo 9 caracteres.",
            "string.max": "El rut debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
            "any.required": "El rut es un campo obligatorio."
        }),
    password: Joi.string()
        .min(8)
        .max(26)
        .pattern(/^[a-zA-Z0-9]+$/)
        .required()
        .messages({
            "string.empty": "La contraseña no puede estar vacía.",
            "string.base": "La contraseña debe ser de tipo string.",
            "string.min": "La contraseña debe tener como mínimo 8 caracteres.",
            "string.max": "La contraseña debe tener como máximo 26 caracteres.",
            "string.pattern.base": "La contraseña solo puede contener letras y números.",
            "any.required": "La contraseña es un campo obligatorio."
        })
});

const domainEmailValidator = (value, helper) => {
    if (!value.endsWith("@gmail.cl")) {
      return helper.message(
        "El correo electrónico debe finalizar en @gmail.cl."
      );
    }
    return value;
  };

export const registerValidation = Joi.object({
    nombre: Joi.string()
      .min(10)
      .max(50)
      .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .required()
      .messages({
        "string.empty": "El nombre no puede estar vacío.",
        "any.required": "El nombre es obligatorio.",
        "string.base": "El nombre debe ser de tipo texto.",
        "string.min": "El nombre debe tener al menos 10 caracteres.",
        "string.max": "El nombre  debe tener como máximo 50 caracteres.",
        "string.pattern.base": "El nombre  solo puede contener letras y espacios.",
      }),
      apellido: Joi.string()
      .min(10)
      .max(50)
      .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .required()
      .messages({
        "string.empty": "El  apellido no puede estar vacío.",
        "any.required": "El apellido es obligatorio.",
        "string.base": "El apellido debe ser de tipo texto.",
        "string.min": "El apellido debe tener al menos 15 caracteres.",
        "string.max": "El apellido debe tener como máximo 50 caracteres.",
        "string.pattern.base": "El apellido solo puede contener letras y espacios.",
      }),
      rut: Joi.string()
      .min(9)
      .max(12)
      .required()
      .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
      .messages({
        "string.empty": "El rut no puede estar vacío.",
        "string.base": "El rut debe ser de tipo string.",
        "string.min": "El rut debe tener como mínimo 9 caracteres.",
        "string.max": "El rut debe tener como máximo 12 caracteres.",
        "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
      }),
    email: Joi.string()
      .min(15)
      .max(35)
      .email()
      .required()
      .messages({
        "string.empty": "El correo electrónico no puede estar vacío.",
        "any.required": "El correo electrónico es obligatorio.",
        "string.base": "El correo electrónico debe ser de tipo texto.",
        "string.email": "El correo electrónico debe finalizar en @gmail.cl.",
        "string.min": "El correo electrónico debe tener al menos 15 caracteres.",
        "string.max": "El correo electrónico debe tener como máximo 35 caracteres.",
      })
      .custom(domainEmailValidator, "Validación dominio email"),
    password: Joi.string()
      .min(8)
      .max(26)
      .pattern(/^[a-zA-Z0-9]+$/)
      .required()
      .messages({
        "string.empty": "La contraseña no puede estar vacía.",
        "any.required": "La contraseña es obligatorio.",
        "string.base": "La contraseña debe ser de tipo texto.",
        "string.min": "La contraseña debe tener al menos 8 caracteres.",
        "string.max": "La contraseña debe tener como máximo 26 caracteres.",
        "string.pattern.base": "La contraseña solo puede contener letras y números.",
      }),
  })
    .unknown(false)
    .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });