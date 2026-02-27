/**
 * @fileoverview Controlador de usuarios - Maneja autenticación y gestión de usuarios
 * @module controllers/usuarioController
 */

const Usuario = require('../models/Usuario');

// ============================================
// CONSTANTES
// ============================================

/** Códigos de estado HTTP */
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
};

/** Mensajes de error estándar */
const ERROR_MESSAGES = {
    CAMPOS_INCOMPLETOS: 'Por favor completa todos los campos obligatorios',
    PASSWORD_NO_COINCIDEN: 'Las contraseñas no coinciden',
    EMAIL_REGISTRADO: 'Este email ya está registrado',
    CREDENCIALES_INVALIDAS: 'Email o contraseña incorrectos',
    NO_AUTENTICADO: 'No has iniciado sesión',
    USUARIO_NO_ENCONTRADO: 'Usuario no encontrado',
    ERROR_REGISTRO: 'Error al registrar el usuario',
    ERROR_LOGIN: 'Error al iniciar sesión',
    ERROR_LOGOUT: 'Error al cerrar sesión',
    ERROR_OBTENER_INFO: 'Error al obtener información del usuario'
};

/** Longitud mínima de campos de texto */
const MIN_NOMBRE_LENGTH = 2;

// ============================================
// CONTROLADOR
// ============================================

/**
 * Controlador de Usuarios
 * @class UsuarioController
 * @description Maneja la lógica de negocio para registro, login y gestión de usuarios
 */
class UsuarioController {
    
    /**
     * Registra un nuevo usuario en el sistema
     * @async
     * @static
     * @param {Object} req - Objeto request de Express
     * @param {Object} req.body - Datos del formulario
     * @param {string} req.body.nombre - Nombre del usuario
     * @param {string} req.body.email - Email del usuario
     * @param {string} req.body.password - Contraseña
     * @param {string} req.body.confirmar_password - Confirmación de contraseña
     * @param {Object} res - Objeto response de Express
     * @returns {Promise<void>} JSON con usuario creado o mensaje de error
     * @route POST /api/usuarios/registro
     */
    static async registro(req, res) {
        try {
            const { nombre, email, password, confirmar_password } = req.body;

            // Validación 1: Campos obligatorios
            if (!nombre || !email || !password || !confirmar_password) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    error: ERROR_MESSAGES.CAMPOS_INCOMPLETOS,
                    camposFaltantes: {
                        nombre: !nombre,
                        email: !email,
                        password: !password,
                        confirmar_password: !confirmar_password
                    }
                });
            }

            // Validación 2: Longitud del nombre
            if (nombre.trim().length < MIN_NOMBRE_LENGTH) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    error: `El nombre debe tener al menos ${MIN_NOMBRE_LENGTH} caracteres`
                });
            }

            // Validación 3: Coincidencia de contraseñas
            if (password !== confirmar_password) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    error: ERROR_MESSAGES.PASSWORD_NO_COINCIDEN
                });
            }

            // Verificar si el email ya existe
            const usuarioExistente = await Usuario.buscarPorEmail(email);
            if (usuarioExistente) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    error: ERROR_MESSAGES.EMAIL_REGISTRADO
                });
            }

            // Crear el usuario (el modelo se encarga de validar y hashear)
            const nuevoUsuario = await Usuario.crear({ nombre, email, password });

            // Crear sesión automática después del registro
            req.session.userId = nuevoUsuario.id;
            req.session.userName = nuevoUsuario.nombre;

            res.status(HTTP_STATUS.CREATED).json({
                mensaje: 'Usuario registrado exitosamente',
                usuario: {
                    id: nuevoUsuario.id,
                    nombre: nuevoUsuario.nombre,
                    email: nuevoUsuario.email
                }
            });

        } catch (error) {
            console.error('[usuarioController.registro] Error:', error.message);
            
            res.status(HTTP_STATUS.INTERNAL_ERROR).json({
                error: ERROR_MESSAGES.ERROR_REGISTRO,
                detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Inicia sesión de un usuario existente
     * @async
     * @static
     * @param {Object} req - Objeto request de Express
     * @param {Object} req.body - Datos del formulario
     * @param {string} req.body.email - Email del usuario
     * @param {string} req.body.password - Contraseña
     * @param {Object} res - Objeto response de Express
     * @returns {Promise<void>} JSON con datos del usuario o mensaje de error
     * @route POST /api/usuarios/login
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validación 1: Campos obligatorios
            if (!email || !password) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    error: 'Por favor ingresa email y contraseña',
                    camposFaltantes: {
                        email: !email,
                        password: !password
                    }
                });
            }

            // Validación 2: Normalización de email
            const emailNormalizado = email.toLowerCase().trim();

            // Buscar el usuario por email
            const usuario = await Usuario.buscarPorEmail(emailNormalizado);
            if (!usuario) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    error: ERROR_MESSAGES.CREDENCIALES_INVALIDAS
                });
            }

            // Verificar la contraseña
            const passwordValido = await Usuario.verificarPassword(password, usuario.password);
            if (!passwordValido) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    error: ERROR_MESSAGES.CREDENCIALES_INVALIDAS
                });
            }

            // Crear sesión
            req.session.userId = usuario.id;
            req.session.userName = usuario.nombre;

            res.status(HTTP_STATUS.OK).json({
                mensaje: 'Inicio de sesión exitoso',
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email
                }
            });

        } catch (error) {
            console.error('[usuarioController.login] Error:', error.message);
            
            res.status(HTTP_STATUS.INTERNAL_ERROR).json({
                error: ERROR_MESSAGES.ERROR_LOGIN,
                detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Cierra la sesión del usuario actual
     * @async
     * @static
     * @param {Object} req - Objeto request de Express con sesión activa
     * @param {Object} res - Objeto response de Express
     * @returns {Promise<void>} JSON con mensaje de confirmación
     * @route POST /api/usuarios/logout
     */
    static async logout(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    console.error('[usuarioController.logout] Error al destruir sesión:', err);
                    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
                        error: ERROR_MESSAGES.ERROR_LOGOUT
                    });
                }
                
                res.status(HTTP_STATUS.OK).json({ 
                    mensaje: 'Sesión cerrada exitosamente' 
                });
            });
        } catch (error) {
            console.error('[usuarioController.logout] Error:', error.message);
            res.status(HTTP_STATUS.INTERNAL_ERROR).json({
                error: ERROR_MESSAGES.ERROR_LOGOUT
            });
        }
    }

    /**
     * Obtiene información del usuario actualmente autenticado
     * @async
     * @static
     * @param {Object} req - Objeto request de Express
     * @param {Object} req.session - Sesión con userId
     * @param {Object} res - Objeto response de Express
     * @returns {Promise<void>} JSON con datos del usuario
     * @route GET /api/usuarios/me
     */
    static async obtenerUsuarioActual(req, res) {
        try {
            // Validar que existe sesión activa
            if (!req.session.userId) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    error: ERROR_MESSAGES.NO_AUTENTICADO
                });
            }

            // Buscar usuario por ID de sesión
            const usuario = await Usuario.buscarPorId(req.session.userId);
            
            if (!usuario) {
                // La sesión tiene un userId inválido, destruir sesión
                req.session.destroy();
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    error: ERROR_MESSAGES.USUARIO_NO_ENCONTRADO
                });
            }

            // Responder con datos del usuario (sin contraseña)
            res.status(HTTP_STATUS.OK).json({ 
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    fecha_registro: usuario.fecha_registro
                }
            });

        } catch (error) {
            console.error('[usuarioController.obtenerUsuarioActual] Error:', error.message);
            res.status(HTTP_STATUS.INTERNAL_ERROR).json({
                error: ERROR_MESSAGES.ERROR_OBTENER_INFO,
                detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Obtiene la lista de todos los usuarios registrados
     * @async
     * @static
     * @param {Object} req - Objeto request de Express
     * @param {Object} res - Objeto response de Express
     * @returns {Promise<void>} JSON con array de usuarios
     * @route GET /api/usuarios
     */
    static async obtenerTodos(req, res) {
        try {
            const usuarios = await Usuario.obtenerTodos();
            
            // Filtrar información sensible (contraseñas)
            const usuariosFiltrados = usuarios.map(usuario => ({
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                fecha_registro: usuario.fecha_registro
            }));
            
            res.status(HTTP_STATUS.OK).json({ 
                usuarios: usuariosFiltrados,
                total: usuariosFiltrados.length
            });
            
        } catch (error) {
            console.error('[usuarioController.obtenerTodos] Error:', error.message);
            res.status(HTTP_STATUS.INTERNAL_ERROR).json({
                error: 'Error al obtener usuarios',
                detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

module.exports = UsuarioController;
