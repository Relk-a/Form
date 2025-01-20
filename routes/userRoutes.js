const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Importa tu modelo de usuario

// Ruta para registrar un usuario
router.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Validación de campos
        if (!email || !username || !password) {
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }

        // Comprobar si el usuario ya existe
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "El usuario ya existe" });
        }

        // Crear un nuevo usuario
        const newUser = new User({ email, username, password });
        await newUser.save();

        // Respuesta exitosa
        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
        console.error("Error en /register:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
});

module.exports = router;
