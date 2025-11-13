import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Titulo from '../../components/Titulo/Titulo';
import Footer from '../../components/Footer/Footer';
import './sobreDev.css';
import quemSouEu from '../../assets/img/QuemSouEu.png';
import porQueMaxCurriculo from '../../assets/img/PorQueMaxCurriculo.png';
import qualTecno from '../../assets/img/QualTecno.png';

const blocosConteudo = [
  {
    id: 1,
    etiqueta: 'Sobre o Dev',
    titulo: 'Quem sou eu?',
    descricao:
      'Sou um desenvolvedor em formação, apaixonado por tecnologia e sempre em busca de novos desafios. Este projeto é parte da minha evolução na área de programação e desenvolvimento web.',
    imagem: quemSouEu,
    alt: 'Ilustração relacionada a perfil profissional',
  },
  {
    id: 2,
    etiqueta: 'Sobre a ferramenta',
    titulo: 'Porque o MaxCurrículo foi criado?',
    descricao:
      'Além de praticar e aplicar meus conhecimentos técnicos, quis construir algo que também pudesse ajudar outras pessoas a conquistarem novas oportunidades profissionais.',
    imagem: porQueMaxCurriculo,
    alt: 'Ilustração representando desenvolvimento de código',
  },
  {
    id: 3,
    etiqueta: 'Sobre a tecnologia',
    titulo: 'Quais tecnologias foram utilizadas?',
    descricao:
      'O MaxCurriculo foi desenvolvido utilizando ferramentas como React, JavaScript, Figma (para o design) e bibliotecas modernas para criação de documentos em PDF.',
    imagem: qualTecno,
    alt: 'Ilustração simbolizando colaboração entre pessoas',
  },
];

const blocoConclusao = {
  titulo: 'Construindo junto com a comunidade',
  // TODO: No meio deste texto da const blocoConclusao há um e-mail. Quero que o e-mail seja clicável
  descricao:
    'Caso queira saber mais sobre o projeto ou trocar ideias, fique à vontade para me encontrar nas redes sociais! E-mail: marcos.x.marcos@hotmail.com.br',
};

function SobreDev() {
  return (
    <div className="sobre-dev">
      <Navbar isHome={false} />

      <main className="sobre-dev__conteudo">
        <div className="sobre-dev__titulo-wrapper">
          <Titulo texto="Sobre o Desenvolvedor" />
        </div>

        <section className="sobre-dev__blocos">
          <div className="sobre-dev__divider" aria-hidden="true" />
          {blocosConteudo.map((bloco, index) => (
            <React.Fragment key={bloco.id}>
              <div
                className={`sobre-dev__bloco ${
                  index % 2 !== 0 ? 'sobre-dev__bloco--invertido' : ''
                }`}
              >
                <div className="sobre-dev__imagem">
                  <img src={bloco.imagem} alt={bloco.alt} loading="lazy" />
                </div>

                <div className="sobre-dev__texto">
                  <span className="sobre-dev__etiqueta">{bloco.etiqueta}</span>
                  <h3>{bloco.titulo}</h3>
                  <p>{bloco.descricao}</p>
                </div>
              </div>

              {index < blocosConteudo.length - 1 && (
                <div className="sobre-dev__divider" aria-hidden="true" />
              )}
            </React.Fragment>
          ))}
          <div className="sobre-dev__divider" aria-hidden="true" />
        </section>

        <section className="sobre-dev__conclusao">
          <h4>{blocoConclusao.titulo}</h4>
          <p>{blocoConclusao.descricao}</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default SobreDev;
