"use strict";
import Joi from "joi";

// Validador personalizado para dominios de email
const domainEmailValidator = (value, helper) => {
    if (!value.endsWith("@gmail.cl")) {
        return helper.message("El correo electrónico debe ser del dominio @gmail.cl");
    }
    return value;
};



// Validación para crear un usuario
export const createUserValidationSchema = Joi.object({
    rut: Joi.string()
        .min(9)
        .max(12)
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
        .required()
        .messages({
            "string.empty": "El RUT no puede estar vacío.",
            "string.min": "El RUT debe tener al menos 9 caracteres.",
            "string.max": "El RUT debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato de RUT inválido. Debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
        }),
    nombre: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .required()
        .messages({
            "string.empty": "El nombre no puede estar vacío.",
            "string.min": "El nombre debe tener al menos 2 caracteres.",
            "string.max": "El nombre debe tener como máximo 50 caracteres.",
            "string.pattern.base": "El nombre solo puede contener letras y espacios.",
        }),
    apellido: Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .required()
        .messages({
            "string.empty": "El apellido no puede estar vacío.",
            "string.min": "El apellido debe tener al menos 2 caracteres.",
            "string.max": "El apellido debe tener como máximo 50 caracteres.",
            "string.pattern.base": "El apellido solo puede contener letras y espacios.",
        }),
    email: Joi.string()
        .email()
        .required()
        .custom(domainEmailValidator, "Validación dominio email")
        .messages({
            "string.empty": "El correo electrónico no puede estar vacío.",
            "string.email": "El correo electrónico debe ser válido y terminar en @gmail.cl.",
        }),
    password: Joi.string()
        .min(8)
        .max(26)
        .pattern(/^[a-zA-Z0-9]+$/)
        .required()
        .messages({
            "string.empty": "La contraseña no puede estar vacía.",
            "string.min": "La contraseña debe tener al menos 8 caracteres.",
            "string.max": "La contraseña debe tener como máximo 26 caracteres.",
            "string.pattern.base": "La contraseña solo puede contener letras y números.",
        }),
    rol: Joi.string()
        .valid("profesor", "alumno")
        .required()
        .messages({
            "string.empty": "El rol no puede estar vacío.",
            "any.only": "El rol debe ser 'profesor' o 'alumno'.",
        }),
})
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
    });

// Validación para consultas (query parameters)
export const userQueryValidation = Joi.object({
    rut: Joi.string()
        .min(9)
        .max(12)
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
        .required()
        .messages({
            "string.empty": "El RUT no puede estar vacío.",
            "string.min": "El RUT debe tener al menos 9 caracteres.",
            "string.max": "El RUT debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato de RUT inválido.",
            "any.required": "El RUT es obligatorio.",
        }),
})
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
    });
