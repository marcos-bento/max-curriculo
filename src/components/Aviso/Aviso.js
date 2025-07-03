import React from "react";
import { FaLock } from "react-icons/fa";
import "./Aviso.css";

function Aviso({ titulo, texto }) {
  return (
    <div className="aviso-container">
      <FaLock className="aviso-icone" />
      <div className="aviso-conteudo">
        <h3 className="aviso-titulo">{titulo}</h3>
        <p className="aviso-texto">{texto}</p>
      </div>
    </div>
  );
}

export default Aviso;
