/**
 * Controlador de Recursos
 * Maneja la lógica de negocio para CRUD de recursos académicos
 */

const Recurso = require('../models/Recurso');

class RecursoController {
    /**
     * Crear un nuevo recurso
     * POST /api/recursos
     */
    static async crear(req, res) {
        try {
            // Verificar que el usuario esté autenticado
            if (!req.session.userId) {
                return res.status(401).json({
                    error: 'Debes iniciar sesión para agregar recursos'
                });
            }

            const { titulo, descripcion, enlace, curso, tipo } = req.body;

            // Validaciones básicas
            if (!titulo || !descripcion || !enlace || !curso || !tipo) {
                return res.status(400).json({
                    error: 'Por favor completa todos los campos'
                });
            }

            // Crear el recurso asociado al usuario actual
            const nuevoRecurso = await Recurso.crear({
                titulo,
                descripcion,
                enlace,
                curso,
                tipo,
                usuario_id: req.session.userId
            });

            res.status(201).json({
                mensaje: 'Recurso creado exitosamente',
                recurso: nuevoRecurso
            });

        } catch (error) {
            console.error('Error al crear recurso:', error);
            res.status(500).json({
                error: 'Error al crear el recurso'
            });
        }
    }

    /**
     * Obtener todos los recursos o filtrados por curso
     * GET /api/recursos
     * GET /api/recursos?curso=NombreCurso
     */
    static async obtenerTodos(req, res) {
        try {
            const { curso } = req.query;
            
            let recursos;
            if (curso && curso !== 'todos') {
                // Filtrar por curso específico
                recursos = await Recurso.obtenerPorCurso(curso);
            } else {
                // Obtener todos los recursos
                recursos = await Recurso.obtenerTodos();
            }

            res.json({ recursos });

        } catch (error) {
            console.error('Error al obtener recursos:', error);
            res.status(500).json({
                error: 'Error al obtener los recursos'
            });
        }
    }

    /**
     * Obtener un recurso por ID
     * GET /api/recursos/:id
     */
    static async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            
            const recurso = await Recurso.obtenerPorId(id);
            
            if (!recurso) {
                return res.status(404).json({
                    error: 'Recurso no encontrado'
                });
            }

            res.json({ recurso });

        } catch (error) {
            console.error('Error al obtener recurso:', error);
            res.status(500).json({
                error: 'Error al obtener el recurso'
            });
        }
    }

    /**
     * Obtener recursos del usuario actual
     * GET /api/recursos/mis-recursos
     */
    static async obtenerMisRecursos(req, res) {
        try {
            if (!req.session.userId) {
                return res.status(401).json({
                    error: 'Debes iniciar sesión'
                });
            }

            const recursos = await Recurso.obtenerPorUsuario(req.session.userId);
            res.json({ recursos });

        } catch (error) {
            console.error('Error al obtener mis recursos:', error);
            res.status(500).json({
                error: 'Error al obtener tus recursos'
            });
        }
    }

    /**
     * Actualizar un recurso
     * PUT /api/recursos/:id
     */
    static async actualizar(req, res) {
        try {
            if (!req.session.userId) {
                return res.status(401).json({
                    error: 'Debes iniciar sesión'
                });
            }

            const { id } = req.params;
            const { titulo, descripcion, enlace, curso, tipo } = req.body;

            // Verificar que el recurso existe
            const recursoExistente = await Recurso.obtenerPorId(id);
            if (!recursoExistente) {
                return res.status(404).json({
                    error: 'Recurso no encontrado'
                });
            }

            // Verificar que el usuario sea el creador del recurso
            if (recursoExistente.usuario_id !== req.session.userId) {
                return res.status(403).json({
                    error: 'No tienes permiso para editar este recurso'
                });
            }

            // Actualizar el recurso
            const actualizado = await Recurso.actualizar(id, {
                titulo,
                descripcion,
                enlace,
                curso,
                tipo
            });

            if (actualizado) {
                res.json({ mensaje: 'Recurso actualizado exitosamente' });
            } else {
                res.status(500).json({ error: 'No se pudo actualizar el recurso' });
            }

        } catch (error) {
            console.error('Error al actualizar recurso:', error);
            res.status(500).json({
                error: 'Error al actualizar el recurso'
            });
        }
    }

    /**
     * Eliminar un recurso
     * DELETE /api/recursos/:id
     */
    static async eliminar(req, res) {
        try {
            if (!req.session.userId) {
                return res.status(401).json({
                    error: 'Debes iniciar sesión'
                });
            }

            const { id } = req.params;

            // Verificar que el recurso existe
            const recursoExistente = await Recurso.obtenerPorId(id);
            if (!recursoExistente) {
                return res.status(404).json({
                    error: 'Recurso no encontrado'
                });
            }

            // Verificar que el usuario sea el creador del recurso
            if (recursoExistente.usuario_id !== req.session.userId) {
                return res.status(403).json({
                    error: 'No tienes permiso para eliminar este recurso'
                });
            }

            // Eliminar el recurso
            const eliminado = await Recurso.eliminar(id);

            if (eliminado) {
                res.json({ mensaje: 'Recurso eliminado exitosamente' });
            } else {
                res.status(500).json({ error: 'No se pudo eliminar el recurso' });
            }

        } catch (error) {
            console.error('Error al eliminar recurso:', error);
            res.status(500).json({
                error: 'Error al eliminar el recurso'
            });
        }
    }

    /**
     * Obtener lista de cursos únicos
     * GET /api/recursos/cursos/lista
     */
    static async obtenerCursos(req, res) {
        try {
            const cursos = await Recurso.obtenerCursosUnicos();
            res.json({ cursos });
        } catch (error) {
            console.error('Error al obtener cursos:', error);
            res.status(500).json({
                error: 'Error al obtener la lista de cursos'
            });
        }
    }
}

module.exports = RecursoController;
