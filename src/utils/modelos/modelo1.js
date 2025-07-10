import jsPDF from "jspdf";

export default function gerarModelo1(dados) {
  const doc = new jsPDF();

  // Cabeçalho azul
  doc.setFillColor(26, 77, 154); // Azul escuro
  doc.rect(0, 0, 210, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(dados.nome, 20, 20);

  doc.setFontSize(11);
  doc.text(`${dados.cargo}`, 20, 26);

  doc.setTextColor(0, 0, 0);
  let y = 40;

  // Dados de contato
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Email: ${dados.email}`, 20, y);
  y += 6;
  doc.text(`Telefone: ${dados.telefone}`, 20, y);
  y += 6;
  doc.text(`Cidade: ${dados.cidade}`, 20, y);
  y += 10;

  // Experiências
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(26, 77, 154);
  doc.text("Experiência Profissional", 20, y);
  y += 8;

  dados.experiencias?.forEach((exp) => {
    doc.setTextColor(0, 0, 0);
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
  doc.setTextColor(26, 77, 154);
  doc.text("Formação", 20, y);
  y += 8;

  dados.formacoes?.forEach((form) => {
    doc.setTextColor(0, 0, 0);
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
  doc.setTextColor(26, 77, 154);
  doc.text("Habilidades", 20, y);
  y += 8;

  dados.habilidades?.forEach((hab) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`• ${hab.descricao}`, 20, y);
    y += 6;
  });

  doc.save("curriculo-moderno.pdf");
}
