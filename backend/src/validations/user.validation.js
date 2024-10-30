"use strict";
import Joi from "joi";

// Validador personalizado para dominios de email
const domainEmailValidator = (value, helper) => {
    if (!value.endsWith("@gmail.cl")) {
        return helper.message("El correo electrónico debe ser del dominio @gmail.cl");
    }
    return value;
};

// Validación de parámetros para las consultas (query parameters)
export const userQueryValidation = Joi.object({
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
            "any.required": "El rut es obligatorio.",
        }),
})
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
    });

// Validación para el cuerpo de las solicitudes (body)
export const userBodyValidation = Joi.object({
    rut: Joi.string()
        .min(9)
        .max(12)
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
        .messages({
            "string.empty": "El rut no puede estar vacío.",
            "string.base": "El rut debe ser de tipo string.",
            "string.min": "El rut debe tener como mínimo 9 caracteres.",
            "string.max": "El rut debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
        }),
    nombre: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .messages({
            "string.empty": "El nombre no puede estar vacío.",
            "string.base": "El nombre debe ser de tipo string.",
            "string.min": "El nombre debe tener como mínimo 2 caracteres.",
            "string.max": "El nombre debe tener como máximo 50 caracteres.",
            "string.pattern.base": "El nombre solo puede contener letras y espacios.",
        }),
    apellido: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .messages({
            "string.empty": "El apellido no puede estar vacío.",
            "string.base": "El apellido debe ser de tipo string.",
            "string.min": "El apellido debe tener como mínimo 2 caracteres.",
            "string.max": "El apellido debe tener como máximo 50 caracteres.",
            "string.pattern.base": "El apellido solo puede contener letras y espacios.",
        }),
    email: Joi.string()
        .min(15)
        .max(35)
        .email()
        .messages({
            "string.empty": "El correo electrónico no puede estar vacío.",
            "string.base": "El correo electrónico debe ser de tipo string.",
            "string.email": "El correo electrónico debe finalizar en @gmail.cl.",
            "string.min": "El correo electrónico debe tener como mínimo 15 caracteres.",
            "string.max": "El correo electrónico debe tener como máximo 35 caracteres.",
        })
        .custom(domainEmailValidator, "Validación dominio email"),
    password: Joi.string()
        .min(8)
        .max(26)
        .pattern(/^[a-zA-Z0-9]+$/)
        .messages({
            "string.empty": "La contraseña no puede estar vacía.",
            "string.base": "La contraseña debe ser de tipo string.",
            "string.min": "La contraseña debe tener como mínimo 8 caracteres.",
            "string.max": "La contraseña debe tener como máximo 26 caracteres.",
            "string.pattern.base": "La contraseña solo puede contener letras y números.",
        }),
    newPassword: Joi.string()
        .min(8)
        .max(26)
        .allow("")
        .pattern(/^[a-zA-Z0-9]+$/)
        .messages({
            "string.empty": "La nueva contraseña no puede estar vacía.",
            "string.base": "La nueva contraseña debe ser de tipo string.",
            "string.min": "La nueva contraseña debe tener como mínimo 8 caracteres.",
            "string.max": "La nueva contraseña debe tener como máximo 26 caracteres.",
            "string.pattern.base": "La nueva contraseña solo puede contener letras y números.",
        }),
    rol: Joi.string()
        .valid("profesor", "alumno")
        .messages({
            "string.base": "El rol debe ser de tipo string.",
            "any.only": "El rol debe ser 'profesor' o 'alumno'.",
        }),
})
    .or("rut", "nombre", "apellido", "email", "password", "newPassword", "rol")
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
        "object.missing": "Debes proporcionar al menos un campo.",
    });