import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdOutlineExpandMore } from "react-icons/md";
import { MdOutlineExpandLess } from "react-icons/md";

export default function TarefaCard({ t, precisaExpandir, expandido, emEdicao, setEditando, excluir, atualizar, alternarExpandido }) {
  return (
   <>
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
          <div className={`flex-1 ${expandido ? 'overflow-auto card-scroll' : 'overflow-hidden desc-clamped'}`}>
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
   </>
  );
}