const mongoose = require('mongoose');

const quejaSugerenciaSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true,
        trim: true, // Eliminar espacios en blanco al inicio y final
    },
    correo: { 
        type: String, 
        required: true,
        match: [/.+\@.+\..+/, "Por favor, ingrese un correo válido."], // Validar formato de correo
        trim: true,
    },
    mensaje: { 
        type: String, 
        required: true,
        trim: true,
    },
    opciones: { 
        type: [String], 
        required: true,
        validate: {
            validator: function(v) {
                return v.length > 0; // Asegurar que haya al menos una opción
            },
            message: 'Debe proporcionar al menos una opción.'
        }
    },
    fecha: { 
        type: Date, 
        default: Date.now,
        index: true, // Añadir índice para consultas por fecha
    }
});

module.exports = mongoose.model('QuejaSugerencia', quejaSugerenciaSchema);