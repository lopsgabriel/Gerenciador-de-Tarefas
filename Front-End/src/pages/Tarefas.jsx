import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { excluirTarefa, listarTarefas, atualizarTarefa, criarTarefa } from '../redux/tasksSlice';
import { logout } from '../redux/authSlice';
import FormTarefa from '../components/FormTarefa';

export default function Tarefas(){
  const dispatch = useDispatch();
  const { itens, carregando, erro } = useSelector(e => e.tarefas);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    dispatch(listarTarefas());
  }, [dispatch]);

  async function criar({nome, descricao}){
    await dispatch(criarTarefa({nome, descricao}));
  }

  async function atualizar ({nome, descricao}){
    if(!editando) return;
    await dispatch(atualizarTarefa({id: editando.id, nome, descricao}));
    setEditando(null);
  }

  async function excluir(id){
    await dispatch(excluirTarefa(id));
  }

  return(
    <div style={{ maxWidth: 720, margin: '40px auto', display: 'grid', gap: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Tarefas</h1>
        <button onClick={() => dispatch(logout())}>Sair</button>
      </header>

      <section>
        <h3>Nova tarefa</h3>
        <FormTarefa onSave={criar} />
      </section>

      {carregando && <p>Carregando…</p>}
      {erro && <p style={{ color: 'tomato' }}>{erro}</p>}

      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
        {itens.map(t => (
          <li key={t.id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
            {editando?.id === t.id ? (
              <FormTarefa inicial={t} onSave={atualizar} onCancel={() => setEditando(null)} />
            ) : (
              <>
                <strong>{t.nome}</strong>
                <p style={{ margin: '6px 0' }}>{t.descricao}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setEditando(t)}>Editar</button>
                  <button onClick={() => excluir(t.id)}>Apagar</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}