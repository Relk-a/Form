const mongoose = require('mongoose');

const EncuestaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
        index: true, // Añadir índice para mejorar consultas
    },
    respuesta: {
        type: String,
        enum: ['SI', 'NO'],
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now,
        index: true, // Añadir índice para consultas por fecha
    },
});

// Añadir índice compuesto si es necesario
EncuestaSchema.index({ usuario: 1, fecha: 1 });

module.exports = mongoose.model('Encuesta', EncuestaSchema);