import { MdSearch } from "react-icons/md";

/**
 * Componente: BarraPesquisa
 * -------------------------------------------------------
 * Campo de busca reutilizável para filtrar tarefas.
 *
 * Props:
 * - onChange: função chamada a cada alteração no input,
 *   recebe o valor atual do campo como string.
 */
export default function BarraPesquisa({ onChange }) {
  return (
    <div className="w-5/12 items-center justify-center flex relative">
      {/* Ícone da lupa decorativo (não interativo) */}
      <MdSearch
        size={18}
        color="#796c58"
        className="absolute left-8.5 top-4 pointer-events-none"
        aria-hidden="true"
      />

      {/* Campo de input de pesquisa */}
      <input
        type="text"
        placeholder="Pesquisar..."
        className="input input--search"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}