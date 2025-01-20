// models/QuejaSugerencia.js
const mongoose = require('mongoose');

const quejaSugerenciaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    mensaje: { type: String, required: true },
    opciones: { type: [String], required: true },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuejaSugerencia', quejaSugerenciaSchema);
