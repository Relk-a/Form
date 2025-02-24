const express = require('express');
const router = express.Router();
const Encuesta = require('../models/Encuesta');
const autenticarUsuario = require('../middlewares/autenticarUsuario');
const { body, validationResult } = require('express-validator');

router.post('/guardarRespuesta', autenticarUsuario, [
    body('respuesta').isIn(['SI', 'NO']).withMessage('Respuesta inválida.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { respuesta } = req.body;

        const nuevaEncuesta = new Encuesta({
            usuario: req.userId,
            respuesta,
        });

        await nuevaEncuesta.save();
        res.status(201).json({ message: 'Respuesta guardada exitosamente.' });
    } catch (error) {
        console.error('Error al guardar la respuesta:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = router;