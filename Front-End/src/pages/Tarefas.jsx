import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { excluirTarefa, listarTarefas, atualizarTarefa, criarTarefa } from '../redux/tasksSlice';
import { logout } from '../redux/authSlice';
import { fuzzyMatch, norm } from '../components/FuzzyMatch';
import FormTarefa from '../components/FormTarefa';
import HeaderTarefas from '../components/HeaderTarefas';
import TarefaCard from '../components/TarefaCard';
import BarraPesquisa from '../components/BarraPesquisa';
import ErroAlerta from '../components/ErroAlerta';

export default function Tarefas(){
  const dispatch = useDispatch();
  const { itens } = useSelector(e => e.tarefas);
  const [editando, setEditando] = useState(null);
  const [pesquisa, setPesquisa] = useState('');
  const [erro, setErro] = useState(null);
  const [visivel, setVisivel] = useState(false);


  const [expandidos, setExpandidos] = useState(() => new Set());
  const LIMITE = 140;

  const itensFiltrados = useMemo(() => {
    const q = norm(pesquisa).trim();
    if (!q) return itens;
    const termos = q.split(/\s+/).filter(Boolean);
    return itens.filter(t => {
      const alvo = `${t.nome ?? ''} ${t.descricao ?? ''}`;
      return termos.every(term => fuzzyMatch(term, alvo));
    });
  }, [itens, pesquisa]);

  useEffect(() => {
    dispatch(listarTarefas());
    if (!visivel && erro){
      const timer = setTimeout(() => setErro(null), 500);
      return () => clearTimeout(timer);
    }

  }, [dispatch, visivel, erro]);

  function avisoErro(err){
    setErro(err.message || 'Erro inesperado');
    setVisivel(true);
    setTimeout(() => setVisivel(false), 4000);
  }

  async function criar({nome, descricao}){
    try{
      await dispatch(criarTarefa({nome, descricao})).unwrap();
    } catch (err){
      avisoErro(err);
    }
  }

  async function atualizar ({nome, descricao}){
    if(!editando) return;
    try{
      await dispatch(atualizarTarefa({id: editando.id, nome, descricao})).unwrap();
      setEditando(null);
    } catch (err){
      avisoErro(err);
    }
  }

  async function excluir(id){
    try{
      await dispatch(excluirTarefa(id)).unwrap();
    } catch {
      // igonore
    } finally {
      await dispatch(listarTarefas());
    }
  }

  function estaExpandido(id){
    return expandidos.has(id);
  }
  
  function alternarExpandido(id){
    setExpandidos(prev => {
      const novo = new Set(prev);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  }

  return(
    <>
      <HeaderTarefas logout={() => dispatch(logout())} />
      <div className='layout-root'>
        <div className='layout-container'>
          <ErroAlerta visivel={visivel} mensagem={erro} />
          <section className='layout-section'>
            <h3 className='form-title'>Nova tarefa</h3>
            <FormTarefa onSave={criar} />
          </section>
          <BarraPesquisa onChange={setPesquisa} />
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-10/12 pb-10">
            {itensFiltrados.map(t => {
              const emEdicao = editando?.id === t.id;
              const precisaExpandir = (t?.descricao?.length ?? 0) > LIMITE;
              const expandido = estaExpandido(t.id)
              return (
                <TarefaCard
                  key={t.id}
                  t={t}
                  precisaExpandir={precisaExpandir}
                  expandido={expandido}
                  emEdicao={emEdicao}
                  setEditando={setEditando}
                  excluir={excluir}
                  atualizar={atualizar}
                  alternarExpandido={alternarExpandido}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </>
  )
}