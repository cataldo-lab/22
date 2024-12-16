"use strict";
import Joi from "joi";



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



export const createCalificacionSchema = Joi.object({
    rut_alumno: rutValidator,
    id_asignatura: Joi.number().min(1).max(3).integer().required().messages({
        "number.base": "El ID de la asignatura debe ser un número válido.",
        "any.required": "El ID de la asignatura es obligatorio.",
    }),
    puntaje_alumno: Joi.number().integer().required().min(1).messages({
        "number.base": "El puntaje del alumno debe ser un número.",
        "any.required": "El puntaje del alumno es obligatorio.",
    }),
    puntaje_total: Joi.number().integer().min(1).required().messages({
        "number.base": "El puntaje total debe ser un número.",
        "any.required": "El puntaje total es obligatorio.",
    }),
}).custom((value, helpers) => {
    if (value.puntaje_total < value.puntaje_alumno) {
        return helpers.error("any.invalid", {
            message: "El puntaje total debe ser mayor o igual al puntaje del alumno.",
        });
    }
    return value; // Retornar el objeto si es válido
});

// Validación para actualización de calificaciones
export const updateCalificacionSchema = Joi.object({
    calificacion: Joi.number().min(10).max(70).required().messages({
        "number.base": "La calificación debe ser un número.",
        "number.min": "La calificación mínima es 1.",
        "number.max": "La calificación máxima es 7.",
        "any.required": "La calificación es obligatoria.",
    }),
    
});

// Validación para eliminación de calificaciones
export const deleteCalificacionSchema = Joi.object({
    alumnoRut: rutValidator,
    idNota: idNotaValidator,
    asignaturaRut: rutValidator,
});