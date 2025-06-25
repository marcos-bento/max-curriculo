import React from "react";
import "./Banner.css";
import Bannerimg from "../../assets/img/Banner.png"; // Substitua pela sua imagem real

function Banner() {
  return (
    <div className="banner-container">
      <div className="banner-item grande">
        <img src={Bannerimg} alt="Banner" className="banner-img" />
        <p className="banner-item-texto texto-grande">O futuro é brilhante pra quem se prepara!</p>
      </div>
      <div className="banner-item pequeno top">
        <p className="banner-item-texto">Não te falta oportunidades... Te falta um bom <span className="banner-item-text-destaq">Currículo!</span></p>
      </div>
      <div className="banner-item pequeno bottom">
        <p className="banner-item-texto">Faça um agora mesmo, rápido e totalmente <span className="banner-item-text-destaq">grátis!</span></p>
      </div>
    </div>
  );
}

export default Banner;
