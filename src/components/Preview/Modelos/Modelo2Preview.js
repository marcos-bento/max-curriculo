import React from "react";
import "./Modelo2Preview.css";
import mailIcon from "../../../assets/img/mail.png";
import foneIcon from "../../../assets/img/fone.png";
import pinIcon from "../../../assets/img/gps.png";

export default function Modelo2Preview({ dados = {} }) {
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

  return (
    <div className="modelo2-wrapper">
      {/* Header em grid: imagem e texto em colunas (sem sobreposição) */}
      <div className="modelo2-header">
        <div className="modelo2-header-grid">
          {fotoBase64 ? (
            <img src={fotoBase64} alt="Foto" className="modelo2-foto" />
          ) : (
            <div className="modelo2-foto placeholder" />
          )}

          <div className="modelo2-header-text">
            <div className="modelo2-nome">{nome}</div>
            <div className="modelo2-divisor" />
            {descricao && (
              <div className="modelo2-linha">
                <strong>Objetivo:</strong> {descricao}
              </div>
            )}
            {idade && (
              <div className="modelo2-linha">
                <strong>Idade / Nascimento:</strong> {idade}
              </div>
            )}
            {estadoCivil && (
              <div className="modelo2-linha">
                <strong>Estado civil:</strong> {estadoCivil}
              </div>
            )}
            {cargo && (
              <div className="modelo2-linha">
                <strong>Cargo desejado:</strong> {cargo}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid duas colunas */}
      <div className="modelo2-grid">
        {/* Coluna esquerda (35%) */}
        <aside className="modelo2-col-esq">
          <div className="modelo2-sep" />
          <h3 className="modelo2-titulo-secao">CONTATO</h3>
          <div className="modelo2-texto">
            {email && (
              <div className="modelo2-iconrow mb6">
                <img src={mailIcon} alt="" className="modelo2-ico" />
                <span>{email}</span>
              </div>
            )}
            {telefone && (
              <div className="modelo2-iconrow mb6">
                <img src={foneIcon} alt="" className="modelo2-ico" />
                <span>{telefone}</span>
              </div>
            )}
            {cidade && (
              <div className="modelo2-iconrow mb6">
                <img src={pinIcon} alt="" className="modelo2-ico" />
                <span>{cidade}</span>
              </div>
            )}
            {linkedin && <div className="mb6">LinkedIn: {linkedin}</div>}
            {portfolio && <div className="mb6">Portfólio: {portfolio}</div>}
          </div>

          {Array.isArray(formacoes) && formacoes.length > 0 && (
            <>
              <div className="modelo2-sep" />
              <h3 className="modelo2-titulo-secao">ESCOLARIDADE</h3>
              <div className="modelo2-texto">
                {formacoes.map((f, idx) => {
                  const linha = [f?.curso, f?.instituicao].filter(Boolean).join(" — ");
                  return (
                    <div key={idx} className="mb6">
                      {linha && <div>• {linha}</div>}
                      {f?.periodo && <div className="indent">{f.periodo}</div>}
                      {f?.descricao && <div className="indent">{f.descricao}</div>}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {Array.isArray(habilidades) && habilidades.length > 0 && (
            <>
              <div className="modelo2-sep" />
              <h3 className="modelo2-titulo-secao">HABILIDADES</h3>
              <div className="modelo2-texto">
                {habilidades.map((h, idx) => {
                  const txt = (typeof h === "string" ? h : h?.descricao) || "";
                  return txt ? <div key={idx} className="mb4">• {txt}</div> : null;
                })}
              </div>
            </>
          )}

          {Array.isArray(certificacoes) && certificacoes.length > 0 && (
            <>
              <div className="modelo2-sep" />
              <h3 className="modelo2-titulo-secao">CERTIFICAÇÕES</h3>
              <div className="modelo2-texto">
                {certificacoes.map((c, idx) => {
                  const txt = (typeof c === "string" ? c : c?.descricao) || "";
                  return txt ? <div key={idx} className="mb4">• {txt}</div> : null;
                })}
              </div>
            </>
          )}
        </aside>

        {/* Coluna direita (65%) */}
        <section className="modelo2-col-dir">
          <h2 className="modelo2-h2">EXPERIÊNCIA PROFISSIONAL</h2>
          <div className="modelo2-texto">
            {Array.isArray(experiencias) && experiencias.length > 0 ? (
              experiencias.map((exp, idx) => (
                <div key={idx} className="mb12">
                  <div className="modelo2-exp-titulo">
                    {[exp?.cargo, exp?.empresa].filter(Boolean).join(" — ")}
                  </div>
                  {exp?.periodo && <div>{exp.periodo}</div>}
                  {exp?.descricao && <div>{exp.descricao}</div>}
                </div>
              ))
            ) : (
              <div className="modelo2-placeholder">
                Preencha suas experiências para visualizar a prévia…
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
