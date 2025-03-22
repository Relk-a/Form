const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');

// Ruta para registrar un usuario
router.post("/register", [
    body('email').isEmail().withMessage('El correo debe ser válido.'),
    body('username').notEmpty().withMessage('El nombre de usuario es obligatorio.'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "El usuario ya existe" });
        }

        const newUser = new User({ email, username, password });
        await newUser.save();

        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
        console.error("Error en /register:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
});

module.exports = router;