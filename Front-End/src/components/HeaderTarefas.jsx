import React from "react";

export default function HeaderTarefas({ logout }) {
  return (
    <header className="header-tarefas">
      <div className="header-conteudo">
        <h1 className="header-titulo">Minhas Tarefas</h1>
        <div className="header-acoes">
          <button className="header-botao button" onClick={logout}>Sair</button>
        </div>
      </div>
    </header>
  );
}
