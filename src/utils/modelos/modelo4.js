// src/utils/modelos/modelo4.js
import jsPDF from "jspdf";
import { loadImageAsBase64 } from "../loadImageBase64";
import foneIcon from "../../assets/img/fone.png";
import mailIcon from "../../assets/img/mail.png";
import pinIcon from "../../assets/img/gps.png";

export default async function gerarModelo4(dados = {}) {
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
  const NAME_SIZE = 20;
  const CARGO_SIZE = 12;
  const TITLE_SIZE = 11;
  const SUBTITLE_SIZE = 10;
  const BODY_SIZE = 9.5;
  const LINE_STEP = 13;
  const SECTION_GAP = 18;

  // Cores inspiradas na imagem
  const COLOR_SIDEBAR = [140, 40, 50];      // Vermelho vinho
  const COLOR_WHITE = [255, 255, 255];
  const COLOR_BLACK = [40, 40, 40];
  const COLOR_GRAY = [100, 100, 100];
  const COLOR_LIGHT_BG = [245, 245, 245];

  // Utilitário para medir imagem
  const measureImage = (src) =>
    new Promise((resolve) => {
      try {
        const img = new Image();
        img.onload = () =>
          resolve({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
        img.onerror = () => resolve({ w: 120, h: 120 });
        img.src = src;
      } catch {
        resolve({ w: 120, h: 120 });
      }
    });

  // ================== Layout de 2 colunas ==================
  const SIDEBAR_WIDTH = 180;
  const CONTENT_START = SIDEBAR_WIDTH + 24;
  const CONTENT_WIDTH = pageWidth - CONTENT_START - 24;

  // Fundo da sidebar (vermelho vinho)
  doc.setFillColor(...COLOR_SIDEBAR);
  doc.rect(0, 0, SIDEBAR_WIDTH, pageHeight, "F");

  // ================== SIDEBAR ESQUERDA ==================
  let sidebarY = 24;

  // Foto (centralizada na sidebar, circular)
  const PHOTO_SIZE = 100;
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
    const photoX = (SIDEBAR_WIDTH - w) / 2;
    
    try {
      doc.addImage(fotoForPdf.dataUrl, fotoForPdf.fmt, photoX, sidebarY, w, h);
    } catch {}
    
    sidebarY += PHOTO_SIZE + 20;
  } else {
    sidebarY += 10;
  }

  // Helper para títulos da sidebar
  const sidebarTitle = (title) => {
    doc.setTextColor(...COLOR_WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(TITLE_SIZE);
    doc.text(title, 16, sidebarY);
    sidebarY += 14;
  };

  // Helper para texto wrapped na sidebar
  const sidebarText = (text, isBold = false) => {
    doc.setTextColor(...COLOR_WHITE);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(BODY_SIZE);
    const lines = doc.splitTextToSize(text, SIDEBAR_WIDTH - 32);
    lines.forEach(line => {
      doc.text(line, 16, sidebarY);
      sidebarY += LINE_STEP;
    });
  };

  // DETALHES PESSOAIS
  sidebarTitle("Detalhes personales");
  
  if (dados.email) {
    try { doc.addImage(mailImg, "PNG", 16, sidebarY - 8, 8, 8); } catch {}
    sidebarText(dados.email);
    sidebarY += 4;
  }
  
  if (dados.telefone) {
    try { doc.addImage(foneImg, "PNG", 16, sidebarY - 8, 8, 8); } catch {}
    sidebarText(dados.telefone);
    sidebarY += 4;
  }
  
  if (dados.cidade) {
    try { doc.addImage(pinImg, "PNG", 16, sidebarY - 8, 8, 8); } catch {}
    sidebarText(dados.cidade);
    sidebarY += 4;
  }

  if (dados.linkedin) {
    sidebarText(`LinkedIn: ${dados.linkedin}`);
    sidebarY += 4;
  }

  if (dados.portfolio) {
    sidebarText(`Portfólio: ${dados.portfolio}`);
    sidebarY += 4;
  }

  sidebarY += 16;

  // IDIOMAS (se houver dados de idiomas, caso contrário simula)
  if (Array.isArray(dados.idiomas) && dados.idiomas.length) {
    sidebarTitle("Idiomas");
    dados.idiomas.forEach(idioma => {
      const nome = typeof idioma === "string" ? idioma : (idioma?.nome || idioma?.descricao || "");
      const nivel = typeof idioma === "object" ? idioma?.nivel : null;
      
      if (nome) {
        sidebarText(nome, true);
        
        // Barra de nível (5 pontos)
        if (nivel) {
          const nivelNum = parseInt(nivel) || 3;
          const barY = sidebarY;
          const barX = 16;
          const dotSize = 6;
          const dotSpacing = 10;
          
          for (let i = 0; i < 5; i++) {
            if (i < nivelNum) {
              doc.setFillColor(...COLOR_WHITE);
              doc.circle(barX + i * dotSpacing, barY, dotSize / 2, "F");
            } else {
              doc.setFillColor(100, 60, 70);
              doc.circle(barX + i * dotSpacing, barY, dotSize / 2, "F");
            }
          }
          sidebarY += 14;
        }
        sidebarY += 4;
      }
    });
    sidebarY += 8;
  }

  // HABILIDADES com barras de nível
  if (Array.isArray(dados.habilidades) && dados.habilidades.length) {
    sidebarTitle("Habilidades");
    dados.habilidades.forEach((h) => {
      const txt = typeof h === "string" ? h : (h?.descricao || "");
      const nivel = typeof h === "object" ? h?.nivel : null;
      
      if (txt) {
        sidebarText(txt, true);
        
        // Barra de nível (5 pontos)
        if (nivel) {
          const nivelNum = parseInt(nivel) || 3;
          const barY = sidebarY;
          const barX = 16;
          const dotSize = 6;
          const dotSpacing = 10;
          
          for (let i = 0; i < 5; i++) {
            if (i < nivelNum) {
              doc.setFillColor(...COLOR_WHITE);
              doc.circle(barX + i * dotSpacing, barY, dotSize / 2, "F");
            } else {
              doc.setFillColor(100, 60, 70);
              doc.circle(barX + i * dotSpacing, barY, dotSize / 2, "F");
            }
          }
          sidebarY += 14;
        } else {
          // Sem nível especificado, apenas lista
          sidebarY += 2;
        }
        sidebarY += 4;
      }
    });
  }

  // ================== CONTEÚDO PRINCIPAL (DIREITA) ==================
  let contentY = 40;

  // Nome grande no topo
  doc.setTextColor(...COLOR_BLACK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(NAME_SIZE);
  const nomeStr = (dados.nome || "").toString().toUpperCase();
  doc.text(nomeStr, CONTENT_START, contentY);
  contentY += 6;

  // Cargo/Subtítulo
  const cargoText = (dados.cargo || "").toString();
  if (cargoText) {
    doc.setTextColor(...COLOR_GRAY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(CARGO_SIZE);
    doc.text(cargoText, CONTENT_START, contentY);
    contentY += 16;
  } else {
    contentY += 10;
  }

  // Idade e Estado Civil
  const parts = [];
  if (dados.idade) parts.push(`${dados.idade} anos`);
  if (dados.estadoCivil) parts.push(dados.estadoCivil);
  if (parts.length) {
    doc.setTextColor(...COLOR_GRAY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(BODY_SIZE);
    doc.text(parts.join(" • "), CONTENT_START, contentY);
    contentY += 18;
  }

  // Helper para títulos de seção no conteúdo principal
  const contentTitle = (title) => {
    doc.setFillColor(...COLOR_LIGHT_BG);
    doc.rect(CONTENT_START - 8, contentY - 11, CONTENT_WIDTH + 16, 16, "F");
    
    doc.setTextColor(...COLOR_BLACK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(TITLE_SIZE);
    doc.text(title, CONTENT_START, contentY);
    contentY += 18;
  };

  // OBJETIVO / PERFIL
  const objetivoText = (dados.descricao || "").toString().trim();
  if (objetivoText) {
    contentTitle("PERFIL PROFISSIONAL");
    
    doc.setTextColor(...COLOR_BLACK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(BODY_SIZE);
    const lines = doc.splitTextToSize(objetivoText, CONTENT_WIDTH);
    lines.forEach(line => {
      doc.text(line, CONTENT_START, contentY);
      contentY += LINE_STEP;
    });
    contentY += SECTION_GAP;
  }

  // FORMAÇÃO ACADÊMICA
  if (Array.isArray(dados.formacoes) && dados.formacoes.length) {
    contentTitle("ESTUDIOS Y CERTIFICACIONES");

    dados.formacoes.forEach((f, idx) => {
      // Curso em negrito
      if (f.curso) {
        doc.setTextColor(...COLOR_BLACK);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(SUBTITLE_SIZE);
        const cursoLines = doc.splitTextToSize(f.curso, CONTENT_WIDTH);
        cursoLines.forEach(line => {
          doc.text(line, CONTENT_START, contentY);
          contentY += LINE_STEP;
        });
      }

      // Instituição
      if (f.instituicao) {
        doc.setTextColor(...COLOR_BLACK);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(BODY_SIZE);
        const instLines = doc.splitTextToSize(f.instituicao, CONTENT_WIDTH);
        instLines.forEach(line => {
          doc.text(line, CONTENT_START, contentY);
          contentY += LINE_STEP;
        });
      }

      // Período em cinza
      if (f.periodo) {
        doc.setTextColor(...COLOR_GRAY);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(BODY_SIZE);
        doc.text(f.periodo, CONTENT_START, contentY);
        contentY += LINE_STEP;
      }

      // Descrição
      if (f.descricao) {
        doc.setTextColor(...COLOR_BLACK);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(BODY_SIZE);
        const descLines = doc.splitTextToSize(f.descricao, CONTENT_WIDTH);
        descLines.forEach(line => {
          doc.text(line, CONTENT_START, contentY);
          contentY += LINE_STEP;
        });
      }

      contentY += 12;
    });

    contentY += 6;
  }

  // EXPERIÊNCIA PROFISSIONAL
  if (Array.isArray(dados.experiencias) && dados.experiencias.length) {
    contentTitle("EXPERIENCIA LABORAL");

    dados.experiencias.forEach((exp, idx) => {
      // Cargo em negrito
      if (exp.cargo) {
        doc.setTextColor(...COLOR_BLACK);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(SUBTITLE_SIZE);
        const cargoLines = doc.splitTextToSize(exp.cargo, CONTENT_WIDTH);
        cargoLines.forEach(line => {
          doc.text(line, CONTENT_START, contentY);
          contentY += LINE_STEP;
        });
      }

      // Empresa
      if (exp.empresa) {
        doc.setTextColor(...COLOR_BLACK);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(BODY_SIZE);
        const empLines = doc.splitTextToSize(exp.empresa, CONTENT_WIDTH);
        empLines.forEach(line => {
          doc.text(line, CONTENT_START, contentY);
          contentY += LINE_STEP;
        });
      }

      // Período em cinza
      if (exp.periodo) {
        doc.setTextColor(...COLOR_GRAY);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(BODY_SIZE);
        doc.text(exp.periodo, CONTENT_START, contentY);
        contentY += LINE_STEP;
      }

      // Descrição com bullets
      if (exp.descricao) {
        doc.setTextColor(...COLOR_BLACK);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(BODY_SIZE);
        
        // Divide por linhas se houver quebras
        const descLines = exp.descricao.split('\n').filter(l => l.trim());
        descLines.forEach(linha => {
          const wrapped = doc.splitTextToSize(`• ${linha.trim()}`, CONTENT_WIDTH - 8);
          wrapped.forEach(line => {
            doc.text(line, CONTENT_START + 4, contentY);
            contentY += LINE_STEP;
          });
        });
      }

      contentY += 12;
    });

    contentY += 6;
  }

  // CERTIFICAÇÕES
  if (Array.isArray(dados.certificacoes) && dados.certificacoes.length) {
    contentTitle("CERTIFICAÇÕES");

    dados.certificacoes.forEach((c) => {
      const txt = (typeof c === "string" ? c : c?.descricao) || "";
      if (txt) {
        doc.setTextColor(...COLOR_BLACK);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(BODY_SIZE);
        
        const lines = doc.splitTextToSize(`• ${txt}`, CONTENT_WIDTH - 8);
        lines.forEach(line => {
          doc.text(line, CONTENT_START + 4, contentY);
          contentY += LINE_STEP;
        });
        contentY += 4;
      }
    });
  }

  doc.save("curriculo-modelo4.pdf");
}