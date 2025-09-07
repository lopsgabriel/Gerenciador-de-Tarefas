import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { excluirTarefa, listarTarefas, atualizarTarefa, criarTarefa } from '../redux/tasksSlice';
import { logout } from '../redux/authSlice';
import { fuzzyMatch, norm } from '../components/FuzzyMatch';
import FormTarefa from '../components/FormTarefa';
import HeaderTarefas from '../components/HeaderTarefas';
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdSearch } from "react-icons/md";

export default function Tarefas(){
  const dispatch = useDispatch();
  const { itens } = useSelector(e => e.tarefas);
  const [editando, setEditando] = useState(null);
  const [pesquisa, setPesquisa] = useState('');

  const itensFiltrados = useMemo(() => {
  const q = norm(pesquisa).trim();
  if (!q) return itens; // 👉 sem pesquisa = retorna todos
  const termos = q.split(/\s+/).filter(Boolean);
  return itens.filter(t => {
    const alvo = `${t.nome ?? ''} ${t.descricao ?? ''}`;
    return termos.every(term => fuzzyMatch(term, alvo));
  });
}, [itens, pesquisa]);

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
    <>
      <HeaderTarefas logout={() => dispatch(logout())} />
      <div className='layout-root'>
        <div className='layout-container'>
          <section className='layout-section'>
            <h3 className='titulo-form'>Nova tarefa</h3>
            <FormTarefa onSave={criar} />
          </section>
          <div className='w-5/12 items-center justify-center flex relative'>
              <MdSearch size={18} color="#796c58" className='absolute left-8.5 top-4 pointer-events-none'/>
            <input
              type="text"
              placeholder="Pesquisar..."
              className="input-busca"
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-10/12 pb-10">
            {itensFiltrados.map(t => {
              const emEdicao = editando?.id === t.id;
              return (
                <li
                  key={t.id}
                  className={`card-tarefas ${emEdicao ? 'em-edicao' : ''}`}
                >
                  {emEdicao ? (
                    <div className="flex-1 overflow-auto card-scroll">
                      <FormTarefa 
                        inicial={t}
                        onSave={atualizar} 
                        onCancel={() => setEditando(null)}
                        modo='edicao' />
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-hidden">
                        <strong className="card-nome">{t.nome}</strong>
                        <p className="card-descricao">
                          {t.descricao}
                        </p>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="button-card" onClick={() => setEditando(t)}>
                          <MdEdit />
                        </button>
                        <button className="button-card delete" onClick={() => excluir(t.id)}>
                          <MdDelete />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  )
}