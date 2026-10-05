const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let eventos = [
  {
    id: 1,
    nombre: "Feria de Tecnología",
    descripcion: "Evento académico sobre tecnología e innovación.",
    fecha: "2026-10-20",
    lugar: "Universidad CORHUILA"
  },
  {
    id: 2,
    nombre: "Taller de Programación",
    descripcion: "Taller práctico de desarrollo de aplicaciones.",
    fecha: "2026-10-25",
    lugar: "Laboratorio de Sistemas"
  }
];

app.get("/", (req, res) => {
  res.json({
    mensaje: "API de Eventos funcionando correctamente"
  });
});

app.get("/api/eventos", (req, res) => {
  res.json(eventos);
});

app.post("/api/eventos", (req, res) => {
  const { nombre, descripcion, fecha, lugar } = req.body;

  if (!nombre || !descripcion || !fecha || !lugar) {
    return res.status(400).json({
      error: "Todos los campos son obligatorios."
    });
  }

  const nuevoEvento = {
    id: eventos.length > 0 ? eventos[eventos.length - 1].id + 1 : 1,
    nombre,
    descripcion,
    fecha,
    lugar
  };

  eventos.push(nuevoEvento);

  res.status(201).json(nuevoEvento);
});

app.listen(PORT, () => {
  console.log(`API ejecutándose en http://localhost:${PORT}`);
});
