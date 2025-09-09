import React from "react";

/**
 * Componente: HeaderTarefas
 * -------------------------------------------------------
 * Cabeçalho da aplicação de tarefas.
 * - Exibe título "Minhas Tarefas".
 * - Oferece ação de logout, recebida via prop.
 *
 * Props:
 * - logout: função disparada ao clicar no botão "Sair".
 */
export default function HeaderTarefas({ logout }) {
  return (
    <header className="app-header">
      <div className="app-header__content">
        {/* Título da aplicação */}
        <h1 className="app-header__title">Minhas Tarefas</h1>

        {/* Ações do cabeçalho ( só o botão de sair) */}
        <div className="app-header__actions">
          <button
            className="app-header__button btn btn--primary"
            onClick={logout}
            aria-label="Encerrar sessão"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
