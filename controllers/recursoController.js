/**
 * @fileoverview Controlador de recursos académicos - Maneja CRUD de materiales de estudio
 * @module controllers/recursoController
 */

const Recurso = require('../models/Recurso');

// ============================================
// CONSTANTES
// ============================================

/** Códigos de estado HTTP */
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
};

/** Mensajes de error */
const ERROR_MESSAGES = {
    NO_AUTENTICADO: 'Debes iniciar sesión para realizar esta acción',
    CAMPOS_INCOMPLETOS: 'Por favor completa todos los campos obligatorios',
    RECURSO_NO_ENCONTRADO: 'Recurso no encontrado',
    SIN_PERMISO: 'No tienes permiso para realizar esta acción',
    ERROR_CREAR: 'Error al crear el recurso',
    ERROR_OBTENER: 'Error al obtener los recursos',
    ERROR_ACTUALIZAR: 'Error al actualizar el recurso',
    ERROR_ELIMINAR: 'Error al eliminar el recurso'
};

/** Valor por defecto para filtros */
const FILTRO_TODOS = 'todos';

// ============================================
// CONTROLADOR
// ============================================

/**
 * Controlador de Recursos
 * @class RecursoController
 * @description Maneja la lógica de negocio para CRUD de recursos académicos
 */
class RecursoController {
    /**
     * Crea un nuevo recurso académico
     * @async
     * @static
     * @param {Object} req - Objeto request de Express
     * @param {Object} req.body - Datos del recurso
     * @param {string} req.body.titulo - Título del recurso
     * @param {string} req.body.descripcion - Descripción detallada
     * @param {string} req.body.enlace - URL del recurso
     * @param {string} req.body.curso - Nombre del curso
     * @param {string} req.body.tipo - Tipo de recurso (Video, Documento, etc.)
     * @param {Object} req.session - Sesión con userId del creador
     * @param {Object} res - Objeto response de Express
     * @returns {Promise<void>} JSON con recurso creado o error
     * @route POST /api/recursos
     */
    static async crear(req, res) {
        try {
            // Validación 1: Usuario autenticado
            if (!req.session.userId) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    error: ERROR_MESSAGES.NO_AUTENTICADO
                });
            }

            const { titulo, descripcion, enlace, curso, tipo } = req.body;

            // Validación 2: Campos obligatorios
            if (!titulo || !descripcion || !enlace || !curso || !tipo) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    error: ERROR_MESSAGES.CAMPOS_INCOMPLETOS,
                    camposFaltantes: {
                        titulo: !titulo,
                        descripcion: !descripcion,
                        enlace: !enlace,
                        curso: !curso,
                        tipo: !tipo
                    }
                });
            }

            // Crear el recurso (el modelo se encarga de validar tipos y URLs)
            const nuevoRecurso = await Recurso.crear({
                titulo,
                descripcion,
                enlace,
                curso,
                tipo,
                usuario_id: req.session.userId
            });

            res.status(HTTP_STATUS.CREATED).json({
                mensaje: 'Recurso creado exitosamente',
                recurso: nuevoRecurso
            });

        } catch (error) {
            console.error('[recursoController.crear] Error:', error.message);
            res.status(HTTP_STATUS.INTERNAL_ERROR).json({
                error: ERROR_MESSAGES.ERROR_CREAR,
                detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Obtiene todos los recursos o filtrados por curso
     * @async
     * @static
     * @param {Object} req - Objeto request de Express
     * @param {Object} req.query - Parámetros de query
     * @param {string} [req.query.curso] - Nombre del curso para filtrar (opcional)
     * @param {Object} res - Objeto response de Express
     * @returns {Promise<void>} JSON con array de recursos
     * @route GET /api/recursos
     * @route GET /api/recursos?curso=NombreCurso
     */
    static async obtenerTodos(req, res) {
        try {
            const { curso } = req.query;
            
            let recursos;
            if (curso && curso !== FILTRO_TODOS) {
                // Filtrar por curso específico
                recursos = await Recurso.obtenerPorCurso(curso);
            } else {
                // Obtener todos los recursos
                recursos = await Recurso.obtenerTodos();
            }

            res.status(HTTP_STATUS.OK).json({ 
                recursos,
                total: recursos.length,
                filtrado: curso && curso !== FILTRO_TODOS
            });

        } catch (error) {
            console.error('[recursoController.obtenerTodos] Error:', error.message);
            res.status(HTTP_STATUS.INTERNAL_ERROR).json({
                error: ERROR_MESSAGES.ERROR_OBTENER,
                detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Obtiene un recurso específico por su ID
     * @async
     * @static
     * @param {Object} req - Objeto request de Express
     * @param {Object} req.params - Parámetros de ruta
     * @param {string} req.params.id - ID del recurso
     * @param {Object} res - Objeto response de Express
     * @returns {Promise<void>} JSON con datos del recurso
     * @route GET /api/recursos/:id
     */
    static async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            
            // Validación: ID numérico
            if (isNaN(parseInt(id))) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    error: 'ID inválido'
                });
            }
            
            const recurso = await Recurso.obtenerPorId(id);
            
            if (!recurso) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    error: ERROR_MESSAGES.RECURSO_NO_ENCONTRADO
                });
            }

            res.status(HTTP_STATUS.OK).json({ recurso });

        } catch (error) {
            console.error('[recursoController.obtenerPorId] Error:', error.message);
            res.status(HTTP_STATUS.INTERNAL_ERROR).json({
                error: ERROR_MESSAGES.ERROR_OBTENER,
                detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Obtiene los recursos creados por el usuario autenticado
     * @async
     * @static
     * @param {Object} req - Objeto request de Express
     * @param {Object} req.session - Sesión con userId
     * @param {Object} res - Objeto response de Express
     * @returns {Promise<void>} JSON con recursos del usuario
     * @route GET /api/recursos/mis-recursos
     */
    static async obtenerMisRecursos(req, res) {
        try {
            // Validar autenticación
            if (!req.session.userId) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    error: ERROR_MESSAGES.NO_AUTENTICADO
                });
            }

            const recursos = await Recurso.obtenerPorUsuario(req.session.userId);
            
            res.status(HTTP_STATUS.OK).json({ 
                recursos,
                total: recursos.length
            });

        } catch (error) {
            console.error('[recursoController.obtenerMisRecursos] Error:', error.message);
            res.status(HTTP_STATUS.INTERNAL_ERROR).json({
                error: 'Error al obtener tus recursos',
                detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Actualiza un recurso existente
     * @async
     * @static
     * @param {Object} req - Objeto request de Express
     * @param {Object} req.params - Parámetros de ruta
     * @param {string} req.params.id - ID del recurso a actualizar
     * @param {Object} req.body - Datos actualizados
     * @param {Object} req.session - Sesión con userId
     * @param {Object} res - Objeto response de Express
     * @returns {Promise<void>} JSON con mensaje de éxito o error
     * @route PUT /api/recursos/:id
     */
    static async actualizar(req, res) {
        try {
            // Validación 1: Usuario autenticado
            if (!req.session.userId) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    error: ERROR_MESSAGES.NO_AUTENTICADO
                });
            }

            const { id } = req.params;
            const { titulo, descripcion, enlace, curso, tipo } = req.body;

            // Validación 2: ID numérico
            if (isNaN(parseInt(id))) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    error: 'ID inválido'
                });
            }

            // Validación 3: Recurso existe
            const recursoExistente = await Recurso.obtenerPorId(id);
            if (!recursoExistente) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    error: ERROR_MESSAGES.RECURSO_NO_ENCONTRADO
                });
            }

            // Validación 4: Verificar propiedad del recurso
            if (recursoExistente.usuario_id !== req.session.userId) {
                return res.status(HTTP_STATUS.FORBIDDEN).json({
                    error: 'No tienes permiso para editar este recurso',
                    detalle: 'Solo el creador puede modificar un recurso'
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
                res.status(HTTP_STATUS.OK).json({ 
                    mensaje: 'Recurso actualizado exitosamente' 
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_ERROR).json({ 
                    error: 'No se pudo actualizar el recurso' 
                });
            }

        } catch (error) {
            console.error('[recursoController.actualizar] Error:', error.message);
            res.status(HTTP_STATUS.INTERNAL_ERROR).json({
                error: ERROR_MESSAGES.ERROR_ACTUALIZAR,
                detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Elimina un recurso existente
     * @async
     * @static
     * @param {Object} req - Objeto request de Express
     * @param {Object} req.params - Parámetros de ruta
     * @param {string} req.params.id - ID del recurso a eliminar
     * @param {Object} req.session - Sesión con userId
     * @param {Object} res - Objeto response de Express
     * @returns {Promise<void>} JSON con mensaje de éxito o error
     * @route DELETE /api/recursos/:id
     */
    static async eliminar(req, res) {
        try {
            // Validación 1: Usuario autenticado
            if (!req.session.userId) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    error: ERROR_MESSAGES.NO_AUTENTICADO
                });
            }

            const { id } = req.params;

            // Validación 2: ID numérico
            if (isNaN(parseInt(id))) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    error: 'ID inválido'
                });
            }

            // Validación 3: Recurso existe
            const recursoExistente = await Recurso.obtenerPorId(id);
            if (!recursoExistente) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    error: ERROR_MESSAGES.RECURSO_NO_ENCONTRADO
                });
            }

            // Validación 4: Verificar propiedad del recurso
            if (recursoExistente.usuario_id !== req.session.userId) {
                return res.status(HTTP_STATUS.FORBIDDEN).json({
                    error: 'No tienes permiso para eliminar este recurso',
                    detalle: 'Solo el creador puede eliminar un recurso'
                });
            }

            // Eliminar el recurso
            const eliminado = await Recurso.eliminar(id);

            if (eliminado) {
                res.status(HTTP_STATUS.OK).json({ 
                    mensaje: 'Recurso eliminado exitosamente' 
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_ERROR).json({ 
                    error: 'No se pudo eliminar el recurso' 
                });
            }

        } catch (error) {
            console.error('[recursoController.eliminar] Error:', error.message);
            res.status(HTTP_STATUS.INTERNAL_ERROR).json({
                error: ERROR_MESSAGES.ERROR_ELIMINAR,
                detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Obtiene la lista de cursos únicos de todos los recursos
     * @async
     * @static
     * @param {Object} req - Objeto request de Express
     * @param {Object} res - Objeto response de Express
     * @returns {Promise<void>} JSON con array de nombres de cursos
     * @route GET /api/recursos/cursos/lista
     */
    static async obtenerCursos(req, res) {
        try {
            const cursos = await Recurso.obtenerCursosUnicos();
            
            res.status(HTTP_STATUS.OK).json({ 
                cursos,
                total: cursos.length
            });
            
        } catch (error) {
            console.error('[recursoController.obtenerCursos] Error:', error.message);
            res.status(HTTP_STATUS.INTERNAL_ERROR).json({
                error: 'Error al obtener la lista de cursos',
                detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

module.exports = RecursoController;
