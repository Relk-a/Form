const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "El correo es obligatorio."],
        unique: true,
        match: [/.+\@.+\..+/, "Por favor, ingrese un correo válido."],
        trim: true,
        index: true, // Añadir índice para consultas por correo
    },
    username: {
        type: String,
        required: [true, "El nombre de usuario es obligatorio."],
        minlength: [3, "El nombre de usuario debe tener al menos 3 caracteres."],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria."],
    },
}, { timestamps: true });

// Añadir índice compuesto si es necesario
userSchema.index({ email: 1, username: 1 });

const User = mongoose.model("Usuarios", userSchema);

module.exports = User;