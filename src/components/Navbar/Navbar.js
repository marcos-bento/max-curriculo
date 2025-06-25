import React from "react";
import {FaFileAlt} from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-logo">Max Currículo</div>
      <div className="navbar-actions">
        <span className="novo-texto">Novo</span>
        <FaFileAlt className="icone" />
      </div>
    </div>
  );
}

export default Navbar;