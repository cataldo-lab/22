//import { React } from "react";
import { NavLink } from "react-router-dom";
import "@styles/sidebar.css";

function Sidebar() {
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
                
            </ul>
        </div>
    );
}

export default Sidebar;
