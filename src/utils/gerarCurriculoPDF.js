// src/utils/gerarCurriculoPDF.js
import gerarModelo0 from "./modelos/modelo0";
import gerarModelo1 from "./modelos/modelo1";
import gerarModelo2 from "./modelos/modelo2";

export default async function gerarCurriculoPDF(dados = {}) {
  const modelo = (localStorage.getItem("modeloSelecionado") || "modelo0").toLowerCase();

  switch (modelo) {
    case "modelo1":
      await gerarModelo1(dados);
      break;
    case "modelo2":
      await gerarModelo2(dados);
      break;
    case "modelo0":
    default:
      await gerarModelo0(dados);
      break;
  }
}
