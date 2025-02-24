const jwt = require('jsonwebtoken');

// Middleware para autenticar al usuario mediante JWT
const autenticarUsuario = (req, res, next) => {
    // Obtener el token del encabezado de autorización
    const authHeader = req.headers['authorization'];

    // Verificar si el token existe
    if (!authHeader) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    // Verificar que el token tenga el formato correcto (Bearer Token)
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Formato de token inválido. Debe ser "Bearer <token>".' });
    }

    const token = tokenParts[1]; // Extraer el token

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.SECRET_KEY || 'clave_secreta');

        // Asignar el ID del usuario al objeto `req` para su uso en rutas posteriores
        req.userId = decoded.id;

        // Si hay más información en el token (como roles, email, etc.), se puede añadir aquí
        if (decoded.email) {
            req.userEmail = decoded.email;
        }

        // Continuar con la siguiente función en la cadena de middlewares
        next();
    } catch (error) {
        // Manejar errores específicos de JWT
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ error: 'Token expirado. Por favor, inicie sesión nuevamente.' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: 'Token inválido.' });
        } else {
            console.error('Error al verificar el token:', error);
            return res.status(500).json({ error: 'Error interno del servidor al autenticar.' });
        }
    }
};

module.exports = autenticarUsuario;