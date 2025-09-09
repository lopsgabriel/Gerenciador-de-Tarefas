import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdOutlineExpandMore } from "react-icons/md";
import { MdOutlineExpandLess } from "react-icons/md";
import FormTarefa from "./FormTarefa";

/**
 * Componente: TarefaCard
 * ------------------------------------------------------
 * Responsável por renderizar um card de tarefa individual.
 * Pode estar em dois modos:
 * - Edição: exibe <FormTarefa> com dados iniciais.
 * - Visualização: mostra nome, descrição (clamp/expand) e botões de ação.
 *
 * Props:
 * - t: objeto da tarefa (id, nome, descricao).
 * - precisaExpandir: boolean → se a descrição é longa e merece botão expandir.
 * - expandido: boolean → se este card está expandido no momento.
 * - emEdicao: boolean → se este card está em modo edição.
 * - setEditando: fn → define tarefa em edição.
 * - excluir: fn(id) → remove tarefa.
 * - atualizar: fn(data) → salva edição da tarefa.
 * - alternarExpandido: fn(id) → alterna estado expandido deste card.
 */

export default function TarefaCard({ t, precisaExpandir, expandido, emEdicao, setEditando, excluir, atualizar, alternarExpandido }) {
  return (
   <>
    <li
      key={t.id}
      className={`card ${emEdicao ? 'card--editing' : ''} ${expandido ? 'expanded' : ''}`}
    >
      {emEdicao ? (
        // --- Modo edição ---
        <div className="flex-1 overflow-auto card-scroll">
          <FormTarefa 
            inicial={t}
            onSave={atualizar} 
            onCancel={() => setEditando(null)}
            modo='edicao' />
        </div>
      ) : (
        // --- Modo visualização ---
        <>
          <div className={`flex-1 ${expandido ? 'overflow-auto card-scroll' : 'overflow-hidden desc-clamped'}`}>
            <h1 className="card__name">{t.nome}</h1>
            {/* 
              Descrição pode estar colapsada (clamp) ou expandida.
              As classes desc-clamped/desc-full cuidam do corte ou estilo.
            */}
            <p className={expandido ? 'desc-full' : 'desc-clamped'}>
              {t.descricao}
            </p>
          </div>
          <div className='flex justify-between'>
            {/* Ações principais: editar e excluir */}
            <div className="mt-3 flex gap-2">
              <button className="btn btn--card" onClick={() => setEditando(t)}>
                <MdEdit />
              </button>
              <button className="btn btn--card is-danger" onClick={() => excluir(t.id)}>
                <MdDelete />
              </button>
            </div>

             {/* Botão de expandir só aparece se realmente precisar */}
            {precisaExpandir && (
              <button
                className="btn btn--expand"
                onClick={() => alternarExpandido(t.id)}
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
   </>
  );
}