import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import tasksReducer from "./tasksSlice";

/**
 * Configuração da Redux Store
 * -------------------------------------------------------
 * Centraliza o estado global da aplicação.
 *
 * reducers:
 * - authentication → gerencia token e estado de login (authSlice).
 * - tarefas → gerencia lista de tarefas e operações CRUD (tasksSlice).
 *
 * O Redux Toolkit aplica:
 * - thunk middleware.
 * - integração com Redux DevTools.
 */
export const store = configureStore({
  reducer: {
    authentication: authReducer,
    tarefas: tasksReducer,
  },
});
