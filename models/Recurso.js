/**
 * @fileoverview Modelo de datos para la entidad Recurso Académico
 * @module models/Recurso
 * @requires config/database
 */

const { pool } = require('../config/database');

// Constantes para validación
const TIPOS_VALIDOS = ['Video', 'Documento', 'Código', 'Curso Online', 'Artículo', 'Libro', 'Otro'];
const MAX_TITULO_LENGTH = 200;
const MAX_DESCRIPCION_LENGTH = 1000;

/**
 * Clase Recurso - Gestiona todas las operaciones CRUD de recursos académicos
 * @class
 */
class Recurso {
    /**
     * Valida los datos de un recurso
     * @private
     * @static
     * @param {Object} recursoData - Datos del recurso a validar
     * @throws {Error} Si los datos no son válidos
     */
    static _validarDatos(recursoData) {
        const { titulo, descripcion, enlace, curso, tipo } = recursoData;
        
        if (!titulo || titulo.trim().length === 0) {
            throw new Error('El título es obligatorio');
        }
        
        if (titulo.length > MAX_TITULO_LENGTH) {
            throw new Error(`El título no puede exceder ${MAX_TITULO_LENGTH} caracteres`);
        }
        
        if (!descripcion || descripcion.trim().length === 0) {
            throw new Error('La descripción es obligatoria');
        }
        
        if (descripcion.length > MAX_DESCRIPCION_LENGTH) {
            throw new Error(`La descripción no puede exceder ${MAX_DESCRIPCION_LENGTH} caracteres`);
        }
        
        if (!enlace || !/^https?:\/\/.+/.test(enlace)) {
            throw new Error('El enlace debe ser una URL válida (http:// o https://)');
        }
        
        if (!curso || curso.trim().length === 0) {
            throw new Error('El curso es obligatorio');
        }
        
        if (!tipo || !TIPOS_VALIDOS.includes(tipo)) {
            throw new Error(`Tipo inválido. Debe ser uno de: ${TIPOS_VALIDOS.join(', ')}`);
        }
    }

    /**
     * Crea un nuevo recurso académico en la base de datos
     * @async
     * @static
     * @param {Object} recursoData - Datos del recurso
     * @param {string} recursoData.titulo - Título del recurso
     * @param {string} recursoData.descripcion - Descripción detallada
     * @param {string} recursoData.enlace - URL del recurso
     * @param {string} recursoData.curso - Curso al que pertenece
     * @param {string} recursoData.tipo - Tipo de recurso
     * @param {number} recursoData.usuario_id - ID del usuario creador
     * @returns {Promise<Object>} Recurso creado
     * @throws {Error} Si hay un error en la creación o validación
     */
    static async crear(recursoData) {
        try {
            this._validarDatos(recursoData);
            
            const { titulo, descripcion, enlace, curso, tipo, usuario_id } = recursoData;
            
            if (!usuario_id || isNaN(usuario_id)) {
                throw new Error('ID de usuario inválido');
            }
            
            const query = `
                INSERT INTO recursos (titulo, descripcion, enlace, curso, tipo, usuario_id, fecha_creacion)
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            `;
            
            const [result] = await pool.execute(query, [
                titulo.trim(),
                descripcion.trim(),
                enlace.trim(),
                curso.trim(),
                tipo,
                usuario_id
            ]);
            
            return {
                id: result.insertId,
                titulo: titulo.trim(),
                descripcion: descripcion.trim(),
                enlace: enlace.trim(),
                curso: curso.trim(),
                tipo,
                usuario_id
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene todos los recursos con información del usuario creador
     * @async
     * @static
     * @returns {Promise<Array>} Lista de recursos con información del usuario
     * @throws {Error} Si hay un error en la consulta
     */
    static async obtenerTodos() {
        try {
            const query = `
                SELECT 
                    r.id,
                    r.titulo,
                    r.descripcion,
                    r.enlace,
                    r.curso,
                    r.tipo,
                    r.fecha_creacion,
                    r.usuario_id,
                    u.nombre as usuario_nombre,
                    u.email as usuario_email
                FROM recursos r
                INNER JOIN usuarios u ON r.usuario_id = u.id
                ORDER BY r.fecha_creacion DESC
            `;
            
            const [rows] = await pool.execute(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene recursos filtrados por curso
     * @async
     * @static
     * @param {string} curso - Nombre del curso
     * @returns {Promise<Array>} Lista de recursos del curso especificado
     * @throws {Error} Si hay un error en la consulta
     */
    static async obtenerPorCurso(curso) {
        try {
            if (!curso || curso.trim().length === 0) {
                throw new Error('El nombre del curso es obligatorio');
            }
            
            const query = `
                SELECT 
                    r.id,
                    r.titulo,
                    r.descripcion,
                    r.enlace,
                    r.curso,
                    r.tipo,
                    r.fecha_creacion,
                    r.usuario_id,
                    u.nombre as usuario_nombre,
                    u.email as usuario_email
                FROM recursos r
                INNER JOIN usuarios u ON r.usuario_id = u.id
                WHERE r.curso = ?
                ORDER BY r.fecha_creacion DESC
            `;
            
            const [rows] = await pool.execute(query, [curso.trim()]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene un recurso específico por su ID
     * @async
     * @static
     * @param {number} id - ID del recurso
     * @returns {Promise<Object|null>} Recurso encontrado o null
     * @throws {Error} Si hay un error en la consulta
     */
    static async obtenerPorId(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID inválido');
            }
            
            const query = `
                SELECT 
                    r.*,
                    u.nombre as usuario_nombre,
                    u.email as usuario_email
                FROM recursos r
                INNER JOIN usuarios u ON r.usuario_id = u.id
                WHERE r.id = ?
            `;
            
            const [rows] = await pool.execute(query, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene todos los recursos creados por un usuario específico
     * @async
     * @static
     * @param {number} usuario_id - ID del usuario
     * @returns {Promise<Array>} Lista de recursos del usuario
     * @throws {Error} Si hay un error en la consulta
     */
    static async obtenerPorUsuario(usuario_id) {
        try {
            if (!usuario_id || isNaN(usuario_id)) {
                throw new Error('ID de usuario inválido');
            }
            
            const query = `
                SELECT * FROM recursos
                WHERE usuario_id = ?
                ORDER BY fecha_creacion DESC
            `;
            
            const [rows] = await pool.execute(query, [usuario_id]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Actualiza un recurso existente
     * @async
     * @static
     * @param {number} id - ID del recurso a actualizar
     * @param {Object} recursoData - Nuevos datos del recurso
     * @returns {Promise<boolean>} True si se actualizó correctamente
     * @throws {Error} Si hay un error en la actualización
     */
    static async actualizar(id, recursoData) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID inválido');
            }
            
            this._validarDatos(recursoData);
            
            const { titulo, descripcion, enlace, curso, tipo } = recursoData;
            
            const query = `
                UPDATE recursos
                SET titulo = ?, descripcion = ?, enlace = ?, curso = ?, tipo = ?
                WHERE id = ?
            `;
            
            const [result] = await pool.execute(query, [
                titulo.trim(),
                descripcion.trim(),
                enlace.trim(),
                curso.trim(),
                tipo,
                id
            ]);
            
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Elimina un recurso de la base de datos
     * @async
     * @static
     * @param {number} id - ID del recurso a eliminar
     * @returns {Promise<boolean>} True si se eliminó correctamente
     * @throws {Error} Si hay un error en la eliminación
     */
    static async eliminar(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID inválido');
            }
            
            const query = 'DELETE FROM recursos WHERE id = ?';
            const [result] = await pool.execute(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtiene la lista de cursos únicos de todos los recursos
     * @async
     * @static
     * @returns {Promise<Array<string>>} Lista de nombres de cursos
     * @throws {Error} Si hay un error en la consulta
     */
    static async obtenerCursosUnicos() {
        try {
            const query = 'SELECT DISTINCT curso FROM recursos ORDER BY curso';
            const [rows] = await pool.execute(query);
            return rows.map(row => row.curso);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Recurso;
