/**
 * Modelo de Recurso
 * Maneja todas las operaciones relacionadas con recursos académicos en la base de datos
 */

const { pool } = require('../config/database');

class Recurso {
    /**
     * Crear un nuevo recurso académico
     * @param {Object} recursoData - Datos del recurso {titulo, descripcion, enlace, curso, tipo, usuario_id}
     * @returns {Promise<Object>} - Recurso creado
     */
    static async crear(recursoData) {
        try {
            const { titulo, descripcion, enlace, curso, tipo, usuario_id } = recursoData;
            
            const query = `
                INSERT INTO recursos (titulo, descripcion, enlace, curso, tipo, usuario_id, fecha_creacion)
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            `;
            
            const [result] = await pool.execute(query, [
                titulo,
                descripcion,
                enlace,
                curso,
                tipo,
                usuario_id
            ]);
            
            return {
                id: result.insertId,
                ...recursoData
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener todos los recursos con información del usuario que lo creó
     * @returns {Promise<Array>} - Lista de recursos
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
     * Obtener recursos filtrados por curso
     * @param {string} curso - Nombre del curso
     * @returns {Promise<Array>} - Lista de recursos del curso
     */
    static async obtenerPorCurso(curso) {
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
                    u.nombre as usuario_nombre,
                    u.email as usuario_email
                FROM recursos r
                INNER JOIN usuarios u ON r.usuario_id = u.id
                WHERE r.curso = ?
                ORDER BY r.fecha_creacion DESC
            `;
            
            const [rows] = await pool.execute(query, [curso]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener un recurso por su ID
     * @param {number} id - ID del recurso
     * @returns {Promise<Object|null>} - Recurso encontrado o null
     */
    static async obtenerPorId(id) {
        try {
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
     * Obtener recursos creados por un usuario específico
     * @param {number} usuario_id - ID del usuario
     * @returns {Promise<Array>} - Lista de recursos del usuario
     */
    static async obtenerPorUsuario(usuario_id) {
        try {
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
     * Actualizar un recurso
     * @param {number} id - ID del recurso
     * @param {Object} recursoData - Datos a actualizar
     * @returns {Promise<boolean>} - True si se actualizó, false si no
     */
    static async actualizar(id, recursoData) {
        try {
            const { titulo, descripcion, enlace, curso, tipo } = recursoData;
            
            const query = `
                UPDATE recursos
                SET titulo = ?, descripcion = ?, enlace = ?, curso = ?, tipo = ?
                WHERE id = ?
            `;
            
            const [result] = await pool.execute(query, [
                titulo,
                descripcion,
                enlace,
                curso,
                tipo,
                id
            ]);
            
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Eliminar un recurso
     * @param {number} id - ID del recurso
     * @returns {Promise<boolean>} - True si se eliminó, false si no
     */
    static async eliminar(id) {
        try {
            const query = 'DELETE FROM recursos WHERE id = ?';
            const [result] = await pool.execute(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener lista de cursos únicos (para el filtro)
     * @returns {Promise<Array>} - Lista de cursos
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
