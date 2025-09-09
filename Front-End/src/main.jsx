import { StrictMode } from 'react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

/**
 * Ponto de entrada da aplicação React
 * -------------------------------------------------------
 * - Ativa o React.StrictMode (ajuda a identificar problemas em dev).
 * - Envolve toda a aplicação no Provider do Redux, para acesso global ao estado.
 * - Configura BrowserRouter para habilitar navegação por rotas.
 * - Renderiza o componente raiz <App />.
 */
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
