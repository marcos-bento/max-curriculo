// Importações de componentes e hooks necessários
import Navbar from '../../components/Navbar/Navbar';
import Titulo from '../../components/Titulo/Titulo';
import Aviso from '../../components/Aviso/Aviso';
import TituloSessao from '../../components/TituloSessao/TituloSessao';
import Footer from '../../components/Footer/Footer';
import InputTexto from '../../components/InputTexto/InputTexto';
import { useForm, useFieldArray } from 'react-hook-form';
import React, { useEffect } from 'react';
import "./Form.css";
import gerarCurriculoPDF from '../../utils/gerarCurriculoPDF';
import { toast } from 'react-toastify';
import Modelo0Preview from '../../components/Preview/Modelos/Modelo0Preview';


function Form() {
  const [modeloSelecionado, setModeloSelecionado] = React.useState("modelo0");
  const [fotoBase64, setFotoBase64] = React.useState(null);

  useEffect(() => {
    const modelo = localStorage.getItem("modeloSelecionado") || "modelo0";
    setModeloSelecionado(modelo);
    window.scrollTo(0, 0);
  }, []);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoBase64(reader.result); // salva como base64
    };
    reader.readAsDataURL(file);
  };

  const handleRemoverFoto = () => {
    setFotoBase64(null);
    // Também limpa o input file manualmente
    const input = document.getElementById("foto-perfil-input");
    if (input) input.value = "";
  };

  // Inicializa o hook do formulário
  const { register, handleSubmit, control, watch } = useForm();
  const dadosForm = watch();

  // Controle dinâmico dos campos de EXPERIÊNCIA
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiencias"
  });

  // Controle dinâmico dos campos de FORMAÇÃO
  const { fields: formacoes, append: appendFormacao, remove: removeFormacao } = useFieldArray({
    control,
    name: "formacoes"
  });

  // Controle dinâmico dos campos de HABILIDADES
  const { fields: habilidades, append: appendHabilidade, remove: removeHabilidade } = useFieldArray({
    control,
    name: "habilidades"
  });

  // Manipula o envio do formulário
  const onSubmit = (dados) => {
    gerarCurriculoPDF({ ...dados, fotoBase64 }); // <- adiciona imagem ao objeto
    toast.success("Currículo gerado com sucesso!");
  };

  return (
    <div>
      {/* Navbar no topo da página */}
      <Navbar isHome={false} />

      {/* Título principal da página */}
      <div style={{ paddingTop: "50px" }}>
        <Titulo texto="Novo currículo" />
      </div>

      {/* Aviso legal sobre uso de dados */}
      <Aviso
        titulo="Aviso"
        texto="Os dados inseridos são usados apenas para gerar seu currículo. Não armazenamos nem compartilhamos nenhuma informação. O MaxCurriculo não se responsabiliza pelo uso ou conteúdo dos dados fornecidos."
      />

      {/* Início do formulário */}
      <form className='form-container' onSubmit={handleSubmit(onSubmit)}>

        {/* Seção: Dados Pessoais */}
        <TituloSessao texto="Dados pessoais" />
        <div style={{ padding: "40px var(--padding-padrao)" }}>
          <InputTexto label="Nome completo" name="nome" register={register} required />
          <InputTexto label="Email" name="email" type="email" register={register} required />
          <InputTexto label="Telefone" name="telefone" register={register} required />
          <InputTexto label="Cidade" name="cidade" register={register} required />
          <InputTexto label="Cargo desejado" name="cargo" register={register} required />
          {modeloSelecionado === "modelo1" && (
            <>
              <div style={{ padding: "40px var(--padding-padrao)" }}>
                <InputTexto label="LinkedIn" name="linkedin" register={register} />
                <InputTexto label="Portfólio ou Website" name="portfolio" register={register} />
                <div className="form-section">
                  <label style={{ fontWeight: "bold", display: "block", marginBottom: "10px", textAlign: "center" }}>
                    Foto de Perfil (opcional)
                  </label>

                  <div className="foto-upload-container">
                    {fotoBase64 && (
                      <>
                        <img src={fotoBase64} alt="Prévia da Foto" className="foto-preview" />
                        <button type="button" className="btn-remover-foto" onClick={handleRemoverFoto}>
                          Remover Foto
                        </button>
                      </>
                    )}
                    <input
                      type="file"
                      id="foto-perfil-input"
                      accept="image/*"
                      onChange={handleFotoChange}
                      className="input-foto"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Seção: Experiência Profissional */}
        <TituloSessao texto="Experiência Profissional" />
        <div className="form-section">
          {fields.map((field, index) => (
            <div key={field.id} className="experiencia-bloco">
              <InputTexto label="Empresa" name={`experiencias[${index}].empresa`} register={register} required />
              <InputTexto label="Cargo" name={`experiencias[${index}].cargo`} register={register} required />
              <InputTexto label="Período" name={`experiencias[${index}].periodo`} register={register} required />
              <InputTexto label="Descrição" name={`experiencias[${index}].descricao`} register={register} />
              <div className="btn-centro">
                <button type="button" onClick={() => remove(index)} className="btn-remover-experiencia">
                  Remover experiência
                </button>
              </div>
            </div>
          ))}
          {/* Botão para adicionar nova experiência */}
          <div className="btn-centro">
            <button type="button" onClick={() => append({ empresa: "", cargo: "", periodo: "", descricao: "" })} className="btn-adicionar-experiencia">
              + Adicionar Experiência
            </button>
          </div>
        </div>

        {/* Seção: Formação */}
        <TituloSessao texto="Formação" />
        <div className="form-section">
          {formacoes.map((field, index) => (
            <div key={field.id} className="experiencia-bloco">
              <InputTexto label="Instituição" name={`formacoes[${index}].instituicao`} register={register} required />
              <InputTexto label="Curso" name={`formacoes[${index}].curso`} register={register} required />
              <InputTexto label="Período" name={`formacoes[${index}].periodo`} register={register} required />
              <InputTexto label="Descrição (opcional)" name={`formacoes[${index}].descricao`} register={register} />
              <div className="btn-centro">
                <button type="button" onClick={() => removeFormacao(index)} className="btn-remover-experiencia">
                  Remover formação
                </button>
              </div>
            </div>
          ))}
          {/* Botão para adicionar nova formação */}
          <div className="btn-centro">
            <button type="button" onClick={() => appendFormacao({ instituicao: "", curso: "", periodo: "", descricao: "" })} className="btn-adicionar-experiencia">
              + Adicionar Formação
            </button>
          </div>
        </div>

        {/* Seção: Habilidades */}
        <TituloSessao texto="Habilidades" />
        <div className="form-section">
          {habilidades.map((field, index) => (
            <div key={field.id} className="experiencia-bloco">
              <InputTexto label={`Habilidade ${index + 1}`} name={`habilidades[${index}].descricao`} register={register} required />
              <div className="btn-centro">
                <button type="button" onClick={() => removeHabilidade(index)} className="btn-remover-experiencia">
                  Remover habilidade
                </button>
              </div>
            </div>
          ))}
          {/* Botão para adicionar nova habilidade */}
          <div className="btn-centro">
            <button type="button" onClick={() => appendHabilidade({ descricao: "" })} className="btn-adicionar-experiencia">
              + Adicionar Habilidade
            </button>
          </div>
        </div>

        <div className="btn-centro">
          <button type="submit" className="btn-gerar-curriculo">
            Gerar Currículo PDF
          </button>
        </div>

      </form>
      {modeloSelecionado === "modelo0" && (
        <div className="preview-container">
          <h2 style={{ textAlign: "center", marginTop: "40px" }}>Prévia do Currículo</h2>
          <Modelo0Preview dados={dadosForm} />
        </div>
      )}

      {/* Rodapé da página */}
      <Footer />
    </div>
  );
}

export default Form;
