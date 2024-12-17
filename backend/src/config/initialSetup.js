"use strict";
import User from "../entity/user.entity.js";
import Asignatura from "../entity/asignatura.entity.js";
import Alumno from "../entity/alumno.entity.js";
import Profesor from "../entity/profesor.entity.js";
import Curso from "../entity/curso.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import Evaluado from "../entity/evaluado.entity.js";


async function createUsers() {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const alumnoRepository = AppDataSource.getRepository(Alumno);
        const profesorRepository = AppDataSource.getRepository(Profesor);

        
        const userCount = await userRepository.count();
        if (userCount > 0) {
            console.log("ℹ️ Usuarios ya existen en la base de datos. Se omite la creación inicial.");
            return;
        }

        
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

        // Crear usuarios y guardar en paralelo
        const userPromises = users.map(async (userData) => {
            const newUser  = userRepository.create(userData);
            const savedUser  = await userRepository.save(newUser );

            if (userData.rol === "alumno") {
                const newAlumno = alumnoRepository.create({ usuario: savedUser  });
                await alumnoRepository.save(newAlumno);
                savedUser .id_alumno = newAlumno.id_alumno; 
            } else if (userData.rol === "profesor") {
                const newProfesor = profesorRepository.create({ usuario: savedUser  });
                await profesorRepository.save(newProfesor);
                savedUser .id_profesor = newProfesor.id_profesor; 
            }

            return savedUser ; 
        });

        await Promise.all(userPromises); 

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

        
        const profesores = await profesorRepository.find();

        if (profesores.length === 0) {
            console.log("❌ No se encontraron profesores para asignar a las asignaturas.");
            return;
        }

        
        const asignaturas = [
            { nombre_asignatura: "Matemáticas", ano: 2024, semestre: 1, profesor: profesores[0] },
            { nombre_asignatura: "Física", ano: 2024, semestre: 2, profesor: profesores[0] },
            { nombre_asignatura: "Química", ano: 2024, semestre: 1, profesor: profesores[1] || profesores[0] },
        ];

        
        const asignaturaPromises = asignaturas.map(async (asignaturaData) => {
            const newAsignatura = asignaturaRepository.create(asignaturaData);
            return asignaturaRepository.save(newAsignatura);
        });

        await Promise.all(asignaturaPromises); 

        console.log("✅ Asignaturas creadas exitosamente y asociadas a profesores.");
    } catch (error) {
        console.error("❌ Error al crear asignaturas:", error.message);
    }
}

async function createCursos() {
    try {
        const cursoRepository = AppDataSource.getRepository(Curso);
        const alumnoRepository = AppDataSource.getRepository(Alumno);

        // Verificar si ya existen cursos
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

        // Crear cursos y asignar alumnos
        const cursoPromises = cursos.map(async (cursoData) => {
            const newCurso = await cursoRepository.save(cursoRepository.create(cursoData));

            // Encontrar alumnos que no están asignados a un curso
            const alumnos = await alumnoRepository.find({
                where: { id_curso: null }, // Buscar estudiantes no asignados a un curso
                take: 5, // Asignar hasta 5 estudiantes por curso
            });

            // Asignar alumnos al curso
            const updateAlumnosPromises = alumnos.map(async (alumno) => {
                alumno.id_curso = newCurso.id_curso; // Asignar el curso al alumno
                return alumnoRepository.save(alumno); // Guardar el alumno actualizado
            });

            await Promise.all(updateAlumnosPromises); // Esperar a que todos los alumnos se guarden

            console.log(`✅ Curso ${newCurso.nivel_curso}-${newCurso.seccion_curso}  n° ${alumnos.length} alums`);
        });

        await Promise.all(cursoPromises); // Esperar a que todos los cursos se guarden

    } catch (error) {
        console.error("❌ Error al crear cursos:", error.message);
    }
}

async function createEvaluados() {
    try {
        const evaluadoRepository = AppDataSource.getRepository(Evaluado);
        const alumnoRepository = AppDataSource.getRepository(Alumno);
        const asignaturaRepository = AppDataSource.getRepository(Asignatura);

        // Verificar si ya existen evaluaciones en la base de datos
        const evaluadoCount = await evaluadoRepository.count();
        if (evaluadoCount > 0) {
            console.log("ℹ️ Evaluaciones ya existen en la base de datos.");
            return;
        }

        // Obtener alumnos y asignaturas
        const alumnos = await alumnoRepository.find({ take: 5 }); // Limitar a los primeros 5 alumnos
        const asignaturas = await asignaturaRepository.find();

        if (alumnos.length === 0 || asignaturas.length === 0) {
            console.log("❌ No hay alumnos o asignaturas disponibles para crear evaluaciones.");
            return;
        }

        // Crear evaluaciones de prueba
        const evaluaciones = [
            {
                id_alumno: alumnos[0].id_alumno,
                id_asignatura: asignaturas[0].id_asignatura,
                nota: 7.0,
                ponderacion_nota: 0.6,
                tipo_evaluacion: "Parcial",
                descripcion: "Primera evaluación del curso.",
                fecha: "2024-01-15",
                puntaje_alumno: 90,
                puntaje_total: 90,
            },
            {
                id_alumno: alumnos[1].id_alumno,
                id_asignatura: asignaturas[1]?.id_asignatura || asignaturas[0].id_asignatura,
                nota: 7.0,
                ponderacion_nota: 0.5,
                tipo_evaluacion: "Examen",
                descripcion: "Evaluación final del semestre.",
                fecha: "2024-06-20",
                puntaje_alumno: 95,
                puntaje_total: 95,
            },
            {
                id_alumno: alumnos[2].id_alumno,
                id_asignatura: asignaturas[2]?.id_asignatura || asignaturas[0].id_asignatura,
                nota: 7.0,
                ponderacion_nota: 0.5,
                tipo_evaluacion: "Tarea",
                descripcion: "Entrega de informe.",
                fecha: "2024-03-10",
                puntaje_alumno: 70,
                puntaje_total: 70,
            },
        ];

        // Crear y guardar evaluaciones en paralelo
        const evaluadoPromises = evaluaciones.map(async (evaluacionData) => {
            const newEvaluado = evaluadoRepository.create(evaluacionData);
            return evaluadoRepository.save(newEvaluado);
        });

        await Promise.all(evaluadoPromises); // Esperar a que todas las evaluaciones se guarden

        console.log("✅ Evaluaciones creadas exitosamente.");
    } catch (error) {
        console.error("❌ Error al crear evaluaciones:", error.message);
    }
}

async function createAsignaturaAlumnos() {
    try {
        const asignaturaRepository = AppDataSource.getRepository(Asignatura);
        const alumnoRepository = AppDataSource.getRepository(Alumno);

        // Obtener asignaturas y alumnos
        const asignaturas = await asignaturaRepository.find({ relations: ["alumnos"] });
        const alumnos = await alumnoRepository.find();

        if (asignaturas.length === 0 || alumnos.length === 0) {
            console.log("❌ No se encontraron asignaturas o alumnos para asociar.");
            return;
        }

        // Asociar alumnos a asignaturas
        const relaciones = [
            { id_asignatura: asignaturas[0].id_asignatura, alumnos: [alumnos[0], alumnos[1]] },
            { 
                id_asignatura: asignaturas[1]?.id_asignatura || asignaturas[0].id_asignatura, 
                alumnos: [alumnos[2], alumnos[3]]
            },
        ];

        // Crear y guardar las relaciones en paralelo
        const savePromises = relaciones.map(async (relacion) => {
            const asignatura = asignaturas.find(a => a.id_asignatura === relacion.id_asignatura);
            if (asignatura) {
                asignatura.alumnos = relacion.alumnos; 
                return asignaturaRepository.save(asignatura); 
            }
        });

        await Promise.all(savePromises); // Esperar a que todas las asignaturas se guarden

        console.log("✅ Alumnos asociados correctamente a las asignaturas.");
    } catch (error) {
        console.error("❌ Error al asociar alumnos a asignaturas:", error.message);
    }
}


async function initialSetup() {
    await createUsers();
    await createAsignaturas();
    await createCursos();
    await createEvaluados();
    await createAsignaturaAlumnos();
}

export { initialSetup };
