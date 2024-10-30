"use strict";
import { EntitySchema } from "typeorm";

const UsuarioSchema = new EntitySchema({
  name: "Usuario",
  tableName: "usuario",
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
    },
    nombre: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    apellido: {
      type: "varchar",
      length: 50,
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
      nullable: true,
    },
    password: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    id_asignatura: {
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
  indices: [
    {
      name: "IDX_USUARIO_RUT",
      columns: ["rut"],
      unique: true,
    },
  ],
  relations: {
    calificaciones: {
      type: "one-to-many",
      target: "Calificacion",
      inverseSide: "alumno",
      onDelete: "CASCADE",
    },
    profesorAsignaturas: {
      type: "one-to-many",
      target: "Asignatura",
      inverseSide: "profesor",
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

export default UsuarioSchema;
