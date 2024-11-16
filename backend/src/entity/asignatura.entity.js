"use strict";
import { EntitySchema } from "typeorm";

const AsignaturaSchema = new EntitySchema({
  name: "Asignatura",
  tableName: "asignaturas",
  columns: {
    id_asignatura: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    id_profesor: {
      type: "int",
      nullable: true,
    },
    nombre_asignatura: {
      type: "varchar",
      length: 255,
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
    profesor: {
      type: "many-to-one",
      target: "Profesor",
      joinColumn: { name: "id_profesor", referencedColumnName: "id_profesor" },
      onDelete: "SET NULL",
    },
  },
});

export default AsignaturaSchema;
