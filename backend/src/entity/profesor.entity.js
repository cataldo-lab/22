"use strict";
import { EntitySchema } from "typeorm";

const ProfesorSchema = new EntitySchema({
  name: "Profesor",
  tableName: "profesores",
  columns: {
    id_profesor: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    id_usuario: {
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
    usuario: {
      type: "one-to-one",
      target: "Usuario",
      joinColumn: { name: "id_usuario", referencedColumnName: "id_usuario" },
      onDelete: "CASCADE",
    },
    asignaturas: {
      type: "one-to-many",
      target: "Asignatura",
      inverseSide: "profesor",
  },
  },
});

export default ProfesorSchema;