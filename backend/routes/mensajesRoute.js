const express = require("express");
const router = express.Router();
const Mensaje = require("../models/Mensaje");
const { body, validationResult } = require('express-validator');

router.post("/", [
    body('nombreUsuario').notEmpty().withMessage('El nombre de usuario es obligatorio.'),
    body('tipo').notEmpty().withMessage('El tipo es obligatorio.'),
    body('contenido').notEmpty().withMessage('El contenido es obligatorio.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { nombreUsuario, tipo, contenido, respuestaSiNo } = req.body;

        const nuevoMensaje = new Mensaje({
            nombreUsuario,
            tipo,
            contenido,
            respuestaSiNo: tipo === "pregunta" ? respuestaSiNo : undefined,
        });

        await nuevoMensaje.save();
        res.status(201).json({ mensaje: "Mensaje guardado exitosamente." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al guardar el mensaje." });
    }
});

module.exports = router;