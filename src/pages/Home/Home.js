import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/Banner/Banner';
import RotatingMessage from '../../components/MensagemRotativa/RotatingMessage';
import Vantagens from '../../components/Vantagens/Vantagens';
import Modelos from '../../components/Modelos/Modelos';
import Botao from '../../components/Botao/Botao';
import Footer from '../../components/Footer/Footer';

function Home() {
  return (
    <div>
      <Navbar/>
      <Banner/>
      <RotatingMessage/>
      <Vantagens/>
      <Modelos/>
      <div style={{ display: "flex", justifyContent: "center", paddingBottom:"50px" }}><Botao texto="Faça seu currículo agora!" onClick={() => console.log("Clique")} /></div>
      <Link to="/form">Criar Currículo</Link>
      <Footer/>
    </div>
  );
}

export default Home;
