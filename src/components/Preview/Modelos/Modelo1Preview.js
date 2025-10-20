// Bloco: Prévia visual do Modelo 1 (simples moderno + ícones + timeline)
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

  return (
    <div className="modelo1-preview">
      {/* Faixa do topo */}
      <div className="m1-band">
        <div className="m1-container">
          <h1 className="m1-nome">{nome}</h1>
          {cargo ? <div className="m1-cargo">{cargo}</div> : null}

          {/* Contatos com ícones */}
          <div className="m1-contatos">
            {email && (
              <div className="m1-contato">
                <img src={MailIcon} alt="" className="m1-ico" />
                <span>Email: {email}</span>
              </div>
            )}
            {telefone && (
              <div className="m1-contato">
                <img src={PhoneIcon} alt="" className="m1-ico" />
                <span>Telefone: {telefone}</span>
              </div>
            )}
            {cidade && (
              <div className="m1-contato">
                <img src={PinIcon} alt="" className="m1-ico" />
                <span>Endereço: {cidade}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="m1-container">
        {/* Bloco de Descrição Profissional */}
        {descricao?.trim() ? (
          <section className="m1-section">
            <SectionTitle>Descrição profissional</SectionTitle>
            <p className="m1-text">{descricao}</p>
          </section>
        ) : null}

        {/* Bloco de Experiência Profissional (com timeline) */}
        <section className="m1-section">
          <SectionTitle>Experiência Profissional</SectionTitle>

          {(experiencias || []).length === 0 && (
            <p className="m1-muted">Sem experiências adicionadas.</p>
          )}

          <div className="m1-timeline">
            {(experiencias || []).map((exp, i) => {
              const cabec = [exp?.cargo, exp?.empresa].filter(Boolean).join(" — ");
              return (
                <div className="m1-tl-item" key={`exp-${i}`}>
                  {/* Ponto e conector horizontal */}
                  <div className="m1-tl-dot" />
                  <div className="m1-tl-connector" />

                  <div className="m1-item">
                    <div className="m1-item-header">
                      <div className="m1-item-title">{cabec}</div>
                      {exp?.periodo ? (
                        <div className="m1-item-sub">{exp.periodo}</div>
                      ) : null}
                    </div>
                    {exp?.descricao ? (
                      <p className="m1-text">{exp.descricao}</p>
                    ) : null}
                  </div>

                  {/* Linha vertical até o próximo item */}
                  {i < (experiencias.length - 1) && <div className="m1-tl-vert" />}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bloco de Formação */}
        <section className="m1-section">
          <SectionTitle>Formação</SectionTitle>

          {(formacoes || []).length === 0 && (
            <p className="m1-muted">Sem formações adicionadas.</p>
          )}

          {(formacoes || []).map((form, i) => (
            <div className="m1-item" key={`form-${i}`}>
              <div className="m1-item-header">
                <div className="m1-item-title">
                  {[form?.curso, form?.instituicao].filter(Boolean).join(" — ")}
                </div>
                {form?.periodo ? (
                  <div className="m1-item-sub">{form.periodo}</div>
                ) : null}
              </div>
              {form?.descricao ? (
                <p className="m1-text">{form.descricao}</p>
              ) : null}
              {i < (formacoes.length - 1) ? <div className="m1-divider" /> : null}
            </div>
          ))}
        </section>

        {/* Bloco de Habilidades */}
        {(habilidades || []).length ? (
          <section className="m1-section">
            <SectionTitle>Habilidades</SectionTitle>
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

// Bloco: Título de sessão
function SectionTitle({ children }) {
  return <h2 className="m1-title">{children}</h2>;
}
