// src/utils/modelos/modelo2.js
import jsPDF from "jspdf";
import { loadImageAsBase64 } from "../loadImageBase64";
import foneIcon from "../../assets/img/fone.png";
import mailIcon from "../../assets/img/mail.png";
import pinIcon from "../../assets/img/gps.png";

export default async function gerarModelo2(dados = {}) {
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
    return null; // ex.: webp, heic, etc.
  };

  // Helper: rasteriza para um DataURL no mime desejado (mantém dimensões)
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

  // Helper: normaliza SEMPRE para PNG via canvas (evita CMYK/progressive JPEG etc.)
  const ensureSupportedPdfImage = async (dataUrl) => {
    const converted = await rasterizeToDataUrl(dataUrl, "image/png");
    return { dataUrl: converted, fmt: "PNG" };
  };

  // Helper: gera PNG circular (mascara com clip), simulando object-fit: cover central
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

          // Desenha o recorte quadrado central preenchendo o canvas
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
  const NAME_SIZE              = 16;      // Nome
  const SUB_SIZE               = 11;      // Idade (menor), subtítulos do header
  const TITLE_SIZE             = 12;      // Títulos de seção (aside & direita)
  const BODY_SIZE              = 10.5;    // Corpo
  const LINE_STEP              = 13.5;    // Espaçamento linha do corpo
  const TITLE_BODY_GAP         = 24;      // Espaço entre TÍTULO e texto da seção
  const HEADER_RULE_GAP        = 18;      // Espaço entre a linha horizontal e o Objetivo
  const NAME_CARGO_GAP         = 16;      // ↓ Menor espaço entre NOME e CARGO (antes 28)
  const COMPANY_TITLE_DESC_GAP = 8;       // ↓ Menor espaço entre título da empresa e período
  const LINE_TO_TITLE_GAP_ASIDE = 18;     // ↑ Mais espaço entre linha horizontal do ASIDE e o título

  // Cores
  const COLOR_BLACK = [0, 0, 0];
  const COLOR_WHITE = [255, 255, 255];
  const COLOR_GRAY  = [120, 120, 120];

  // Foto (preserva proporção dentro da caixa)
  const PHOTO_BOX = { x: 24, y: 36, maxW: 90, maxH: 90 };

  // Utilitário para medir imagem e preservar proporção
  const measureImage = (src) =>
    new Promise((resolve) => {
      try {
        const img = new Image();
        img.onload = () =>
          resolve({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
        img.onerror = () => resolve({ w: PHOTO_BOX.maxW, h: PHOTO_BOX.maxH });
        img.src = src;
      } catch {
        resolve({ w: PHOTO_BOX.maxW, h: PHOTO_BOX.maxH });
      }
    });

  // ================== Cabeçalho ==================
  const BASE_TEXT_X  = 64;
  const headerTextX  = dados.fotoBase64 ? (PHOTO_BOX.x + PHOTO_BOX.maxW + 28) : BASE_TEXT_X;
  const nameY        = 48; // baseline do nome

  // Menor margem direita para o objetivo "ir até o final"
  const HEADER_RIGHT_PAD = 2;
  const headerMaxWidth = pageWidth - headerTextX - HEADER_RIGHT_PAD + 185;

  // Cargo (abaixo do nome, sem label)
  const cargoText  = (dados.cargo || "").toString().trim();
  const cargoLines = cargoText ? doc.splitTextToSize(cargoText, headerMaxWidth) : [];

  // Objetivo (sem label)
  const objetivoText  = (dados.descricao || "").toString().trim();
  const objetivoLines = objetivoText ? doc.splitTextToSize(objetivoText, headerMaxWidth) : [];

  // Simulação de altura do header (considerando gaps)
  let simulatedY = nameY;
  if (cargoLines.length) {
    simulatedY += NAME_CARGO_GAP + (cargoLines.length * LINE_STEP);
  }
  simulatedY += 8;                 // espaço para a linha horizontal
  simulatedY += HEADER_RULE_GAP;   // espaço extra até começar o objetivo
  if (objetivoLines.length) simulatedY += objetivoLines.length * LINE_STEP;

  // Calcular caixa da foto com proporção preservada
  let photoDraw = null;
  let fotoForPdf = null; // { dataUrl, fmt }
  if (dados.fotoBase64) {
    // Normaliza a foto para formato suportado pelo jsPDF (evita imagem corrompida)
    const basePng = await ensureSupportedPdfImage(dados.fotoBase64);
    const wantsRound = String(dados.formatoFoto || "").toLowerCase() === "redonda";
    const finalDataUrl = wantsRound ? await makeCircularPng(basePng.dataUrl) : basePng.dataUrl;
    fotoForPdf = { dataUrl: finalDataUrl, fmt: "PNG" };

    const natural = await measureImage(finalDataUrl);
    const ratio = Math.min(PHOTO_BOX.maxW / natural.w, PHOTO_BOX.maxH / natural.h);
    const w = Math.max(1, natural.w * ratio);
    const h = Math.max(1, natural.h * ratio);
    const dx = PHOTO_BOX.x + (PHOTO_BOX.maxW - w) / 2;
    const dy = PHOTO_BOX.y + (PHOTO_BOX.maxH - h) / 2;
    photoDraw = { x: dx, y: dy, w, h };
  }

  // Altura final do header cobre textos e a caixa da foto
  const minHeaderHeight = 90;
  const headerBottomPadding = 14;
  const headerHeight = Math.max(
    minHeaderHeight,
    simulatedY + headerBottomPadding,
    PHOTO_BOX.y + PHOTO_BOX.maxH + 20
  );

  // Fundo do header
  doc.setFillColor(30, 50, 90);
  doc.rect(0, 0, pageWidth, headerHeight, "F");

  // Foto
  if (photoDraw && fotoForPdf?.dataUrl) {
    try {
      doc.addImage(fotoForPdf.dataUrl, fotoForPdf.fmt, photoDraw.x, photoDraw.y, photoDraw.w, photoDraw.h);
    } catch {}
  }

  // Texto do header
  doc.setTextColor(...COLOR_WHITE);

  // Nome (bold)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(NAME_SIZE);
  const nomeStr = (dados.nome || "").toString();
  doc.text(nomeStr, headerTextX, nameY);

  // Idade e Estado Civil (ao lado do nome, entre parênteses, menor)
  {
    const nameWidth = doc.getTextWidth(nomeStr);
    const parts = [];
    if (dados.idade) parts.push(String(dados.idade));
    if (dados.estadoCivil) parts.push(String(dados.estadoCivil));
    if (parts.length) {
      const infoStr = ` (${parts.join(" • ")})`;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(SUB_SIZE);
      doc.text(infoStr, headerTextX + nameWidth + 8, nameY);
    }
  }

  // Cargo (abaixo do nome) com GAP menor (pedido)
  let headerY = nameY + NAME_CARGO_GAP;
  if (cargoLines.length) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(SUB_SIZE + 1);
    cargoLines.forEach((line) => { doc.text(line, headerTextX, headerY); headerY += LINE_STEP; });
  }

  // Linha horizontal
  doc.setDrawColor(255);
  doc.setLineWidth(0.8);
  const ruleY = headerY - (LINE_STEP - 6);
  doc.line(headerTextX, ruleY, pageWidth - 24, ruleY);

  // Espaço entre a linha e o Objetivo
  headerY = ruleY + HEADER_RULE_GAP;

  // Objetivo (sem label)
  if (objetivoLines.length) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(BODY_SIZE);
    objetivoLines.forEach((line) => { doc.text(line, headerTextX, headerY); headerY += LINE_STEP; });
  }

  // ================== Colunas ==================
  const columnsStartY = headerHeight;

  // ASIDE 35%
  const LEFT_COL_RATIO = 0.35;
  const leftColW = Math.floor(pageWidth * LEFT_COL_RATIO);
  const leftColX = 0;
  const leftColY = columnsStartY;
  const leftColH = pageHeight - leftColY; // encosta no rodapé

  // Faixa azul clara do aside (sem sobras brancas)
  doc.setFillColor(200, 220, 255);
  doc.rect(leftColX, leftColY, leftColW, leftColH, "F");

  doc.setTextColor(...COLOR_BLACK);
  let yLeft = columnsStartY + 18; // respiro interno

  const sectionTitle = (title) => {
    // linha separadora
    doc.setDrawColor(0, 0, 0);
    doc.line(10, yLeft, leftColW - 10, yLeft);
    // ↑ mais espaço até o título
    yLeft += LINE_TO_TITLE_GAP_ASIDE; // (antes era ~12)
    // título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(TITLE_SIZE);
    doc.text(title, 16, yLeft);
    // espaço entre TÍTULO e início do texto
    yLeft += TITLE_BODY_GAP;
    // corpo
    doc.setFont("helvetica", "normal");
    doc.setFontSize(BODY_SIZE);
  };

  const writeWrapped = (text, maxWidth, x, yStart) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((l, i) => doc.text(l, x, yStart + i * LINE_STEP));
    return yStart + lines.length * LINE_STEP;
  };

  // CONTATO
  sectionTitle("CONTATO");
  const innerPadX = 16;
  const contactMaxW = leftColW - innerPadX * 2;

  if (dados.email) {
    try { doc.addImage(mailImg, "PNG", innerPadX - 4, yLeft - 9, 9, 9); } catch {}
    yLeft = writeWrapped(dados.email, contactMaxW, innerPadX + 12, yLeft);
    yLeft += 6;
  }
  if (dados.telefone) {
    try { doc.addImage(foneImg, "PNG", innerPadX - 4, yLeft - 9, 9, 9); } catch {}
    yLeft = writeWrapped(dados.telefone, contactMaxW, innerPadX + 12, yLeft);
    yLeft += 6;
  }
  if (dados.cidade) {
    try { doc.addImage(pinImg, "PNG", innerPadX - 4, yLeft - 9, 9, 9); } catch {}
    yLeft = writeWrapped(dados.cidade, contactMaxW, innerPadX + 12, yLeft);
    yLeft += 6;
  }
  if (dados.linkedin) {
    yLeft = writeWrapped(`LinkedIn: ${dados.linkedin}`, contactMaxW, innerPadX, yLeft);
    yLeft += 6;
  }
  if (dados.portfolio) {
    yLeft = writeWrapped(`Portfólio: ${dados.portfolio}`, contactMaxW, innerPadX, yLeft);
    yLeft += 6;
  }

  // ESCOLARIDADE
  if (Array.isArray(dados.formacoes) && dados.formacoes.length) {
    sectionTitle("ESCOLARIDADE");
    dados.formacoes.forEach((f) => {
      const linha = [f.curso, f.instituicao].filter(Boolean).join(" — ");
      if (linha) {
        yLeft = writeWrapped(`• ${linha}`, contactMaxW, innerPadX, yLeft);
        if (f.periodo) {
          doc.setTextColor(...COLOR_GRAY); // período cinza
          yLeft = writeWrapped(`${f.periodo}`, contactMaxW, innerPadX + 10, yLeft);
          doc.setTextColor(...COLOR_BLACK);
        }
        if (f.descricao) {
          yLeft = writeWrapped(`${f.descricao}`, contactMaxW, innerPadX + 10, yLeft);
        }
        yLeft += 6;
      }
    });
  }

  // HABILIDADES
  if (Array.isArray(dados.habilidades) && dados.habilidades.length) {
    sectionTitle("HABILIDADES");
    dados.habilidades.forEach((h) => {
      const txt = (typeof h === "string" ? h : h?.descricao) || "";
      if (txt) {
        yLeft = writeWrapped(`• ${txt}`, contactMaxW, innerPadX, yLeft);
        yLeft += 4;
      }
    });
  }

  // CERTIFICAÇÕES
  if (Array.isArray(dados.certificacoes) && dados.certificacoes.length) {
    sectionTitle("CERTIFICAÇÕES");
    dados.certificacoes.forEach((c) => {
      const txt = (typeof c === "string" ? c : c?.descricao) || "";
      if (txt) {
        yLeft = writeWrapped(`• ${txt}`, contactMaxW, innerPadX, yLeft);
        yLeft += 4;
      }
    });
  }

  // ================== Direita — Experiências ==================
  let yRight = columnsStartY + 22;
  const rightStart = leftColW + 22;
  const rightMaxWidth = pageWidth - rightStart - 28;

  // Título
  doc.setTextColor(...COLOR_BLACK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(TITLE_SIZE);
  doc.text("EXPERIÊNCIA PROFISSIONAL", rightStart, yRight);
  yRight += TITLE_BODY_GAP;

  // Conteúdo
  doc.setFont("helvetica", "normal");
  doc.setFontSize(BODY_SIZE);

  (dados.experiencias || []).forEach((exp) => {
    // Cargo — Empresa
    const cargoEmpresa = [exp.cargo, exp.empresa].filter(Boolean).join(" — ");
    if (cargoEmpresa) {
      doc.setFont("helvetica", "bold");
      const lines = doc.splitTextToSize(cargoEmpresa, rightMaxWidth);
      lines.forEach((line) => { doc.text(line, rightStart, yRight); yRight += LINE_STEP; });
      // GAP (reduzido) antes do período
      yRight += COMPANY_TITLE_DESC_GAP;
    }

    // Período (cinza)
    doc.setFont("helvetica", "normal");
    if (exp.periodo) {
      const periodoLines = doc.splitTextToSize(exp.periodo, rightMaxWidth);
      doc.setTextColor(...COLOR_GRAY);
      periodoLines.forEach((line) => { doc.text(line, rightStart, yRight); yRight += LINE_STEP; });
      doc.setTextColor(...COLOR_BLACK);
    }

    // Descrição
    if (exp.descricao) {
      const descLines = doc.splitTextToSize(exp.descricao, rightMaxWidth);
      descLines.forEach((line) => { doc.text(line, rightStart, yRight); yRight += LINE_STEP; });
    }

    yRight += 10; // respiro entre experiências
  });

  doc.save("curriculo-modelo2.pdf");
}
