// Cargar variables de entorno
require('dotenv').config(); // Cargar desde .env en la raíz del proyecto

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./models/User"); // Modelo de usuario
const Duda = require("./models/Duda");
const Encuesta = require("./models/Encuesta");
const QuejaSugerencia = require("./models/QuejaSugerencia");

const quejasSugerenciasRoutes = require('./routes/QuejaSugerenciaRoute');
const encuestasRoutes = require('./routes/EncuestaRoute');
const dudasRoutes = require('./routes/DudasRoute');

const app = express();
app.use(bodyParser.json());

// Clave secreta para JWT (usar variable de entorno)
const SECRET_KEY = process.env.SECRET_KEY || "clave_secreta";

// Middleware
app.use(cors({ origin: ["http://localhost:4000", "http://localhost:3000" ,"https://mentestranquilas.vercel.app"], credentials: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, '/public')));
app.use('/quejasSugerencias', quejasSugerenciasRoutes);
app.use('/encuestas', encuestasRoutes);
app.use('/dudas', dudasRoutes);

const pages = [
    "index.html", "Acceder", "beneficios", "canalesAtencion", "mensaje",
    "opciones", "quienes", "register", "sintomas", "TuCuenta"
];

app.get("/:page", (req, res) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, "../public", `${page}.html`);

    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send("Página no encontrada");
        }
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});


// Middleware para autenticación
const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
        req.user = decoded; // Añadir los datos del usuario al request
        next();
    } catch (error) {
        res.status(403).json({ message: "Token inválido o expirado." });
    }
};

// Ruta de registro
app.post("/register", async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El correo ya está registrado." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ email, username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Usuario registrado con éxito." });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
});

// Ruta de inicio de sesión
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Correo no registrado." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta." });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({ message: "Inicio de sesión exitoso.", token, username: user.username });
    } catch (error) {
        console.error("Error en inicio de sesión:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
});

// Ruta para guardar la respuesta de la encuesta
app.post("/guardarRespuesta", async (req, res) => {
    const { username, respuesta } = req.body;

    if (!username || !respuesta) {
        return res.status(400).json({ error: "Faltan datos." });
    }

    try {
        // Verificar si el usuario ya ha respondido
        const existente = await Encuesta.findOne({ username });

        if (existente) {
            return res.status(400).json({ error: "Ya has votado." });
        }

        const nuevaEncuesta = new Encuesta({ username, respuesta });
        await nuevaEncuesta.save();
        res.status(201).json({ message: "Respuesta guardada con éxito." });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor." });
    }
});

// Ruta para verificar si un usuario ya votó
app.get("/verificarRespuesta", async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: "Falta el nombre de usuario." });
    }

    try {
        const respuesta = await Encuesta.findOne({ username });
        res.json({ respuesta: respuesta ? respuesta.respuesta : null });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor." });
    }
});

// Conexión a MongoDB
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 50000, // Tiempo de espera de 50 segundos
    })
    .then(() => console.log("Conectado a MongoDB"))
    .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});