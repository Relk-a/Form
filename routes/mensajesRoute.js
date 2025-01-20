const express = require("express");
const Mensaje = require("../models/Mensaje");

const router = express.Router();

// Endpoint para guardar mensajes
router.post("/", async (req, res) => {
  try {
    const { nombreUsuario, tipo, contenido, respuestaSiNo } = req.body;

    if (!nombreUsuario || !tipo || !contenido) {
      return res.status(400).json({ error: "Faltan datos requeridos." });
    }

    // Crear y guardar el mensaje
    const nuevoMensaje = new Mensaje({
      nombreUsuario,
      tipo,
      contenido,
      respuestaSiNo: tipo === "pregunta" ? respuestaSiNo : undefined, // Solo aplica para preguntas
    });

    await nuevoMensaje.save();
    res.status(201).json({ mensaje: "Mensaje guardado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar el mensaje." });
  }
});

module.exports = router;
