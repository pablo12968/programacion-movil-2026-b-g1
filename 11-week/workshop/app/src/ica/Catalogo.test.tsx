import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { setupIonicReact } from '@ionic/react';
import Catalogo from './Catalogo';
import { sabores, type Helado } from './catalog';
setupIonicReact({ animated: false });
afterEach(cleanup);
describe('Catálogo de ICA', () => {
  it('muestra el error y Reintentar vuelve a pedir los datos y recupera Fresa', async () => {
    const cargar = vi.fn<() => Promise<Helado[]>>()
      .mockRejectedValueOnce(new Error('Sin conexión'))
      .mockResolvedValueOnce(sabores);
    render(<Catalogo cargar={cargar} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos cargar los helados');
    expect(cargar).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('Reintentar'));
    expect(await screen.findByText('Fresa de temporada')).toBeVisible();
    expect(cargar).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
  it('distingue un catálogo vacío de una búsqueda sin resultados', async () => {
    const cargar = vi.fn<() => Promise<Helado[]>>().mockResolvedValueOnce([]).mockResolvedValueOnce(sabores);
    render(<Catalogo cargar={cargar} />);
    expect(await screen.findByText('Aún no hay sabores disponibles')).toBeVisible();
    fireEvent.click(screen.getByText('Actualizar catálogo'));
    await screen.findByText('Fresa de temporada');
    fireEvent.change(screen.getByLabelText('Buscar por sabor'), { target: { value: 'NoExiste' } });
    expect(screen.getByText('No encontramos ese sabor')).toBeVisible();
    fireEvent.click(screen.getByText('Restablecer búsqueda'));
    await waitFor(() => expect(screen.getByText('Fresa de temporada')).toBeVisible());
  });
});
