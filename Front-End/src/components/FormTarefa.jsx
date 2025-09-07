import { useState, useEffect, useRef } from "react";

export default function FormTarefa({ inicial = null, onSave, onCancel, modo='criar' }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const refDescricao = useRef(null);

  useEffect(() => {
    if (inicial) {
      setNome(inicial.nome || "");
      setDescricao(inicial.descricao || "");
    }
  }, [inicial]);

  function autoAjustarTextarea(el = refDescricao.current) {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

  useEffect(() => {
    autoAjustarTextarea();
  }, [descricao, modo]);

  function enviar(e) {
    setDescricao('')
    setNome('')
    e.preventDefault();
    onSave({ nome, descricao });
  }

  return (
    <form onSubmit={enviar} className='pr-2 w-full flex flex-col items-center '>
      <input 
      className={`Nome-tarefa-form shadow-sm ${modo === 'edicao' ? 'em-edicao' : ''}`}
      placeholder="Titulo" 
      value={nome} 
      onChange={(e) => setNome(e.target.value)} 
      required />
      <textarea
        ref={refDescricao}
        className={` Nome-tarefa-form shadow-sm overflow-hidden resize-none 
          ${modo === 'edicao' ? 'em-edicao min-h-28 md:min-h-36' : 'min-h-28 md:min-h-32'}`}
        rows={modo === 'edicao' ? 8 : 4}
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => { setDescricao(e.target.value); autoAjustarTextarea(e.target); }}
        onInput={(e) => autoAjustarTextarea(e.target)}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button 
          className={`button shadow-sm ${nome ? '' : 'disabled' } `}
          type="submit"
        > 
          {modo === 'edicao' ? 'Salvar' : 'Criar tarefa'}
        </button>
        {onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}
      </div>
    </form>
  )
}