import { useState, useEffect, useRef } from "react";

/**
 * Componente: FormTarefa
 * -------------------------------------------------------
 * Formulário reutilizável para criar ou editar uma tarefa.
 *
 * Props:
 * - inicial: objeto da tarefa. Quando presente, popula os campos.
 * - onSave: função chamada ao enviar o formulário ({ nome, descricao }).
 * - onCancel: função chamada ao cancelar (opcional, aparece só no modo edição).
 * - modo: string ('criar' | 'edicao'), muda rótulos e estilos.
 */
export default function FormTarefa({ inicial = null, onSave, onCancel, modo='criar' }) {
  // estados controlados dos campos
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  // referência para a <textarea>, usada no auto-ajuste de altura
  const refDescricao = useRef(null);

  /**
   * Efeito: se receber "inicial", preenche os campos com nome e descrição.
   * Executa sempre que "inicial" mudar (ex.: ao entrar no modo edição).
   */
  useEffect(() => {
    if (inicial) {
      setNome(inicial.nome || "");
      setDescricao(inicial.descricao || "");
    }
  }, [inicial]);

  /**
   * Ajusta automaticamente a altura da textarea de acordo com o conteúdo.
   * - zera a altura para recalcular.
   * - define height = scrollHeight (altura do conteúdo).
   */
  function autoAjustarTextarea(el = refDescricao.current) {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

  // Sempre que descrição ou modo mudarem, reajusta textarea.
  useEffect(() => {
    autoAjustarTextarea();
  }, [descricao, modo]);

  /**
   * Handler de envio do formulário.
   * - Limpa os campos após salvar.
   */
  function enviar(e) {
    e.preventDefault();
    onSave({ nome, descricao });
    setDescricao('');
    setNome('');
  }

  return (
    <form onSubmit={enviar} className="pr-2 w-full flex flex-col items-center">
      {/* Campo título */}
      <input 
        className={`input input--title shadow-sm ${modo === 'edicao' ? 'is-editing' : ''}`}
        placeholder="Titulo"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />

      {/* Campo descrição (textarea com auto-resize) */}
      <textarea
        ref={refDescricao}
        className={`input input--title shadow-sm overflow-hidden resize-none 
          ${modo === 'edicao' ? 'is-editing min-h-28 md:min-h-36' : 'min-h-28 md:min-h-32'}`}
        rows={modo === 'edicao' ? 8 : 4}
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => { 
          setDescricao(e.target.value);
          autoAjustarTextarea(e.target); 
        }}
        onInput={(e) => autoAjustarTextarea(e.target)}
      />

      {/* Botões de ação */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className={`btn btn--primary shadow-sm ${nome ? '' : 'is-disabled'}`}
          type="submit"
        >
          {modo === 'edicao' ? 'Salvar' : 'Criar tarefa'}
        </button>

        {/* Botão de cancelar só aparece no modo edição */}
        {onCancel && (
          <button className="btn btn--card" type="button" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
