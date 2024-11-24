"use strict";
import { EntitySchema } from "typeorm";

const ProfesorAlumnosViewSchema = new EntitySchema({
  name: "ProfesorAlumnosView", // Nombre lógico de la entidad
  tableName: "vista_profesor_alumnos", // Nombre exacto de la vista en PostgreSQL
  columns: {
    id_profesor: {
      type: "int",
      primary: true, // Clave primaria lógica para TypeORM
    },
    id_alumno: {
      type: "int",
      primary: true, // Clave primaria lógica para TypeORM
    },
    alumno_nombre: {
      type: "varchar",
      length: 255,
    },
    alumno_apellido: {
      type: "varchar",
      length: 255,
    },
    nivel_curso: {
      type: "int",
    },
    seccion_curso: {
      type: "varchar",
      length: 1,
    },
    nombre_asignatura: {
      type: "varchar",
      length: 255,
    },
  },
  expression: true, // Indicador de que es una vista en lugar de una tabla
});

export default ProfesorAlumnosViewSchema;
