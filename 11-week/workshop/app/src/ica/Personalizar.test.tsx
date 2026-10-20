import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { MemoryRouter, Route } from 'react-router-dom';
import { setupIonicReact } from '@ionic/react';
import Personalizar from './Personalizar';
import { cargarHelados } from './catalog';
vi.mock('./catalog', async importOriginal => ({
  ...await importOriginal<typeof import('./catalog')>(), cargarHelados: vi.fn(),
}));
setupIonicReact({ animated: false });
afterEach(cleanup);
it('usa el precio del servicio y permite seleccionar tamaño y topping con sus etiquetas', async () => {
  vi.mocked(cargarHelados).mockResolvedValue([{id:99,name:'Pistacho especial',description:'Con pistacho',category:'Especiales',price:3200}]);
  render(<MemoryRouter initialEntries={['/helados/99']}><Route path="/helados/:id"><Personalizar /></Route></MemoryRouter>);
  expect(await screen.findByRole('heading',{name:'Pistacho especial'})).toBeVisible();
  fireEvent.click(screen.getByRole('radio',{name:/Dos bolas/}));
  fireEvent.click(screen.getByRole('radio',{name:/Chocolate/}));
  expect(screen.getByRole('radio',{name:/Dos bolas/})).toBeChecked();
  expect(screen.getByText(/Total:/)).toHaveTextContent('4.700');
  expect(cargarHelados).toHaveBeenCalledTimes(1);
});
