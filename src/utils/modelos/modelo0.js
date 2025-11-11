import jsPDF from "jspdf";

const gerarCurriculoPDF  = (dados) => {
  const doc = new jsPDF();
  const left = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - left - 20;

  // Título principal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(dados.nome || "", left, 20);

  // Contato
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Email: ${dados.email || ""}`, left, 30);
  doc.text(`Telefone: ${dados.telefone || ""}`, left, 36);
  doc.text(`Endereço: ${dados.cidade || ""}`, left, 42);
  doc.text(`Cargo desejado: ${dados.cargo || ""}`, left, 48);
  doc.text(`Estado civil: ${dados.estadoCivil || ""}`, left, 54);

  let y = 60;

  // ===== Descrição profissional =====
  if (dados.descricao && dados.descricao.trim()) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Descrição profissional", left, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const linhas = doc.splitTextToSize(dados.descricao.trim(), maxWidth);
    linhas.forEach((ln) => {
      if (y > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage(); y = 20;
      }
      doc.text(ln, left, y);
      y += 6;
    });
    y += 6;
  }

  // Experiência Profissional
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Experiência Profissional", left, y);
  y += 8;

  (dados.experiencias || []).forEach((exp) => {
    if (y > doc.internal.pageSize.getHeight() - 30) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    doc.text(`${exp.cargo || ""} - ${exp.empresa || ""}`, left, y); y += 6;

    doc.setFont("helvetica", "normal");
    doc.text(`${exp.periodo || ""}`, left, y); y += 6;

    if (exp.descricao) {
      const parts = doc.splitTextToSize(exp.descricao, maxWidth);
      parts.forEach((ln) => {
        if (y > doc.internal.pageSize.getHeight() - 20) { doc.addPage(); y = 20; }
        doc.text(ln, left, y); y += 6;
      });
      y += 4;
    } else { y += 4; }
  });

  // Formação
  doc.setFont("helvetica", "bold"); doc.setFontSize(14);
  if (y > doc.internal.pageSize.getHeight() - 20) { doc.addPage(); y = 20; }
  doc.text("Formação", left, y); y += 8;

  (dados.formacoes || []).forEach((form) => {
    if (y > doc.internal.pageSize.getHeight() - 30) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    doc.text(`${form.curso || ""} - ${form.instituicao || ""}`, left, y); y += 6;

    doc.setFont("helvetica", "normal");
    doc.text(`${form.periodo || ""}`, left, y); y += 6;

    if (form.descricao) {
      const parts = doc.splitTextToSize(form.descricao, maxWidth);
      parts.forEach((ln) => {
        if (y > doc.internal.pageSize.getHeight() - 20) { doc.addPage(); y = 20; }
        doc.text(ln, left, y); y += 6;
      });
      y += 4;
    } else { y += 4; }
  });

  // Habilidades
  doc.setFont("helvetica", "bold"); doc.setFontSize(14);
  if (y > doc.internal.pageSize.getHeight() - 20) { doc.addPage(); y = 20; }
  doc.text("Habilidades", left, y); y += 8;

  (dados.habilidades || []).forEach((h) => {
    if (y > doc.internal.pageSize.getHeight() - 20) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "normal"); doc.setFontSize(12);
    doc.text(`• ${h?.descricao || ""}`, left, y); y += 6;
  });

  doc.save("curriculo.pdf");
};

export default gerarCurriculoPDF;
