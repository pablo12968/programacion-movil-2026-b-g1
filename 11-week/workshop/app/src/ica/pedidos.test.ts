import { afterEach, expect, it, vi } from 'vitest';
import { erroresPedido, enviarPedido } from './pedidos';
import { sabores } from './catalog';

const datos = { nombre: 'Ana', nota: '' };
const lineas = [{ helado: sabores[0], tamano: 'Dos bolas', topping: 'Chocolate', total: 4000 }];
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.useRealTimers(); window.history.replaceState({}, '', '/'); });
it('valida los límites reales del nombre y de la nota de ICA', () => {
  expect(erroresPedido({ nombre: ' ', nota: 'a'.repeat(301) })).toMatchObject({ nombre: expect.any(String), nota: expect.any(String) });
  expect(erroresPedido({ nombre: 'A', nota: '' }).nombre).not.toBe('');
  expect(erroresPedido({ nombre: 'A'.repeat(81), nota: '' }).nombre).not.toBe('');
  expect(erroresPedido({ nombre: ' Ana ', nota: 'a'.repeat(300) })).toEqual({ nombre: '', nota: '' });
});
it('reintenta con la misma referencia sin duplicar el pedido simulado', async () => {
  vi.stubEnv('VITE_ICA_API_URL', '');
  vi.useFakeTimers();
  window.history.replaceState({}, '', '/?pedido=error');
  const fallo = expect(enviarPedido(datos, lineas, 'pedido-error')).rejects.toThrow('Tus datos se conservan');
  await vi.runAllTimersAsync();
  await fallo;
  const reintento = enviarPedido(datos, lineas, 'pedido-error');
  await vi.runAllTimersAsync();
  const pedido = await reintento;
  expect(pedido.total).toBe(4000);
  expect(await enviarPedido(datos, lineas, 'pedido-error')).toBe(pedido);
});
it('convierte COP a centavos y envía la referencia al contrato real de ICA', async () => {
  vi.stubEnv('VITE_ICA_API_URL', 'https://ica.test');
  vi.useFakeTimers();
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 'servidor-1', total: 400000 }) });
  vi.stubGlobal('fetch', fetchMock);
  const envio = enviarPedido(datos, lineas, 'pedido-api');
  await vi.runAllTimersAsync();
  expect((await envio).total).toBe(4000);
  const [url, opciones] = fetchMock.mock.calls[0];
  expect(url).toBe('https://ica.test/api/orders');
  expect(opciones.headers['Idempotency-Key']).toBe('pedido-api');
  expect(JSON.parse(opciones.body)).toMatchObject({ expectedTotal: 400000, customer: 'Ana', items: [{ productId: 1, size: 'Dos bolas', topping: 'Chocolate', quantity: 1 }] });
});
