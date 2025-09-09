import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../services/api";

// Helper: obtém token do estado global (compatível com possíveis nomes diferentes)
const getToken = (state) => state.authentication?.token ?? state.auth?.token ?? null;

/**
 * Thunks assíncronos (operações CRUD)
 * -------------------------------------------------------
 * Cada thunk:
 * - Recupera o token do estado global.
 * - Faz requisição à API usando apiRequest.
 */

// LISTAR
export const listarTarefas = createAsyncThunk(
  "tarefas/listar",
  async (_, { getState }) => {
    const token = getToken(getState());
    if (!token) throw new Error("Sem token (faça login novamente).");
    return apiRequest("tarefas", { token });
  }
);

// BUSCAR por id
export const buscarTarefa = createAsyncThunk(
  "tarefas/buscar",
  async (id, { getState }) => {
    const token = getToken(getState());
    if (!token) throw new Error("Sem token (faça login novamente).");
    return apiRequest(`tarefas/${id}`, { token });
  }
);

// CRIAR
export const criarTarefa = createAsyncThunk(
  "tarefas/criar",
  async ({ nome, descricao }, { getState }) => {
    const token = getToken(getState());
    if (!token) throw new Error("Sem token (faça login novamente).");
    return apiRequest("tarefas", {
      token,
      method: "POST",
      body: { nome, descricao },
    });
  }
);

// ATUALIZAR
export const atualizarTarefa = createAsyncThunk(
  "tarefas/atualizar",
  async ({ id, nome, descricao }, { getState }) => {
    const token = getToken(getState());
    if (!token) throw new Error("Sem token (faça login novamente).");
    return apiRequest(`tarefas/${id}`, {
      token,
      method: "PUT",
      body: { nome, descricao },
    });
  }
);

// EXCLUIR
export const excluirTarefa = createAsyncThunk(
  "tarefas/excluir",
  async (id, { getState }) => {
    const token = getToken(getState());
    if (!token) throw new Error("Sem token (faça login novamente).");
    await apiRequest(`tarefas/${id}`, { token, method: "DELETE" });
    return id; // retorna id para remover do estado
  }
);

/**
 * Slice: tarefas
 * -------------------------------------------------------
 * Estado inicial:
 * - itens: lista de tarefas
 * - carregando: flag de loading
 * - erro: mensagem de erro (string ou null)
 * - selecionada: tarefa carregada individualmente
 */
const tasksSlice = createSlice({
  name: "tasks",
  initialState: { itens: [], carregando: false, erro: null, selecionada: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // LISTAR
      .addCase(listarTarefas.pending, (state) => {
        state.carregando = true;
        state.erro = null;
      })
      .addCase(listarTarefas.fulfilled, (state, action) => {
        state.carregando = false;
        state.itens = action.payload;
      })
      .addCase(listarTarefas.rejected, (state, action) => {
        state.carregando = false;
        state.erro = action.error.message;
      })

      // BUSCAR
      .addCase(buscarTarefa.fulfilled, (state, action) => {
        state.selecionada = action.payload;
      })

      // CRIAR
      .addCase(criarTarefa.fulfilled, (state, action) => {
        state.itens.push(action.payload);
      })

      // ATUALIZAR
      .addCase(atualizarTarefa.fulfilled, (state, action) => {
        const i = state.itens.findIndex((t) => t.id === action.payload.id);
        if (i !== -1) state.itens[i] = action.payload;
      })

      // EXCLUIR
      .addCase(excluirTarefa.fulfilled, (state, action) => {
        state.itens = state.itens.filter((t) => t.id !== action.payload);
      });
  },
});

// Exporta apenas o reducer 
export default tasksSlice.reducer;
