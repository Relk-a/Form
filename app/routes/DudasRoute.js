const express = require('express');
const router = express.Router();
const Duda = require('../models/Duda');
const { body, validationResult } = require('express-validator');

router.post('/guardar', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio.'),
    body('apellido').notEmpty().withMessage('El apellido es obligatorio.'),
    body('correo').isEmail().withMessage('El correo debe ser válido.'),
    body('mensaje').notEmpty().withMessage('El mensaje es obligatorio.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { nombre, apellido, correo, mensaje } = req.body;

        const nuevaDuda = new Duda({ nombre, apellido, correo, mensaje });
        await nuevaDuda.save();

        res.status(201).json({ message: 'Duda guardada exitosamente.' });
    } catch (error) {
        console.error('Error al guardar la duda:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = router;