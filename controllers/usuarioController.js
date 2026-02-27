/**
 * Controlador de Usuarios
 * Maneja la lógica de negocio para registro, login y gestión de usuarios
 */

const Usuario = require('../models/Usuario');

class UsuarioController {
    /**
     * Registrar un nuevo usuario
     * POST /api/usuarios/registro
     */
    static async registro(req, res) {
        try {
            const { nombre, email, password, confirmar_password } = req.body;

            // Validaciones básicas
            if (!nombre || !email || !password) {
                return res.status(400).json({
                    error: 'Por favor completa todos los campos'
                });
            }

            // Verificar que las contraseñas coincidan
            if (password !== confirmar_password) {
                return res.status(400).json({
                    error: 'Las contraseñas no coinciden'
                });
            }

            // Verificar si el email ya está registrado
            const usuarioExistente = await Usuario.buscarPorEmail(email);
            if (usuarioExistente) {
                return res.status(400).json({
                    error: 'Este email ya está registrado'
                });
            }

            // Crear el usuario
            const nuevoUsuario = await Usuario.crear({ nombre, email, password });

            // Crear sesión automáticamente después del registro
            req.session.userId = nuevoUsuario.id;
            req.session.userName = nuevoUsuario.nombre;

            res.status(201).json({
                mensaje: 'Usuario registrado exitosamente',
                usuario: nuevoUsuario
            });

        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({
                error: 'Error al registrar el usuario'
            });
        }
    }

    /**
     * Iniciar sesión
     * POST /api/usuarios/login
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validaciones básicas
            if (!email || !password) {
                return res.status(400).json({
                    error: 'Por favor ingresa email y contraseña'
                });
            }

            // Buscar el usuario
            const usuario = await Usuario.buscarPorEmail(email);
            if (!usuario) {
                return res.status(401).json({
                    error: 'Email o contraseña incorrectos'
                });
            }

            // Verificar la contraseña
            const passwordValido = await Usuario.verificarPassword(password, usuario.password);
            if (!passwordValido) {
                return res.status(401).json({
                    error: 'Email o contraseña incorrectos'
                });
            }

            // Crear sesión
            req.session.userId = usuario.id;
            req.session.userName = usuario.nombre;

            res.json({
                mensaje: 'Inicio de sesión exitoso',
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email
                }
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                error: 'Error al iniciar sesión'
            });
        }
    }

    /**
     * Cerrar sesión
     * POST /api/usuarios/logout
     */
    static async logout(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({
                        error: 'Error al cerrar sesión'
                    });
                }
                res.json({ mensaje: 'Sesión cerrada exitosamente' });
            });
        } catch (error) {
            console.error('Error en logout:', error);
            res.status(500).json({
                error: 'Error al cerrar sesión'
            });
        }
    }

    /**
     * Obtener información del usuario actual
     * GET /api/usuarios/me
     */
    static async obtenerUsuarioActual(req, res) {
        try {
            if (!req.session.userId) {
                return res.status(401).json({
                    error: 'No has iniciado sesión'
                });
            }

            const usuario = await Usuario.buscarPorId(req.session.userId);
            
            if (!usuario) {
                return res.status(404).json({
                    error: 'Usuario no encontrado'
                });
            }

            res.json({ usuario });

        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json({
                error: 'Error al obtener información del usuario'
            });
        }
    }

    /**
     * Obtener todos los usuarios
     * GET /api/usuarios
     */
    static async obtenerTodos(req, res) {
        try {
            const usuarios = await Usuario.obtenerTodos();
            res.json({ usuarios });
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({
                error: 'Error al obtener usuarios'
            });
        }
    }
}

module.exports = UsuarioController;
