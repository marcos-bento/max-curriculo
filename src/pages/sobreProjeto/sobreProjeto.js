import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Titulo from '../../components/Titulo/Titulo';
import Footer from '../../components/Footer/Footer';

function SobreProjeto() {
  return (
    <div>
      <Navbar isHome={false} />
      <div style={{ paddingTop:"50px" }}><Titulo texto={"Sobre o Projeto"}/></div>
      <Footer/>
    </div>
  );
}

export default SobreProjeto;