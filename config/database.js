/**
 * @fileoverview Configuración y gestión de conexión a MySQL
 * @module config/database
 * @requires mysql2
 * @requires dotenv
 */

const mysql = require('mysql2');
require('dotenv').config();

// Constantes de configuración
const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'recursos_academicos',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};

/**
 * Pool de conexiones MySQL con soporte de promesas
 * Gestiona múltiples conexiones de forma eficiente y automática
 * @type {mysql.Pool}
 */
const pool = mysql.createPool(DB_CONFIG);

// Pool con soporte para promesas (async/await)
const promisePool = pool.promise();

/**
 * Verifica la conexión a la base de datos
 * @async
 * @function testConnection
 * @returns {Promise<boolean>} True si la conexión es exitosa, false en caso contrario
 * @throws {Error} Si hay un error crítico en la conexión
 */
const testConnection = async () => {
    let connection;
    try {
        connection = await promisePool.getConnection();
        await connection.ping();
        console.log('✓ Conexión exitosa a MySQL - Base de datos:', DB_CONFIG.database);
        return true;
    } catch (error) {
        console.error('✗ Error al conectar a MySQL:', error.message);
        console.error('  Verifica tu configuración en el archivo .env');
        return false;
    } finally {
        if (connection) connection.release();
    }
};

/**
 * Cierra todas las conexiones del pool de forma segura
 * @async
 * @function closePool
 * @returns {Promise<void>}
 */
const closePool = async () => {
    try {
        await promisePool.end();
        console.log('✓ Pool de conexiones cerrado correctamente');
    } catch (error) {
        console.error('✗ Error al cerrar pool:', error.message);
        throw error;
    }
};

module.exports = { 
    pool: promisePool, 
    testConnection,
    closePool
};
