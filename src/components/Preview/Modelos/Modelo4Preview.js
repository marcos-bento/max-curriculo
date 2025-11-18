import React from "react";
import "./Modelo4Preview.css";

import mailIcon from "../../../assets/img/mail.png";
import foneIcon from "../../../assets/img/fone.png";
import pinIcon from "../../../assets/img/gps.png";

export default function Modelo4Preview({
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
    idiomas = [],
  } = dados;

  const fotoUsada = mostrarFoto ? fotoBase64 : null;

  const detalhesLinha = [];
  if (idade) detalhesLinha.push(`${idade} anos`);
  if (estadoCivil) detalhesLinha.push(estadoCivil);

  const contatos = [
    email && { icon: mailIcon, texto: email },
    telefone && { icon: foneIcon, texto: telefone },
    cidade && { icon: pinIcon, texto: cidade },
  ].filter(Boolean);

  const normalizarTexto = (item) =>
    typeof item === "string" ? item : item?.descricao || item?.nome || "";

  return (
    <div className="modelo4-wrapper">
      {/* Coluna lateral esquerda */}
      <aside className="modelo4-sidebar">
        {fotoUsada && (
          <img
            src={fotoUsada}
            alt="Foto"
            className={`modelo4-foto ${
              formatoFoto === "redonda" ? "round" : "square"
            }`}
          />
        )}

        <div className="modelo4-sidebar-section">
          <h3 className="modelo4-sidebar-title">DETALHES PESSOAIS</h3>
          <div className="modelo4-sidebar-text">
            {email && (
              <div className="modelo4-sidebar-line">
                <img src={mailIcon} alt="" className="modelo4-ico" />
                <span>{email}</span>
              </div>
            )}
            {telefone && (
              <div className="modelo4-sidebar-line">
                <img src={foneIcon} alt="" className="modelo4-ico" />
                <span>{telefone}</span>
              </div>
            )}
            {cidade && (
              <div className="modelo4-sidebar-line">
                <img src={pinIcon} alt="" className="modelo4-ico" />
                <span>{cidade}</span>
              </div>
            )}
            {linkedin && <div>LinkedIn: {linkedin}</div>}
            {portfolio && <div>Portfólio: {portfolio}</div>}
          </div>
        </div>

        {Array.isArray(idiomas) && idiomas.length > 0 && (
          <div className="modelo4-sidebar-section">
            <h3 className="modelo4-sidebar-title">IDIOMAS</h3>
            <div className="modelo4-sidebar-text">
              {idiomas.map((idioma, idx) => {
                const nome = normalizarTexto(idioma);
                const nivel =
                  typeof idioma === "object" ? idioma?.nivel : null;
                if (!nome) return null;
                return (
                  <div key={idx} className="modelo4-idioma-item">
                    <div className="modelo4-idioma-nome">{nome}</div>
                    {nivel && (
                      <div className="modelo4-pontos">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <span
                            key={i}
                            className={
                              i < (parseInt(nivel, 10) || 3)
                                ? "ponto ativo"
                                : "ponto"
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {Array.isArray(habilidades) && habilidades.length > 0 && (
          <div className="modelo4-sidebar-section">
            <h3 className="modelo4-sidebar-title">HABILIDADES</h3>
            <div className="modelo4-sidebar-text">
              {habilidades.map((h, idx) => {
                const txt = normalizarTexto(h);
                const nivel =
                  typeof h === "object" ? h?.nivel : null;
                if (!txt) return null;
                return (
                  <div key={idx} className="modelo4-idioma-item">
                    <div className="modelo4-idioma-nome">{txt}</div>
                    {nivel && (
                      <div className="modelo4-pontos">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <span
                            key={i}
                            className={
                              i < (parseInt(nivel, 10) || 3)
                                ? "ponto ativo"
                                : "ponto"
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </aside>

      {/* Conteúdo principal à direita */}
      <main className="modelo4-main">
        <header className="modelo4-main-header">
          <h1 className="modelo4-nome">
            {(nome || "").toUpperCase() || "SEU NOME"}
          </h1>
          {cargo && <div className="modelo4-cargo">{cargo}</div>}
          {detalhesLinha.length > 0 && (
            <div className="modelo4-detalhes">
              {detalhesLinha.join(" • ")}
            </div>
          )}
        </header>

        {/* Perfil / Objetivo */}
        {descricao?.trim() && (
          <section className="modelo4-section">
            <h2 className="modelo4-section-title">PERFIL PROFISSIONAL</h2>
            <p className="modelo4-texto">{descricao}</p>
          </section>
        )}

        {/* Formação */}
        {Array.isArray(formacoes) && formacoes.length > 0 && (
          <section className="modelo4-section">
            <h2 className="modelo4-section-title">
              ESTUDOS E CERTIFICAÇÕES
            </h2>
            {formacoes.map((f, idx) => (
              <div key={idx} className="modelo4-item">
                {f?.curso && (
                  <div className="modelo4-item-titulo">{f.curso}</div>
                )}
                {f?.instituicao && (
                  <div className="modelo4-item-sub">{f.instituicao}</div>
                )}
                {f?.periodo && (
                  <div className="modelo4-item-periodo">{f.periodo}</div>
                )}
                {f?.descricao && (
                  <p className="modelo4-texto">{f.descricao}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Experiência */}
        {Array.isArray(experiencias) && experiencias.length > 0 && (
          <section className="modelo4-section">
            <h2 className="modelo4-section-title">EXPERIÊNCIA LABORAL</h2>
            {experiencias.map((exp, idx) => (
              <div key={idx} className="modelo4-item">
                {exp?.cargo && (
                  <div className="modelo4-item-titulo">{exp.cargo}</div>
                )}
                {exp?.empresa && (
                  <div className="modelo4-item-sub">{exp.empresa}</div>
                )}
                {exp?.periodo && (
                  <div className="modelo4-item-periodo">
                    {exp.periodo}
                  </div>
                )}
                {exp?.descricao && (
                  <ul className="modelo4-bullets">
                    {exp.descricao
                      .split("\n")
                      .filter((l) => l.trim())
                      .map((linha, i) => (
                        <li key={i}>{linha.trim()}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Certificações extras */}
        {Array.isArray(certificacoes) && certificacoes.length > 0 && (
          <section className="modelo4-section">
            <h2 className="modelo4-section-title">CERTIFICAÇÕES</h2>
            <ul className="modelo4-bullets">
              {certificacoes.map((c, idx) => {
                const txt = normalizarTexto(c);
                return txt ? <li key={idx}>{txt}</li> : null;
              })}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

