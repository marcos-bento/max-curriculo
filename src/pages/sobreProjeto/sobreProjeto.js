import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Titulo from '../../components/Titulo/Titulo';
import Footer from '../../components/Footer/Footer';
import '../sobreDev/sobreDev.css';
import paraQuemEh from '../../assets/img/ParaQuemEh.png';
import porQueExiste from '../../assets/img/PorQueExiste.png';
import qualDif from '../../assets/img/QualDif.png';

const blocosConteudo = [
  {
    id: 1,
    etiqueta: 'Sobre o Projeto',
    titulo: 'Por que foi criado?',
    descricao:
      'O MaxCurriculo foi criado como parte do meu processo de aprendizado e aprimoramento em programação. Além disso, tem como objetivo ajudar pessoas que precisam criar um currículo de forma simples e rápida.',
    imagem: porQueExiste,
    alt: 'Ilustração representando desenvolvimento de código',
  },
  {
    id: 2,
    etiqueta: 'Sobre o Projeto',
    titulo: 'Praticidade no uso',
    descricao:
      'Este site é focado na praticidade: você gera seu currículo sem precisar se cadastrar e sem enfrentar processos complicados. Tudo de forma gratuita e intuitiva.',
    imagem: qualDif,
    alt: 'Ilustração simbolizando praticidade',
  },
  {
    id: 3,
    etiqueta: 'Para quem',
    titulo: 'Para quem é',
    descricao:
      'Para quem precisa montar um currículo de maneira rápida, seja para buscar o primeiro emprego, uma nova vaga ou apenas atualizar as informações profissionais.',
    imagem: paraQuemEh,
    alt: 'Ilustração relacionada a perfil profissional',
  },
];

const blocoConclusao = {
  titulo: 'Construindo junto com a comunidade',
  descricao:
    'Este projeto é parte da minha jornada como desenvolvedor, e espero que também ajude você na sua!',
};

function SobreProjeto() {
  return (
    <div className="sobre-dev">
      <Navbar isHome={false} />

      <main className="sobre-dev__conteudo">
        <div className="sobre-dev__titulo-wrapper">
          <Titulo texto="Sobre o Projeto" />
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

export default SobreProjeto;
