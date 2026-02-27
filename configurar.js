/**
 * Script de Configuración y Despliegue Automatizado
 * Configura MySQL, crea la base de datos y despliega la aplicación
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');

// Colores
const c = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const log = (icon, msg, color = c.reset) => console.log(`${color}${icon} ${msg}${c.reset}`);

// Crear interfaz para input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

/**
 * Encuentra la instalación de MySQL
 */
function findMySQLPath() {
    const possiblePaths = [
        'C:\\xampp\\mysql\\bin\\mysql.exe',
        'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe',
        'C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\mysql.exe',
        'C:\\Program Files\\MySQL\\MySQL Server 5.7\\bin\\mysql.exe',
        'C:\\MySQL\\bin\\mysql.exe'
    ];
    
    for (const mysqlPath of possiblePaths) {
        if (fs.existsSync(mysqlPath)) {
            return mysqlPath;
        }
    }
    return null;
}

/**
 * Prueba la conexión a MySQL
 */
function testMySQLConnection(password = '') {
    return new Promise((resolve) => {
        const mysqlPath = findMySQLPath();
        if (!mysqlPath) {
            resolve({ success: false, error: 'MySQL no encontrado' });
            return;
        }

        const args = ['-u', 'root'];
        if (password) {
            args.push(`-p${password}`);
        }
        args.push('-e', 'SELECT VERSION();');

        const mysql = spawn(mysqlPath, args);
        let output = '';
        let errorOutput = '';

        mysql.stdout.on('data', (data) => {
            output += data.toString();
        });

        mysql.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        mysql.on('close', (code) => {
            if (code === 0) {
                resolve({ success: true, output });
            } else {
                resolve({ success: false, error: errorOutput });
            }
        });

        // Timeout de 5 segundos
        setTimeout(() => {
            mysql.kill();
            resolve({ success: false, error: 'Timeout' });
        }, 5000);
    });
}

/**
 * Crea la base de datos
 */
async function createDatabase(password) {
    return new Promise((resolve) => {
        const mysqlPath = findMySQLPath();
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        
        if (!fs.existsSync(schemaPath)) {
            resolve({ success: false, error: 'schema.sql no encontrado' });
            return;
        }

        const args = ['-u', 'root'];
        if (password) {
            args.push(`-p${password}`);
        }

        const mysql = spawn(mysqlPath, args);
        const schemaContent = fs.readFileSync(schemaPath, 'utf8');
        
        mysql.stdin.write(schemaContent);
        mysql.stdin.end();

        let errorOutput = '';
        mysql.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        mysql.on('close', (code) => {
            if (code === 0 || errorOutput.includes('already exists')) {
                resolve({ success: true });
            } else {
                resolve({ success: false, error: errorOutput });
            }
        });
    });
}

/**
 * Actualiza el archivo .env
 */
function updateEnvFile(password) {
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Actualizar la línea de DB_PASSWORD
    envContent = envContent.replace(
        /DB_PASSWORD=.*/,
        `DB_PASSWORD=${password}`
    );
    
    fs.writeFileSync(envPath, envContent);
}

/**
 * Inicia el servidor
 */
function startServer() {
    return new Promise((resolve) => {
        log('🚀', 'Iniciando servidor...', c.cyan);
        
        const server = spawn('npm', ['start'], {
            stdio: 'inherit',
            shell: true
        });

        // Esperar un poco para que el servidor inicie
        setTimeout(() => {
            resolve(server);
        }, 2000);
    });
}

/**
 * Función principal
 */
async function main() {
    console.clear();
    console.log(c.cyan + '═'.repeat(65) + c.reset);
    console.log(c.bright + c.cyan + '  🛠️  CONFIGURACIÓN Y DESPLIEGUE AUTOMATIZADO' + c.reset);
    console.log(c.cyan + '  Repositorio Colaborativo de Recursos - Promoción 2025' + c.reset);
    console.log(c.cyan + '═'.repeat(65) + c.reset);
    console.log();

    try {
        // 1. Verificar MySQL instalado
        log('📍', 'Paso 1/5: Verificando MySQL...', c.bright);
        const mysqlPath = findMySQLPath();
        
        if (!mysqlPath) {
            log('✗', 'MySQL no está instalado', c.red);
            console.log();
            log('📖', 'Instala MySQL Server o XAMPP:', c.yellow);
            log('  ', '  • MySQL: https://dev.mysql.com/downloads/mysql/', c.blue);
            log('  ', '  • XAMPP: https://www.apachefriends.org/download.html', c.blue);
            console.log();
            rl.close();
            process.exit(1);
        }
        
        log('✓', `MySQL encontrado: ${mysqlPath}`, c.green);
        console.log();

        // 2. Probar conexión sin contraseña
        log('🔐', 'Paso 2/5: Configurando credenciales...', c.bright);
        let testResult = await testMySQLConnection('');
        let mysqlPassword = '';

        if (!testResult.success) {
            // Necesita contraseña
            log('⚠', 'MySQL requiere contraseña', c.yellow);
            console.log();
            
            mysqlPassword = await question(c.cyan + '  Ingresa la contraseña de MySQL root: ' + c.reset);
            
            if (!mysqlPassword) {
                log('✗', 'Contraseña vacía. Cancelando...', c.red);
                rl.close();
                process.exit(1);
            }

            // Probar con la contraseña proporcionada
            testResult = await testMySQLConnection(mysqlPassword);
            
            if (!testResult.success) {
                log('✗', 'Contraseña incorrecta', c.red);
                log('  ', '  Verifica tu contraseña e intenta nuevamente', c.yellow);
                rl.close();
                process.exit(1);
            }
        }

        log('✓', 'Conexión a MySQL exitosa', c.green);
        console.log();

        // 3. Actualizar .env
        log('📝', 'Paso 3/5: Actualizando configuración...', c.bright);
        updateEnvFile(mysqlPassword);
        log('✓', 'Archivo .env actualizado', c.green);
        console.log();

        // 4. Crear base de datos
        log('🗄️', 'Paso 4/5: Creando base de datos...', c.bright);
        const dbResult = await createDatabase(mysqlPassword);
        
        if (!dbResult.success) {
            log('✗', 'Error al crear base de datos', c.red);
            log('  ', `  ${dbResult.error}`, c.yellow);
            rl.close();
            process.exit(1);
        }
        
        log('✓', 'Base de datos "recursos_academicos" creada', c.green);
        log('✓', 'Tablas: usuarios, recursos', c.green);
        console.log();

        // 5. Confirmar inicio del servidor
        log('🎯', 'Paso 5/5: Listo para desplegar', c.bright);
        console.log();
        
        const startNow = await question(c.cyan + '¿Iniciar el servidor ahora? (s/n): ' + c.reset);
        
        if (startNow.toLowerCase() === 's' || startNow.toLowerCase() === 'si') {
            console.log();
            console.log(c.green + '═'.repeat(65) + c.reset);
            log('✅', 'CONFIGURACIÓN COMPLETADA', c.bright + c.green);
            console.log(c.green + '═'.repeat(65) + c.reset);
            console.log();
            
            rl.close();
            
            // Iniciar servidor
            await startServer();
        } else {
            console.log();
            console.log(c.green + '═'.repeat(65) + c.reset);
            log('✅', 'CONFIGURACIÓN COMPLETADA', c.bright + c.green);
            console.log(c.green + '═'.repeat(65) + c.reset);
            console.log();
            log('🚀', 'Para iniciar el servidor ejecuta:', c.cyan);
            log('  ', '  npm start       - Modo producción', c.blue);
            log('  ', '  npm run dev     - Modo desarrollo', c.blue);
            console.log();
            log('🌐', 'Luego abre: http://localhost:3000', c.cyan);
            console.log();
            
            rl.close();
            process.exit(0);
        }

    } catch (error) {
        console.error();
        log('❌', `Error: ${error.message}`, c.red);
        rl.close();
        process.exit(1);
    }
}

// Manejar Ctrl+C
process.on('SIGINT', () => {
    console.log();
    log('👋', 'Configuración cancelada', c.yellow);
    rl.close();
    process.exit(0);
});

// Ejecutar
main();
