import { createApp } from '../../../../server/app.js';

/**
 * YA DADO. Helper para las pruebas de la API.
 *
 * Levanta una instancia NUEVA de la API (con los datos semilla intactos) en un puerto libre
 * (`listen(0)`: el sistema asigna uno) y devuelve la dirección base y una función para cerrarla.
 *
 * Uso en una prueba (el archivo debe empezar con `// @vitest-environment node`):
 *   const { baseUrl, close } = await startTestServer();
 *   const response = await fetch(`${baseUrl}/api/products`);
 *   ...
 *   await close();
 */
export async function startTestServer(): Promise<{ baseUrl: string; close: () => Promise<void> }> {
  const server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://localhost:${server.address().port}`;
  const close = () => new Promise<void>((resolve) => server.close(() => resolve()));
  return { baseUrl, close };
}
