// Modelo 1 (PDF) — simples moderno c/ ícones, timeline à esquerda e quebras por contagem de caracteres
import jsPDF from "jspdf";
import { loadImageAsBase64 } from "../../utils/loadImageBase64";
import foneIcon from "../../assets/img/fone.png";
import mailIcon from "../../assets/img/mail.png";
import pinIcon from "../../assets/img/gps.png";

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
  const TL = { r: 150, g: 150, b: 150 }; // timeline cinza

  // Helpers
  const setColor = (c) => doc.setTextColor(c.r, c.g, c.b);
  const setDraw = (c) => doc.setDrawColor(c.r, c.g, c.b);
  const setFill = (c) => doc.setFillColor(c.r, c.g, c.b);

  const hRule = (y) => {
    setDraw(RULE);
    doc.setLineWidth(0.6);
    doc.line(MARGIN_L, y, pageW - MARGIN_R, y);
  };

  // Espaçamentos: menos acima da linha (2), mais entre linha e título (16), respiro após título (14)
  const sectionTitle = (txt, y) => {
    y += 2;
    hRule(y);
    y += 16;
    setColor(TEXT);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(txt, MARGIN_L, y);
    return y + 18;
  };

  const writeBlock = (text, y, maxW = CONTENT_W, fontSize = 11, color = TEXT) => {
    if (!text) return y;
    setColor(color);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    const parts = doc.splitTextToSize(String(text), maxW);
    for (const ln of parts) {
      if (y > pageH - 60) {
        doc.addPage(); y = 60;
      }
      doc.text(ln, MARGIN_L, y);
      y += LINE_H;
    }
    return y;
  };

  const ensureSpace = (y, needed = 80) => {
    if (y > pageH - needed) {
      doc.addPage();
      return 60;
    }
    return y;
  };

  // Cabeçalho
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

  // Estado civil abaixo do cargo (discreto)
  if (dados.estadoCivil) {
    setColor(MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Estado civil: ${String(dados.estadoCivil)}`, MARGIN_L, 94);
  }

  // Contatos com quebra por contagem de caracteres
  const iconSize = 12;
  const gapItem = 14; // espaçamento entre blocos de contato (na mesma linha)
  const gapIcon = 6;  // ícone->texto
  let contactX = MARGIN_L;
  let contactY = 106;
  const CONTACT_LINE_H = 16;

  const mailB64 = await loadImageAsBase64(mailIcon);
  const phoneB64 = await loadImageAsBase64(foneIcon);
  const pinB64 = await loadImageAsBase64(pinIcon);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  setColor(MUTED);

  // Limite "aproximado" por linha com base em contagem de caracteres
  // (atende ao requisito explícito; ainda assim há um fallback por largura real)
  const CHAR_LIMIT_PER_LINE = 70; // ajuste fino prático
  let charCountThisLine = 0;

  const newLineContacts = () => {
    contactX = MARGIN_L;
    contactY += CONTACT_LINE_H;
    charCountThisLine = 0;
  };

  const drawContact = (iconB64, rawText) => {
    if (!rawText) return;
    const text = String(rawText);
    const willOverflowByChars = (charCountThisLine + text.length) > CHAR_LIMIT_PER_LINE;

    // Fallback por largura real (segurança)
    const maxWidthForItem = pageW - MARGIN_L - MARGIN_R - (iconSize + gapIcon);
    const lines = doc.splitTextToSize(text, maxWidthForItem);

    // Se o item for multi-linha ou a linha atual está "cheia" por contagem, quebra antes
    if (lines.length > 1 || willOverflowByChars) {
      newLineContacts();
    }

    // Desenha primeira linha com ícone
    doc.addImage(iconB64, "PNG", contactX, contactY - iconSize + 2, iconSize, iconSize);
    doc.text(lines[0], contactX + iconSize + gapIcon, contactY);

    // Contagem de caracteres
    charCountThisLine += lines[0].length;

    // Linhas subsequentes (sem ícone)
    for (let i = 1; i < lines.length; i++) {
      newLineContacts();
      doc.text(lines[i], contactX, contactY);
      charCountThisLine += lines[i].length;
    }

    // Tenta continuar na mesma linha para o próximo bloco (se sobrar espaço)
    const tentativeNextX = contactX + iconSize + gapIcon + doc.getTextWidth(lines[0]) + gapItem;
    if (tentativeNextX > (pageW - MARGIN_R - 100)) {
      newLineContacts();
    } else {
      contactX = tentativeNextX;
    }
  };

  drawContact(mailB64, dados.email ? `Email: ${dados.email}` : "");
  drawContact(phoneB64, dados.telefone ? `Telefone: ${dados.telefone}` : "");
  drawContact(pinB64, dados.cidade ? `Endereço: ${dados.cidade}` : "");

  // Início do conteúdo
  y = Math.max(150, contactY + 24);

  // Descrição Profissional
  if (dados.descricao && String(dados.descricao).trim()) {
    y = sectionTitle("Descrição profissional", y);
    y = writeBlock(dados.descricao, y);
    y += 4;
  }

  // Experiência Profissional — timeline à esquerda (fora da coluna do texto)
  y = sectionTitle("Experiência Profissional", y);

  const gutter = 18;            // calha à esquerda
  const timelineX = MARGIN_L - gutter; // posição da linha/pontos (fora do bloco)
  const dotR = 2.2;

  (dados.experiencias || []).forEach((exp, idx, arr) => {
    y = ensureSpace(y, 140);

    // Ponto e conector horizontal (à esquerda, fora do bloco)
    const anchorY = y - 6;
    setDraw(TL); setFill(TL);
    doc.setLineWidth(1);
    doc.circle(timelineX, anchorY, dotR, "F");
    doc.line(timelineX + dotR, anchorY, MARGIN_L - 4, anchorY);

    // Título (quebra automática)
    const titulo = [exp?.cargo, exp?.empresa].filter(Boolean).join(" — ");
    setColor(TEXT);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const tituloLines = doc.splitTextToSize(titulo, CONTENT_W);
    for (const ln of tituloLines) {
      doc.text(ln, MARGIN_L, y);
      y += LINE_H;
    }

    // Período abaixo do título
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

    // Linha vertical conectando ao próximo item
    const isLast = idx === arr.length - 1;
    if (!isLast) {
      setDraw(TL); doc.setLineWidth(1);
      const nextAnchorY = y + 14;
      doc.line(timelineX, anchorY + dotR, timelineX, nextAnchorY);

      // Separador leve dentro do bloco (opcional)
      setDraw(RULE); doc.setLineWidth(0.4);
      doc.line(MARGIN_L, y + 6, pageW - MARGIN_R, y + 6);
      y += 20;
    } else {
      y += 6;
    }
  });

  // Formação
  y = ensureSpace(y, 100);
  y = sectionTitle("Formação", y);

  (dados.formacoes || []).forEach((form, idx, arr) => {
    y = ensureSpace(y, 100);

    setColor(TEXT);
    doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    const cabec = [form?.curso, form?.instituicao].filter(Boolean).join(" — ");
    const cabecLines = doc.splitTextToSize(cabec, CONTENT_W);
    for (const ln of cabecLines) {
      doc.text(ln, MARGIN_L, y);
      y += LINE_H;
    }

    if (form?.periodo) {
      setColor(MUTED); doc.setFont("helvetica", "normal"); doc.setFontSize(10);
      doc.text(String(form.periodo), MARGIN_L, y); y += LINE_H;
    }

    if (form?.descricao) {
      y = writeBlock(form.descricao, y, CONTENT_W, 11, TEXT);
    }

    if (idx < (arr.length - 1)) {
      setDraw(RULE); doc.setLineWidth(0.4);
      doc.line(MARGIN_L, y + 6, pageW - MARGIN_R, y + 6);
      y += 14;
    } else { y += 6; }
  });

  // Habilidades
  if ((dados.habilidades || []).length) {
    y = ensureSpace(y, 100);
    y = sectionTitle("Habilidades", y);

    setColor(TEXT); doc.setFont("helvetica", "normal"); doc.setFontSize(11);
    (dados.habilidades || []).forEach((h) => {
      y = ensureSpace(y, 60);
      const txt = h?.descricao ? String(h.descricao) : "";
      if (!txt) return;
      doc.circle(MARGIN_L + 3, y - 4, 1.5, "F");
      const lines = doc.splitTextToSize(txt, CONTENT_W - 14);
      doc.text(lines, MARGIN_L + 14, y);
      y += LINE_H * (Array.isArray(lines) ? lines.length : 1);
    });
  }

  doc.save("curriculo-modelo1.pdf");
}
