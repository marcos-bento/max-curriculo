import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Bem-vindo ao MaxCurriculo</h1>
      <Link to="/form">Criar Currículo</Link>
    </div>
  );
}

export default Home;
