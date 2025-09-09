import { MdSearch } from "react-icons/md";

export default function BarraPesquisa({ onChange }) {
  return (
    <div className='w-5/12 items-center justify-center flex relative'>
        <MdSearch size={18} color="#796c58" className='absolute left-8.5 top-4 pointer-events-none'/>
      <input
        type="text"
        placeholder="Pesquisar..."
        className="input input--search"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}