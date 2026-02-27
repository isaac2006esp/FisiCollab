# 📖 CONCEPTOS CLAVE PARA ESTUDIANTES

Este documento explica los conceptos importantes del proyecto para estudiantes de primer ciclo.

## 🏗️ Arquitectura del Proyecto: MVC

### ¿Qué es MVC?
MVC significa **Modelo-Vista-Controlador**. Es un patrón de diseño que separa la aplicación en 3 partes:

```
┌─────────────┐
│   VISTA     │  → Lo que ve el usuario (HTML, CSS, JS)
│  (views/)   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ CONTROLADOR │  → Lógica de negocio (¿qué hacer?)
│(controllers)│
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   MODELO    │  → Manejo de datos (Base de Datos)
│  (models/)  │
└─────────────┘
```

### Ejemplo Práctico: Agregar un Recurso

**1. VISTA (agregar-recurso.html):**
- Formulario donde el usuario ingresa datos
- Botón "Guardar Recurso"

**2. CONTROLADOR (recursoController.js):**
- Recibe los datos del formulario
- Valida que estén completos
- Llama al modelo para guardarlos

**3. MODELO (Recurso.js):**
- Se conecta a MySQL
- Ejecuta el INSERT para guardar en la BD
- Retorna el resultado

---

## 🔄 ¿Cómo Funciona una Petición?

### Ejemplo: Login de Usuario

```
1. Usuario llena formulario en login.html
   📝 Email: juan@fisi.edu.pe
   📝 Password: 123456

2. JavaScript (login.js) envía datos al servidor
   → fetch('/api/usuarios/login', {datos})

3. Express recibe en la ruta (routes/usuarios.js)
   → router.post('/login', ...)

4. Controlador procesa (usuarioController.js)
   → Busca usuario en BD
   → Verifica contraseña
   → Crea sesión

5. Modelo consulta BD (Usuario.js)
   → SELECT * FROM usuarios WHERE email = ?

6. Respuesta regresa al cliente
   → JSON con resultado
   → Redirección al dashboard
```

---

## 🗄️ Base de Datos: Relaciones

### Tabla: usuarios
```
┌────┬─────────────┬──────────────────┬──────────┐
│ id │   nombre    │      email       │ password │
├────┼─────────────┼──────────────────┼──────────┤
│ 1  │ Juan Pérez  │ juan@fisi.edu.pe │ ******** │
│ 2  │ María López │ maria@fisi.edu.pe│ ******** │
└────┴─────────────┴──────────────────┴──────────┘
```

### Tabla: recursos
```
┌────┬─────────────┬──────────┬────────────┬────────────┐
│ id │   titulo    │  curso   │  enlace    │ usuario_id │
├────┼─────────────┼──────────┼────────────┼────────────┤
│ 1  │ Tutorial JS │ Prog Web │ https://...│     1      │
│ 2  │ Guía MySQL  │ Base DD  │ https://...│     1      │
│ 3  │ Ejercicios  │ Algoritm │ https://...│     2      │
└────┴─────────────┴──────────┴────────────┴────────────┘
                                                   ↑
                                                   │
                    Relación: usuario_id → usuarios.id
```

**Esto se llama "Clave Foránea" (Foreign Key)**
- Cada recurso pertenece a un usuario
- Si se elimina un usuario, se eliminan sus recursos (CASCADE)

---

## 🔐 Seguridad: ¿Por qué bcrypt?

### ❌ MAL (Nunca hacer esto):
```javascript
// Guardar contraseña en texto plano
password: "123456"
```
Si alguien hackea la BD, verá todas las contraseñas.

### ✅ BIEN (Lo que hacemos):
```javascript
// Encriptar con bcrypt
const hash = await bcrypt.hash("123456", 10);
// Guarda: "$2a$10$xYz..."
```

**¿Cómo funciona?**
1. El usuario ingresa: "123456"
2. bcrypt lo convierte a: "$2a$10$xYz..." (irreversible)
3. Se guarda el hash en la BD
4. Al hacer login, bcrypt compara hashes, no contraseñas

---

## 🌐 Cliente vs Servidor

```
┌─────────────────────┐         ┌─────────────────────┐
│     CLIENTE         │         │      SERVIDOR       │
│   (Navegador)       │         │   (Node.js/Express) │
├─────────────────────┤         ├─────────────────────┤
│                     │         │                     │
│  • HTML             │         │  • Procesa datos    │
│  • CSS              │  HTTP   │  • Consulta BD      │
│  • JavaScript       │◄───────►│  • Valida           │
│  • Formularios      │ Request │  • Autenticación    │
│  • Mostrar datos    │Response │  • Lógica negocio   │
│                     │         │                     │
└─────────────────────┘         └──────────┬──────────┘
                                           │
                                           ↓
                                  ┌─────────────────┐
                                  │      MySQL      │
                                  │  (Base de Datos)│
                                  └─────────────────┘
```

---

## 🚀 APIs REST: Los "Endpoints"

Un endpoint es una URL que realiza una acción específica.

### Ejemplos de Nuestras APIs:

| Método | URL | ¿Qué hace? |
|--------|-----|------------|
| POST | `/api/usuarios/registro` | Crear nuevo usuario |
| POST | `/api/usuarios/login` | Iniciar sesión |
| GET | `/api/recursos` | Obtener todos los recursos |
| POST | `/api/recursos` | Crear nuevo recurso |
| DELETE | `/api/recursos/:id` | Eliminar un recurso |

### Métodos HTTP:
- **GET**: Obtener/Leer datos
- **POST**: Crear datos nuevos
- **PUT**: Actualizar datos existentes
- **DELETE**: Eliminar datos

---

## 🔑 Sesiones: ¿Cómo mantiene login?

### Sin Sesiones:
```
Usuario hace login → ✅
Usuario va a otra página → ❌ Pregunta: "¿Quién eres?"
```

### Con Sesiones (express-session):
```
1. Usuario hace login → ✅
2. Servidor crea sesión: { userId: 1, userName: "Juan" }
3. Servidor envía cookie al navegador
4. Navegador guarda cookie
5. En cada petición, envía la cookie
6. Servidor reconoce: "Ah, eres Juan (userId: 1)"
```

---

## 📦 Dependencias: ¿Qué es npm?

**npm** = Node Package Manager (gestor de paquetes)

### ¿Qué hace `npm install`?
Descarga e instala las librerías que necesitamos:

```json
"dependencies": {
  "express": "^4.18.2",        // Framework web
  "mysql2": "^3.6.5",          // Conexión a MySQL
  "bcryptjs": "^2.4.3",        // Encriptación
  "express-session": "^1.17.3" // Sesiones
}
```

Es como descargar libros de una biblioteca. No escribimos todo desde cero.

---

## 🎨 Frontend: Fetch API

### ¿Cómo enviar datos al servidor?

```javascript
// Ejemplo: Agregar recurso
async function agregarRecurso() {
    const datos = {
        titulo: "Tutorial JS",
        curso: "Programación Web",
        enlace: "https://..."
    };

    const response = await fetch('/api/recursos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    const resultado = await response.json();
    console.log(resultado); // { mensaje: "Recurso creado..." }
}
```

---

## 🔍 Debugging: Cómo Buscar Errores

### 1. **Errores en el Navegador:**
```
F12 → Console → Ver mensajes de error
```

### 2. **Errores en el Servidor:**
```
Terminal donde corre npm run dev → Ver logs
```

### 3. **Errores de Base de Datos:**
```
mysql -u root -p
USE recursos_academicos;
SELECT * FROM recursos; -- Ver datos
```

### Técnica del console.log():
```javascript
async function crearRecurso(datos) {
    console.log('Datos recibidos:', datos); // 👈 Para ver qué llega
    
    const resultado = await Recurso.crear(datos);
    
    console.log('Resultado:', resultado); // 👈 Para ver qué retorna
    
    return resultado;
}
```

---

## 📚 Glosario de Términos

- **Backend**: Parte del servidor (Node.js, Express, MySQL)
- **Frontend**: Parte del cliente (HTML, CSS, JavaScript)
- **API**: Punto de comunicación entre frontend y backend
- **CRUD**: Create, Read, Update, Delete (operaciones básicas)
- **JSON**: Formato de datos `{ "nombre": "Juan" }`
- **Async/Await**: Esperar resultados de operaciones asíncronas
- **Promise**: Promesa de que algo se completará en el futuro
- **Middleware**: Función que se ejecuta entre petición y respuesta
- **Router**: Manejador de rutas en Express
- **Query**: Consulta SQL a la base de datos
- **Hash**: Resultado de encriptar un texto (irreversible)
- **Session**: Datos que persisten mientras el usuario está logueado

---

## 💡 Consejos de Estudio

1. **Lee el código línea por línea** - No intentes entender todo de una vez
2. **Experimenta** - Cambia cosas y ve qué pasa
3. **Usa console.log()** - Para ver valores de variables
4. **Prueba en el navegador** - Usa F12 → Network para ver peticiones
5. **Pregunta** - Si no entiendes algo, busca o pregunta al equipo

---

## 🎯 Ejercicios Sugeridos

### Nivel Básico:
1. Cambia el color del botón de login en el CSS
2. Agrega un nuevo campo "autor" en el formulario de recursos
3. Modifica el mensaje de bienvenida en el dashboard

### Nivel Intermedio:
4. Agrega un botón para editar recursos
5. Implementa búsqueda de recursos por título
6. Agrega validación: el enlace debe empezar con "https://"

### Nivel Avanzado:
7. Implementa sistema de "favoritos" (guardar recursos)
8. Agrega paginación (10 recursos por página)
9. Permite subir imágenes para cada recurso

---

**¡Sigue aprendiendo y practicando! 🚀**
