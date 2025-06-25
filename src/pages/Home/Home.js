import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/Banner/Banner';

function Home() {
  return (
    <div>
      <Navbar/>
      <Banner/>
      <h1>Bem-vindo ao MaxCurriculo</h1>
      <Link to="/form">Criar Currículo</Link>
    </div>
  );
}

export default Home;
