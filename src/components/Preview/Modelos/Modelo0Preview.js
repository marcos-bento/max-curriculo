import React from 'react';
import './Modelo0Preview.css';

function Modelo0Preview({ dados }) {
  return (
    <div className="modelo0-preview">
      <h1 className="titulo-nome">{dados.nome}</h1>

      <div className="bloco-info">
        <p>Email: {dados.email}</p>
        <p>Telefone: {dados.telefone}</p>
        <p>Cidade: {dados.cidade}</p>
        <p>Cargo desejado: {dados.cargo}</p>
      </div>

      <div className="bloco-sessao">
        <h2>Experiência Profissional</h2>
        {dados.experiencias?.map((exp, index) => (
          <div key={index} className="bloco-item">
            <p className="item-titulo">{exp.cargo} - {exp.empresa}</p>
            <p>{exp.periodo}</p>
            <p>{exp.descricao}</p>
          </div>
        ))}
      </div>

      <div className="bloco-sessao">
        <h2>Formação</h2>
        {dados.formacoes?.map((form, index) => (
          <div key={index} className="bloco-item">
            <p className="item-titulo">{form.curso} - {form.instituicao}</p>
            <p>{form.periodo}</p>
            {form.descricao && <p>{form.descricao}</p>}
          </div>
        ))}
      </div>

      <div className="bloco-sessao">
        <h2>Habilidades</h2>
        <ul>
          {dados.habilidades?.map((hab, index) => (
            <li key={index}>{hab.descricao}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Modelo0Preview;
