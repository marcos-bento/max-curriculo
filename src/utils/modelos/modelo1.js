// Bloco: Geração do PDF do Modelo 1 (simples moderno)
import jsPDF from "jspdf";
import { loadImageAsBase64 } from "../../utils/loadImageBase64";
import foneIcon from "../../assets/img/fone.png";
import mailIcon from "../../assets/img/mail.png";
import pinIcon from "../../assets/img/gps.png";

/**
 * Modelo 1 — Simples Moderno (com ícones e timeline)
 */
export default async function gerarModelo1(dados = {}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Medidas
  const MARGIN_L = 48;
  const MARGIN_R = 48;
  const CONTENT_W = pageW - MARGIN_L - MARGIN_R;
  const LINE_H = 16;

  // Paleta
  const ACCENT = { r: 38, g: 99, b: 235 };
  const TEXT = { r: 40, g: 40, b: 40 };
  const MUTED = { r: 110, g: 110, b: 110 };
  const RULE = { r: 210, g: 210, b: 210 };
  const BAND = { r: 245, g: 247, b: 255 };

  // Helpers
  const setColor = (c) => doc.setTextColor(c.r, c.g, c.b);
  const setDraw = (c) => doc.setDrawColor(c.r, c.g, c.b);
  const setFill = (c) => doc.setFillColor(c.r, c.g, c.b);

  const hRule = (y) => {
    setDraw(RULE);
    doc.setLineWidth(0.6);
    doc.line(MARGIN_L, y, pageW - MARGIN_R, y);
  };

  const sectionTitle = (txt, y) => {
    // Maior respiro: espaço antes e depois da linha
    y += 6; // espaço antes da linha
    hRule(y);
    y += 12; // espaço entre linha e título
    setColor(TEXT);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(txt, MARGIN_L, y);
    return y + 14; // respiro depois do título
  };

  const writeBlock = (text, y, maxW = CONTENT_W, fontSize = 11, color = TEXT) => {
    if (!text) return y;
    setColor(color);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    const parts = doc.splitTextToSize(String(text), maxW);
    parts.forEach((ln) => {
      if (y > pageH - 60) {
        doc.addPage();
        y = 60;
      }
      doc.text(ln, MARGIN_L, y);
      y += LINE_H;
    });
    return y;
  };

  const ensureSpace = (y, needed = 80) => {
    if (y > pageH - needed) {
      doc.addPage();
      return 60;
    }
    return y;
  };

  // Cabeçalho com faixa
  setFill(BAND);
  doc.rect(0, 0, pageW, 130, "F");

  // Nome + Cargo
  let y = 62;
  setColor(TEXT);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(dados.nome || "", MARGIN_L, y);

  if (dados.cargo) {
    setColor(ACCENT);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(String(dados.cargo), MARGIN_L, y + 18);
  }

  // Ícones de contato
  const iconSize = 12; // px
  const gap = 14;
  let contactX = MARGIN_L;
  const contactY = 106;

  const mailB64 = await loadImageAsBase64(mailIcon);
  const phoneB64 = await loadImageAsBase64(foneIcon);
  const pinB64 = await loadImageAsBase64(pinIcon);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  setColor(MUTED);

  const drawContact = (iconB64, text) => {
    if (!text) return;
    doc.addImage(iconB64, "PNG", contactX, contactY - iconSize + 2, iconSize, iconSize);
    doc.text(text, contactX + iconSize + 6, contactY);
    const textW = doc.getTextWidth(text);
    contactX += iconSize + 6 + textW + gap;
  };

  drawContact(mailB64, dados.email ? `Email: ${dados.email}` : "");
  drawContact(phoneB64, dados.telefone ? `Telefone: ${dados.telefone}` : "");
  drawContact(pinB64, dados.cidade ? `Endereço: ${dados.cidade}` : "");

  // Início do conteúdo
  y = 150;

  // Descrição Profissional
  if (dados.descricao && String(dados.descricao).trim()) {
    y = sectionTitle("Descrição profissional", y);
    y = writeBlock(dados.descricao, y);
    y += 4;
  }

  // Experiência Profissional (com linha do tempo)
  y = sectionTitle("Experiência Profissional", y);

  const timelineX = MARGIN_L - 18;        // coluna da timeline
  const connectorLen = 10;                 // conector horizontal até o texto
  const dotR = 2.2;

  (dados.experiencias || []).forEach((exp, idx, arr) => {
    y = ensureSpace(y, 140);

    // Ponto e conector (timeline)
    const itemTopY = y - 6; // marca início do item
    setDraw(ACCENT);
    doc.setLineWidth(1);
    doc.circle(timelineX, itemTopY, dotR, "F"); // ponto sólido
    doc.line(timelineX + dotR, itemTopY, MARGIN_L - 4, itemTopY); // conector horizontal

    // Título (Cargo — Empresa) com quebra automática
    const titulo = [exp?.cargo, exp?.empresa].filter(Boolean).join(" — ");
    setColor(TEXT);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const tituloLines = doc.splitTextToSize(titulo, CONTENT_W);
    tituloLines.forEach((ln) => {
      doc.text(ln, MARGIN_L, y);
      y += LINE_H;
    });

    // Período
    if (exp?.periodo) {
      setColor(MUTED);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(String(exp.periodo), MARGIN_L, y);
      y += LINE_H;
    }

    // Descrição
    if (exp?.descricao) {
      y = writeBlock(exp.descricao, y, CONTENT_W, 11, TEXT);
    }

    // Linha vertical conectando para o próximo item
    const isLast = idx === arr.length - 1;
    if (!isLast) {
      setDraw(ACCENT);
      doc.setLineWidth(1);
      // Do centro do ponto atual até antes do próximo ponto
      const nextAnchorY = y + 8; // respiro entre os itens
      doc.line(timelineX, itemTopY + dotR, timelineX, nextAnchorY);
      // Separador visual leve (opcional)
      setDraw(RULE);
      doc.setLineWidth(0.4);
      doc.line(MARGIN_L, y + 6, pageW - MARGIN_R, y + 6);
      y += 14;
    } else {
      y += 6;
    }
  });

  // Formação
  y = ensureSpace(y, 100);
  y = sectionTitle("Formação", y);

  (dados.formacoes || []).forEach((form, idx, arr) => {
    y = ensureSpace(y, 100);

    // Curso — Instituição (com quebra)
    setColor(TEXT);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const cabec = [form?.curso, form?.instituicao].filter(Boolean).join(" — ");
    const cabecLines = doc.splitTextToSize(cabec, CONTENT_W);
    cabecLines.forEach((ln) => {
      doc.text(ln, MARGIN_L, y);
      y += LINE_H;
    });

    // Período
    if (form?.periodo) {
      setColor(MUTED);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(String(form.periodo), MARGIN_L, y);
      y += LINE_H;
    }

    // Descrição
    if (form?.descricao) {
      y = writeBlock(form.descricao, y, CONTENT_W, 11, TEXT);
    }

    if (idx < (arr.length - 1)) {
      setDraw(RULE);
      doc.setLineWidth(0.4);
      doc.line(MARGIN_L, y + 6, pageW - MARGIN_R, y + 6);
      y += 14;
    } else {
      y += 6;
    }
  });

  // Habilidades
  if ((dados.habilidades || []).length) {
    y = ensureSpace(y, 100);
    y = sectionTitle("Habilidades", y);

    setColor(TEXT);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    (dados.habilidades || []).forEach((h) => {
      y = ensureSpace(y, 60);
      const txt = h?.descricao ? String(h.descricao) : "";
      if (!txt) return;

      // Bullet simples
      doc.circle(MARGIN_L + 3, y - 4, 1.5, "F");
      const lines = doc.splitTextToSize(txt, CONTENT_W - 14);
      doc.text(lines, MARGIN_L + 14, y);
      y += LINE_H * (Array.isArray(lines) ? lines.length : 1);
    });
  }

  doc.save("curriculo-modelo1.pdf");
}
