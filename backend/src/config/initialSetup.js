"use strict";
import User from "../entity/user.entity.js";
import Asignatura from "../entity/asignatura.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    // Verificar si ya existen usuarios en la base de datos
    const count = await userRepository.count();
    if (count > 0) {
      console.log("ℹ️ Usuarios ya existen en la base de datos. Se omite la creación inicial.");
      return;
    }

    // Crear usuarios iniciales con rut primero (clave primaria)
    await Promise.all([
      userRepository.save(
        userRepository.create({
          rut: "21.308.770-3",
          nombre: "Diego Alexis",
          apellido: "Salazar Jara",
          email: "administrador2024@gmail.cl",
          password: await encryptPassword("admin1234"),
          rol: "administrador",
          
        }),
      ),
      userRepository.save(
        userRepository.create({
          rut: "22.111.333-4",
          nombre: "María Fernanda",
          apellido: "Gómez López",
          email: "profesora2024@gmail.cl",
          password: await encryptPassword("profesor1234"),
          rol: "profesor",
          
        }),
      ),
      userRepository.save(
        userRepository.create({
          rut: "21.151.897-9",
          nombre: "Diego Sebastián",
          apellido: "Ampuero Belmar",
          email: "usuario1.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "alumno",
          
        })
      ),
      userRepository.save(
        userRepository.create({
          rut: "20.630.735-8",
          nombre: "Alexander Benjamín Marcelo",
          apellido: "Carrasco Fuentes",
          email: "usuario2.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "alumno",
          
        }),
      ),
      userRepository.save(
        userRepository.create({
          rut: "abba",
          nombre: "Alexander Benjamín Marcelo",
          apellido: "Carrasco Fuentes",
          email: "usuario2.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "alumno",
          
        }),
      ),
    
    ]);
    console.log("✅ Usuarios creados exitosamente");
  } catch (error) {
    console.error("❌ Error al crear usuarios:", error);
  }
}



async function createAsignaturas() {
  try {
    const asignaturaRepository = AppDataSource.getRepository(Asignatura);

  
  const count = await asignaturaRepository.count();
  if (count > 0) {
    console.log("ℹ️ Asignaturas ya existen en la base de datos.");
    return;
  }

     await asignaturaRepository.save(
      asignaturaRepository.create({
        nombre_asignatura: "Matemáticas I",
        semestre:1,
        ano: "2024",
      })
    );

    await asignaturaRepository.save(
      asignaturaRepository.create({
        nombre_asignatura: "Física II",
        semestre:2,
        ano: "2024",
      })
    );



    console.log("✅ Asignaturas y asociaciones de alumnos creadas exitosamente");
  } catch (error) {
    console.error("❌ Error al crear asignaturas o asociaciones:", error);
  }
}

async function initialSetup() {
  await createUsers();
  await createAsignaturas();
}

export { initialSetup };