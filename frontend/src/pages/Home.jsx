//import React from "react";
import Sidebar from "@components/Sidebar";
import "@styles/home.css"; // Si tienes estilos específicos para el contenido principal

function Home() {
    return (
        <div className="home-container">
            <Sidebar />
            <div className="main-content">
                <h1>Bienvenido a la Plataforma</h1>
                
            </div>
        </div>
    );
}

export default Home;
