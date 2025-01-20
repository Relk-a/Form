// models/Duda.js
const mongoose = require('mongoose');

const dudaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    correo: { type: String, required: true },
    mensaje: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Duda', dudaSchema);
