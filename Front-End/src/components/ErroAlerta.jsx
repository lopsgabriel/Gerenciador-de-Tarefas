import Alert from '@mui/material/Alert';

/**
 * Componente: ErroAlerta
 * -------------------------------------------------------
 * Exibe um alerta de erro fixo no topo da tela, com efeito de fade.
 *
 * Props:
 * - visivel: boolean → controla a opacidade (fade in/out).
 * - mensagem: string → texto do erro. Se não existir, não renderiza nada.
 *
 * Obs:
 * - É posicionado de forma fixa a 5rem do topo, alinhado à direita.
 * - Transição suave de opacidade em 0.5s para melhorar a experiência do usuário.
 */
export default function ErroAlerta({ visivel, mensagem }) {
  if (!mensagem) return null; // não renderiza nada se não há erro

  return (
    <div
      className="w-full justify-end mr-5 flex relative"
      style={{
        position: 'fixed',
        top: '5rem',
        opacity: visivel ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out'
      }}
    >
      <Alert severity="error">{mensagem}</Alert>
    </div>
  );
}
