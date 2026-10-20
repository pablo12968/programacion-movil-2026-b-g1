/**
 * YA DADO. Dirección base de la API.
 *
 * Vite expone las variables que empiezan por `VITE_` en `import.meta.env`. Si no existe un
 * archivo `.env` (se crea copiando `.env.example`), se usa la dirección por defecto.
 */
export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
