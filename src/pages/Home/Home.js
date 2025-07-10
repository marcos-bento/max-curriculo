import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/Banner/Banner';
import RotatingMessage from '../../components/MensagemRotativa/RotatingMessage';
import Vantagens from '../../components/Vantagens/Vantagens';
import Modelos from '../../components/Modelos/Modelos';
import Botao from '../../components/Botao/Botao';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar isHome={true} />  
      <Banner/>
      <RotatingMessage/>
      <Vantagens/>
      <Modelos/>
      <div style={{ display: "flex", justifyContent: "center", paddingBottom:"50px" }}><Botao texto="Faça seu currículo agora!" onClick={() => navigate("/selecionarModelo")} /></div>
      <Footer/>
    </div>
  );
}

export default Home;
