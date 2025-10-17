import React from 'react';
import './Modelo0Preview.css';

function Modelo0Preview({ dados = {} }) {
  const {
    nome = '',
    email = '',
    telefone = '',
    cidade = '',
    cargo = '',
    descricao = '',
    experiencias = [],
    formacoes = [],
    habilidades = []
  } = dados;

  const temTexto = (t) => typeof t === 'string' && t.trim().length > 0;

  return (
    <div className="modelo0-preview">
      <h1 className="titulo-nome">{nome || 'Seu nome'}</h1>

      <div className="bloco-info">
        <p>Email: {email || '—'}</p>
        <p>Telefone: {telefone || '—'}</p>
        <p>Cidade: {cidade || '—'}</p>
        <p>Cargo desejado: {cargo || '—'}</p>
      </div>

      {/* NOVO BLOCO: Descrição profissional */}
      {temTexto(descricao) && (
        <div className="bloco-sessao">
          <h2>Descrição profissional</h2>
          <p className="texto-longo">{descricao}</p>
        </div>
      )}

      <div className="bloco-sessao">
        <h2>Experiência Profissional</h2>
        {experiencias.length === 0 && <p>—</p>}
        {experiencias.map((exp, index) => (
          <div key={index} className="bloco-item">
            <p className="item-titulo">
              {(exp?.cargo || '')}{exp?.empresa ? ` - ${exp.empresa}` : ''}
            </p>
            <p>{exp?.periodo || ''}</p>
            {temTexto(exp?.descricao) && <p className="texto-longo">{exp.descricao}</p>}
          </div>
        ))}
      </div>

      <div className="bloco-sessao">
        <h2>Formação</h2>
        {formacoes.length === 0 && <p>—</p>}
        {formacoes.map((form, index) => (
          <div key={index} className="bloco-item">
            <p className="item-titulo">
              {(form?.curso || '')}{form?.instituicao ? ` - ${form.instituicao}` : ''}
            </p>
            <p>{form?.periodo || ''}</p>
            {temTexto(form?.descricao) && <p className="texto-longo">{form.descricao}</p>}
          </div>
        ))}
      </div>

      <div className="bloco-sessao">
        <h2>Habilidades</h2>
        {habilidades.length === 0 && <p>—</p>}
        <ul>
          {habilidades.map((hab, index) => (
            <li key={index}>{hab?.descricao || ''}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Modelo0Preview;
