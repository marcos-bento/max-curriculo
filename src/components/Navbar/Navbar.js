import React from "react";
import { FaFileAlt, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ isHome }) {
  const navigate = useNavigate();

  const redirecionar = () => {
    navigate(isHome ? "/selecionarModelo" : "/");
  };

  return (
    <div className="navbar">
      <div className="navbar-logo" onClick={redirecionar} style={{ cursor: "pointer" }}>
        Max Currículo
      </div>

      <div className="navbar-actions">
        <span className="novo-texto" onClick={redirecionar} style={{ cursor: "pointer" }}>
          {isHome ? "Novo" : "Home"}
        </span>
        {isHome ? (
          <FaFileAlt className="icone" onClick={redirecionar} style={{ cursor: "pointer" }} />
        ) : (
          <FaHome className="icone" onClick={redirecionar} style={{ cursor: "pointer" }} />
        )}
      </div>
    </div>
  );
}

export default Navbar;
