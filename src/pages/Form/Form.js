import React from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../../components/Navbar/Navbar';
import Titulo from '../../components/Titulo/Titulo';
import Aviso from '../../components/Aviso/Aviso';
import TituloSessao from '../../components/TituloSessao/TituloSessao';
import Footer from '../../components/Footer/Footer';
import InputTexto from '../../components/InputTexto/InputTexto';

function Form() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (dados) => {
    console.log(dados); // aqui futuramente geramos o PDF
  };

  return (
    <div>
      <Navbar isHome={false} />
      <div style={{ paddingTop: "50px" }}><Titulo texto="Novo currículo" /></div>
      <Aviso
        titulo="Aviso"
        texto="Os dados inseridos são usados apenas para gerar seu currículo. Não armazenamos nem compartilhamos nenhuma informação. O MaxCurriculo não se responsabiliza pelo uso ou conteúdo dos dados fornecidos."
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <TituloSessao texto="Dados pessoais" />
        <div style={{ padding: "40px var(--padding-padrao)" }}>
          <InputTexto label="Nome completo" name="nome" register={register} required />
          <InputTexto label="Email" name="email" type="email" register={register} required />
          <InputTexto label="Telefone" name="telefone" register={register} required />
          <InputTexto label="Cidade" name="cidade" register={register} required />
          <InputTexto label="Cargo desejado" name="cargo" register={register} required />
        </div>

        {/* Demais seções virão abaixo */}
        
        <TituloSessao texto="Experiência Profissional" />
        {/* Inputs da experiência aqui */}

        <TituloSessao texto="Formação" />
        {/* Inputs da formação aqui */}

        <TituloSessao texto="Habilidades" />
        {/* Inputs das habilidades aqui */}
      </form>

      <Footer />
    </div>
  );
}

export default Form;
