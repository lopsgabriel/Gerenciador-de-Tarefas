import { Routes, Route } from 'react-router-dom';
import Tarefas from './pages/Tarefas';
import Login from './pages/Login';
import ProtectedRouter from './routes/AppRouter';

/**
 * Componente: App
 * -------------------------------------------------------
 * Define o roteamento principal da aplicação.
 *
 * Rotas:
 * - /login → página pública de autenticação.
 * - / (raiz) → página de tarefas, protegida por ProtectedRouter.
 *
 * Notas:
 * - ProtectedRouter garante que apenas usuários autenticados
 *   possam acessar a lista de tarefas.
 * - Caso contrário, redireciona para /login.
 */
export default function App() {
  return (
    <Routes>
      {/* Rota de login (pública) */}
      <Route path="/login" element={<Login />} />

      {/* Rota raiz protegida → só renderiza Tarefas se autenticado */}
      <Route
        path="/"
        element={
          <ProtectedRouter>
            <Tarefas />
          </ProtectedRouter>
        }
      />
    </Routes>
  );
}
