export interface Helado { id: number; name: string; description: string; category: string; price: number }
export const sabores: Helado[] = [
  { id: 1, name: 'Fresa de temporada', description: 'Cremoso helado con fresas y un toque de vainilla.', category: 'Clásicos', price: 2500 },
  { id: 2, name: 'Chocolate intenso', description: 'Cacao, textura suave y mucho chocolate.', category: 'Clásicos', price: 2500 },
  { id: 3, name: 'Vainilla artesanal', description: 'El clásico que combina con todo.', category: 'Clásicos', price: 2500 },
  { id: 4, name: 'Mango tropical', description: 'Sorbete refrescante de mango. Sin lácteos.', category: 'Frutales', price: 2500 },
  { id: 5, name: 'Limón fresco', description: 'Sorbete cítrico y ligero. Sin lácteos.', category: 'Frutales', price: 2500 },
  { id: 6, name: 'Pistacho especial', description: 'Helado cremoso con pistacho. Contiene frutos secos.', category: 'Especiales', price: 3500 },
];
export const tamanos = { 'Una bola': 0, 'Dos bolas': 1000, 'Tres bolas': 2000 };
export const toppings = { 'Sin topping': 0, Chocolate: 500, Galleta: 500, Chispas: 250 };
export const cop = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value) + ' COP';
let falloSimulado = false;
export async function cargarHelados(): Promise<Helado[]> {
  const params = new URLSearchParams(window.location.search);
  const estado = import.meta.env.DEV ? params.get('estado') : null;
  const requestedDelay = Number(params.get('retraso') ?? 450);
  const delay = import.meta.env.DEV && Number.isFinite(requestedDelay) ? Math.max(0, Math.min(requestedDelay, 10000)) : 450;
  await new Promise(resolve => setTimeout(resolve, delay));
  if (estado === 'error' && !falloSimulado) {
    falloSimulado = true;
    throw new Error('Falla de demostración');
  }
  if (estado === 'vacio') return [];
  const api = import.meta.env.VITE_ICA_API_URL;
  if (!api) return sabores;
  const response = await fetch(`${api.replace(/\/$/, '')}/api/products`, { signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error('No se pudo consultar el catálogo');
  const data: unknown = await response.json();
  if (!Array.isArray(data)) throw new Error('Respuesta inválida');
  return data.map(value => {
    if (!value || typeof value.id !== 'number' || typeof value.name !== 'string'
      || !Number.isFinite(Number(value.price)) || Number(value.price) < 0) throw new Error('Helado inválido');
    return { id: value.id, name: value.name, price: Number(value.price), description: value.description ?? '', category: value.category ?? 'Helados' };
  });
}
