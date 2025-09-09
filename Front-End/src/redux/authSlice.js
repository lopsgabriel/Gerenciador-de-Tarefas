import { createSlice } from "@reduxjs/toolkit";
const STORAGE_KEY = "token";
const bruto = localStorage.getItem(STORAGE_KEY);
const token = bruto && bruto !== "undefined" ? bruto : null;

const authSlice = createSlice({
  name: "auth",
  initialState: { token, authenticated: !!token },
  reducers: {
    login: (state, action) => {
      const t = action.payload;
      state.token = t || null;
      state.authenticated = !!t;
      if (t) localStorage.setItem("token", t);
      else localStorage.removeItem("token");
    },
    logout: (state) => {
      state.token = null;
      state.authenticated = false;
      localStorage.removeItem("token");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
