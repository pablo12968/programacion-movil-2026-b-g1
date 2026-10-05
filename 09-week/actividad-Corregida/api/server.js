import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
import { createStore } from './store.js';

const file = process.env.DATA_FILE || fileURLToPath(new URL('./data/eventos.json', import.meta.url));
const port = Number(process.env.PORT || 3001);
const server = createApp(createStore(file)).listen(port, '127.0.0.1', () => {
  console.log(`UniEventos API: http://127.0.0.1:${port}/api/eventos`);
});
server.on('error', error => { console.error(`No se pudo iniciar la API: ${error.message}`); process.exitCode = 1; });
