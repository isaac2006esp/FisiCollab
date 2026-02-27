-- ============================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS
-- Repositorio Colaborativo de Recursos - Promoción 2025
-- ============================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS recursos_academicos
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE recursos_academicos;

-- ============================================
-- TABLA: usuarios
-- Almacena la información de los usuarios registrados
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: recursos
-- Almacena los recursos académicos compartidos
-- ============================================
CREATE TABLE IF NOT EXISTS recursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    enlace VARCHAR(500) NOT NULL,
    curso VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    usuario_id INT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Clave foránea para relacionar con usuarios
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Índices para mejorar búsquedas
    INDEX idx_curso (curso),
    INDEX idx_tipo (tipo),
    INDEX idx_usuario (usuario_id),
    INDEX idx_fecha (fecha_creacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- Puedes comentar esta sección si no quieres datos de prueba
-- ============================================

-- Insertar usuarios de ejemplo (las contraseñas están hasheadas con bcrypt)
-- Contraseña para todos: "password123"
INSERT INTO usuarios (nombre, email, password) VALUES
('Juan Pérez', 'juan@fisi.edu.pe', '$2a$10$rWN0KJfKfqWXhBqPYmZGOu1jXkNLhpM9cJqKYqBwQxYqBXqYqBwQx'),
('María García', 'maria@fisi.edu.pe', '$2a$10$rWN0KJfKfqWXhBqPYmZGOu1jXkNLhpM9cJqKYqBwQxYqBXqYqBwQx'),
('Carlos López', 'carlos@fisi.edu.pe', '$2a$10$rWN0KJfKfqWXhBqPYmZGOu1jXkNLhpM9cJqKYqBwQxYqBXqYqBwQx');

-- Insertar recursos de ejemplo
INSERT INTO recursos (titulo, descripcion, enlace, curso, tipo, usuario_id) VALUES
(
    'Tutorial de JavaScript Básico',
    'Video tutorial completo sobre los fundamentos de JavaScript para principiantes',
    'https://www.youtube.com/watch?v=ejemplo1',
    'Programación Web',
    'Video',
    1
),
(
    'Guía de MySQL',
    'Documento PDF con comandos esenciales de MySQL y ejemplos prácticos',
    'https://drive.google.com/file/ejemplo2',
    'Base de Datos',
    'Documento',
    1
),
(
    'Ejercicios de Algoritmos',
    'Repositorio de GitHub con 50 ejercicios resueltos de algoritmos en Python',
    'https://github.com/usuario/algoritmos',
    'Algoritmos',
    'Código',
    2
),
(
    'Curso de HTML y CSS',
    'Curso interactivo gratuito para aprender HTML5 y CSS3 desde cero',
    'https://www.freecodecamp.org/learn',
    'Programación Web',
    'Curso Online',
    2
),
(
    'Calculadora Científica en Python',
    'Código fuente de una calculadora científica implementada en Python',
    'https://github.com/usuario/calculadora',
    'Programación',
    'Código',
    3
);

-- ============================================
-- CONSULTAS ÚTILES (COMENTADAS)
-- ============================================

-- Ver todos los usuarios
-- SELECT * FROM usuarios;

-- Ver todos los recursos con información del usuario
-- SELECT r.*, u.nombre as usuario_nombre
-- FROM recursos r
-- JOIN usuarios u ON r.usuario_id = u.id
-- ORDER BY r.fecha_creacion DESC;

-- Ver recursos por curso
-- SELECT * FROM recursos WHERE curso = 'Programación Web';

-- Contar recursos por usuario
-- SELECT u.nombre, COUNT(r.id) as total_recursos
-- FROM usuarios u
-- LEFT JOIN recursos r ON u.id = r.usuario_id
-- GROUP BY u.id, u.nombre;

-- Ver cursos únicos
-- SELECT DISTINCT curso FROM recursos ORDER BY curso;
