const mongoose = require('mongoose');

const dudaSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true,
        trim: true,
    },
    apellido: { 
        type: String, 
        required: true,
        trim: true,
    },
    correo: { 
        type: String, 
        required: true,
        match: [/.+\@.+\..+/, "Por favor, ingrese un correo válido."],
        trim: true,
    },
    mensaje: { 
        type: String, 
        required: true,
        trim: true,
    },
    fecha: { 
        type: Date, 
        default: Date.now,
        index: true, // Añadir índice para consultas por fecha
    }
});

module.exports = mongoose.model('Duda', dudaSchema);