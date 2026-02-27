/**
 * SERVIDOR PRINCIPAL - server.js
 * Aplicación Express para el Repositorio Colaborativo de Recursos
 * Promoción 2025
 */

// Importar dependencias
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Importar configuración de base de datos
const { testConnection } = require('./config/database');

// Importar rutas
const usuariosRoutes = require('./routes/usuarios');
const recursosRoutes = require('./routes/recursos');

// Crear la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// CONFIGURACIÓN DE MIDDLEWARES
// ============================================

// 1. Body parser - para leer datos del body en formato JSON y URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 2. Archivos estáticos - servir CSS, JS, imágenes desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// 3. Configuración de sesiones - para mantener usuarios autenticados
app.use(session({
    secret: process.env.SESSION_SECRET || 'mi_secreto_super_seguro_2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Cambiar a true en producción con HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
}));

// 4. Middleware para logging de peticiones (desarrollo)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// ============================================
// CONFIGURACIÓN DE RUTAS
// ============================================

// Rutas de la API
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/recursos', recursosRoutes);

// Ruta para verificar el estado del servidor
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        mensaje: 'Servidor funcionando correctamente',
        timestamp: new Date()
    });
});

// ============================================
// RUTAS PARA SERVIR LAS PÁGINAS HTML
// ============================================

// Página de inicio / login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Página de registro
app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'registro.html'));
});

// Página principal (dashboard)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Página para agregar recursos
app.get('/agregar-recurso', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'agregar-recurso.html'));
});

// ============================================
// MANEJO DE ERRORES
// ============================================

// Ruta no encontrada (404)
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        ruta: req.path
    });
});

// Manejador de errores general
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        mensaje: process.env.NODE_ENV === 'development' ? err.message : 'Ocurrió un error'
    });
});

// ============================================
// INICIAR EL SERVIDOR
// ============================================

const iniciarServidor = async () => {
    try {
        // Verificar conexión a la base de datos
        console.log('🔍 Verificando conexión a la base de datos...');
        const dbConectada = await testConnection();
        
        if (!dbConectada) {
            console.error('⚠️  Advertencia: No se pudo conectar a la base de datos');
            console.error('   Verifica tu configuración en el archivo .env');
            console.error('   El servidor iniciará pero las funciones de BD no funcionarán');
        }

        // Iniciar el servidor Express
        app.listen(PORT, () => {
            console.log('');
            console.log('╔════════════════════════════════════════════════════════╗');
            console.log('║  🚀 Servidor iniciado exitosamente                    ║');
            console.log('║                                                        ║');
            console.log(`║  📍 URL: http://localhost:${PORT}                        ║`);
            console.log('║                                                        ║');
            console.log('║  📚 Repositorio Colaborativo de Recursos              ║');
            console.log('║     Promoción 2025                                     ║');
            console.log('║                                                        ║');
            console.log('║  Rutas disponibles:                                    ║');
            console.log(`║  • http://localhost:${PORT}/ (Login)                     ║`);
            console.log(`║  • http://localhost:${PORT}/registro                     ║`);
            console.log(`║  • http://localhost:${PORT}/dashboard                    ║`);
            console.log('║                                                        ║');
            console.log('║  Presiona Ctrl+C para detener el servidor             ║');
            console.log('╚════════════════════════════════════════════════════════╝');
            console.log('');
        });

    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Ejecutar el servidor
iniciarServidor();

// Manejo de cierre graceful
process.on('SIGTERM', () => {
    console.log('👋 Señal SIGTERM recibida, cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n👋 Servidor detenido por el usuario');
    process.exit(0);
});
