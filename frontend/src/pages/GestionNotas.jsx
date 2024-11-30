import { useState, useEffect } from "react";
import axios from "axios";
import "@styles/gestionNotas.css";
import Sidebar from "@components/Sidebar";
import "@styles/home.css"; 

const GestionNotas = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener estudiantes desde el backend
  const fetchStudents = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/students");
      setStudents(data);
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener notas de un estudiante
  const fetchGrades = async (studentId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/calificaciones/alumno${studentId}`
      );
      setGrades(data);
    } catch (error) {
      console.error("Error al obtener las notas:", error);
    }
  };

  // Actualizar nota
  const updateGrade = async (gradeId, newGrade) => {
    try {
      await axios.put(`http://localhost:3000/api/calificaciones/${gradeId}`, {
        nota: newGrade,
      });
      setGrades((prev) =>
        prev.map((grade) =>
          grade.id === gradeId ? { ...grade, nota: newGrade } : grade
        )
      );
      alert("Nota actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar la nota:", error);
    }
  };

  // Agregar nueva nota
  const addGrade = async (materia, nota) => {
    try {
      const { data } = await axios.post("http://localhost:3000/api/calificaciones", {
        studentId: selectedStudent.id,
        materia,
        nota,
      });
      setGrades((prev) => [...prev, data]);
      alert("Nota agregada correctamente");
    } catch (error) {
      console.error("Error al agregar nota:", error);
    }
  };

  // Manejo de selección de estudiante
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    fetchGrades(student.id);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) return <p>Cargando estudiantes...</p>;

  return (
    <div className="gestion-notas">
      <h1>Gestión de Notas</h1>
      <div className="student-list">
        <h2>Estudiantes</h2>
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              <button onClick={() => handleStudentSelect(student)}>
                {student.nombre}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedStudent && (
        <StudentGrades
          grades={grades}
          studentName={selectedStudent.nombre}
          onUpdateGrade={updateGrade}
          onAddGrade={addGrade}
        />
      )}
    </div>
  );
};

// Componente para mostrar las notas de un estudiante
const StudentGrades = ({ grades, studentName, onUpdateGrade, onAddGrade }) => {
  const [newGrade, setNewGrade] = useState({ materia: "", nota: "" });

  const handleAdd = () => {
    const { materia, nota } = newGrade;
    if (materia && nota) {
      onAddGrade(materia, parseFloat(nota));
      setNewGrade({ materia: "", nota: "" });
    } else {
      alert("Por favor, complete los campos para agregar una nota.");
    }
  };

  return (
    <div className="grades-section">
      <Sidebar />
      <h2>Notas de {studentName}</h2>
      <table className="grades-table">
        <thead>
          <tr>
            <th>Materia</th>
            <th>Nota</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <tr key={grade.id}>
              <td>{grade.materia}</td>
              <td>
                <input
                  type="number"
                  value={grade.nota}
                  onChange={(e) =>
                    onUpdateGrade(grade.id, parseFloat(e.target.value))
                  }
                />
              </td>
              <td>
                <button onClick={() => onUpdateGrade(grade.id, grade.nota)}>
                  Guardar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="add-grade">
        <h3>Agregar Nota</h3>
        <input
          type="text"
          placeholder="Materia"
          value={newGrade.materia}
          onChange={(e) =>
            setNewGrade((prev) => ({ ...prev, materia: e.target.value }))
          }
        />
        <input
          type="number"
          placeholder="Nota"
          value={newGrade.nota}
          onChange={(e) =>
            setNewGrade((prev) => ({ ...prev, nota: e.target.value }))
          }
        />
        <button onClick={handleAdd}>Agregar Nota</button>
      </div>
    </div>
  );
};

export default GestionNotas;
