/**
 * Configuración de conexión a la base de datos MySQL
 * Este archivo maneja la conexión con MySQL usando mysql2
 */

const mysql = require('mysql2');
require('dotenv').config();

// Crear el pool de conexiones para mejor rendimiento
// Un pool maneja múltiples conexiones de forma eficiente
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'recursos_academicos',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10, // Máximo de conexiones simultáneas
    queueLimit: 0
});

// Exportar el pool con soporte para promesas (async/await)
const promisePool = pool.promise();

// Función para verificar la conexión
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✓ Conexión exitosa a MySQL');
        connection.release();
        return true;
    } catch (error) {
        console.error('✗ Error al conectar a MySQL:', error.message);
        return false;
    }
};

module.exports = { pool: promisePool, testConnection };
