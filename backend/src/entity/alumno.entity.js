"use strict";
import { EntitySchema } from "typeorm";

const AlumnoSchema = new EntitySchema({
  name: "Alumno",
  tableName: "alumnos",
  columns: {
    id_alumno: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    id_usuario: {
      type: "int",
      nullable: true,
    },
    alumno_Pie: {
      type: "boolean",
      default: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    },
    id_curso: {
      type: "int",
      nullable: true,
    },
  },
  relations: {
    usuario: {
      type: "one-to-one",
      target: "Usuario",
      joinColumn: { name: "id_usuario", referencedColumnName: "id_usuario" },
      onDelete: "CASCADE",
    },
    curso: {
      type: "many-to-one",
      target: "Curso",
      joinColumn: { name: "id_curso", referencedColumnName: "id_curso" },
      onDelete: "SET NULL",
    },
    evaluados: {
      type: "one-to-many",
      target: "Evaluado",
      inverseSide: "alumno",
    },
    asignaturas: {
      type: "many-to-many", 
      target: "Asignatura",
      mappedBy: "alumnos",  
    },
  },
});

export default AlumnoSchema;
