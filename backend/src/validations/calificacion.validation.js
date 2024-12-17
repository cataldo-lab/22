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

// Validador de ID de calificación 
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
    return value; 
});

// Validación para actualización de calificación
export const updateCalificacionSchema = Joi.object({
    puntaje_alumno: Joi.number()
        .min(1)
        .required()
        .messages({
            "number.base": "El puntaje del alumno debe ser un número.",
            "number.min": "El puntaje del alumno debe ser al menos 1.",
            "any.required": "El puntaje del alumno es obligatorio.",
        }),
    puntaje_total: Joi.number()
        .min(1)
        .required()
        .messages({
            "number.base": "El puntaje total debe ser un número.",
            "number.min": "El puntaje total debe ser al menos 1.",
            "any.required": "El puntaje total es obligatorio.",
        }),
}).custom((value, helpers) => {
    if (value.puntaje_alumno > value.puntaje_total) {
        return helpers.message(
            "El puntaje del alumno no puede ser mayor al puntaje total."
        );
    }
    return value;
});

// Validación para deleteCalificacion
export const deleteCalificacionSchema = Joi.object({
    alumnoRut: rutValidator,
    idNota: idNotaValidator,
    asignaturaRut: rutValidator,
});