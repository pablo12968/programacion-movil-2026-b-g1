const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${base}/api${path}`, { ...options, signal: controller.signal });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      const error = new Error(body?.message || `El servidor respondió con un error (${response.status}).`);
      error.fields = body?.errors;
      throw error;
    }
    if (!body) throw new Error('El servidor envió una respuesta inválida.');
    return body;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('La solicitud tardó demasiado. Comprueba tu conexión y vuelve a intentar.');
    if (error instanceof TypeError) throw new Error('No pudimos conectar con la API. Comprueba que esté encendida y vuelve a intentar.');
    throw error;
  } finally { clearTimeout(timer); }
}

export const listEvents = () => request('/eventos');
export const getEvent = id => request(`/eventos/${encodeURIComponent(id)}`);
export const createEvent = data => request('/eventos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
