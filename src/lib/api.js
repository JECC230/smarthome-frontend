import { API } from '@/config';
import { getToken, clearToken } from '@/lib/auth';

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { ... (options.headers || {}) };

  // Configuramos el contenido como JSON por defecto
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Si hay un token, lo enviamos en el header de Authorization
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => null);

  if (res.status === 401) {
    clearToken();
    throw new Error(data?.error || 'Sesión expirada');
  }

  if (!res.ok) {
    const err = new Error(data?.error || `Error HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return data;
}