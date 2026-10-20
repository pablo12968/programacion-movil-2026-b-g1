/**
 * YA DADO. Error que lanza el cliente de la API (capa data).
 *
 * Distingue dos situaciones (regla del framework: mapear los errores de bajo nivel a errores
 * del dominio antes de que lleguen a la interfaz):
 *  - ERROR DE RED: `fetch` lanza una excepción porque la API no responde → `status` es null.
 *  - RESPUESTA NO EXITOSA: la API responde 400, 404, 500… → `status` trae el código y
 *    `details` los mensajes que envió el servidor.
 */
export class ApiError extends Error {
  readonly status: number | null;
  readonly details: string[];
  readonly isNetworkError: boolean;

  constructor(message: string, status: number | null, details: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.isNetworkError = status === null;
  }
}

/** YA DADO. Mensaje comprensible para la persona usuaria a partir de cualquier error. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.isNetworkError) {
      return 'No fue posible conectar con el servidor. Verifique que la API esté en ejecución.';
    }
    if (error.status === 404) {
      return 'No encontramos ese producto.';
    }
    return error.message;
  }
  return 'Ocurrió un error inesperado. Intente de nuevo.';
}
