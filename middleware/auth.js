/**
 * @fileoverview Middleware de autenticación y autorización
 * @module middleware/auth
 */

/**
 * Verifica que el usuario esté autenticado antes de permitir el acceso
 * @function verificarAutenticacion
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 * @returns {void}
 */
const verificarAutenticacion = (req, res, next) => {
    // Verificar si existe sesión activa con usuario autenticado
    if (req.session && req.session.userId) {
        // Usuario autenticado, continuar con la petición
        return next();
    }
    
    // Usuario no autenticado, denegar acceso
    return res.status(401).json({
        error: 'No autorizado. Debes iniciar sesión para acceder a este recurso.',
        autenticado: false,
        requiereLogin: true
    });
};

/**
 * Middleware opcional: Agregar información de usuario a la petición si está autenticado
 * @function agregarUsuarioSiAutenticado
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 * @returns {void}
 */
const agregarUsuarioSiAutenticado = (req, res, next) => {
    if (req.session && req.session.userId) {
        req.usuario = {
            id: req.session.userId,
            nombre: req.session.userName
        };
    }
    next();
};

module.exports = { 
    verificarAutenticacion,
    agregarUsuarioSiAutenticado
};
