/**
 * Rutas de Recursos
 * Define todos los endpoints relacionados con recursos académicos
 */

const express = require('express');
const router = express.Router();
const RecursoController = require('../controllers/recursoController');
const { verificarAutenticacion } = require('../middleware/auth');

// Obtener lista de cursos (público)
router.get('/cursos/lista', RecursoController.obtenerCursos);

// Rutas protegidas - requieren autenticación
router.post('/', verificarAutenticacion, RecursoController.crear);
router.get('/', RecursoController.obtenerTodos); // Puede ser público o protegido según preferencia
router.get('/mis-recursos', verificarAutenticacion, RecursoController.obtenerMisRecursos);
router.get('/:id', RecursoController.obtenerPorId);
router.put('/:id', verificarAutenticacion, RecursoController.actualizar);
router.delete('/:id', verificarAutenticacion, RecursoController.eliminar);

module.exports = router;
