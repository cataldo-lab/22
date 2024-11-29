//import { React } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@context/AuthContext"; 
import "@styles/sidebar.css";

function Sidebar() {
    const { user } = useAuth();

    return (
        <div className="sidebar">
            <h2>Menú</h2>
            <ul className="sidebar-list">
                <li>
                    <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>
                        Inicio
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/notas" className={({ isActive }) => (isActive ? "active" : "")}>
                        Notas
                    </NavLink>
                </li>

                {/* Opciones exclusivas para el rol de profesor */}
                {user?.rol === "profesor" && (
                    <>
                        <li>
                            <NavLink
                                to="/calificaciones"
                                className={({ isActive }) => (isActive ? "active" : "")}
                            >
                                Gestionar Notas
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/lista-alumnos"
                                className={({ isActive }) => (isActive ? "active" : "")}
                            >
                                Lista Alumnos
                            </NavLink>
                        </li>
                    </>
                )}

                {user?.rol === "alumno" && (
                    <>
                        <li>
                            <NavLink
                                to="/mis-notas"
                                className={({ isActive }) => (isActive ? "active" : "")}
                            >
                                Mis Notas
                            </NavLink>
                        </li>
                    </>
                )}


            </ul>
        </div>
    );
}

export default Sidebar;
