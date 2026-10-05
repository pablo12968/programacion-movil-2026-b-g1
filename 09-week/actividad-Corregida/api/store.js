import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export const seedEvents = [
  { id: '1', titulo: 'Ideas que transforman el campus', descripcion: 'Comparte soluciones creativas para nuestra universidad en un encuentro de innovación. Trae tus ideas y conoce estudiantes de otras carreras.', fecha: '2026-11-12', lugar: 'Auditorio principal', categoria: 'Académico' },
  { id: '2', titulo: 'Una tarde de música y arte', descripcion: 'Disfruta de las presentaciones de nuestros colectivos estudiantiles y de una exposición de arte creada en el campus.', fecha: '2026-11-14', lugar: 'Plazoleta central', categoria: 'Cultural' },
  { id: '3', titulo: 'Nos vemos en la cancha', descripcion: 'Una jornada de integración deportiva para toda la comunidad. Puedes asistir con tu equipo o conocer uno al llegar.', fecha: '2026-11-18', lugar: 'Polideportivo', categoria: 'Deportivo' },
];

// Cada escritura termina antes de atender otra petición y reemplaza el archivo
// completo. Adecuado para esta API educativa de un solo proceso.
export function createStore(file) {
  let events = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : structuredClone(seedEvents);
  if (!Array.isArray(events)) throw new Error('El archivo de eventos no contiene una lista.');
  function persist(next) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(`${file}.tmp`, JSON.stringify(next, null, 2), 'utf8');
    renameSync(`${file}.tmp`, file);
    events = next;
  }
  if (!existsSync(file)) persist(events);
  return { list: () => events, find: id => events.find(event => event.id === id), add(event) { persist([event, ...events]); return event; } };
}
