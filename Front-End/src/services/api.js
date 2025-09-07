const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000';

function joinUrl(base, path) {
  const b = (base || '').replace(/\/+$/, '');
  const p = String(path || '').replace(/^\/+/, '');
  return `${b}/${p}`;
}
// Request simples
export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`
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

// Request simples com token
export async function apiAuth(path, { method = 'GET', body, token } = {}) {
  return apiRequest(path, {
    method,
    body,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}


