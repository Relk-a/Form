const mongoose = require('mongoose');

const EncuestaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', // Asegúrate de que el modelo de Usuario esté bien definido
        required: true,
    },
    respuesta: {
        type: String,
        enum: ['SI', 'NO'], // Solo puede ser 'SI' o 'NO'
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Encuesta', EncuestaSchema);
