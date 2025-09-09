import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
/**
 * Componente: ProtectedRouter
 * -------------------------------------------------------
 * Wrapper para proteger rotas que exigem autenticação.
 *
 * Props:
 * - children: elementos a renderizar caso usuário esteja autenticado.
 *
 * Funcionamento:
 * - Verifica no Redux se o usuário está autenticado.
 * - Se sim → renderiza o conteúdo normalmente.
 * - Se não → redireciona para "/login".
 *
 * Observação:
 * - Este padrão garante que apenas usuários logados tenham acesso
 *   a determinadas páginas (ex.: lista de tarefas).
 */
export default function ProtectedRouter({ children }) {
  const authenticated = useSelector(e => e.authentication.authenticated);
  return authenticated ? children : <Navigate to="/login" />
}