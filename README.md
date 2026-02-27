# 📚 Repositorio Colaborativo de Recursos - Promoción 2025

Plataforma web colaborativa para compartir recursos académicos entre estudiantes de FISI.

## 🎯 Descripción

Este es un proyecto web full-stack que permite a los estudiantes:
- ✅ Registrarse e iniciar sesión de forma segura
- ➕ Agregar recursos académicos (videos, documentos, códigos, etc.)
- 📋 Ver lista completa de recursos compartidos
- 🔍 Filtrar recursos por curso/materia
- 👤 Identificar al autor de cada recurso

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución de JavaScript
- **Express** - Framework web para Node.js
- **MySQL** - Base de datos relacional
- **mysql2** - Driver de MySQL con soporte para promesas
- **bcryptjs** - Encriptación de contraseñas
- **express-session** - Manejo de sesiones de usuario
- **dotenv** - Configuración de variables de entorno

### Frontend
- **HTML5** - Estructura de las páginas
- **CSS3** - Estilos y diseño responsive
- **JavaScript (Vanilla)** - Lógica del cliente

## 📁 Estructura del Proyecto

```
FISI-2025-II/
│
├── config/                 # Configuraciones
│   └── database.js        # Conexión a MySQL
│
├── models/                # Modelos de datos (Capa de datos)
│   ├── Usuario.js        # Modelo de usuarios
│   └── Recurso.js        # Modelo de recursos
│
├── controllers/           # Controladores (Lógica de negocio)
│   ├── usuarioController.js
│   └── recursoController.js
│
├── routes/                # Rutas de la API
│   ├── usuarios.js       # Rutas de usuarios
│   └── recursos.js       # Rutas de recursos
│
├── middleware/            # Middlewares personalizados
│   └── auth.js           # Verificación de autenticación
│
├── views/                 # Páginas HTML
│   ├── login.html
│   ├── registro.html
│   ├── dashboard.html
│   └── agregar-recurso.html
│
├── public/                # Archivos estáticos
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── login.js
│   │   ├── registro.js
│   │   ├── dashboard.js
│   │   └── agregar-recurso.js
│   └── images/
│
├── database/              # Scripts SQL
│   └── schema.sql        # Creación de tablas
│
├── server.js             # Archivo principal del servidor
├── package.json          # Dependencias del proyecto
├── .env                  # Variables de entorno (NO subir a Git)
├── .env.example          # Ejemplo de variables de entorno
└── README.md             # Documentación

```

## 🚀 Instalación y Configuración

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [MySQL](https://www.mysql.com/) (versión 5.7 o superior)
- [Git](https://git-scm.com/)

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/Crypt0xDev/FISI-2025-II.git
cd FISI-2025-II
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar la base de datos

1. Abre MySQL desde la terminal o un cliente como MySQL Workbench:

```bash
mysql -u root -p
```

2. Ejecuta el script SQL para crear la base de datos y las tablas:

```bash
source database/schema.sql
```

O copia y pega el contenido del archivo `database/schema.sql` en tu cliente MySQL.

### Paso 4: Configurar variables de entorno

1. Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

2. Edita el archivo `.env` con tus credenciales de MySQL:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=recursos_academicos
DB_PORT=3306

SESSION_SECRET=cambia_esto_por_algo_seguro
```

### Paso 5: Iniciar el servidor

**Modo desarrollo (con reinicio automático):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📖 Uso de la Aplicación

### 1. Registro de Usuario
- Accede a `http://localhost:3000/registro`
- Completa el formulario con:
  - Nombre completo
  - Correo electrónico
  - Contraseña (mínimo 6 caracteres)
- Haz clic en "Registrarse"

### 2. Iniciar Sesión
- Accede a `http://localhost:3000/`
- Ingresa tu email y contraseña
- Haz clic en "Iniciar Sesión"

### 3. Ver Recursos
- En el dashboard verás todos los recursos compartidos
- Usa el filtro para ver recursos de un curso específico
- Haz clic en "Ver Recurso" para abrir el enlace

### 4. Agregar un Recurso
- Haz clic en "Agregar Nuevo Recurso"
- Completa el formulario:
  - **Título:** Nombre descriptivo del recurso
  - **Descripción:** Breve explicación del contenido
  - **Enlace:** URL del recurso (YouTube, Drive, GitHub, etc.)
  - **Curso:** Materia relacionada
  - **Tipo:** Categoría del recurso
- Haz clic en "Guardar Recurso"

## 🔒 Seguridad

- ✅ Contraseñas encriptadas con bcrypt
- ✅ Protección contra inyección SQL (consultas preparadas)
- ✅ Validación de datos en cliente y servidor
- ✅ Sesiones seguras con express-session
- ✅ Variables de entorno para datos sensibles

## 📊 Modelo de Base de Datos

### Tabla: `usuarios`
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- nombre (VARCHAR)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, encriptado)
- fecha_registro (DATETIME)
```

### Tabla: `recursos`
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- titulo (VARCHAR)
- descripcion (TEXT)
- enlace (VARCHAR)
- curso (VARCHAR)
- tipo (VARCHAR)
- usuario_id (INT, FOREIGN KEY)
- fecha_creacion (DATETIME)
```

## 🧪 API Endpoints

### Usuarios
| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/usuarios/registro` | Registrar nuevo usuario | No |
| POST | `/api/usuarios/login` | Iniciar sesión | No |
| POST | `/api/usuarios/logout` | Cerrar sesión | Sí |
| GET | `/api/usuarios/me` | Obtener usuario actual | Sí |
| GET | `/api/usuarios` | Listar todos los usuarios | Sí |

### Recursos
| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/recursos` | Crear nuevo recurso | Sí |
| GET | `/api/recursos` | Obtener todos los recursos | No |
| GET | `/api/recursos?curso=X` | Filtrar por curso | No |
| GET | `/api/recursos/:id` | Obtener recurso específico | No |
| GET | `/api/recursos/mis-recursos` | Recursos del usuario | Sí |
| PUT | `/api/recursos/:id` | Actualizar recurso | Sí |
| DELETE | `/api/recursos/:id` | Eliminar recurso | Sí |
| GET | `/api/recursos/cursos/lista` | Obtener cursos únicos | No |

## 👥 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios y haz commit:
   ```bash
   git commit -m "Agregar nueva funcionalidad"
   ```
4. Push a tu rama:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. Abre un Pull Request

## 🐛 Solución de Problemas

### Error de conexión a MySQL
- Verifica que MySQL esté corriendo
- Confirma las credenciales en el archivo `.env`
- Asegúrate de haber creado la base de datos

### Puerto en uso
- Cambia el puerto en `.env` si el 3000 está ocupado

### Módulos no encontrados
- Ejecuta `npm install` nuevamente

## 📝 Integrantes del Equipo

- [Agregar nombres de los integrantes]

## 📄 Licencia

Este proyecto es de código abierto para fines educativos.

## 🙏 Agradecimientos

Proyecto desarrollado como parte del curso FISI 2025-II.

---

**¿Tienes dudas o sugerencias?** Abre un *issue* en el repositorio.
