import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { createApp } from '../app.js';
import { createStore } from '../store.js';

const valid = { titulo: 'Feria de proyectos', descripcion: 'Presentación de proyectos de programación móvil.', fecha: '2026-11-20', lugar: 'Bloque de ingeniería', categoria: 'Académico' };

async function fixture(t, customStore) {
  const directory = mkdtempSync(join(tmpdir(), 'unieventos-test-'));
  const file = join(directory, 'eventos.json');
  const server = createApp(customStore || createStore(file)).listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(async () => { await new Promise(resolve => server.close(resolve)); rmSync(directory, { recursive: true, force: true }); });
  const url = `http://127.0.0.1:${server.address().port}`;
  return { file, get: path => fetch(`${url}${path}`), post: (body, headers = { 'Content-Type': 'application/json' }) => fetch(`${url}/api/eventos`, { method: 'POST', headers, body }) };
}

test('GET devuelve eventos JSON y GET por ID devuelve el detalle', async t => {
  const api = await fixture(t);
  const response = await api.get('/api/eventos');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /application\/json/);
  const events = await response.json();
  assert.equal(events.length, 3);
  assert.deepEqual(await (await api.get(`/api/eventos/${events[0].id}`)).json(), events[0]);
});

test('POST crea, recorta espacios, genera ID, lista y persiste al reabrir el almacén', async t => {
  const api = await fixture(t);
  const response = await api.post(JSON.stringify({ ...valid, titulo: `  ${valid.titulo}  `, id: 'no-controlado-por-cliente' }));
  assert.equal(response.status, 201);
  const created = await response.json();
  assert.equal(created.titulo, valid.titulo);
  assert.notEqual(created.id, 'no-controlado-por-cliente');
  assert.equal(response.headers.get('location'), `/api/eventos/${created.id}`);
  assert.equal((await (await api.get('/api/eventos')).json()).length, 4);
  assert.deepEqual(createStore(api.file).find(created.id), created);
});

test('POST rechaza campos vacíos, tipos incorrectos, categorías y fechas imposibles sin insertar', async t => {
  const api = await fixture(t);
  for (const body of [{}, null, { ...valid, titulo: '   ' }, { ...valid, lugar: 22 }, { ...valid, descripcion: 'a'.repeat(1001) }, { ...valid, categoria: 'Otra' }, { ...valid, fecha: '2026-02-30' }, { ...valid, fecha: 'no-fecha' }]) {
    const response = await api.post(JSON.stringify(body));
    assert.equal(response.status, 400);
    assert.ok((await response.json()).message);
  }
  assert.equal((await (await api.get('/api/eventos')).json()).length, 3);
});

test('JSON mal formado, tipo incorrecto y cuerpos demasiado grandes tienen errores JSON', async t => {
  const api = await fixture(t);
  assert.equal((await api.post('{')).status, 400);
  assert.equal((await api.post('texto', { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await api.post(JSON.stringify({ ...valid, descripcion: 'a'.repeat(18000) }))).status, 413);
});

test('ID y ruta desconocidos devuelven 404 JSON', async t => {
  const api = await fixture(t);
  for (const path of ['/api/eventos/no-existe', '/api/desconocida']) {
    const response = await api.get(path);
    assert.equal(response.status, 404);
    assert.ok((await response.json()).message);
  }
});

test('un fallo al guardar responde 500 sin exponer detalles internos', async t => {
  const api = await fixture(t, { add() { throw new Error('fallo simulado de almacenamiento'); } });
  const response = await api.post(JSON.stringify(valid));
  assert.equal(response.status, 500);
  assert.equal((await response.json()).message, 'No fue posible completar la operación. Inténtalo de nuevo.');
});
