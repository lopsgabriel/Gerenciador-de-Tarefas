import React from "react";

export default function HeaderTarefas({ logout }) {
  return (
    <header className="app-header">
      <div className="app-header__content">
        <h1 className="app-header__title">Minhas Tarefas</h1>
        <div className="app-header__actions">
          <button className="app-header__button btn btn--primary" onClick={logout}>Sair</button>
        </div>
      </div>
    </header>
  );
}
