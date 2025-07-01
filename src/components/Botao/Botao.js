import React from "react";
import "./Botao.css";

function Botao({ texto, onClick }) {
  return (
    <button className="botao-estilizado" onClick={onClick}>
      {texto}
    </button>
  );
}

export default Botao;
