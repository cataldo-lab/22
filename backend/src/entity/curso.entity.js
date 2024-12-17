"use strict";
import { EntitySchema } from "typeorm";

const CursoSchema = new EntitySchema({
  name: "Curso",
  tableName: "cursos",
  columns: {
    id_curso: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    nivel_curso: {
      type: "int",
      nullable: false,
    },
    seccion_curso: {
      type: "varchar",
      length: 1,
      nullable: false,
    },
    cupos_maximos: {
      type: "int",
      nullable: false,
    },
    cupos_reservados: {
      type: "int",
      nullable: false,
    },
    cupos_disponibles: {
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
    alumnos: {
      type: "one-to-many",
      target: "Alumno",
      inverseSide: "curso",
    },
  },
});

export default CursoSchema;