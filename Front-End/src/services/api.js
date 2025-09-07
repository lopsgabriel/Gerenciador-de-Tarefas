const baseURL = import.meta.env.VITE_API_URL;

function joinUrl(base, path) {
  const b = (base || '').replace(/\/+$/, '');
  const p = String(path || '').replace(/^\/+/, '');
  return `${b}/${p}`;
}

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = joinUrl(baseURL, path);
  const resp = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!resp.ok) {
    let mensagem = `Erro na requisição (${resp.status})`;
    try {
      const data = await resp.json();
      mensagem = data.erro || data.error || data.message || mensagem;
    } catch {
      try { mensagem = await resp.text(); } catch { /* empty */ }
    }
    throw new Error(mensagem);
  }

  return resp.status === 204 ? null : resp.json();
}
