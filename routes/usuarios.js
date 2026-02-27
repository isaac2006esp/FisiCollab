/**
 * Rutas de Usuarios
 * Define todos los endpoints relacionados con usuarios
 */

const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');
const { verificarAutenticacion } = require('../middleware/auth');

// Rutas públicas (no requieren autenticación)
router.post('/registro', UsuarioController.registro);
router.post('/login', UsuarioController.login);

// Rutas protegidas (requieren autenticación)
router.post('/logout', verificarAutenticacion, UsuarioController.logout);
router.get('/me', verificarAutenticacion, UsuarioController.obtenerUsuarioActual);
router.get('/', verificarAutenticacion, UsuarioController.obtenerTodos);

module.exports = router;
