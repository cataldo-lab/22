"use strict";
import { EntitySchema } from "typeorm";

const UsuarioSchema = new EntitySchema({
  name: "Usuario",
  tableName: "users",
  columns: {
    id_usuario: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    rut: {
      type: "varchar",
      length: 12,
      unique: true,
      nullable: false,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    apellido: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    rol: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    password: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    id_alumno: {
      type: "int",
      nullable: true,
    },
    id_profesor: {
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
      type: "one-to-one",
      target: "Alumno",
      joinColumn: { name: "id_alumno", referencedColumnName: "id_alumno" },
      onDelete: "SET NULL",
    },
    profesor: {
      type: "one-to-one",
      target: "Profesor",
      joinColumn: { name: "id_profesor", referencedColumnName: "id_profesor" },
      onDelete: "SET NULL",
    },
  },
  indices: [
    {
      name: "IDX_USER_RUT",
      columns: ["rut"],
      unique: true,
    },
  ],
});

export default UsuarioSchema;
