"use strict";
import { EntitySchema } from "typeorm";

const EvaluadoSchema = new EntitySchema({
  name: "Evaluado",
  tableName: "evaluados",
  columns: {
    id_nota: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    id_alumno: {
      type: "int",
      nullable: true,
    },
    id_asignatura: {
      type: "int",
      nullable: true,
    },
    nota: {
      type: "numeric",
      nullable: false,
    },
    ponderacion_nota: {
      type: "numeric",
      default: 0.6,
    },
    tipo_evaluacion: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    descripcion: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    fecha: {
      type: "date",
      nullable: true,
    },
    puntaje_alumno: {
      type: "int",
      nullable: false,
    },
    puntaje_total: {
      type: "int",
      nullable: true,
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
      target: "Alumno",
      joinColumn: { name: "id_alumno", referencedColumnName: "id_alumno" },
      onDelete: "SET NULL",
    },
    asignatura: {
      type: "many-to-one",
      target: "Asignatura",
      joinColumn: { name: "id_asignatura", referencedColumnName: "id_asignatura" },
      onDelete: "SET NULL",
    },
  },
});

export default EvaluadoSchema;
