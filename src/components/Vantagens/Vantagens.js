import React from "react";
import "./Vantagens.css";
import img1 from "../../assets/img/icon1.png";
import img2 from "../../assets/img/icon2.png";
import img3 from "../../assets/img/icon3.png";

function Vantagens() {
  const cards = [
    { texto: "Um bom currículo pode te dar mais chances de ser encontrado!", imagem: img1 },
    { texto: "Seja encontrado pelas principais ferramentas de IA e saia na frente!", imagem: img2 },
    { texto: "Rápido e prático, acelere o processo pra garantir uma nova oportunidade!", imagem: img3 },
  ];

  return (
    <div className="vantagens-container">
      {cards.map((card, index) => (
        <div key={index} className="card-vantagem">
          <div className="icone-circular">
            <img src={card.imagem} alt="" />
          </div>
          <div className="conteudo-card">
            <p>{card.texto}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Vantagens;
