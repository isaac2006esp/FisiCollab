<div align="center">

# 📚 Repositorio Colaborativo de Recursos

### Plataforma Web Full-Stack para Compartir Recursos Académicos

[![Node.js](https://img.shields.io/badge/Node.js-25.6.1-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

**Proyecto Académico - Promoción 2025 FISI**

[🚀 Quick Start](#-quick-start) • [✨ Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [📖 API](#-api-endpoints)

---

</div>

## 🎯 Descripción

Plataforma colaborativa desarrollada con arquitectura **MVC profesional** que permite a estudiantes universitarios compartir y descubrir recursos académicos de manera eficiente y organizada.

### 🌟 Características Principales

<table>
<tr>
<td width="50%">

#### 👤 Gestión de Usuarios
- ✅ Registro con validación de email
- 🔐 Autenticación segura (bcrypt)
- 🔄 Sesiones persistentes
- 🛡️ Protección CSRF

</td>
<td width="50%">

#### 📁 Gestión de Recursos
- ➕ Crear y compartir recursos
- 🔍 Filtrado por curso/materia
- 📊 Vista organizada por categorías
- ✏️ Editar y eliminar propios recursos

</td>
</tr>
<tr>
<td width="50%">

#### 🎨 Interfaz Moderna
- 📱 Diseño responsive
- 🌈 Gradientes dinámicos
- ⚡ Carga rápida
- 💫 Animaciones suaves

</td>
<td width="50%">

#### 🔧 Código Profesional
- 📝 JSDoc completo
- 🏗️ Arquitectura MVC
- ✨ Código limpio (Clean Code)
- 🎯 Validaciones robustas

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Requisitos Previos

- [Node.js](https://nodejs.org/) v14+ instalado ✅
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) 5.7+ corriendo ✅
- Git (opcional)

### Instalación en 3 Pasos

```bash
# 1. Clonar el repositorio (o descargar ZIP)
git clone https://github.com/FISI-2025-II/FisiCollab.git
cd FisiCollab

# 2. Configuración automática (instala dependencias + crea BD)
npm run setup

# 3. Iniciar servidor
npm start
```

<div align="center">

**¡Listo! Abre http://localhost:3000 en tu navegador** 🎉

</div>

---

## 🛠️ Tech Stack

<div align="center">

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcryptjs-2.4.3-orange?style=flat-square)

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

### Desarrollo
![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=flat-square&logo=nodemon&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)
![dotenv](https://img.shields.io/badge/.env-ECD53F?style=flat-square&logo=dotenv&logoColor=black)

</div>

---

## 📁 Estructura del Proyecto

```
📦 FisiCollab/
├── 📂 config/                  # Configuración de base de datos
│   └── database.js            # Pool de conexiones MySQL
├── 📂 models/                  # Capa de datos (ORM manual)
│   ├── Usuario.js             # Modelo de usuarios
│   └── Recurso.js             # Modelo de recursos
├── 📂 controllers/             # Lógica de negocio
│   ├── usuarioController.js   # Autenticación y usuarios
│   └── recursoController.js   # CRUD de recursos
├── 📂 routes/                  # Rutas de la API
│   ├── usuarios.js            # Endpoints de usuarios
│   └── recursos.js            # Endpoints de recursos
├── 📂 middleware/              # Middlewares personalizados
│   └── auth.js                # Verificación de autenticación
├── 📂 views/                   # Vistas HTML
│   ├── login.html
│   ├── registro.html
│   ├── dashboard.html
│   └── agregar.html
├── 📂 public/                  # Archivos estáticos
│   ├── css/styles.css         # 650+ líneas de estilos
│   └── js/                    # JavaScript del cliente
├── 📂 database/
│   └── schema.sql             # Script de creación de BD
├── 📄 server.js               # Servidor Express principal
├── 📄 configurar.js           # Setup automático
├── 📄 verificar-instalacion.js # Verificador de requisitos
├── 📄 package.json            # Dependencias
├── 📄 .env                    # Variables de entorno
└── 📄 README.md               # Este archivo
```

---

## ✨ Features

### 🔐 Sistema de Autenticación

```javascript
✓ Hash de contraseñas con bcrypt (salt rounds: 10)
✓ Sesiones seguras con express-session
✓ Middleware de autenticación
✓ Protección CSRF (sameSite: 'strict')
✓ Validación de email con regex
✓ Mensajes de error informativos
```

### 📚 Gestión de Recursos

```javascript
✓ CRUD completo de recursos académicos
✓ Tipos: Video, Documento, Código, Curso Online, Presentación
✓ Validación de URLs con regex
✓ Filtrado dinámico por curso
✓ Búsqueda por usuario
✓ Lista de cursos únicos
✓ Verificación de propiedad (editar/eliminar)
```

### 🎨 Interfaz de Usuario

```css
✓ Diseño responsive (mobile-first)
✓ Gradientes dinámicos con animaciones
✓ Cards con hover effects
✓ Grid system adaptativo
✓ Formularios con validación visual
✓ Mensajes de feedback al usuario
✓ Carga asíncrona con Fetch API
```

---

## 📖 Comandos

```bash
# Configuración automática (primera vez)
npm run setup              # Configura MySQL y crea BD

# Verificar instalación
npm run verify             # Verifica requisitos del sistema

# Desarrollo
npm run dev                # Inicia con nodemon (auto-reload)

# Producción
npm start                  # Inicia servidor en modo producción
```

---

## 📡 API Endpoints

### Autenticación
```http
POST   /api/usuarios/registro     # Registrar nuevo usuario
POST   /api/usuarios/login        # Iniciar sesión
POST   /api/usuarios/logout       # Cerrar sesión
GET    /api/usuarios/me           # Usuario actual
GET    /api/usuarios              # Listar todos
```

### Recursos
```http
GET    /api/recursos              # Obtener todos los recursos
GET    /api/recursos?curso=X      # Filtrar por curso
GET    /api/recursos/:id          # Obtener recurso por ID
GET    /api/recursos/mis-recursos # Recursos del usuario actual
POST   /api/recursos              # Crear nuevo recurso
PUT    /api/recursos/:id          # Actualizar recurso
DELETE /api/recursos/:id         # Eliminar recurso
GET    /api/recursos/cursos/lista # Obtener cursos únicos
```

### Sistema
```http
GET    /api/health                # Estado del servidor y BD
```

### Ejemplo de Uso

```bash
# Health check
curl http://localhost:3000/api/health

# Login
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@fisi.edu.pe","password":"password123"}'

# Obtener recursos
curl http://localhost:3000/api/recursos
```

---

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=recursos_academicos
DB_PORT=3306

# Sesión
SESSION_SECRET=tu_secreto_super_seguro
```

---

## 🏗️ Arquitectura MVC

```
┌─────────────┐
│   Cliente   │ (Views HTML + Public JS/CSS)
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────┐
│   Routes    │ (usuarios.js, recursos.js)
└──────┬──────┘
       │ req, res
       ▼
┌─────────────┐
│ Controllers │ (usuarioController, recursoController)
└──────┬──────┘
       │ Business Logic
       ▼
┌─────────────┐
│   Models    │ (Usuario.js, Recurso.js)
└──────┬──────┘
       │ SQL Queries
       ▼
┌─────────────┐
│  Database   │ (MySQL)
└─────────────┘
```

### Flujo de Autenticación

```
Usuario → /login → POST /api/usuarios/login
                    ↓
            Verificar credenciales
                    ↓
            Crear sesión (express-session)
                    ↓
            Redirect a /dashboard
                    ↓
            Middleware verifica sesión
                    ↓
            Acceso permitido ✓
```

---

## 🔒 Seguridad

### Características de Seguridad Implementadas

- ✅ **Contraseñas hasheadas** con bcrypt (salt rounds: 10)
- ✅ **Sessions seguras** con `httpOnly`, `sameSite: 'strict'`
- ✅ **Validación de inputs** en frontend y backend
- ✅ **Protección SQL Injection** con prepared statements
- ✅ **CORS configurado** según entorno
- ✅ **Variables de entorno** para datos sensibles

### Validaciones Implementadas

```javascript
// Email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// URL de recursos
const URL_REGEX = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}.*$/;

// Constraints
const MIN_PASSWORD_LENGTH = 6;
const MAX_TITULO_LENGTH = 200;
const MAX_DESCRIPCION_LENGTH = 1000;
const BCRYPT_SALT_ROUNDS = 10;
```

---

## 🎓 Usuarios de Prueba

Si ejecutaste el script completo `schema.sql`:

| Email | Contraseña | Recursos |
|-------|------------|----------|
| juan@fisi.edu.pe | password123 | 2 |
| maria@fisi.edu.pe | password123 | 2 |
| carlos@fisi.edu.pe | password123 | 1 |

---

## 🐛 Troubleshooting

### MySQL no conecta

```bash
# Verificar que MySQL esté corriendo
netstat -ano | findstr :3306

# Verificar credenciales
mysql -u root -p

# Ver logs del servidor
npm start
```

### Puerto 3000 en uso

```bash
# Cambiar puerto en .env
PORT=3001

# O detener proceso
netstat -ano | findstr :3000
taskkill /PID [numero] /F
```

### Error "Cannot find module"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentación Adicional

- 📖 **[DESPLIEGUE-LOCAL.md](DESPLIEGUE-LOCAL.md)** - Guía completa de despliegue
- 🐙 **[GitHub Repository](https://github.com/FISI-2025-II/FisiCollab)** - Código fuente

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit tus cambios (`git commit -m 'Agregar nueva feature'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

---

## 📄 Licencia

Proyecto académico para **Facultad de Ingeniería de Sistemas - FISI**  
Universidad Nacional Mayor de San Marcos (UNMSM)

---

## 👥 Equipo

**Promoción 2025 - FISI**

Desarrollado con ❤️ para facilitar el aprendizaje colaborativo

---

<div align="center">

### ⭐ Si te ayudó este proyecto, dale una estrella en GitHub

**Hecho con Node.js, Express, MySQL y mucho ☕**

[![GitHub](https://img.shields.io/badge/GitHub-FISI--2025--II-181717?style=for-the-badge&logo=github)](https://github.com/FISI-2025-II/FisiCollab)

</div>
