const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const SECRET_KEY = "clave_secreta"; // Asegúrate de usar una clave secreta segura

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
router.post("/register", async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    try {
        // Verificar si el correo ya está registrado
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El correo ya está registrado." });
        }

        // Encriptar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Crear y guardar el usuario
        const user = new User({ email, username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "Usuario registrado con éxito." });
    } catch (error) {
        console.error("Error al registrar usuario:", error);

        if (error.code === 11000) {
            // Error de duplicado (email o username ya existen)
            return res.status(400).json({ message: "El usuario o correo ya están registrados." });
        }

        res.status(500).json({ message: "Error interno del servidor." });
    }
});

// Ruta de inicio de sesión
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    try {
        // Buscar el usuario por su correo
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Comparar la contraseña ingresada con la encriptada en la base de datos
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta." });
        }

        // Generar un token JWT
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
    // En aplicaciones sin almacenamiento de tokens en el servidor, el cierre de sesión es responsabilidad del cliente.
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
