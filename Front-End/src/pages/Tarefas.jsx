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

/**
 * Página: Tarefas
 * - Orquestra a listagem, criação, edição e remoção de tarefas.
 * - Integra com Redux para buscar e mutar dados.
 * - Implementa pesquisa com "fuzzy match" e expansão por card.
 * - Exibe feedback de erro via alerta temporizado.
 */
export default function Tarefas(){
  const dispatch = useDispatch();

  // Lista de tarefas vem do Redux
  const { itens } = useSelector(e => e.tarefas);

  const [editando, setEditando] = useState(null);
  const [pesquisa, setPesquisa] = useState('');
  const [erro, setErro] = useState(null);
  const [visivel, setVisivel] = useState(false);

  // Controle de expansão por item (guarda ids expandidos)
  const [expandidos, setExpandidos] = useState(() => new Set());
  // Limite de caracteres para decidir se precisa expandir a tarefa
  const LIMITE = 80;

  /**
   * Filtra itens em memória usando fuzzyMatch:
   * - Normaliza e quebra a query em termos.
   * - Cada termo precisa casar com nome+descrição da tarefa.
   */
  const itensFiltrados = useMemo(() => {
    const q = norm(pesquisa).trim();
    if (!q) return itens;
    const termos = q.split(/\s+/).filter(Boolean);
    return itens.filter(t => {
      const alvo = `${t.nome ?? ''} ${t.descricao ?? ''}`;
      return termos.every(term => fuzzyMatch(term, alvo));
    });
  }, [itens, pesquisa]);

  /**
   * Carrega lista inicial de tarefas
   * e controla desaparecimento suave do alerta de erro.
   */
  useEffect(() => {
    dispatch(listarTarefas());
    if (!visivel && erro){
      const timer = setTimeout(() => setErro(null), 500);
      return () => clearTimeout(timer);
    }

  }, [dispatch, visivel, erro, editando]);

  /**
   * Exibe erro padronizado no alerta, com timeout para esconder.
   */
  function avisoErro(err){
    setErro(err.message || 'Erro inesperado');
    setVisivel(true);
    setTimeout(() => setVisivel(false), 4000);
  }

  /**
   * Cria nova tarefa → Redux thunk.
   */
  async function criar({nome, descricao}){
    try{
      await dispatch(criarTarefa({nome, descricao})).unwrap();
    } catch (err){
      avisoErro(err);
    }
  }
  
   /**
   * Atualiza tarefa em edição → Redux thunk.
   */
  async function atualizar ({nome, descricao}){
    if(!editando) return;
    try{
      await dispatch(atualizarTarefa({id: editando.id, nome, descricao})).unwrap();
      setEditando(null);
    } catch (err){
      avisoErro(err);
    }
  }

   /**
   * Exclui tarefa → Redux thunk.
   * Sempre revalida lista no finally.
   */
  async function excluir(id){
    try{
      await dispatch(excluirTarefa(id)).unwrap();
    } catch {
      // igonore
    } finally {
      await dispatch(listarTarefas());
    }
  }

   /**
   * Helpers de expansão por card:
   * - estaExpandido: verifica se o id está no Set
   * - alternarExpandido: adiciona ou remove id do Set
   */
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

  /**
   * - Sempre que a lista de itens mudar, remove dos expandidos
   *   os que não precisam mais expandir (descrição <= LIMITE).
   */
  useEffect(() => {
    setExpandidos(prev => {
      const novo = new Set(prev);
      itens.forEach( t => {
        const precisaExpandir = (t?.descricao?.length ?? 0) > LIMITE;
        if (!precisaExpandir && novo.has(t.id)){
          novo.delete(t.id)
        }
      })
      return novo
    })
  }, [itens, LIMITE])

  return(
    <>
    {/* Header com botão de logout */}
      <HeaderTarefas logout={() => dispatch(logout())} />
      <div className='layout-root'>
        <div className='layout-container'>
          <ErroAlerta visivel={visivel} mensagem={erro} />
          
          {/* Form de criação */}
          <section className='layout-section'>
            <h3 className='form-title'>Nova tarefa</h3>
            <FormTarefa onSave={criar} />
          </section>

          {/* Barra de pesquisa */}
          <BarraPesquisa onChange={setPesquisa} />

          {/* Grid de cards */}
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