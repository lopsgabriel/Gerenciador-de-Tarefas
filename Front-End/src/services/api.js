// Base da API: vem do .env (VITE_API_URL) ou fallback para localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000';

/**
 * Utilitário: joinUrl
 * -------------------------------------------------------
 * Concatena base + path de forma segura, evitando barras duplicadas.
 * Exemplo:
 *   joinUrl('http://api.com/', '/tarefas') → "http://api.com/tarefas"
 */
function joinUrl(base, path) {
  const b = (base || '').replace(/\/+$/, '');
  const p = String(path || '').replace(/^\/+/, '');
  return `${b}/${p}`;
}

/**
 * Função principal: apiRequest
 * -------------------------------------------------------
 * Executa uma requisição HTTP padrão (fetch).
 *
 * Parâmetros:
 * - path: caminho relativo (ex.: "tarefas", "login").
 * - options:
 *    - method: método HTTP (GET, POST, PUT, DELETE).
 *    - body: objeto JS que será convertido para JSON.
 *    - token: opcional, se presente adiciona Authorization Bearer.
 *
 * Regras:
 * - Sempre envia "Content-Type: application/json".
 * - Se resposta !ok:
 *    - Tenta extrair mensagem de erro (data.erro ou data.message).
 *    - Caso contrário, usa `Erro <status>`.
 * - Se erro de rede (TypeError): retorna mensagem amigável.
 */
export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const url = joinUrl(BASE_URL, path);
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.erro || data?.message || `Erro ${res.status}`);
    }

    return res.json();
  } catch (e) {
    if (e.name === 'TypeError') {
      throw new Error('Não foi possível conectar ao servidor.');
    }
    throw e;
  }
}

/**
 * Função auxiliar: apiAuth
 * -------------------------------------------------------
 * Versão simplificada de apiRequest para endpoints autenticados.
 * - Garante que o header Authorization seja passado se o token existir.
 * - Usa mesma assinatura de apiRequest.
 */
export async function apiAuth(path, { method = 'GET', body, token } = {}) {
  return apiRequest(path, {
    method,
    body,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
