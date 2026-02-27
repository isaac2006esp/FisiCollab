# 🚀 GUÍA DE INICIO RÁPIDO

## ⚡ Configuración en 5 Pasos

### 1️⃣ Instalar MySQL
- Descarga e instala MySQL desde: https://dev.mysql.com/downloads/
- Durante la instalación, establece una contraseña para el usuario `root`

### 2️⃣ Crear la Base de Datos
Abre tu terminal MySQL:
```bash
mysql -u root -p
```

Luego ejecuta estos comandos uno por uno:
```sql
CREATE DATABASE recursos_academicos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE recursos_academicos;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE recursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    enlace VARCHAR(500) NOT NULL,
    curso VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    usuario_id INT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_curso (curso),
    INDEX idx_tipo (tipo),
    INDEX idx_usuario (usuario_id),
    INDEX idx_fecha (fecha_creacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

exit;
```

### 3️⃣ Configurar Variables de Entorno
El archivo `.env` ya está creado. **Solo necesitas actualizar la contraseña de MySQL:**

Abre el archivo `.env` y cambia esta línea:
```env
DB_PASSWORD=tu_contraseña_aqui
```

Por tu contraseña real de MySQL:
```env
DB_PASSWORD=micontraseña123
```

### 4️⃣ Instalar Dependencias (Ya hecho ✅)
```bash
npm install
```

### 5️⃣ Iniciar el Servidor
```bash
npm run dev
```

¡Listo! Abre tu navegador en: **http://localhost:3000**

---

## 📱 Páginas Disponibles

- **http://localhost:3000/** → Login
- **http://localhost:3000/registro** → Registro de usuarios
- **http://localhost:3000/dashboard** → Dashboard principal
- **http://localhost:3000/agregar-recurso** → Agregar recursos

---

## 🎯 Prueba Rápida del Sistema

1. **Registra un usuario:**
   - Ve a http://localhost:3000/registro
   - Llena el formulario
   - Haz clic en "Registrarse"

2. **Agrega un recurso:**
   - Haz clic en "Agregar Nuevo Recurso"
   - Llena el formulario con datos de ejemplo:
     - Título: "Tutorial de JavaScript"
     - Descripción: "Video tutorial sobre JS básico"
     - Enlace: "https://www.youtube.com/watch?v=ejemplo"
     - Curso: "Programación Web"
     - Tipo: "Video"
   - Haz clic en "Guardar Recurso"

3. **Visualiza los recursos:**
   - Verás tu recurso en el dashboard
   - Prueba el filtro por curso

---

## 🐛 Problemas Comunes

### ❌ Error: "Cannot connect to MySQL"
**Solución:**
- Verifica que MySQL esté corriendo
- Confirma la contraseña en el archivo `.env`
- Asegúrate de haber creado la base de datos

### ❌ Error: "Module not found"
**Solución:**
```bash
npm install
```

### ❌ Error: "Port 3000 is already in use"
**Solución:**
Cambia el puerto en el archivo `.env`:
```env
PORT=3001
```

---

## 📚 Comandos Útiles

```bash
# Iniciar servidor en modo desarrollo (con auto-reinicio)
npm run dev

# Iniciar servidor en modo producción
npm start

# Ver logs de MySQL (si tienes problemas de conexión)
mysql -u root -p -e "SHOW DATABASES;"

# Verificar que las tablas existen
mysql -u root -p -e "USE recursos_academicos; SHOW TABLES;"

# Ver recursos agregados
mysql -u root -p -e "USE recursos_academicos; SELECT * FROM recursos;"
```

---

## 🎓 Estructura del Código

```
📁 Backend (Node.js + Express)
├── server.js          → Servidor principal
├── config/            → Configuración de BD
├── models/            → Modelos (Usuario, Recurso)
├── controllers/       → Lógica de negocio
├── routes/            → Rutas de la API
└── middleware/        → Autenticación

📁 Frontend (HTML + CSS + JS)
├── views/             → Páginas HTML
└── public/
    ├── css/           → Estilos
    └── js/            → Lógica del cliente

📁 Base de Datos (MySQL)
└── database/          → Scripts SQL
```

---

## 💡 Consejos para el Equipo

1. **Antes de subir cambios a GitHub:**
   ```bash
   git pull origin main
   git add .
   git commit -m "Descripción clara del cambio"
   git push origin main
   ```

2. **Nunca subas el archivo `.env`** (ya está en .gitignore)

3. **Documenta tus cambios** en commits descriptivos

4. **Prueba antes de subir** - Verifica que todo funcione

---

## 🆘 ¿Necesitas Ayuda?

1. Revisa el archivo `README.md` completo
2. Consulta la documentación de [Express](https://expressjs.com/)
3. Consulta la documentación de [MySQL](https://dev.mysql.com/doc/)
4. Abre un issue en el repositorio de GitHub

---

**¡Éxito con tu proyecto! 🚀**
