import jsPDF from "jspdf";
import { loadImageAsBase64 } from "../../utils/loadImageBase64";
import foneIcon from "../../assets/img/fone.png";
import mailIcon from "../../assets/img/mail.png";
import pinIcon from "../../assets/img/gps.png";

export default async function gerarModelo1(dados) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // === Carrega ícones (base64) ===
  const mailImg = await loadImageAsBase64(mailIcon);
  const foneImg = await loadImageAsBase64(foneIcon);
  const pinImg  = await loadImageAsBase64(pinIcon);

  // === TOPO dinâmico (imagem + nome + descrição + estado civil + cargo) ===

  // Medidas base
  const headerX = 45; // margem esquerda do texto no topo
  const headerMaxWidth = pageWidth - headerX - 10; // largura útil p/ quebra
  const lineStep = 5; // incremento por linha
  const nameY = 20;   // Y do nome
  let simulatedY = nameY;

  // Pré-processa linhas para calcular a altura final do cabeçalho
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  simulatedY += 4; // espaço antes da linha divisória
  simulatedY += 8; // espaço depois da linha divisória

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const objetivoText = (`Objetivo: ${dados.descricao}`) || "Descrição profissional";
  const objetivoLines = doc.splitTextToSize(objetivoText, headerMaxWidth);
  simulatedY += objetivoLines.length * lineStep;

  let ecLines = [];
  if (dados.estadoCivil) {
    ecLines = doc.splitTextToSize(`Estado civil: ${dados.estadoCivil}`, headerMaxWidth);
    simulatedY += ecLines.length * lineStep;
  }

  let cargoLines = [];
  if (dados.cargo) {
    cargoLines = doc.splitTextToSize(`Cargo desejado: ${dados.cargo}`, headerMaxWidth);
    simulatedY += cargoLines.length * lineStep;
  }

  // Altura mínima do cabeçalho + padding inferior
  const minHeaderHeight = 50;
  const headerBottomPadding = 6;
  const headerHeight = Math.max(minHeaderHeight, simulatedY + headerBottomPadding);

  // Fundo azul com altura dinâmica
  doc.setFillColor(30, 50, 90);
  doc.rect(0, 0, pageWidth, headerHeight, "F");

  // Foto (opcional)
  if (dados.fotoBase64) {
    doc.addImage(dados.fotoBase64, "JPEG", 10, 10, 30, 30);
  }

  // Texto no cabeçalho
  doc.setTextColor(255, 255, 255);

  // Nome
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(dados.nome || "", headerX, nameY);

  // Linha divisória
  doc.setDrawColor(255);
  doc.setLineWidth(0.5);
  doc.line(headerX, nameY + 2, pageWidth - 10, nameY + 2);

  // Objetivo + campos adicionais
  let headerY = nameY + 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  // Objetivo
  objetivoLines.forEach((line) => {
    doc.text(line, headerX, headerY);
    headerY += lineStep;
  });

  // Estado civil (opcional)
  ecLines.forEach((line) => {
    doc.text(line, headerX, headerY);
    headerY += lineStep;
  });

  // Cargo desejado (opcional)
  cargoLines.forEach((line) => {
    doc.text(line, headerX, headerY);
    headerY += lineStep;
  });

  // A partir daqui, as colunas começam depois do cabeçalho dinâmico
  const columnsStartY = headerHeight + 6;

  // === COLUNA ESQUERDA (azul claro) ===
  doc.setFillColor(200, 220, 255);
  doc.rect(0, columnsStartY - 5, 85, 250, "F");

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);

  let yLeft = columnsStartY; // começa um pouco mais acima que antes

  const renderSection = (title, items, iconList = false) => {
    if (!items || items.length === 0) return;

    // Linha separadora + título
    doc.setDrawColor(0, 0, 0);
    doc.line(5, yLeft, 80, yLeft);
    yLeft += 6;

    doc.setFont("helvetica", "bold");
    doc.text(title, 10, yLeft);
    yLeft += 10; // espaçamento após título

    doc.setFont("helvetica", "normal");

    items.forEach((item) => {
      if (iconList && typeof item === "object" && item.icon && item.text) {
        const iconX = 8;
        const textX = 16;
        const maxWidth = 65;

        doc.addImage(item.icon, "PNG", iconX, yLeft - 4, 5, 5);

        const lines = doc.splitTextToSize(item.text, maxWidth);
        lines.forEach((line, i) => {
          doc.text(line, textX, yLeft + i * 5);
        });

        yLeft += lines.length * 6;
      } else if (typeof item === "string") {
        const lines = doc.splitTextToSize(item, 65);
        lines.forEach((line, i) => {
          doc.text(line, 10, yLeft + i * 5);
        });
        yLeft += lines.length * 6;
      } else if (item.descricao) {
        const lines = doc.splitTextToSize(`• ${item.descricao}`, 65);
        lines.forEach((line, i) => {
          doc.text(line, 10, yLeft + i * 5);
        });
        yLeft += lines.length * 6;
      }
    });

    yLeft += 4;
  };

  // Seções da coluna esquerda
  renderSection(
    "CONTATO",
    [
      { icon: mailImg, text: dados.email || "" },
      { icon: foneImg, text: dados.telefone || "" },
      { icon: pinImg,  text: dados.cidade || "" },
    ],
    true
  );

  renderSection(
    "ESCOLARIDADE",
    (dados.formacoes || []).map((f) => `${f.curso} - ${f.instituicao}`)
  );

  renderSection("HABILIDADES", dados.habilidades || []);

  renderSection("CERTIFICAÇÕES", dados.certificacoes || []);

  // === COLUNA DIREITA (Experiências) ===
  let yRight = columnsStartY + 6; // começa um pouco mais abaixo para dar margem
  const rightStart = 90;

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("EXPERIÊNCIA PROFISSIONAL", rightStart, yRight);
  yRight += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  // Largura útil de texto na coluna direita (evita vazamento)
  const rightMaxWidth = pageWidth - rightStart - 10;

  (dados.experiencias || []).forEach((exp) => {
    // Cargo - Empresa
    const cargoEmpresa = `${exp.cargo || ""} - ${exp.empresa || ""}`.trim();
    doc.setFont("helvetica", "bold");
    const cargoEmpresaLines = doc.splitTextToSize(cargoEmpresa, rightMaxWidth);
    cargoEmpresaLines.forEach((line) => {
      doc.text(line, rightStart, yRight);
      yRight += 5;
    });

    // Período
    doc.setFont("helvetica", "normal");
    if (exp.periodo) {
      const periodoLines = doc.splitTextToSize(exp.periodo, rightMaxWidth);
      periodoLines.forEach((line) => {
        doc.text(line, rightStart, yRight);
        yRight += 5;
      });
    }

    // Descrição
    if (exp.descricao) {
      const descLines = doc.splitTextToSize(exp.descricao, rightMaxWidth);
      descLines.forEach((line) => {
        doc.text(line, rightStart, yRight);
        yRight += 5;
      });
    }

    yRight += 4; // respiro entre experiências
  });

  doc.save("curriculo-modelo1.pdf");
}
