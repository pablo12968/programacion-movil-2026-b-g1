import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { setupIonicReact } from '@ionic/react';
import { ShopProvider, useShop } from './shop';
import { sabores } from './catalog';
import FormularioPedido from './FormularioPedido';
import { enviarPedido } from './pedidos';
vi.mock('./pedidos', async original => ({ ...await original<typeof import('./pedidos')>(), enviarPedido: vi.fn() }));
setupIonicReact({ animated: false });
function Preparar() {
  const { add } = useShop();
  return <><button onClick={() => add({ helado: sabores[0], tamano: 'Una bola', topping: 'Sin topping', total: 2500 })}>Preparar carrito</button><FormularioPedido /></>;
}
it('bloquea datos inválidos y conserva el nombre al fallar el envío', async () => {
  vi.mocked(enviarPedido).mockRejectedValue(new Error('No se confirmó el pedido'));
  render(<MemoryRouter><ShopProvider><Preparar /></ShopProvider></MemoryRouter>);
  fireEvent.click(screen.getByText('Preparar carrito'));
  const boton = screen.getByText('Simular pedido');
  expect(boton).toHaveAttribute('disabled', 'true');
  fireEvent.change(screen.getByLabelText('Nombre para recoger (obligatorio)'), { target: { value: 'Ana' } });
  expect(boton).toHaveAttribute('disabled', 'false');
  fireEvent.submit(boton.closest('form')!);
  expect(await screen.findByRole('alert')).toHaveTextContent('No se confirmó el pedido');
  expect(screen.getByLabelText('Nombre para recoger (obligatorio)')).toHaveValue('Ana');
  expect(enviarPedido).toHaveBeenCalledTimes(1);
});
