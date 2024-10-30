"use strict";
import { EntitySchema } from "typeorm";

const CalificacionSchema = new EntitySchema({
  name: "Calificacion",
  tableName: "calificacion",
  columns: {
    id_nota: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    nota: {
      type: "decimal",
      nullable: false,
    },
    ponderacion_nota:{
      type: "decimal",
      default:0.6,
      nullable: true,
    },
    fecha: {
      type: "timestamp with time zone",
      nullable: true,
    },
    id_alumno: {
      type: "int",
      nullable: false,
    },
    id_asignatura: {
      type: "int",
      nullable: false,
    },
    programa_Pie: {
      type: "boolean",
      nullable: false,
    },
    puntaje_alumno:{
      type: "int",
      nullable: false,
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
  },
  relations: {
    alumno: {
      type: "many-to-one",
      target: "Usuario",
      joinColumn: { name: "id_alumno", referencedColumnName: "id_usuario" },
      onDelete: "CASCADE",
    },
    asignatura: {
      type: "many-to-one",
      target: "Asignatura",
      joinColumn: { name: "id_asignatura" },
      onDelete: "CASCADE",
    },
  },
});

export default CalificacionSchema;
