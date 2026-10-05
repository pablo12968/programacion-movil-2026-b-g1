

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


