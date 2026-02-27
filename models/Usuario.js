/**
 * @fileoverview Modelo de datos para la entidad Usuario
 * @module models/Usuario
 * @requires config/database
 * @requires bcryptjs
 */

const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

// Constantes
const BCRYPT_SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 6;

/**
 * Clase Usuario - Gestiona todas las operaciones CRUD de usuarios
 * @class
 */
class Usuario {
    /**
     * Valida los datos de un usuario
     * @private
     * @static
     * @param {Object} userData - Datos del usuario a validar
     * @param {string} userData.nombre - Nombre del usuario
     * @param {string} userData.email - Email del usuario
     * @param {string} userData.password - Contraseña del usuario
     * @throws {Error} Si los datos no son válidos
     */
    static _validarDatos(userData) {
        const { nombre, email, password } = userData;
        
        if (!nombre || nombre.trim().length === 0) {
            throw new Error('El nombre es obligatorio');
        }
        
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('Email inválido');
        }
        
        if (!password || password.length < MIN_PASSWORD_LENGTH) {
            throw new Error(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
        }
    }

    /**
     * Crea un nuevo usuario en la base de datos
     * @async
     * @static
     * @param {Object} userData - Datos del usuario
     * @param {string} userData.nombre - Nombre completo del usuario
     * @param {string} userData.email - Correo electrónico único
     * @param {string} userData.password - Contraseña en texto plano (será hasheada)
     * @returns {Promise<Object>} Usuario creado (sin contraseña)
     * @throws {Error} Si hay un error en la creación o el email ya existe
     */
    static async crear(userData) {
        try {
            this._validarDatos(userData);
            
            const { nombre, email, password } = userData;
            
            // Encriptar contraseña con bcrypt
            const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
            
            const query = `
                INSERT INTO usuarios (nombre, email, password, fecha_registro)
                VALUES (?, ?, ?, NOW())
            `;
            
            const [result] = await pool.execute(query, [nombre.trim(), email.toLowerCase(), hashedPassword]);
            
            return {
                id: result.insertId,
                nombre: nombre.trim(),
                email: email.toLowerCase()
            };
        } catch (error) {
            // Error de clave duplicada (email ya existe)
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('El email ya está registrado');
            }
            throw error;
        }
    }

    /**
     * Busca un usuario por su email
     * @async
     * @static
     * @param {string} email - Email del usuario
     * @returns {Promise<Object|null>} Usuario encontrado o null
     * @throws {Error} Si hay un error en la consulta
     */
    static async buscarPorEmail(email) {
        try {
            if (!email) {
                throw new Error('El email es obligatorio');
            }
            
            const query = 'SELECT * FROM usuarios WHERE email = ?';
            const [rows] = await pool.execute(query, [email.toLowerCase()]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Busca un usuario por su ID
     * @async
     * @static
     * @param {number} id - ID del usuario
     * @returns {Promise<Object|null>} Usuario encontrado (sin contraseña) o null
     * @throws {Error} Si hay un error en la consulta
     */
    static async buscarPorId(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID inválido');
            }
            
            const query = 'SELECT id, nombre, email, fecha_registro FROM usuarios WHERE id = ?';
            const [rows] = await pool.execute(query, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Verifica si una contraseña coincide con el hash almacenado
     * @async
     * @static
     * @param {string} password - Contraseña en texto plano
     * @param {string} hashedPassword - Hash de la contraseña almacenado
     * @returns {Promise<boolean>} True si coincide, false en caso contrario
     * @throws {Error} Si hay un error en la comparación
     */
    static async verificarPassword(password, hashedPassword) {
        try {
            if (!password || !hashedPassword) {
                return false;
            }
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            console.error('Error al verificar contraseña:', error);
            return false;
        }
    }

    /**
     * Obtiene todos los usuarios registrados (sin contraseñas)
     * @async
     * @static
     * @returns {Promise<Array>} Lista de usuarios
     * @throws {Error} Si hay un error en la consulta
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
