import React from "react";
import "./Titulo.css";

function Titulo({ texto }) {
  return (
    <div className="titulo-bloco">
      <h2 className="titulo-texto">{texto}</h2>
    </div>
  );
}

export default Titulo;
