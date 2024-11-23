import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Botón para gestión de notas */}
      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          margin: "20px",
        }}
        onClick={() => navigate("/gestion-notas")}
      >
        Gestionar Notas
      </button>
    </>
  );
};

export default Home;
