import type { Linea } from './shop';

export interface DatosPedido { nombre: string; nota: string }
export interface Pedido extends DatosPedido {
  id: string; fecha: string; estado: string; total: number; lineas: Linea[];
}
export function erroresPedido(datos: DatosPedido) {
  return {
    nombre: datos.nombre.trim().length < 2 || datos.nombre.trim().length > 80
      ? 'Escribe un nombre de entre 2 y 80 caracteres para recoger el pedido.' : '',
    nota: datos.nota.length > 300 ? 'La nota puede tener como máximo 300 caracteres.' : '',
  };
}
const recibidos = new Map<string, { cuerpo: string; pedido: Pedido }>();
const fallos = new Set<string>();
export async function enviarPedido(datos: DatosPedido, lineas: Linea[], referencia: string): Promise<Pedido> {
  const errores = erroresPedido(datos);
  if (errores.nombre || errores.nota) throw new Error(errores.nombre || errores.nota);
  if (!lineas.length || lineas.length > 50) throw new Error('El pedido debe tener entre 1 y 50 helados.');
  const total = lineas.reduce((suma, linea) => suma + linea.total, 0);
  if (!Number.isFinite(total) || total < 0) throw new Error('Revisa los precios del carrito.');
  const cuerpo = JSON.stringify({
    customer: datos.nombre.trim(), note: datos.nota.trim(), expectedTotal: Math.round(total * 100),
    items: lineas.map(linea => ({ productId: linea.helado.id, size: linea.tamano, topping: linea.topping, quantity: 1 })),
  });
  const anterior = recibidos.get(referencia);
  if (anterior) {
    if (anterior.cuerpo !== cuerpo) throw new Error('La referencia ya pertenece a otro pedido.');
    return anterior.pedido;
  }
  const params = new URLSearchParams(window.location.search);
  const demora = import.meta.env.DEV && params.get('pedido') === 'lento' ? 4000 : 500;
  await new Promise(resolve => setTimeout(resolve, demora));
  if (import.meta.env.DEV && params.get('pedido') === 'error' && !fallos.has(referencia)) {
    fallos.add(referencia);
    throw new Error('No pudimos guardar el pedido. Tus datos se conservan; vuelve a intentarlo.');
  }
  let pedido: Pedido = {
    ...datos, nombre: datos.nombre.trim(), nota: datos.nota.trim(),
    id: referencia, fecha: new Date().toISOString(), estado: 'Simulado', total,
    lineas: structuredClone(lineas),
  };
  const api = import.meta.env.VITE_ICA_API_URL;
  if (api) {
    const respuesta = await fetch(`${api.replace(/\/$/, '')}/api/orders`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': referencia },
      body: cuerpo, signal: AbortSignal.timeout(12000),
    });
    const resultado = await respuesta.json();
    if (!respuesta.ok) throw new Error(typeof resultado.message === 'string' ? resultado.message : 'No se confirmó el pedido. Reintenta.');
    if (typeof resultado.id !== 'string' || !Number.isSafeInteger(resultado.total) || resultado.total < 0) {
      throw new Error('No se pudo verificar la confirmación. Reintenta con la misma referencia.');
    }
    pedido = { ...pedido, id: resultado.id, estado: 'Recibido', total: resultado.total / 100 };
  }
  recibidos.set(referencia, { cuerpo, pedido });
  return pedido;
}
