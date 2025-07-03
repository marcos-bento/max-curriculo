import React from "react";
import "./TituloSessao.css";

function TituloSessao({ texto }) {
  return (
    <div className="titulo-sessao">
      <h2>{texto}</h2>
    </div>
  );
}

export default TituloSessao;
