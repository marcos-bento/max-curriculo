import jsPDF from "jspdf";
import { loadImageAsBase64 } from "../../utils/loadImageBase64";
import foneIcon from "../../assets/img/fone.png";
import mailIcon from "../../assets/img/mail.png";
import pinIcon from "../../assets/img/gps.png";

export default async function gerarModelo1(dados) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 10;
  const mailImg = await loadImageAsBase64(mailIcon);
  doc.addImage(mailImg, 'PNG', 22, y, 5, 5);

  const foneImg = await loadImageAsBase64(foneIcon);
  doc.addImage(foneImg, 'PNG', 22, y, 5, 5);

  const pinImg = await loadImageAsBase64(pinIcon);
  doc.addImage(pinImg, 'PNG', 22, y, 5, 5);

  // TOPO (imagem + nome + descrição)
  doc.setFillColor(30, 50, 90); // Azul escuro
  doc.rect(0, 0, pageWidth, 50, 'F');

  // Foto
  if (dados.fotoBase64) {
    doc.addImage(dados.fotoBase64, 'JPEG', 10, 10, 30, 30);
  }

  // Nome e descrição
  doc.setTextColor(255, 255, 255); // Branco
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(dados.nome, 45, 20);

  doc.setDrawColor(255);
  doc.setLineWidth(0.5);
  doc.line(45, 22, pageWidth - 10, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(dados.descricao || "Descrição profissional", 45, 30);

  y = 55;

  // COLUNA LATERAL ESQUERDA (azul claro)
  doc.setFillColor(200, 220, 255); // Azul claro
  doc.rect(0, y-5, 85, 250, 'F');

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  let yLeft = y + 2;

  const renderSection = (title, items, iconList = false) => {
    if (!items || items.length === 0) return;

    // Linha preta separadora
    doc.setDrawColor(0, 0, 0);
    doc.line(5, yLeft, 80, yLeft);
    yLeft += 6;

    // Título da seção
    doc.setFont("helvetica", "bold");
    doc.text(title, 10, yLeft);
    yLeft += 10; // espaçamento maior após o título

    doc.setFont("helvetica", "normal");

    items.forEach((item) => {
      if (iconList && typeof item === "object" && item.icon && item.text) {
        const iconX = 8;
        const textX = 16;
        const maxWidth = 65;

        doc.addImage(item.icon, 'PNG', iconX, yLeft - 4, 5, 5);

        const lines = doc.splitTextToSize(item.text, maxWidth);
        lines.forEach((line, i) => {
          doc.text(line, textX, yLeft + (i * 5));
        });

        yLeft += lines.length * 6;
      } else if (typeof item === 'string') {
        const lines = doc.splitTextToSize(item, 65);
        lines.forEach((line, i) => {
          doc.text(line, 10, yLeft + (i * 5));
        });
        yLeft += lines.length * 6;
      } else if (item.descricao) {
        const lines = doc.splitTextToSize(`• ${item.descricao}`, 65);
        lines.forEach((line, i) => {
          doc.text(line, 10, yLeft + (i * 5));
        });
        yLeft += lines.length * 6;
      }
    });

    yLeft += 4;
  };

  renderSection("CONTATO", [
    { icon: mailImg, text: dados.email },
    { icon: foneImg, text: dados.telefone },
    { icon: pinImg, text: dados.cidade },
  ], true);

  renderSection("ESCOLARIDADE", dados.formacoes.map(f => `${f.curso} - ${f.instituicao}`));
  renderSection("HABILIDADES", dados.habilidades);
  renderSection("CERTIFICAÇÕES", dados.certificacoes || []);

  // COLUNA PRINCIPAL DIREITA
  let yRight = y + 5;
  const rightStart = 90;

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("EXPERIÊNCIA PROFISSIONAL", rightStart, yRight);
  yRight += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  dados.experiencias?.forEach((exp) => {
    doc.text(`${exp.cargo} - ${exp.empresa}`, rightStart, yRight);
    yRight += 6;
    doc.text(`${exp.periodo}`, rightStart, yRight);
    yRight += 6;
    doc.text(`${exp.descricao}`, rightStart, yRight);
    yRight += 10;
  });

  doc.save("curriculo-modelo1.pdf");
}
