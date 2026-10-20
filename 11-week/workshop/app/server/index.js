// Arranque del servidor: `npm run server` (ya viene hecho; no es necesario modificarlo).
const { createApp } = require('./app');

const PORT = process.env.PORT || 3000;

createApp().listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
