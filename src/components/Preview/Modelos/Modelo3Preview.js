import React from "react";
import "./Modelo3Preview.css";

import mailIcon from "../../../assets/img/mail.png";
import foneIcon from "../../../assets/img/fone.png";
import pinIcon from "../../../assets/img/gps.png";

export default function Modelo3Preview({
  dados = {},
  mostrarFoto = true,
  formatoFoto = "quadrada",
}) {
  const {
    nome = "",
    descricao = "",
    idade = "",
    estadoCivil = "",
    cargo = "",
    email = "",
    telefone = "",
    cidade = "",
    linkedin = "",
    portfolio = "",
    fotoBase64 = null,
    formacoes = [],
    habilidades = [],
    certificacoes = [],
    experiencias = [],
  } = dados;

  const fotoUsada = mostrarFoto ? fotoBase64 : null;

  const infoLinha = [idade, estadoCivil].filter(Boolean).join(" • ");

  const contatos = [
    email && { icon: mailIcon, texto: email },
    telefone && { icon: foneIcon, texto: telefone },
    cidade && { icon: pinIcon, texto: cidade },
  ].filter(Boolean);

  const links = [
    linkedin && `LinkedIn: ${linkedin}`,
    portfolio && `Portfólio: ${portfolio}`,
  ].filter(Boolean);

  const normalizarTexto = (item) =>
    typeof item === "string" ? item : item?.descricao || "";

  return (
    <div className="modelo3-wrapper">
      {/* Header centralizado */}
      <header className="modelo3-header">
        {fotoUsada && (
          <img
            src={fotoUsada}
            alt="Foto"
            className={`modelo3-foto ${
              formatoFoto === "redonda" ? "round" : "square"
            }`}
          />
        )}

        <h1 className="modelo3-nome">{nome || "Seu nome"}</h1>
        {cargo && <div className="modelo3-cargo">{cargo}</div>}

        {infoLinha && <div className="modelo3-info">{infoLinha}</div>}

        {contatos.length > 0 && (
          <div className="modelo3-contatos">
            {contatos.map((c, idx) => (
              <div className="modelo3-contato" key={idx}>
                <img src={c.icon} alt="" className="modelo3-ico" />
                <span>{c.texto}</span>
              </div>
            ))}
          </div>
        )}

        {links.length > 0 && (
          <div className="modelo3-links">
            {links.map((t, idx) => (
              <div key={idx}>{t}</div>
            ))}
          </div>
        )}

        <div className="modelo3-divider" />
      </header>

      <main className="modelo3-body">
        {/* Objetivo */}
        {descricao?.trim() && (
          <section className="modelo3-section">
            <h2 className="modelo3-section-title">OBJETIVO</h2>
            <p className="modelo3-texto">{descricao}</p>
          </section>
        )}

        {/* Experiência profissional */}
        {Array.isArray(experiencias) && experiencias.length > 0 && (
          <section className="modelo3-section">
            <h2 className="modelo3-section-title">EXPERIÊNCIA PROFISSIONAL</h2>
            {experiencias.map((exp, idx) => {
              const empresaPeriodo = [exp?.empresa, exp?.periodo]
                .filter(Boolean)
                .join(" • ");
              return (
                <div key={idx} className="modelo3-exp-item">
                  {exp?.cargo && (
                    <div className="modelo3-exp-cargo">{exp.cargo}</div>
                  )}
                  {empresaPeriodo && (
                    <div className="modelo3-exp-info">{empresaPeriodo}</div>
                  )}
                  {exp?.descricao && (
                    <p className="modelo3-texto">{exp.descricao}</p>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* Formação acadêmica */}
        {Array.isArray(formacoes) && formacoes.length > 0 && (
          <section className="modelo3-section">
            <h2 className="modelo3-section-title">FORMAÇÃO ACADÊMICA</h2>
            {formacoes.map((f, idx) => {
              const linhaTopo = [f?.curso, f?.instituicao]
                .filter(Boolean)
                .join(" • ");
              const linhaInfo = f?.periodo || "";

              return (
                <div key={idx} className="modelo3-exp-item">
                  {linhaTopo && (
                    <div className="modelo3-exp-cargo">{linhaTopo}</div>
                  )}
                  {linhaInfo && (
                    <div className="modelo3-exp-info">{linhaInfo}</div>
                  )}
                  {f?.descricao && (
                    <p className="modelo3-texto">{f.descricao}</p>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* Habilidades como "tags" */}
        {Array.isArray(habilidades) && habilidades.length > 0 && (
          <section className="modelo3-section">
            <h2 className="modelo3-section-title">HABILIDADES</h2>
            <div className="modelo3-tags">
              {habilidades.map((h, idx) => {
                const txt = normalizarTexto(h);
                return txt ? (
                  <span key={idx} className="modelo3-tag">
                    {txt}
                  </span>
                ) : null;
              })}
            </div>
          </section>
        )}

        {/* Certificações */}
        {Array.isArray(certificacoes) && certificacoes.length > 0 && (
          <section className="modelo3-section">
            <h2 className="modelo3-section-title">CERTIFICAÇÕES</h2>
            <ul className="modelo3-cert-list">
              {certificacoes.map((c, idx) => {
                const txt = normalizarTexto(c);
                return txt ? (
                  <li key={idx} className="modelo3-cert-item">
                    {txt}
                  </li>
                ) : null;
              })}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

