import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Titulo from '../../components/Titulo/Titulo';
import Footer from '../../components/Footer/Footer';

function SobreDev() {
  return (
    <div>
      <Navbar isHome={false} />
      <div style={{ paddingTop:"50px" }}><Titulo texto={"Sobre o Desenvolvedor"}/></div>
      <Footer/>
    </div>
  );
}

export default SobreDev;
