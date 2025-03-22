const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { body, validationResult } = require('express-validator');

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || "clave_secreta"; // Usar variable de entorno para la clave secreta

// Middleware para verificar el token JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado." });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido o expirado." });
        }
        req.user = user;
        next();
    });
};

// Ruta de registro
router.post("/register", [
    body('email').isEmail().withMessage('El correo debe ser válido.'),
    body('username').notEmpty().withMessage('El nombre de usuario es obligatorio.'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, username, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El correo ya está registrado." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({ email, username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "Usuario registrado con éxito." });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

// Ruta de inicio de sesión
router.post("/login", [
    body('email').isEmail().withMessage('El correo debe ser válido.'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta." });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
            expiresIn: "1h",
        });

        res.status(200).json({
            message: "Inicio de sesión exitoso.",
            token,
            username: user.username,
        });
    } catch (error) {
        console.error("Error en inicio de sesión:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

// Ruta de cierre de sesión
router.post("/logout", (req, res) => {
    res.status(200).json({ message: "Sesión cerrada exitosamente." });
});

// Ruta protegida de ejemplo
router.get("/perfil", authenticateToken, (req, res) => {
    res.status(200).json({
        message: "Acceso permitido a tu perfil.",
        user: req.user,
    });
});

module.exports = router;