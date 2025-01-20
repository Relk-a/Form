const jwt = require('jsonwebtoken');
const SECRET_KEY = 'clave_secreta'; // Usa la clave secreta real

const autenticarUsuario = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY); // Decodifica el token
        req.userId = decoded.id; // Asigna el userId del token a req.userId
        next(); // Llama a la siguiente función en la cadena de middlewares
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
};

module.exports = autenticarUsuario;

