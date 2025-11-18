// src/utils/modelos/modelo3.js
import jsPDF from "jspdf";
import { loadImageAsBase64 } from "../loadImageBase64";
import foneIcon from "../../assets/img/fone.png";
import mailIcon from "../../assets/img/mail.png";
import pinIcon from "../../assets/img/gps.png";

export default async function gerarModelo3(dados = {}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Helper: detecta formato suportado (PNG/JPEG) a partir de DataURL
  const detectFormatFromDataUrl = (dataUrl) => {
    if (typeof dataUrl !== "string") return null;
    const m = dataUrl.match(/^data:image\/([a-zA-Z0-9.+-]+);base64,/);
    if (!m) return null;
    const subtype = m[1].toLowerCase();
    if (subtype.includes("png")) return "PNG";
    if (subtype.includes("jpeg") || subtype.includes("jpg")) return "JPEG";
    return null;
  };

  // Helper: rasteriza para um DataURL no mime desejado
  const rasterizeToDataUrl = (srcDataUrl, mime = "image/png") => new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const out = canvas.toDataURL(mime);
          resolve(out);
        } catch (e) { resolve(srcDataUrl); }
      };
      img.onerror = () => resolve(srcDataUrl);
      img.src = srcDataUrl;
    } catch (e) {
      resolve(srcDataUrl);
    }
  });

  // Helper: normaliza para PNG
  const ensureSupportedPdfImage = async (dataUrl) => {
    const converted = await rasterizeToDataUrl(dataUrl, "image/png");
    return { dataUrl: converted, fmt: "PNG" };
  };

  // Helper: gera PNG circular
  const makeCircularPng = (srcDataUrl) => new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        try {
          const nW = img.naturalWidth || img.width;
          const nH = img.naturalHeight || img.height;
          const side = Math.min(nW, nH);
          const sx = (nW - side) / 2;
          const sy = (nH - side) / 2;

          const canvas = document.createElement("canvas");
          canvas.width = side;
          canvas.height = side;
          const ctx = canvas.getContext("2d");

          ctx.save();
          ctx.beginPath();
          ctx.arc(side / 2, side / 2, side / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();

          ctx.drawImage(img, sx, sy, side, side, 0, 0, side, side);
          ctx.restore();

          resolve(canvas.toDataURL("image/png"));
        } catch (e) {
          resolve(srcDataUrl);
        }
      };
      img.onerror = () => resolve(srcDataUrl);
      img.src = srcDataUrl;
    } catch (e) {
      resolve(srcDataUrl);
    }
  });

  // Ícones base64
  const mailImg = await loadImageAsBase64(mailIcon);
  const foneImg = await loadImageAsBase64(foneIcon);
  const pinImg  = await loadImageAsBase64(pinIcon);

  // ================== Tokens de layout ==================
  const NAME_SIZE = 24;
  const SUBTITLE_SIZE = 11;
  const TITLE_SIZE = 13;
  const BODY_SIZE = 10;
  const LINE_STEP = 14;
  const SECTION_GAP = 20;
  const ITEM_GAP = 12;

  // Cores modernas
  const COLOR_PRIMARY = [45, 85, 125];      // Azul escuro elegante
  const COLOR_ACCENT = [100, 180, 140];     // Verde água moderno
  const COLOR_BLACK = [30, 30, 30];
  const COLOR_WHITE = [255, 255, 255];
  const COLOR_LIGHT_GRAY = [245, 245, 245];
  const COLOR_GRAY = [120, 120, 120];

  // Utilitário para medir imagem
  const measureImage = (src) =>
    new Promise((resolve) => {
      try {
        const img = new Image();
        img.onload = () =>
          resolve({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
        img.onerror = () => resolve({ w: 100, h: 100 });
        img.src = src;
      } catch {
        resolve({ w: 100, h: 100 });
      }
    });

  // ================== Foto (topo centralizado) ==================
  const PHOTO_SIZE = 85;
  const PHOTO_TOP_MARGIN = 32;
  
  let photoY = PHOTO_TOP_MARGIN;
  let fotoForPdf = null;

  if (dados.fotoBase64) {
    const basePng = await ensureSupportedPdfImage(dados.fotoBase64);
    const wantsRound = String(dados.formatoFoto || "").toLowerCase() === "redonda";
    const finalDataUrl = wantsRound ? await makeCircularPng(basePng.dataUrl) : basePng.dataUrl;
    fotoForPdf = { dataUrl: finalDataUrl, fmt: "PNG" };

    const natural = await measureImage(finalDataUrl);
    const ratio = Math.min(PHOTO_SIZE / natural.w, PHOTO_SIZE / natural.h);
    const w = Math.max(1, natural.w * ratio);
    const h = Math.max(1, natural.h * ratio);
    const photoX = (pageWidth - w) / 2;
    
    try {
      doc.addImage(fotoForPdf.dataUrl, fotoForPdf.fmt, photoX, photoY, w, h);
    } catch {}
  }

  // ================== Header centralizado ==================
  let currentY = dados.fotoBase64 ? (photoY + PHOTO_SIZE + 24) : 50;

  // Nome (centralizado, bold, grande)
  doc.setTextColor(...COLOR_PRIMARY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(NAME_SIZE);
  const nomeStr = (dados.nome || "").toString();
  const nameWidth = doc.getTextWidth(nomeStr);
  doc.text(nomeStr, (pageWidth - nameWidth) / 2, currentY);
  currentY += 8;

  // Cargo (centralizado, destaque)
  const cargoText = (dados.cargo || "").toString().trim();
  if (cargoText) {
    doc.setTextColor(...COLOR_ACCENT);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const cargoWidth = doc.getTextWidth(cargoText);
    doc.text(cargoText, (pageWidth - cargoWidth) / 2, currentY);
    currentY += 6;
  }

  // Idade e Estado Civil (centralizado, discreto)
  const parts = [];
  if (dados.idade) parts.push(String(dados.idade));
  if (dados.estadoCivil) parts.push(String(dados.estadoCivil));
  if (parts.length) {
    const infoStr = parts.join(" • ");
    doc.setTextColor(...COLOR_GRAY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(SUBTITLE_SIZE);
    const infoWidth = doc.getTextWidth(infoStr);
    doc.text(infoStr, (pageWidth - infoWidth) / 2, currentY);
    currentY += 18;
  } else {
    currentY += 12;
  }

  // ================== Contato inline (centralizado) ==================
  const contactItems = [];
  if (dados.email) contactItems.push({ icon: mailImg, text: dados.email });
  if (dados.telefone) contactItems.push({ icon: foneImg, text: dados.telefone });
  if (dados.cidade) contactItems.push({ icon: pinImg, text: dados.cidade });

  if (contactItems.length > 0) {
    doc.setTextColor(...COLOR_GRAY);
    doc.setFontSize(9);
    
    const spacing = 18;
    const iconSize = 8;
    let totalWidth = 0;
    
    contactItems.forEach((item, idx) => {
      totalWidth += iconSize + 4 + doc.getTextWidth(item.text);
      if (idx < contactItems.length - 1) totalWidth += spacing;
    });
    
    let contactX = (pageWidth - totalWidth) / 2;
    
    contactItems.forEach((item, idx) => {
      try {
        doc.addImage(item.icon, "PNG", contactX, currentY - 7, iconSize, iconSize);
      } catch {}
      doc.text(item.text, contactX + iconSize + 4, currentY);
      contactX += iconSize + 4 + doc.getTextWidth(item.text) + spacing;
    });
    
    currentY += 18;
  }

  // Links (LinkedIn e Portfólio centralizados)
  const linkParts = [];
  if (dados.linkedin) linkParts.push(`LinkedIn: ${dados.linkedin}`);
  if (dados.portfolio) linkParts.push(`Portfólio: ${dados.portfolio}`);
  
  if (linkParts.length > 0) {
    doc.setTextColor(...COLOR_ACCENT);
    doc.setFontSize(9);
    linkParts.forEach(link => {
      const linkWidth = doc.getTextWidth(link);
      doc.text(link, (pageWidth - linkWidth) / 2, currentY);
      currentY += 12;
    });
    currentY += 6;
  }

  // Linha decorativa
  doc.setDrawColor(...COLOR_ACCENT);
  doc.setLineWidth(2);
  const lineMargin = 80;
  doc.line(lineMargin, currentY, pageWidth - lineMargin, currentY);
  currentY += 20;

  // ================== Objetivo ==================
  const objetivoText = (dados.descricao || "").toString().trim();
  if (objetivoText) {
    doc.setTextColor(...COLOR_PRIMARY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(TITLE_SIZE);
    doc.text("OBJETIVO", 40, currentY);
    currentY += 16;

    doc.setTextColor(...COLOR_BLACK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(BODY_SIZE);
    const objetivoLines = doc.splitTextToSize(objetivoText, pageWidth - 80);
    objetivoLines.forEach(line => {
      doc.text(line, 40, currentY);
      currentY += LINE_STEP;
    });
    currentY += SECTION_GAP;
  }

  // ================== Helper para títulos de seção ==================
  const sectionTitle = (title) => {
    doc.setTextColor(...COLOR_PRIMARY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(TITLE_SIZE);
    doc.text(title, 40, currentY);
    
    // Sublinhado decorativo
    const titleWidth = doc.getTextWidth(title);
    doc.setDrawColor(...COLOR_ACCENT);
    doc.setLineWidth(2);
    doc.line(40, currentY + 3, 40 + titleWidth + 10, currentY + 3);
    
    currentY += 18;
  };

  // ================== Experiência Profissional ==================
  if (Array.isArray(dados.experiencias) && dados.experiencias.length) {
    sectionTitle("EXPERIÊNCIA PROFISSIONAL");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(BODY_SIZE);

    dados.experiencias.forEach((exp, idx) => {
      // Cargo em destaque
      if (exp.cargo) {
        doc.setTextColor(...COLOR_BLACK);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        const cargoLines = doc.splitTextToSize(exp.cargo, pageWidth - 80);
        cargoLines.forEach(line => {
          doc.text(line, 40, currentY);
          currentY += LINE_STEP;
        });
      }

      // Empresa e período na mesma linha
      const empresaPeriodo = [];
      if (exp.empresa) empresaPeriodo.push(exp.empresa);
      if (exp.periodo) empresaPeriodo.push(exp.periodo);
      
      if (empresaPeriodo.length > 0) {
        doc.setTextColor(...COLOR_GRAY);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(BODY_SIZE);
        const linhaInfo = empresaPeriodo.join(" • ");
        const infoLines = doc.splitTextToSize(linhaInfo, pageWidth - 80);
        infoLines.forEach(line => {
          doc.text(line, 40, currentY);
          currentY += LINE_STEP;
        });
      }

      // Descrição
      if (exp.descricao) {
        doc.setTextColor(...COLOR_BLACK);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(BODY_SIZE);
        const descLines = doc.splitTextToSize(exp.descricao, pageWidth - 80);
        descLines.forEach(line => {
          doc.text(line, 40, currentY);
          currentY += LINE_STEP;
        });
      }

      currentY += ITEM_GAP;
    });

    currentY += SECTION_GAP - ITEM_GAP;
  }

  // ================== Formação Acadêmica ==================
  if (Array.isArray(dados.formacoes) && dados.formacoes.length) {
    sectionTitle("FORMAÇÃO ACADÊMICA");

    dados.formacoes.forEach((f) => {
      // Curso em destaque
      if (f.curso) {
        doc.setTextColor(...COLOR_BLACK);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        const cursoLines = doc.splitTextToSize(f.curso, pageWidth - 80);
        cursoLines.forEach(line => {
          doc.text(line, 40, currentY);
          currentY += LINE_STEP;
        });
      }

      // Instituição e período
      const instPeriodo = [];
      if (f.instituicao) instPeriodo.push(f.instituicao);
      if (f.periodo) instPeriodo.push(f.periodo);
      
      if (instPeriodo.length > 0) {
        doc.setTextColor(...COLOR_GRAY);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(BODY_SIZE);
        const linha = instPeriodo.join(" • ");
        const linhas = doc.splitTextToSize(linha, pageWidth - 80);
        linhas.forEach(line => {
          doc.text(line, 40, currentY);
          currentY += LINE_STEP;
        });
      }

      // Descrição
      if (f.descricao) {
        doc.setTextColor(...COLOR_BLACK);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(BODY_SIZE);
        const descLines = doc.splitTextToSize(f.descricao, pageWidth - 80);
        descLines.forEach(line => {
          doc.text(line, 40, currentY);
          currentY += LINE_STEP;
        });
      }

      currentY += ITEM_GAP;
    });

    currentY += SECTION_GAP - ITEM_GAP;
  }

  // ================== Habilidades ==================
  if (Array.isArray(dados.habilidades) && dados.habilidades.length) {
    sectionTitle("HABILIDADES");

    doc.setTextColor(...COLOR_BLACK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(BODY_SIZE);

    // Exibir habilidades em linha (tags)
    let xPos = 40;
    const yStart = currentY;
    const tagPadding = 8;
    const tagHeight = 18;
    const tagSpacing = 8;

    dados.habilidades.forEach((h) => {
      const txt = (typeof h === "string" ? h : h?.descricao) || "";
      if (txt) {
        const tagWidth = doc.getTextWidth(txt) + tagPadding * 2;
        
        // Quebra de linha se necessário
        if (xPos + tagWidth > pageWidth - 40) {
          xPos = 40;
          currentY += tagHeight + 6;
        }

        // Fundo da tag
        doc.setFillColor(...COLOR_LIGHT_GRAY);
        doc.roundedRect(xPos, currentY - 11, tagWidth, tagHeight, 3, 3, "F");

        // Texto da tag
        doc.setTextColor(...COLOR_BLACK);
        doc.text(txt, xPos + tagPadding, currentY);

        xPos += tagWidth + tagSpacing;
      }
    });

    currentY += tagHeight + SECTION_GAP;
  }

  // ================== Certificações ==================
  if (Array.isArray(dados.certificacoes) && dados.certificacoes.length) {
    sectionTitle("CERTIFICAÇÕES");

    doc.setTextColor(...COLOR_BLACK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(BODY_SIZE);

    dados.certificacoes.forEach((c) => {
      const txt = (typeof c === "string" ? c : c?.descricao) || "";
      if (txt) {
        // Bullet moderno
        doc.setFillColor(...COLOR_ACCENT);
        doc.circle(44, currentY - 3, 2, "F");
        
        const lines = doc.splitTextToSize(txt, pageWidth - 95);
        lines.forEach(line => {
          doc.text(line, 52, currentY);
          currentY += LINE_STEP;
        });
        currentY += 4;
      }
    });

    currentY += SECTION_GAP;
  }

  doc.save("curriculo-modelo3.pdf");
}