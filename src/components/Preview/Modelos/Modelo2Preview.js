import React from "react";
import "./Modelo2Preview.css";

import mailIcon from "../../../assets/img/mail.png";
import foneIcon from "../../../assets/img/fone.png";
import pinIcon from "../../../assets/img/gps.png";

/**
 * Preview sem controles.
 * Recebe as escolhas de foto via props: { mostrarFoto, formatoFoto }
 */
export default function Modelo2Preview({ dados = {}, mostrarFoto = true, formatoFoto = "quadrada" }) {
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

  return (
    <div className="modelo2-wrapper">
      {/* Header em grid: imagem + texto (sem sobreposição) */}
      <div className="modelo2-header">
        <div className="modelo2-header-grid">
          {fotoUsada ? (
            <img
              src={fotoUsada}
              alt="Foto"
              className={`modelo2-foto ${formatoFoto === "redonda" ? "round" : "square"}`}
            />
          ) : (
            <div className="modelo2-foto placeholder" />
          )}

          <div className="modelo2-header-text">
            {/* Nome + idade entre parênteses */}
            <div className="modelo2-nome-linha">
              <span className="modelo2-nome">{nome}</span>
              {idade && <span className="modelo2-idade"> ({idade})</span>}
            </div>

            {/* Cargo desejado com gap sob o nome */}
            {cargo && <div className="modelo2-cargo">{cargo}</div>}

            <div className="modelo2-divisor" />

            {/* Objetivo (sem label) — justificado */}
            {descricao && <div className="modelo2-objetivo">{descricao}</div>}
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
                    <div key={idx} className="mb8">
                      {linha && <div>• {linha}</div>}
                      {f?.periodo && <div className="indent meta">{f.periodo}</div>}
                      {f?.descricao && <div className="indent justify">{f.descricao}</div>}
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
                <div key={idx} className="mb16">
                  <div className="modelo2-exp-titulo">
                    {[exp?.cargo, exp?.empresa].filter(Boolean).join(" — ")}
                  </div>
                  {exp?.periodo && <div className="meta">{exp.periodo}</div>}
                  {exp?.descricao && <div className="justify">{exp.descricao}</div>}
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
