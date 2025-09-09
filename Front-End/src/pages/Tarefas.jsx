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
import { MdOutlineExpandMore } from "react-icons/md";
import { MdOutlineExpandLess } from "react-icons/md";
import Alert from '@mui/material/Alert';

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
          <div className='w-full justify-end mr-5 flex relative' 
            style={{ position: 'fixed', top: '5rem', 
              opacity: visivel ? 1 : 0, transition: 'opacity 0.5s ease-in-out' 
            }}
          >
            {erro && <Alert severity="error">{erro}</Alert>}
          </div>
          <section className='layout-section'>
            <h3 className='form-title'>Nova tarefa</h3>
            <FormTarefa onSave={criar} />
          </section>
          <div className='w-5/12 items-center justify-center flex relative'>
              <MdSearch size={18} color="#796c58" className='absolute left-8.5 top-4 pointer-events-none'/>
            <input
              type="text"
              placeholder="Pesquisar..."
              className="input input--search"
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-10/12 pb-10">
            {itensFiltrados.map(t => {
              const emEdicao = editando?.id === t.id;
              const precisaExpandir = (t?.descricao?.length ?? 0) > LIMITE;
              const expandido = estaExpandido(t.id)
              return (
                <li
                  key={t.id}
                  className={`card ${emEdicao ? 'card--editing' : ''} ${expandido ? 'expanded' : ''}`}
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
                      <div className={`flex-1 ${expandido ? 'overflow-auto card-scroll' : 'overflow-hidden'}`}>
                        <h1 className="card__name">{t.nome}</h1>
                        <p className={expandido ? 'desc-full' : 'desc-clamped'}>
                          {t.descricao}
                        </p>
                      </div>
                      <div className='flex justify-between'>
                        <div className="mt-3 flex gap-2">
                          <button className="btn btn--card" onClick={() => setEditando(t)}>
                            <MdEdit />
                          </button>
                          <button className="btn btn--card is-danger" onClick={() => excluir(t.id)}>
                            <MdDelete />
                          </button>
                        </div>
                        {precisaExpandir && (
                          <button
                            className="btn btn--expand"
                            onClick={() => alternarExpandido(t.id)}
                            aria-expanded={expandido}
                            aria-label={expandido ? 'Recolher descrição' : 'Expandir descrição'}
                          >
                            {expandido
                              ? <MdOutlineExpandLess size={25} />
                              : <MdOutlineExpandMore size={25} />
                            }
                          </button>
                        )}
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