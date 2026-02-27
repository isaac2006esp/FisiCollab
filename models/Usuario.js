/**
 * Modelo de Usuario
 * Maneja todas las operaciones relacionadas con usuarios en la base de datos
 */

const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class Usuario {
    /**
     * Crear un nuevo usuario
     * @param {Object} userData - Datos del usuario {nombre, email, password}
     * @returns {Promise<Object>} - Usuario creado
     */
    static async crear(userData) {
        try {
            const { nombre, email, password } = userData;
            
            // Encriptar la contraseña antes de guardarla (seguridad)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            const query = `
                INSERT INTO usuarios (nombre, email, password, fecha_registro)
                VALUES (?, ?, ?, NOW())
            `;
            
            const [result] = await pool.execute(query, [nombre, email, hashedPassword]);
            
            return {
                id: result.insertId,
                nombre,
                email
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Buscar usuario por email
     * @param {string} email - Email del usuario
     * @returns {Promise<Object|null>} - Usuario encontrado o null
     */
    static async buscarPorEmail(email) {
        try {
            const query = 'SELECT * FROM usuarios WHERE email = ?';
            const [rows] = await pool.execute(query, [email]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Buscar usuario por ID
     * @param {number} id - ID del usuario
     * @returns {Promise<Object|null>} - Usuario encontrado o null
     */
    static async buscarPorId(id) {
        try {
            const query = 'SELECT id, nombre, email, fecha_registro FROM usuarios WHERE id = ?';
            const [rows] = await pool.execute(query, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Verificar contraseña
     * @param {string} password - Contraseña en texto plano
     * @param {string} hashedPassword - Contraseña encriptada
     * @returns {Promise<boolean>} - True si coincide, false si no
     */
    static async verificarPassword(password, hashedPassword) {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener todos los usuarios (sin contraseñas)
     * @returns {Promise<Array>} - Lista de usuarios
     */
    static async obtenerTodos() {
        try {
            const query = 'SELECT id, nombre, email, fecha_registro FROM usuarios ORDER BY fecha_registro DESC';
            const [rows] = await pool.execute(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Usuario;
