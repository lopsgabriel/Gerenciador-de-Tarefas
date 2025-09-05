import { useState, useEffect } from "react";

export default function FormTarefa({ inicial = null, onSave, onCancel }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (inicial) {
      setNome(inicial.nome || "");
      setDescricao(inicial.descricao || "");
    }
  }, [inicial]);

  function enviar(e) {
    e.preventDefault();
    onSave({ nome, descricao });
  }

  return (
    <form onSubmit={enviar} style={{ display: 'grid', gap: 8 }}>
      <input placeholder="Nome da tarefa" value={nome} onChange={(e) => setNome(e.target.value)} required />
      <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit">Salvar</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}
      </div>
    </form>
  )
}