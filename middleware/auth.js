/**
 * Middleware de autenticación
 * Verifica que el usuario esté autenticado antes de acceder a ciertas rutas
 */

const verificarAutenticacion = (req, res, next) => {
    if (req.session && req.session.userId) {
        // Usuario autenticado, continuar
        next();
    } else {
        // Usuario no autenticado
        res.status(401).json({
            error: 'No autorizado. Por favor inicia sesión.',
            autenticado: false
        });
    }
};

module.exports = { verificarAutenticacion };
