const express = require('express');
const router = express.Router();
const QuejaSugerencia = require('../models/QuejaSugerencia');

router.post('/guardar', async (req, res) => {
    try {
        const { nombre, correo, mensaje, opciones } = req.body;

        if (!nombre || !correo || !mensaje || !opciones) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        const nuevaEntrada = new QuejaSugerencia({ nombre, correo, mensaje, opciones });
        await nuevaEntrada.save();

        res.status(201).json({ message: 'Datos guardados exitosamente.' });
    } catch (error) {
        console.error('Error al guardar los datos:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = router;
