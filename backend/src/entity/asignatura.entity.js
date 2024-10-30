"use strict";
import { EntitySchema } from "typeorm";

const AsignaturaSchema = new EntitySchema({
  name: "Asignatura",
  tableName: "asignatura",
  columns: {
    id_asignatura: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre_asignatura: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    id_profesor: {
      type: "int",
      nullable: true,
    },
    semestre: {
      type: "int",
      nullable: false,
    },
    ano: {
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
    calificaciones: {
      type: "one-to-many",
      target: "Calificacion",
      joinColumn: { name: "id_asignatura" },
      onDelete: "CASCADE",
    },
    profesor: {
      type: "many-to-one",
      target: "Usuario",
      joinColumn: { name: "id_profesor", referencedColumnName: "id_usuario" },
      onDelete: "SET NULL",
    },
  },

});

export default AsignaturaSchema;
