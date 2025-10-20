import gerarModelo0 from './modelos/modelo0';
import gerarModelo1 from './modelos/modelo1';
import gerarModelo2 from './modelos/modelo2';

export default function gerarCurriculoPDF(dados) {
  const modelo = localStorage.getItem("modeloSelecionado") || "modelo0";
  switch (modelo) {
    case "modelo2":
      return gerarModelo2(dados);
    case "modelo1":
      return gerarModelo1(dados);
    case "modelo0":
    default:
      return gerarModelo0(dados);
  }
}
