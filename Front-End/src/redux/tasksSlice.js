import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../services/api";

const getToken = (state) => state.authentication?.token ?? state.auth?.token ?? null;

export const listarTarefas = createAsyncThunk('tarefas/listar', async (_, { getState }) => {
  const token = getToken(getState());
  if (!token) throw new Error('Sem token (faça login novamente).');
  return apiRequest('tarefas', { token });
});

export const buscarTarefa = createAsyncThunk('tarefas/buscar', async (id, { getState }) => {
  const token = getToken(getState());
  if (!token) throw new Error('Sem token (faça login novamente).');
  return apiRequest(`tarefas/${id}`, { token });
});

export const criarTarefa = createAsyncThunk('tarefas/criar', async ({ nome, descricao }, { getState }) => {
  const token = getToken(getState());
  if (!token) throw new Error('Sem token (faça login novamente).');
  return apiRequest('tarefas', { token, method: 'POST', body: { nome, descricao } });
});

export const atualizarTarefa = createAsyncThunk('tarefas/atualizar', async ({ id, nome, descricao }, { getState }) => {
  const token = getToken(getState());
  if (!token) throw new Error('Sem token (faça login novamente).');
  return apiRequest(`tarefas/${id}`, { token, method: 'PUT', body: { nome, descricao } });
});

export const excluirTarefa = createAsyncThunk('tarefas/excluir', async (id, { getState }) => {
  const token = getToken(getState());
  if (!token) throw new Error('Sem token (faça login novamente).');
  await apiRequest(`tarefas/${id}`, { token, method: 'DELETE' });
  return id;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { itens: [], carregando: false, erro: null, selecionada: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // LISTAR
      .addCase(listarTarefas.pending, (state) => { state.carregando = true; state.erro = null; })
      .addCase(listarTarefas.fulfilled, (state, action) => { state.carregando = false; state.itens = action.payload; })
      .addCase(listarTarefas.rejected, (state, action) => { state.carregando = false; state.erro = action.error.message; })

      // BUSCAR
      .addCase(buscarTarefa.fulfilled, (state, action) => { state.selecionada = action.payload; })

      // CRIAR
      .addCase(criarTarefa.fulfilled, (state, action) => { state.itens.push(action.payload); })

      // ATUALIZAR
      .addCase(atualizarTarefa.fulfilled, (state, action) => {
        const i = state.itens.findIndex(t => t.id === action.payload.id);
        if (i !== -1) state.itens[i] = action.payload;
      })

      // EXCLUIR
      .addCase(excluirTarefa.fulfilled, (state, action) => {
        state.itens = state.itens.filter(t => t.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
