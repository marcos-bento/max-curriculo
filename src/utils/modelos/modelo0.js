import jsPDF from "jspdf";

const gerarCurriculoPDF  = (dados) => {
  const doc = new jsPDF();

  // Título principal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(dados.nome, 20, 20);

  // Contato
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Email: ${dados.email}`, 20, 30);
  doc.text(`Telefone: ${dados.telefone}`, 20, 36);
  doc.text(`Endereço: ${dados.cidade}`, 20, 42);
  doc.text(`Cargo desejado: ${dados.cargo}`, 20, 48);

  let y = 60;

  // Experiência Profissional
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Experiência Profissional", 20, y);
  y += 8;

  dados.experiencias?.forEach((exp) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`${exp.cargo} - ${exp.empresa}`, 20, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.text(`${exp.periodo}`, 20, y);
    y += 6;
    doc.text(`${exp.descricao}`, 20, y);
    y += 10;
  });

  // Formação
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Formação", 20, y);
  y += 8;

  dados.formacoes?.forEach((form) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`${form.curso} - ${form.instituicao}`, 20, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.text(`${form.periodo}`, 20, y);
    y += 6;
    if (form.descricao) {
      doc.text(`${form.descricao}`, 20, y);
      y += 10;
    } else {
      y += 4;
    }
  });

  // Habilidades
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Habilidades", 20, y);
  y += 8;

  dados.habilidades?.forEach((hab) => {
    doc.setFont("helvetica", "normal");
    doc.text(`• ${hab.descricao}`, 20, y);
    y += 6;
  });

  // Exportar
  doc.save("curriculo.pdf");
};

export default gerarCurriculoPDF;
