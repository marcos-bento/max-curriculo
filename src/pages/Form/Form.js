import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Titulo from '../../components/Titulo/Titulo';
import Aviso from '../../components/Aviso/Aviso';
import TituloSessao from '../../components/TituloSessao/TituloSessao';
import Footer from '../../components/Footer/Footer';

function Form() {
  return (
    <div>
      <Navbar isHome={false} />
      <div style={{ paddingTop:"50px" }}><Titulo texto={"Novo currículo"}/></div>
      <Aviso 
        titulo="Aviso" 
        texto="Os dados inseridos são usados apenas para gerar seu currículo. Não armazenamos nem compartilhamos nenhuma informação. O MaxCurriculo não se responsabiliza pelo uso ou conteúdo dos dados fornecidos." 
      />
      <TituloSessao texto={"Dados pessoais"}/>

      {/* Em breve */}

      <TituloSessao texto={"Experiência Profissional"}/>

      {/* Em breve */}
      
      <TituloSessao texto={"Formação"}/>
      
      {/* Em breve */}
      
      <TituloSessao texto={"Habilidades"}/>

      <Footer/>
    </div>
  );
}

export default Form;
