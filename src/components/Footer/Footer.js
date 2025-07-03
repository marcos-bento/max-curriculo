import React from "react";
import "./Footer.css";
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-coluna-esquerda">
        <h2 className="footer-logo">Max Currículo</h2>
        <div className="footer-icones">
          <div className="footer-icones-round"><FaFacebookF color="#1877F2" /></div>
          <div className="footer-icones-round"><FaLinkedinIn color="#0A66C2" /></div>
          <div className="footer-icones-round"><FaYoutube color="#FF0000" /></div>
          <div className="footer-icones-round"><FaWhatsapp color="#25D366" /></div>
        </div>
      </div>

      <div className="footer-linha-central" />

      <div className="footer-coluna-direita">
        <h3 className="footer-titulo">Saiba mais</h3>
        <Link to="/sobreProjeto" className="footer-link">Sobre o projeto</Link>
        <Link to="/sobreDev" className="footer-link">Sobre o desenvolvedor</Link>
      </div>
    </footer>
  );
}

export default Footer;
