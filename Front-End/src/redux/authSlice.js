import { createSlice } from "@reduxjs/toolkit";

// Chave usada no localStorage para salvar o token
const STORAGE_KEY = "token";

// Recupera token salvo no localStorage se houver
const bruto = localStorage.getItem(STORAGE_KEY);
const token = bruto && bruto !== "undefined" ? bruto : null;

/**
 * Slice: auth
 * -------------------------------------------------------
 * Responsável pela autenticação do usuário.
 * - Armazena o token JWT no estado global.
 * - Persiste o token no localStorage para manter a sessão.
 * - Oferece reducers simples para login e logout.
 */
const authSlice = createSlice({
  name: "auth",

  // Estado inicial: token e flag de autenticado
  initialState: { token, authenticated: !!token },

  reducers: {
    /**
     * login:
     * - Atualiza estado com novo token.
     * - Define authenticated = true.
     * - Salva token no localStorage (ou remove, se vazio).
     */
    login: (state, action) => {
      const t = action.payload;
      state.token = t || null;
      state.authenticated = !!t;
      if (t) localStorage.setItem(STORAGE_KEY, t);
      else localStorage.removeItem(STORAGE_KEY);
    },

    /**
     * logout:
     * - Reseta token e authenticated.
     * - Remove token persistido do localStorage.
     */
    logout: (state) => {
      state.token = null;
      state.authenticated = false;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

// Exporta actions para uso nos componentes
export const { login, logout } = authSlice.actions;

// Exporta reducer para configuração da store
export default authSlice.reducer;
