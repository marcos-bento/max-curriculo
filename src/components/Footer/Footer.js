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
          <a
            className="footer-icones-round"
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebookF color="#1877F2" />
          </a>
          <a
            className="footer-icones-round"
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn color="#0A66C2" />
          </a>
          <a
            className="footer-icones-round"
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <FaYoutube color="#FF0000" />
          </a>
          <a
            className="footer-icones-round"
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <FaWhatsapp color="#25D366" />
          </a>
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
