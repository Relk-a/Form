const express = require('express');
const router = express.Router();
const Encuesta = require('../models/Encuesta');
const autenticarUsuario = require('../middlewares/autenticarUsuario'); // Middleware para autenticación

router.post('/guardarRespuesta', autenticarUsuario, async (req, res) => {
    try {
        const { respuesta } = req.body;

        if (!['SI', 'NO'].includes(respuesta)) {
            return res.status(400).json({ error: 'Respuesta inválida.' });
        }

        const nuevaEncuesta = new Encuesta({
            usuario: req.userId, // Asume que req.userId viene del middleware
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
