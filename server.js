/**
 * @fileoverview Servidor principal de la aplicación
 * @module server
 * @requires express
 * @requires express-session
 * @requires body-parser
 * @requires dotenv
 */

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const { testConnection, closePool } = require('./config/database');
const usuariosRoutes = require('./routes/usuarios');
const recursosRoutes = require('./routes/recursos');

// Constantes de configuración
const PORT = parseInt(process.env.PORT, 10) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const SESSION_SECRET = process.env.SESSION_SECRET || 'mi_secreto_super_seguro_2025';
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

// Crear aplicación Express
const app = express();

// ============================================
// CONFIGURACIÓN DE MIDDLEWARES
// ============================================

/**
 * 1. Parser de cuerpo de peticiones
 * - JSON: para APIs REST
 * - URL-encoded: para formularios HTML
 */
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

/**
 * 2. Archivos estáticos
 * Sirve archivos CSS, JavaScript e imágenes desde /public
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 3. Configuración de sesiones
 * Mantiene el estado de autenticación del usuario
 */
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'sessionId',
    cookie: {
        secure: NODE_ENV === 'production', // HTTPS en producción
        httpOnly: true, // Previene acceso desde JavaScript
        maxAge: SESSION_MAX_AGE,
        sameSite: 'strict' // Protección CSRF
    }
}));

/**
 * 4. Logger de peticiones (solo en desarrollo)
 */
if (NODE_ENV === 'development') {
    app.use((req, res, next) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${req.method} ${req.path}`);
        next();
    });
}

// ============================================
// CONFIGURACIÓN DE RUTAS API
// ============================================

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/recursos', recursosRoutes);

/**
 * Health check endpoint
 * Verifica el estado del servidor y la conexión a BD
 */
app.get('/api/health', async (req, res) => {
    const dbStatus = await testConnection().catch(() => false);
    
    res.status(dbStatus ? 200 : 503).json({
        status: dbStatus ? 'healthy' : 'unhealthy',
        database: dbStatus ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: NODE_ENV
    });
});

// ============================================
// RUTAS PARA PÁGINAS HTML
// ============================================

const sendPageSecure = (filename) => {
    return (_req, res, next) => {
        const filePath = path.join(__dirname, 'views', filename);
        res.sendFile(filePath, (err) => {
            if (err) {
                next(err);
            }
        });
    };
};

app.get('/', sendPageSecure('login.html'));
app.get('/registro', sendPageSecure('registro.html'));
app.get('/dashboard', sendPageSecure('dashboard.html'));
app.get('/agregar', sendPageSecure('agregar.html'));

// ============================================
// MANEJO DE ERRORES
// ============================================

/**
 * 404 - Ruta no encontrada
 */
app.use((req, res) => {
    res.status(404).json({
        error: 'Recurso no encontrado',
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

/**
 * Manejador global de errores
 */
app.use((err, req, res, _next) => {
    console.error('Error no manejado:', err);
    
    const statusCode = err.statusCode || 500;
    const message = NODE_ENV === 'production' 
        ? 'Error interno del servidor' 
        : err.message;
    
    res.status(statusCode).json({
        error: message,
        ...(NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ============================================
// INICIO DEL SERVIDOR
// ============================================

/**
 * Inicializa y arranca el servidor
 * @async
 * @function iniciarServidor
 */
const iniciarServidor = async () => {
    try {
        // Verificar conexión a la base de datos
        console.log('🔍 Verificando conexión a la base de datos...');
        const dbConectada = await testConnection();
        
        if (!dbConectada) {
            console.error('⚠️  ADVERTENCIA: No se pudo conectar a la base de datos');
            console.error('   Verifica tu configuración en el archivo .env');
            console.error('   El servidor iniciará pero las funciones de BD no funcionarán\n');
        }

        // Iniciar servidor HTTP
        const server = app.listen(PORT, () => {
            console.log('');
            console.log('╔════════════════════════════════════════════════════════╗');
            console.log('║  🚀 Servidor iniciado exitosamente                    ║');
            console.log('║                                                        ║');
            console.log(`║  📍 URL: http://localhost:${PORT.toString().padEnd(25)}║`);
            console.log(`║  🌍 Entorno: ${NODE_ENV.padEnd(35)}║`);
            console.log('║                                                        ║');
            console.log('║  📚 Repositorio Colaborativo de Recursos              ║');
            console.log('║     Promoción 2025                                     ║');
            console.log('║                                                        ║');
            console.log('║  Endpoints disponibles:                                ║');
            console.log(`║  • http://localhost:${PORT}/ (Login)                     ║`);
            console.log(`║  • http://localhost:${PORT}/registro                     ║`);
            console.log(`║  • http://localhost:${PORT}/dashboard                    ║`);
            console.log(`║  • http://localhost:${PORT}/api/health (Status)          ║`);
            console.log('║                                                        ║');
            console.log('║  Presiona Ctrl+C para detener el servidor             ║');
            console.log('╚════════════════════════════════════════════════════════╝');
            console.log('');
        });

        // Configurar cierre graceful
        configurarCierreGraceful(server);

    } catch (error) {
        console.error('❌ Error fatal al iniciar el servidor:', error);
        process.exit(1);
    }
};

/**
 * Configura el cierre graceful del servidor
 * @param {Object} server - Instancia del servidor HTTP
 */
const configurarCierreGraceful = (server) => {
    const cerrarServidor = async (signal) => {
        console.log(`\n👋 Señal ${signal} recibida. Cerrando servidor de forma segura...`);
        
        // Cerrar servidor HTTP (deja de aceptar nuevas conexiones)
        server.close(async () => {
            console.log('✓ Servidor HTTP cerrado');
            
            try {
                // Cerrar conexiones a la base de datos
                await closePool();
                console.log('✓ Conexiones de BD cerradas');
                console.log('👋 Servidor detenido correctamente\n');
                process.exit(0);
            } catch (error) {
                console.error('Error al cerrar conexiones:', error);
                process.exit(1);
            }
        });

        // Si el servidor no cierra en 10 segundos, forzar cierre
        setTimeout(() => {
            console.error('⚠️  Forzando cierre del servidor...');
            process.exit(1);
        }, 10000);
    };

    // Manejar señales de terminación
    process.on('SIGTERM', () => cerrarServidor('SIGTERM'));
    process.on('SIGINT', () => cerrarServidor('SIGINT'));
    
    // Manejar errores no capturados
    process.on('uncaughtException', (error) => {
        console.error('💥 Error no capturado:', error);
        cerrarServidor('uncaughtException');
    });
    
    process.on('unhandledRejection', (reason, promise) => {
        console.error('💥 Promesa rechazada no manejada:', reason);
        cerrarServidor('unhandledRejection');
    });
};

// Ejecutar servidor
iniciarServidor();
