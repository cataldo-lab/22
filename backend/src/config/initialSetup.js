"use strict";
import User from "../entity/user.entity.js";
import Asignatura from "../entity/asignatura.entity.js";
import Alumno from "../entity/alumno.entity.js";
import Profesor from "../entity/profesor.entity.js";
import Curso from "../entity/curso.entity.js";
import Evaluado from "../entity/evaluado.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const alumnoRepository = AppDataSource.getRepository(Alumno);
        const profesorRepository = AppDataSource.getRepository(Profesor);

        // Check if users already exist
        const userCount = await userRepository.count();
        if (userCount > 0) {
            console.log("ℹ️ Usuarios ya existen en la base de datos. Se omite la creación inicial.");
            return;
        }

        // Sample users
        const users = [
            {
                rut: "11111111-1",
                nombre: "Admin",
                apellido: "Administrador",
                email: "admin@gmail.cl",
                password: await encryptPassword("admin123"),
                rol: "administrador",
            },
            {
                rut: "12222222-2",
                nombre: "Profesor1",
                apellido: "Gonzalez",
                email: "profesor1@gmail.cl",
                password: await encryptPassword("profesor123"),
                rol: "profesor",
            },
            {
                rut: "13333333-3",
                nombre: "Alumno1",
                apellido: "Perez",
                email: "alumno1@gmail.cl",
                password: await encryptPassword("alumno123"),
                rol: "alumno",
            },
            {
                rut: "14444444-4",
                nombre: "Profesor2",
                apellido: "Lopez",
                email: "profesor2@gmail.cl",
                password: await encryptPassword("profesor456"),
                rol: "profesor",
            },
            {
                rut: "15555555-5",
                nombre: "Alumno2",
                apellido: "Sanchez",
                email: "alumno2@gmail.cl",
                password: await encryptPassword("alumno456"),
                rol: "alumno",
            },
            {
              rut: "16666666-6",
              nombre: "Alumno3",
              apellido: "Ramirez",
              email: "alumno3@gmail.cl",
              password: await encryptPassword("alumno789"),
              rol: "alumno",
          },
          {
              rut: "17777777-7",
              nombre: "Alumno4",
              apellido: "Hernandez",
              email: "alumno4@gmail.cl",
              password: await encryptPassword("alumno321"),
              rol: "alumno",
          },
          {
              rut: "18888888-8",
              nombre: "Alumno5",
              apellido: "Castro",
              email: "alumno5@gmail.cl",
              password: await encryptPassword("alumno654"),
              rol: "alumno",
          },
          {
              rut: "19999999-9",
              nombre: "Alumno6",
              apellido: "Morales",
              email: "alumno6@gmail.cl",
              password: await encryptPassword("alumno987"),
              rol: "alumno",
          },
        ];

        for (const userData of users) {
            const newUser = await userRepository.save(userRepository.create(userData));

            if (userData.rol === "alumno") {
                const newAlumno = await alumnoRepository.save(alumnoRepository.create({ usuario: newUser }));
                newUser.id_alumno = newAlumno.id_alumno;
                await userRepository.save(newUser);
            } else if (userData.rol === "profesor") {
                const newProfesor = await profesorRepository.save(profesorRepository.create({ usuario: newUser }));
                newUser.id_profesor = newProfesor.id_profesor;
                await userRepository.save(newUser);
            }
        }

        console.log("✅ Usuarios creados exitosamente.");
    } catch (error) {
        console.error("❌ Error al crear usuarios:", error.message);
    }
}

async function createAsignaturas() {
    try {
        const asignaturaRepository = AppDataSource.getRepository(Asignatura);
        const profesorRepository = AppDataSource.getRepository(Profesor);

        const asignaturaCount = await asignaturaRepository.count();
        if (asignaturaCount > 0) {
            console.log("ℹ️ Asignaturas ya existen en la base de datos.");
            return;
        }

        // Retrieve all professors from the database
        const profesores = await profesorRepository.find();

        if (profesores.length === 0) {
            console.log("❌ No se encontraron profesores para asignar a las asignaturas.");
            return;
        }

        // Assign subjects to professors
        const asignaturas = [
            { nombre_asignatura: "Matemáticas", ano: 2024, semestre: 1, profesor: profesores[0] },
            { nombre_asignatura: "Física", ano: 2024, semestre: 2, profesor: profesores[0] },
            { nombre_asignatura: "Química", ano: 2024, semestre: 1, profesor: profesores[1] || profesores[0] },
        ];

        for (const asignaturaData of asignaturas) {
            const newAsignatura = asignaturaRepository.create(asignaturaData);
            await asignaturaRepository.save(newAsignatura);
        }

        console.log("✅ Asignaturas creadas exitosamente y asociadas a profesores.");
    } catch (error) {
        console.error("❌ Error al crear asignaturas:", error.message);
    }
}

async function createCursos() {
  try {
      const cursoRepository = AppDataSource.getRepository(Curso);
      const alumnoRepository = AppDataSource.getRepository(Alumno);

      const cursoCount = await cursoRepository.count();
      if (cursoCount > 0) {
          console.log("ℹ️ Cursos ya existen en la base de datos.");
          return;
      }

      const cursos = [
          {
              nivel_curso: 1,
              seccion_curso: "A",
              cupos_maximos: 30,
              cupos_reservados: 1,
              cupos_disponibles: 29,
              ano: 2024,
          },
          {
              nivel_curso: 2,
              seccion_curso: "B",
              cupos_maximos: 30,
              cupos_reservados: 5,
              cupos_disponibles: 25,
              ano: 2024,
          },
      ];

      // Create courses and associate students
      for (const cursoData of cursos) {
          const newCurso = await cursoRepository.save(cursoRepository.create(cursoData));

          // Assign a few students to the newly created course
          const alumnos = await alumnoRepository.find({
              where: { id_curso: null }, // Find students not already assigned to a course
              take: 5, // Assign up to 5 students per course
          });

          for (const alumno of alumnos) {
              alumno.id_curso = newCurso.id_curso;
              await alumnoRepository.save(alumno);
          }

          console.log(`✅ Curso ${newCurso.nivel_curso}-${newCurso.seccion_curso} creado y n° ${alumnos.length} alums`);
      }

  } catch (error) {
      console.error("❌ Error al crear cursos:", error.message);
  }
}

async function createEvaluados() {
    try {
      const evaluadoRepository = AppDataSource.getRepository(Evaluado);
      const alumnoRepository = AppDataSource.getRepository(Alumno);
      const asignaturaRepository = AppDataSource.getRepository(Asignatura);
  
      const evaluadoCount = await evaluadoRepository.count();
      if (evaluadoCount > 0) {
        console.log("ℹ️ Evaluados ya existen en la base de datos.");
        return;
      }
  
      const asignaturas = await asignaturaRepository.find();
      const alumnos = await alumnoRepository.find();
  
      if (!asignaturas.length || !alumnos.length) {
        console.log("❌ No hay datos suficientes para crear evaluaciones.");
        return;
      }
  
      const evaluaciones = [
        {
          tipo_evaluacion: "Examen",
          descripcion: "Primer examen parcial",
          fecha: "2024-05-10",
          ponderacion_nota: 0.6,
          puntaje_alumno: 80,
          nota: 5.5,
        },
        {
          tipo_evaluacion: "Trabajo",
          descripcion: "Proyecto final",
          fecha: "2024-06-15",
          ponderacion_nota: 0.4,
          puntaje_alumno: 90,
          nota: 6.0,
        },
      ];
  
      for (const asignatura of asignaturas) {
        const alumnosEvaluados = alumnos.slice(0, 3);
  
        for (const alumno of alumnosEvaluados) {
          for (const evaluacion of evaluaciones) {
            const evaluado = evaluadoRepository.create({
              id_asignatura: asignatura.id_asignatura,
              id_alumno: alumno.id_alumno,
              ...evaluacion,
            });
  
            await evaluadoRepository.save(evaluado);
          }
        }
      }
  
      console.log("✅ Evaluaciones creadas exitosamente.");
    } catch (error) {
      console.error("❌ Error al crear evaluados:", error.message);
    }
  }


  async function createViewProfesorAlumnos() {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
  
      const queryRunner = AppDataSource.createQueryRunner();
  
      // Verificar y eliminar objetos existentes
      console.log("🔄 Verificando existencia de 'vista_profesor_alumnos'...");
      await queryRunner.query(`
        DROP VIEW IF EXISTS vista_profesor_alumnos CASCADE;
      `);
  
      console.log("✅ Eliminación previa completada. Creando la vista...");
  
      // Crear la vista
      await queryRunner.query(`
        CREATE VIEW vista_profesor_alumnos AS
        SELECT DISTINCT
        p.id_profesor,
        a.id_alumno,
        au.nombre AS alumno_nombre,
        au.apellido AS alumno_apellido,
        c.nivel_curso,
        c.seccion_curso,
        asig.nombre_asignatura
        FROM profesores p
        JOIN users u ON p.id_usuario = u.id_usuario
        JOIN asignaturas asig ON asig.id_profesor = p.id_profesor
        JOIN evaluados e ON e.id_asignatura = asig.id_asignatura
        JOIN alumnos a ON a.id_alumno = e.id_alumno
        JOIN cursos c ON a.id_curso = c.id_curso
        JOIN users au ON a.id_usuario = au.id_usuario;
      `);
  
      console.log("✅ Vista 'vista_profesor_alumnos' creada correctamente.");
      await queryRunner.release();
    } catch (error) {
      console.error("❌ Error al crear la vista 'vista_profesor_alumnos':", error.message);
    }
  }

async function initialSetup() {
    await createUsers();
    await createAsignaturas();
    await createCursos();
    await createEvaluados();
    createViewProfesorAlumnos()
}

export { initialSetup };
