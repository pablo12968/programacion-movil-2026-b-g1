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
export async function cargarHelados(): Promise<Helado[]> { return sabores; }
