const express = require('express');
const router = express.Router();
const QuejaSugerencia = require('../models/QuejaSugerencia');
const { body, validationResult } = require('express-validator');

router.post('/guardar', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio.'),
    body('correo').isEmail().withMessage('El correo debe ser válido.'),
    body('mensaje').notEmpty().withMessage('El mensaje es obligatorio.'),
    body('opciones').isArray({ min: 1 }).withMessage('Debe proporcionar al menos una opción.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { nombre, correo, mensaje, opciones } = req.body;

        const nuevaEntrada = new QuejaSugerencia({ nombre, correo, mensaje, opciones });
        await nuevaEntrada.save();

        res.status(201).json({ message: 'Datos guardados exitosamente.' });
    } catch (error) {
        console.error('Error al guardar los datos:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = router;