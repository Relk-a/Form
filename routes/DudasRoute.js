const express = require('express');
const router = express.Router();
const Duda = require('../models/Duda');

router.post('/guardar', async (req, res) => {
    try {
        const { nombre, apellido, correo, mensaje } = req.body;

        if (!nombre || !apellido || !correo || !mensaje) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        const nuevaDuda = new Duda({ nombre, apellido, correo, mensaje });
        await nuevaDuda.save();

        res.status(201).json({ message: 'Duda guardada exitosamente.' });
    } catch (error) {
        console.error('Error al guardar la duda:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = router;
