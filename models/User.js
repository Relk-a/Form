const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "El correo es obligatorio."],
        unique: true,
        match: [/.+\@.+\..+/, "Por favor, ingrese un correo válido."]
    },
    username: {
        type: String,
        required: [true, "El nombre de usuario es obligatorio."],
        minlength: [3, "El nombre de usuario debe tener al menos 3 caracteres."]
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria."],
    },
}, { timestamps: true }); // Agrega timestamps para createdAt y updatedAt

const User = mongoose.model("Usuarios", userSchema);

module.exports = User;
