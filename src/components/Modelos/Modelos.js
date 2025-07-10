import React from "react";
import "./Modelos.css";
import modelo1 from "../../assets/img/modelo1.png";
import modelo2 from "../../assets/img/modelo2.png";
import modelo3 from "../../assets/img/modelo3.png";
import Titulo from "../Titulo/Titulo";

function Modelos() {
  return (
    <div className="modelos-container">
        <div className="modelos-titulo"><Titulo texto={"Temos vários modelos:"}/></div>
      <div className="modelos-galeria">
        <img src={modelo1} alt="Modelo 1" />
        <img src={modelo2} alt="Modelo 2" />
        <img src={modelo3} alt="Modelo 3" />
      </div>
    </div>
  );
}

export default Modelos;
