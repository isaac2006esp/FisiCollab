# 👥 GUÍA DE TRABAJO EN EQUIPO

## 🤝 Colaboración en GitHub

### 📋 Roles Sugeridos en el Equipo

1. **Project Manager / Líder**
   - Coordina el equipo
   - Revisa Pull Requests
   - Asigna tareas

2. **Backend Developer(s)**
   - Trabaja en server.js, models, controllers, routes
   - Mantiene la base de datos

3. **Frontend Developer(s)**
   - Trabaja en views, CSS, JavaScript del cliente
   - Diseño y UX

4. **Database Administrator**
   - Gestiona MySQL
   - Optimiza consultas
   - Backup de datos

5. **Documentation / Testing**
   - Mantiene README actualizado
   - Prueba funcionalidades
   - Reporta bugs

---

## 🔄 Flujo de Trabajo Git

### 1. Antes de Comenzar a Trabajar

```bash
# 1. Asegúrate de estar en main
git checkout main

# 2. Descarga los últimos cambios
git pull origin main

# 3. Crea una rama para tu tarea
git checkout -b feature/nombre-de-tu-tarea
```

**Ejemplo de nombres de ramas:**
- `feature/agregar-busqueda`
- `fix/corregir-login`
- `ui/mejorar-dashboard`
- `docs/actualizar-readme`

### 2. Mientras Trabajas

```bash
# Ver qué archivos has modificado
git status

# Ver los cambios específicos
git diff

# Guardar progreso frecuentemente
git add .
git commit -m "Descripción clara del cambio"
```

### 3. Cuando Termines tu Tarea

```bash
# 1. Asegúrate de tener todo commiteado
git status

# 2. Actualiza main en tu rama (por si hubo cambios)
git checkout main
git pull origin main
git checkout feature/nombre-de-tu-tarea
git merge main

# 3. Resuelve conflictos si hay (ver sección abajo)

# 4. Sube tu rama a GitHub
git push origin feature/nombre-de-tu-tarea

# 5. Crea un Pull Request en GitHub
# (desde la interfaz web de GitHub)
```

### 4. Pull Request (PR)

1. Ve a: https://github.com/Crypt0xDev/FISI-2025-II
2. Haz clic en "Pull Requests" → "New Pull Request"
3. Selecciona tu rama
4. Describe qué cambios hiciste
5. Asigna a alguien para revisión
6. Espera aprobación
7. Haz merge

---

## ⚠️ Resolver Conflictos de Merge

### ¿Qué es un Conflicto?
Ocurre cuando dos personas modifican la misma línea de código.

### Cómo Resolverlo

```bash
# 1. Git te dirá qué archivos tienen conflictos
git status

# 2. Abre el archivo conflictivo
# Verás algo como:

<<<<<<< HEAD
const PORT = 3000;
=======
const PORT = 3001;
>>>>>>> feature/otra-rama

# 3. Decide qué código mantener:
const PORT = 3000;  # (elige uno o combina ambos)

# 4. Elimina los marcadores de conflicto (<<<<, ====, >>>>)

# 5. Guarda el archivo

# 6. Marca como resuelto
git add archivo-con-conflicto.js

# 7. Completa el merge
git commit -m "Resolver conflicto en configuración de puerto"
```

---

## 📝 Convenciones de Commits

### Formato:
```
tipo: descripción breve

Descripción más detallada (opcional)
```

### Tipos de Commit:
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato, espacios (no afecta código)
- `refactor:` Reestructuración de código
- `test:` Agregar tests
- `chore:` Tareas de mantenimiento

### Ejemplos:
```bash
git commit -m "feat: Agregar búsqueda de recursos por título"
git commit -m "fix: Corregir error en validación de email"
git commit -m "docs: Actualizar sección de instalación en README"
git commit -m "style: Mejorar diseño de tarjetas de recursos"
git commit -m "refactor: Simplificar función de login"
```

---

## 🚫 QUÉ NO HACER

### ❌ NUNCA hagas esto:

1. **NO trabajes directamente en `main`**
   ```bash
   # ❌ MAL
   git checkout main
   # trabajo aquí...
   git push origin main
   
   # ✅ BIEN
   git checkout -b feature/mi-tarea
   # trabajo aquí...
   git push origin feature/mi-tarea
   ```

2. **NO subas el archivo `.env`**
   - Contiene contraseñas
   - Ya está en .gitignore
   - Cada quien debe tener su propio .env

3. **NO subas `node_modules/`**
   - Está en .gitignore
   - Cada quien hace `npm install`

4. **NO hagas `git push -f` (force push)**
   - Puede borrar trabajo de otros
   - Solo úsalo si estás 100% seguro

5. **NO hagas commits gigantes**
   - Commit pequeños y frecuentes
   - Un commit = una funcionalidad

---

## 🎯 División de Tareas Sugerida

### Semana 1: Setup
- [ ] Todos clonan el repo
- [ ] Todos configuran MySQL
- [ ] Todos prueban que funcione
- [ ] Todos leen la documentación

### Semana 2: Funcionalidades Básicas
- [ ] Persona A: Mejorar validaciones del frontend
- [ ] Persona B: Agregar búsqueda de recursos
- [ ] Persona C: Mejorar diseño del dashboard
- [ ] Persona D: Agregar más datos de prueba

### Semana 3: Funcionalidades Avanzadas
- [ ] Persona A: Sistema de edición de recursos
- [ ] Persona B: Sistema de favoritos
- [ ] Persona C: Paginación de recursos
- [ ] Persona D: Perfil de usuario

### Semana 4: Pulido y Deploy
- [ ] Todos: Pruebas exhaustivas
- [ ] Todos: Corrección de bugs
- [ ] Todos: Actualizar documentación
- [ ] Todos: Preparar presentación

---

## 💬 Comunicación del Equipo

### Canales Recomendados:
- **WhatsApp/Telegram**: Comunicación diaria
- **GitHub Issues**: Reportar bugs y tareas
- **GitHub Discussions**: Preguntas generales
- **Reuniones**: Semanal para coordinar

### Plantilla de Issue en GitHub:

```markdown
## 🐛 Bug / ✨ Feature

**Descripción:**
Descripción clara de qué está pasando o qué quieres agregar

**Pasos para reproducir (si es bug):**
1. Ir a...
2. Hacer clic en...
3. Ver error...

**Comportamiento esperado:**
Qué debería pasar

**Screenshots:**
(Si aplica)

**Asignado a:** @usuario
**Prioridad:** Alta / Media / Baja
```

---

## 🔍 Revisión de Código (Code Review)

### Checklist para Revisar Pull Requests:

- [ ] El código funciona correctamente
- [ ] No hay errores en la consola
- [ ] El código está comentado
- [ ] Sigue las convenciones del proyecto
- [ ] No rompe funcionalidades existentes
- [ ] La base de datos sigue funcionando
- [ ] El diseño es responsive
- [ ] No hay archivos innecesarios (.env, node_modules, etc.)

### Cómo Comentar en un PR:

```markdown
✅ Se ve bien, solo algunos comentarios:

1. En `server.js` línea 45: ¿Podrías agregar un comentario explicando qué hace esta función?
2. El botón en `dashboard.html` necesita más padding
3. Falta validación en el campo de email

Por favor actualiza y lo vuelvo a revisar 👍
```

---

## 🆘 Comandos de Emergencia

### Si arruinaste algo localmente:
```bash
# Descartar TODOS los cambios (cuidado!)
git reset --hard HEAD

# Descartar cambios en un archivo específico
git checkout -- nombre-del-archivo.js

# Ver historial de commits
git log --oneline

# Volver a un commit anterior
git revert <commit-hash>
```

### Si subiste algo por error:
```bash
# Deshacer el último commit (mantiene cambios)
git reset HEAD~1

# Deshacer el último commit (borra cambios)
git reset --hard HEAD~1
```

### Si necesitas ayuda:
```bash
# Ver ayuda de comandos
git --help
git commit --help

# Ver estado actual
git status
git log
```

---

## 📅 Reuniones de Equipo

### Agenda Sugerida (30 minutos):

1. **Check-in (5 min)**
   - ¿Qué hiciste desde la última reunión?

2. **Demostración (10 min)**
   - Mostrar lo que cada uno completó

3. **Problemas (5 min)**
   - ¿Qué obstáculos encontraste?
   - ¿Necesitas ayuda con algo?

4. **Planificación (10 min)**
   - ¿Qué vas a hacer para la próxima reunión?
   - Asignar nuevas tareas

5. **Cierre (5 min)**
   - Acuerdos y próximos pasos

---

## 🎓 Recursos de Aprendizaje

### Git y GitHub:
- [Git Básico](https://git-scm.com/book/es/v2)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Interactive Git Tutorial](https://learngitbranching.js.org/)

### Node.js y Express:
- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/es/guide/routing.html)

### MySQL:
- [MySQL Tutorial](https://www.mysqltutorial.org/)
- [SQL Básico](https://www.w3schools.com/sql/)

---

## ✅ Checklist de "Listo para Producción"

Antes de considerar el proyecto terminado:

### Funcionalidad:
- [ ] Todas las funciones CRUD funcionan
- [ ] No hay bugs conocidos
- [ ] Las validaciones funcionan correctamente
- [ ] La autenticación es segura

### Código:
- [ ] Todo el código está comentado
- [ ] No hay console.logs innecesarios
- [ ] Variables tienen nombres descriptivos
- [ ] Código organizado y limpio

### Base de Datos:
- [ ] Las tablas tienen todos los campos necesarios
- [ ] Las relaciones funcionan correctamente
- [ ] Hay datos de prueba

### UI/UX:
- [ ] El diseño es responsive
- [ ] No hay elementos rotos
- [ ] Los mensajes de error son claros
- [ ] La navegación es intuitiva

### Documentación:
- [ ] README está actualizado
- [ ] Hay instrucciones de instalación
- [ ] Hay ejemplos de uso
- [ ] Los comentarios son claros

### Seguridad:
- [ ] Contraseñas encriptadas
- [ ] Sin inyección SQL
- [ ] .env no está en el repo
- [ ] Sesiones funcionan correctamente

---

## 🎉 Celebrar los Logros

No olviden:
- ✅ Celebrar cuando completen features importantes
- 🙏 Agradecer las contribuciones de cada miembro
- 🎯 Reconocer el esfuerzo del equipo
- 📸 Tomar screenshots del proyecto final
- 🚀 Compartir el proyecto en LinkedIn/Portafolio

---

## 📞 Contacto y Ayuda

Si tienes problemas:
1. Revisa la documentación (README, INICIO-RAPIDO, CONCEPTOS-CLAVE)
2. Busca en Google el error específico
3. Pregunta en el grupo del equipo
4. Crea un Issue en GitHub
5. Busca ayuda de alguien con más experiencia

---

**¡Éxito con el trabajo en equipo! 🚀👥**

Recuerda: La comunicación y organización son clave para un proyecto exitoso.
