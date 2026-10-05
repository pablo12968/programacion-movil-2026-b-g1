import express from 'express';
import { randomUUID } from 'node:crypto';

export function validateEvent(body) {
  const errors = {};
  const data = {};
  const limits = { titulo: [3, 100], descripcion: [10, 1000], lugar: [3, 120] };
  for (const [field, [min, max]] of Object.entries(limits)) {
    data[field] = typeof body?.[field] === 'string' ? body[field].trim() : '';
    if (data[field].length < min || data[field].length > max) errors[field] = `Debe tener entre ${min} y ${max} caracteres.`;
  }
  data.fecha = typeof body?.fecha === 'string' ? body.fecha : '';
  const date = new Date(`${data.fecha}T12:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.fecha) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== data.fecha) errors.fecha = 'Selecciona una fecha válida.';
  data.categoria = body?.categoria;
  if (!['Académico', 'Cultural', 'Deportivo'].includes(data.categoria)) errors.categoria = 'Selecciona una categoría válida.';
  return { errors, data };
}

export function createApp(store) {
  const app = express();
  app.disable('x-powered-by');
  // La app local consume /api mediante el proxy de Vite (mismo origen).
  app.use(express.json({ limit: '16kb' }));
  app.get('/api/eventos', (_req, res) => res.json(store.list()));
  app.get('/api/eventos/:id', (req, res) => {
    const event = store.find(req.params.id);
    if (!event) return res.status(404).json({ message: 'El evento no existe.' });
    res.json(event);
  });
  app.post('/api/eventos', (req, res) => {
    if (!req.is('application/json')) return res.status(415).json({ message: 'Envía el cuerpo como application/json.' });
    const { errors, data } = validateEvent(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Revisa los campos del evento.', errors });
    const event = store.add({ id: randomUUID(), ...data });
    res.status(201).location(`/api/eventos/${event.id}`).json(event);
  });
  app.use((_req, res) => res.status(404).json({ message: 'La ruta solicitada no existe.' }));
  app.use((error, _req, res, _next) => {
    if (error.type === 'entity.parse.failed') return res.status(400).json({ message: 'El JSON enviado no es válido.' });
    if (error.type === 'entity.too.large') return res.status(413).json({ message: 'El contenido supera el límite permitido.' });
    console.error('Error de la API:', error.message);
    res.status(500).json({ message: 'No fue posible completar la operación. Inténtalo de nuevo.' });
  });
  return app;
}
