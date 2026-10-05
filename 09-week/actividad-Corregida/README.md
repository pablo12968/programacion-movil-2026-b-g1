# UniEventos · Ionic React + API REST

Actividad calificable del corte 2, semana 09. **Pablo Esteban Santana Vidal** · [pablo12968](https://github.com/pablo12968).

UniEventos reúne eventos académicos, culturales y deportivos del campus. Esta entrega desarrolla la consulta, creación y detalle de eventos del MVP propuesto en la semana 1.

## Ejecutar

Requisitos: **Node.js 22 o superior**, npm y un navegador actualizado. Desde la raíz del repositorio:

```powershell
cd 09-week/actividad-Corregida
npm ci
npm run dev
```

Abre **http://127.0.0.1:5173**. El comando inicia la API en el puerto **3001** y la aplicación en **5173**; ambos deben estar disponibles. Detén ambos con `Ctrl+C`. No necesitas instalar Ionic CLI, una base de datos ni configurar claves.

La API crea `api/data/eventos.json` con tres eventos iniciales en el primer arranque. Los eventos nuevos permanecen después de reiniciar el servidor. El archivo de datos local está excluido de Git. Para restablecer los ejemplos, detén la API y elimina únicamente ese archivo. Es un almacenamiento educativo para un único proceso, sin autenticación ni edición/eliminación de eventos.

También puedes usar dos terminales en esta carpeta: `npm run dev:api` y `npm run dev:app`. Si un puerto está ocupado, detén primero el proceso que lo utiliza.

## Uso

1. Consulta las tarjetas de la agenda. Puedes filtrar por categoría y actualizar la lista.
2. Completa nombre, fecha, categoría, lugar y descripción en **Publica un evento**.
3. Pulsa **Publicar evento**. Mientras se guarda, el formulario queda deshabilitado; al terminar aparece la confirmación y el evento se agrega a la lista.
4. Pulsa **Ver detalle** para navegar a `/eventos/:id`. Puedes recargar esta dirección o abrirla directamente.
5. Regresa mediante **Volver a eventos** o el botón de retroceso de Ionic.

La app muestra estados de carga, lista vacía, errores de conexión, errores HTTP, datos inválidos y evento inexistente. Los errores de consulta ofrecen **Reintentar**. Si falla la creación, se conserva el formulario para corregirlo o enviarlo de nuevo. Las solicitudes tienen un tiempo máximo de ocho segundos. Si se pierde la respuesta de un POST, revisa la lista antes de repetirlo: esta API mínima no implementa claves de idempotencia.

## Architecture

The project is divided into an Express REST API and an Ionic React application built with Vite.
The `GET /api/eventos` endpoint returns the event collection as a JSON array with HTTP status 200.
The `POST /api/eventos` endpoint accepts a JSON object, validates all required fields, generates a server-side identifier, and returns the created event with HTTP status 201 and a Location header.
The `GET /api/eventos/:id` endpoint provides the event detail and returns a JSON error with HTTP status 404 when the identifier does not exist.
The React application consumes these endpoints through the native `fetch` function in `src/api.js`, which checks HTTP errors and cancels requests after eight seconds.
React `useState` hooks manage the event collection, category filter, form values, loading flags, success messages, and validation errors.
The development server forwards same-origin `/api` requests to Express, so the default setup does not require cross-origin requests.
Ionic `IonReactRouter`, `IonRouterOutlet`, and `IonPage` implement list-to-detail navigation, while the detail page fetches its own data to support direct links and browser reloads.
The API stores events in a local JSON file and replaces that file after each successful creation, preserving data across server restarts.
API integration tests and Playwright browser tests verify creation, validation, persistence, error recovery, and navigation on desktop and mobile viewports.

## Contrato de la API

URL local: `http://127.0.0.1:3001`. Todas las respuestas son JSON.

| Método | Endpoint | Respuesta correcta | Errores |
| --- | --- | --- | --- |
| GET | `/api/eventos` | 200, arreglo de eventos | 500 |
| GET | `/api/eventos/:id` | 200, objeto evento | 404, 500 |
| POST | `/api/eventos` | 201, objeto creado + `Location` | 400, 413, 415, 500 |

Ejemplo de cuerpo para POST, con `Content-Type: application/json`:

```json
{
  "titulo": "Feria de proyectos",
  "descripcion": "Conoce los proyectos de programación móvil del semestre.",
  "fecha": "2026-11-20",
  "lugar": "Auditorio principal",
  "categoria": "Académico"
}
```

Cada respuesta de evento contiene estos campos y un `id` de texto asignado por el servidor. Se eliminan espacios al inicio y final de título, descripción y lugar. Límites: título 3–100 caracteres, descripción 10–1000 y lugar 3–120. La fecha debe ser una fecha real con formato `YYYY-MM-DD`; se permiten fechas pasadas para consultar la agenda histórica. Las categorías válidas son `Académico`, `Cultural` y `Deportivo`.

Ejemplo de validación (HTTP 400):

```json
{
  "message": "Revisa los campos del evento.",
  "errors": { "titulo": "Debe tener entre 3 y 100 caracteres." }
}
```

Prueba manual en PowerShell con la API encendida:

```powershell
Invoke-RestMethod http://127.0.0.1:3001/api/eventos
$evento = @{
  titulo = 'Feria de proyectos'
  descripcion = 'Conoce los proyectos de programación móvil del semestre.'
  fecha = '2026-11-20'
  lugar = 'Auditorio principal'
  categoria = 'Académico'
} | ConvertTo-Json
$creado = Invoke-RestMethod -Method Post -Uri http://127.0.0.1:3001/api/eventos -ContentType 'application/json; charset=utf-8' -Body ([System.Text.Encoding]::UTF8.GetBytes($evento))
Invoke-RestMethod "http://127.0.0.1:3001/api/eventos/$($creado.id)"
```

## Pruebas y compilación

```powershell
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

`npm test` inicia servidores temporales en puertos libres y utiliza datos aislados. Las pruebas E2E inician sus propios servidores: detén `npm run dev` antes de ejecutarlas. Sus datos se guardan en `test-results/`, sin alterar los eventos personales. Incluyen recorridos con API real y fallos simulados de red. Las capturas de escritorio y móvil se generan en `evidencias/`.

Para revisar el build: ejecuta `npm start` y, en otra terminal, `npm run preview`; abre `http://127.0.0.1:4173`. La carpeta compilada es `dist/`. El proxy del preview permite consumir la API local. Un despliegue externo necesitaría servir `/api` mediante un proxy y configurar el fallback de rutas de la SPA. `.env.example` documenta `VITE_API_URL`; usar una API de otro origen exige configurar CORS en ese servidor.

## Correspondencia con la rúbrica

| Criterio | Implementación | Verificación |
| --- | --- | --- |
| API Express GET + POST · 1.5 | `api/app.js`, validación y persistencia en `api/store.js` | `npm test`; ejemplos HTTP anteriores |
| Listar y crear con useState · 1.5 | `src/App.jsx`, `EventsPage` y `EventForm`; fetch en `src/api.js` | Creación E2E y lista actualizada |
| Errores y navegación · 1.5 | ErrorNotice, reintentos, timeout, DetailPage e Ionic Router | Pruebas E2E de red, validación, recarga y retorno |
| Architecture EN · 0.5 | Sección de diez oraciones en este README | Explica endpoints, consumo, estado y navegación |

## Archivos principales

```text
actividad-Corregida/
  api/
    app.js                 # Endpoints y validaciones
    server.js              # Arranque del servidor
    store.js               # Persistencia y datos iniciales
    tests/eventos.test.js  # Pruebas HTTP de integración
  src/
    App.jsx                # Pantallas, formulario y rutas Ionic
    api.js                 # Fetch, timeout y errores
    main.jsx               # Inicialización de Ionic React
    styles.css             # Diseño adaptable
  tests/events.spec.js     # Pruebas de navegador
  evidencias/              # Capturas y registro de verificación
  ENTREGA.md               # Pasos GitHub y CONFIG
  package-lock.json        # Dependencias reproducibles
```

Referencias: [navegación de Ionic React 8](https://ionicframework.com/docs/v8/react/navigation), [rutas de Express](https://expressjs.com/en/guide/routing.html), [useState](https://react.dev/reference/react/useState).
