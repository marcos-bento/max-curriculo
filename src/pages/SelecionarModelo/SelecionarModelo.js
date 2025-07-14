  import React from 'react';
  import { useNavigate } from 'react-router-dom';
  import Navbar from '../../components/Navbar/Navbar';
  import Footer from '../../components/Footer/Footer';
  import modelo0 from "../../assets/img/modelo0.png";
  import modelo1 from "../../assets/img/modelo1.png";
  import modelo2 from "../../assets/img/modelo2.png";
  import modelo3 from "../../assets/img/modelo3.png";
  import './SelecionarModelo.css';
  import Titulo from '../../components/Titulo/Titulo';

  function SelecionarModelo() {
    const navigate = useNavigate();

    const selecionarModelo = (modelo) => {
      // Salva o modelo escolhido no localStorage
      localStorage.setItem("modeloSelecionado", modelo);
      navigate("/form");
    };

    return (
      <div>
        <Navbar isHome={false} />

        <div className="modelo-container">
          <div className='modelo-container-titulo'><Titulo texto={"Escolha seu modelo de currículo"}/></div>

          <div className="modelos-grid">
            <div className="modelo-card" onClick={() => selecionarModelo("modelo0")}>
              <img src={modelo0} alt="Modelo 0" />
              <p>Modelo Clássico</p>
            </div>

            <div className="modelo-card" onClick={() => selecionarModelo("modelo1")}>
              <img src={modelo1} alt="Modelo 1" />
              <p>01 - Modelo Azul Com Imagem</p>
            </div>

            <div className="modelo-card" onClick={() => selecionarModelo("modelo2")}>
              <img src={modelo2} alt="Modelo 2" />
              <p>02 - Modelo Azul Com Imagem</p>
            </div>

            <div className="modelo-card" onClick={() => selecionarModelo("modelo3")}>
              <img src={modelo3} alt="Modelo 3" />
              <p>03 - Modelo Vermelho com Imagem</p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  export default SelecionarModelo;
