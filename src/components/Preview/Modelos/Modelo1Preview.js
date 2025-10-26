// Prévia do Modelo 1 — textos maiores, alinhamento de margem e timeline à esquerda do texto
import React from "react";
import MailIcon from "../../../assets/img/mail.png";
import PhoneIcon from "../../../assets/img/fone.png";
import PinIcon from "../../../assets/img/gps.png";
import "./Modelo1Preview.css";

export default function Modelo1Preview({ dados = {} }) {
  const {
    nome = "",
    cargo = "",
    email = "",
    telefone = "",
    cidade = "",
    descricao = "",
    experiencias = [],
    formacoes = [],
    habilidades = [],
  } = dados;

  const contatoBlocos = [
    email ? { ico: MailIcon, texto: `Email: ${email}` } : null,
    telefone ? { ico: PhoneIcon, texto: `Telefone: ${telefone}` } : null,
    cidade ? { ico: PinIcon, texto: `Endereço: ${cidade}` } : null,
  ].filter(Boolean);

  return (
    <div className="modelo1-preview">
      {/* Faixa do topo */}
      <div className="m1-band">
        <div className="m1-inner">
          <h1 className="m1-nome">{nome}</h1>
          {cargo ? <div className="m1-cargo">{cargo}</div> : null}

          <div className="m1-contatos">
            {contatoBlocos.map((c, i) => (
              <div className="m1-contato" key={`c-${i}`}>
                <img src={c.ico} alt="" className="m1-ico" />
                <span className="m1-contato-txt">{c.texto}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Corpo */}
      <div className="m1-inner">
        {/* Descrição Profissional */}
        {descricao?.trim() ? (
          <section className="m1-section">
            <h2 className="m1-title">Descrição profissional</h2>
            <p className="m1-body">{descricao}</p>
          </section>
        ) : null}

        {/* Experiência Profissional */}
        <section className="m1-section">
          <h2 className="m1-title">Experiência Profissional</h2>

          {(experiencias || []).length === 0 ? (
            <p className="m1-muted">Sem experiências adicionadas.</p>
          ) : (
            <div className="m1-exp">
              {(experiencias || []).map((exp, i) => {
                const cabec = [exp?.cargo, exp?.empresa].filter(Boolean).join(" — ");
                const isLast = i === (experiencias.length - 1);

                return (
                  <div className="m1-exp-row" key={`exp-${i}`}>
                    {/* Timeline (fora da coluna de texto, à esquerda) */}
                    <span className="m1-tl-dot" />
                    <span className="m1-tl-connector" />
                    {!isLast && <span className="m1-tl-vert" />}

                    {/* Coluna de texto totalmente alinhada à margem esquerda */}
                    <div className="m1-exp-content">
                      <div className="m1-h3">{cabec}</div>
                      {exp?.periodo ? <div className="m1-sub">{exp.periodo}</div> : null}
                      {exp?.descricao ? <p className="m1-body">{exp.descricao}</p> : null}
                      {!isLast && <div className="m1-sep" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Formação */}
        <section className="m1-section">
          <h2 className="m1-title">Formação</h2>
          {(formacoes || []).length === 0 ? (
            <p className="m1-muted">Sem formações adicionadas.</p>
          ) : (
            (formacoes || []).map((form, i) => (
              <div className="m1-form-row" key={`form-${i}`}>
                <div className="m1-h3">
                  {[form?.curso, form?.instituicao].filter(Boolean).join(" — ")}
                </div>
                {form?.periodo ? <div className="m1-sub">{form.periodo}</div> : null}
                {form?.descricao ? <p className="m1-body">{form.descricao}</p> : null}
                {i < (formacoes.length - 1) && <div className="m1-sep" />}
              </div>
            ))
          )}
        </section>

        {/* Habilidades */}
        {(habilidades || []).length ? (
          <section className="m1-section">
            <h2 className="m1-title">Habilidades</h2>
            <ul className="m1-list">
              {(habilidades || []).map((h, i) =>
                h?.descricao ? <li key={`hab-${i}`}>{h.descricao}</li> : null
              )}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}
