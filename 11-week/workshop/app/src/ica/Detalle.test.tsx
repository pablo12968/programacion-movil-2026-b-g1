import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, useHistory } from 'react-router-dom';
import { setupIonicReact } from '@ionic/react';
import Personalizar from './Personalizar';
import { cargarHelados, sabores } from './catalog';

vi.mock('./catalog', async importOriginal => ({
  ...await importOriginal<typeof import('./catalog')>(), cargarHelados: vi.fn(),
}));
setupIonicReact({ animated: false });
afterEach(() => { cleanup(); vi.resetAllMocks(); });
function CambiarSabor() {
  const history = useHistory();
  return <button onClick={() => history.push('/helados/2')}>Cambiar sabor</button>;
}
function abrir(id = '1') {
  return render(<MemoryRouter initialEntries={['/helados/' + id]}>
    <CambiarSabor /><Route path="/helados/:id"><Personalizar /></Route>
  </MemoryRouter>);
}
it('permite volver mientras carga y sustituye la carga por los datos del id', async () => {
  let resolver!: (lista: typeof sabores) => void;
  vi.mocked(cargarHelados).mockReturnValue(new Promise(resolve => { resolver = resolve; }));
  abrir('6');
  expect(screen.getByRole('status')).toHaveTextContent('Cargando helado');
  expect(screen.getByText('Volver al catálogo')).toHaveAttribute('href', '/tabs/helados');
  await act(async () => resolver(sabores));
  expect(await screen.findByRole('heading', { name: 'Pistacho especial' })).toBeVisible();
  expect(screen.queryByText('Cargando helado…')).not.toBeInTheDocument();
});
it('ofrece reintentar una consulta fallida sin perder la ruta', async () => {
  vi.mocked(cargarHelados).mockRejectedValueOnce(new Error('red')).mockResolvedValueOnce(sabores);
  abrir('6');
  expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos cargar');
  fireEvent.click(screen.getByText('Reintentar'));
  expect(await screen.findByRole('heading', { name: 'Pistacho especial' })).toBeVisible();
  expect(cargarHelados).toHaveBeenCalledTimes(2);
});
it.each(['9999', 'abc', '-1'])('muestra salida al catálogo para el id inexistente %s', async id => {
  vi.mocked(cargarHelados).mockResolvedValue(sabores);
  abrir(id);
  expect(await screen.findByRole('heading', { name: 'Helado no encontrado' })).toBeVisible();
  expect(screen.getByText('Volver al catálogo')).toHaveAttribute('href', '/tabs/helados');
  expect(screen.queryByText('Añadir al carrito')).not.toBeInTheDocument();
});
it('reinicia tamaño y topping al navegar a otro id', async () => {
  vi.mocked(cargarHelados).mockResolvedValue(sabores);
  abrir();
  await screen.findByRole('heading', { name: 'Fresa de temporada' });
  fireEvent.click(screen.getByRole('radio', { name: /Tres bolas/ }));
  fireEvent.click(screen.getByRole('radio', { name: /Chocolate/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Cambiar sabor' }));
  await screen.findByRole('heading', { name: 'Chocolate intenso' });
  expect(screen.getByRole('radio', { name: /Una bola/ })).toBeChecked();
  expect(screen.getByRole('radio', { name: 'Sin topping' })).toBeChecked();
  expect(screen.getByText(/Total:/)).toHaveTextContent('2.500');
});
