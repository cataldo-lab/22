"use strict";
import Joi from "joi";

// Validador de RUT
const rutValidator = Joi.string()
    .min(9)
    .max(12)
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .required()
    .messages({
        "string.empty": "El RUT no puede estar vacío.",
        "string.pattern.base": "Formato de RUT inválido.",
        "any.required": "El RUT es obligatorio.",
    });

// Validador de ID de calificación (id_nota)
const idNotaValidator = Joi.string()
    .required()
    .messages({
        "string.empty": "El ID de la calificación no puede estar vacío.",
        "any.required": "El ID de la calificación es obligatorio.",
    });

// Esquema de validación para crear y actualizar calificaciones
export const calificacionValidation = Joi.object({
    alumnoRut: rutValidator,
    asignaturaRut: rutValidator,
    calificacion: Joi.number().min(1).max(7).required().messages({
        "number.base": "La calificación debe ser un número.",
        "number.min": "La calificación mínima es 1.",
        "number.max": "La calificación máxima es 7.",
        "any.required": "La calificación es obligatoria.",
    }),
    fecha: Joi.date().required().messages({
        "date.base": "La fecha debe ser una fecha válida.",
        "any.required": "La fecha es obligatoria.",
    }),
});

// Esquema de validación para actualizar calificaciones usando el ID de la calificación
export const calificacionUpdateValidation = Joi.object({
    alumnoRut: rutValidator,
    idNota: idNotaValidator,
    asignaturaRut: rutValidator,
    calificacion: Joi.number().min(1).max(7).required().messages({
        "number.base": "La calificación debe ser un número.",
        "number.min": "La calificación mínima es 1.",
        "number.max": "La calificación máxima es 7.",
        "any.required": "La calificación es obligatoria.",
    }),
    fecha: Joi.date().required().messages({
        "date.base": "La fecha debe ser una fecha válida.",
        "any.required": "La fecha es obligatoria.",
    }),
});

// Esquema de validación para eliminar calificaciones usando el ID de la calificación
export const calificacionDeleteValidation = Joi.object({
    alumnoRut: rutValidator,
    idNota: idNotaValidator,
    asignaturaRut: rutValidator,
});