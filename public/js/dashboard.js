/**
 * DASHBOARD.JS
 * Maneja la visualización de recursos y funcionalidades del dashboard
 */

// Estado global
let todosLosRecursos = [];
let cursosDisponibles = [];

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación y cargar datos
    verificarAutenticacion();
    cargarUsuario();
    cargarRecursos();
    cargarCursos();

    // Event listeners
    document.getElementById('btnCerrarSesion').addEventListener('click', cerrarSesion);
    document.getElementById('filtroCurso').addEventListener('change', filtrarRecursos);
    document.getElementById('btnActualizar').addEventListener('click', () => {
        cargarRecursos();
        mostrarMensaje('Recursos actualizados', 'exito');
    });
});

/**
 * Verificar si el usuario está autenticado
 */
async function verificarAutenticacion() {
    try {
        const response = await fetch('/api/usuarios/me');
        
        if (!response.ok) {
            // No está autenticado, redirigir al login
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error al verificar autenticación:', error);
        window.location.href = '/';
    }
}

/**
 * Cargar información del usuario actual
 */
async function cargarUsuario() {
    try {
        const response = await fetch('/api/usuarios/me');
        
        if (response.ok) {
            const data = await response.json();
            document.getElementById('nombreUsuario').textContent = data.usuario.nombre;
        }
    } catch (error) {
        console.error('Error al cargar usuario:', error);
    }
}

/**
 * Cargar todos los recursos
 */
async function cargarRecursos() {
    const listaRecursosDiv = document.getElementById('listaRecursos');
    const sinRecursosDiv = document.getElementById('sinRecursos');
    
    // Mostrar mensaje de carga
    listaRecursosDiv.innerHTML = '<div class="loading">Cargando recursos...</div>';
    sinRecursosDiv.classList.add('oculto');

    try {
        const response = await fetch('/api/recursos');
        
        if (response.ok) {
            const data = await response.json();
            todosLosRecursos = data.recursos;
            
            if (todosLosRecursos.length === 0) {
                listaRecursosDiv.innerHTML = '';
                sinRecursosDiv.classList.remove('oculto');
            } else {
                mostrarRecursos(todosLosRecursos);
                actualizarEstadisticas(todosLosRecursos.length);
            }
        } else {
            listaRecursosDiv.innerHTML = '<div class="error">Error al cargar recursos</div>';
        }
    } catch (error) {
        console.error('Error al cargar recursos:', error);
        listaRecursosDiv.innerHTML = '<div class="error">Error de conexión</div>';
    }
}

/**
 * Mostrar recursos en el DOM
 * @param {Array} recursos - Array de recursos a mostrar
 */
function mostrarRecursos(recursos) {
    const listaRecursosDiv = document.getElementById('listaRecursos');
    
    if (recursos.length === 0) {
        listaRecursosDiv.innerHTML = '';
        document.getElementById('sinRecursos').classList.remove('oculto');
        return;
    }

    document.getElementById('sinRecursos').classList.add('oculto');
    
    // Generar HTML para cada recurso
    const recursosHTML = recursos.map(recurso => `
        <div class="recurso-card">
            <div class="recurso-header">
                <h3 class="recurso-titulo">${escapeHtml(recurso.titulo)}</h3>
                <div class="recurso-badges">
                    <span class="badge badge-curso">${escapeHtml(recurso.curso)}</span>
                    <span class="badge badge-tipo">${escapeHtml(recurso.tipo)}</span>
                </div>
            </div>
            
            <p class="recurso-descripcion">${escapeHtml(recurso.descripcion)}</p>
            
            <div class="recurso-acciones">
                <a href="${escapeHtml(recurso.enlace)}" target="_blank" class="btn btn-primary btn-small">
                    🔗 Ver Recurso
                </a>
            </div>
            
            <div class="recurso-meta">
                <span class="recurso-autor">👤 ${escapeHtml(recurso.usuario_nombre)}</span>
                <span class="recurso-fecha">${formatearFecha(recurso.fecha_creacion)}</span>
            </div>
        </div>
    `).join('');
    
    listaRecursosDiv.innerHTML = recursosHTML;
}

/**
 * Cargar lista de cursos disponibles
 */
async function cargarCursos() {
    try {
        const response = await fetch('/api/recursos/cursos/lista');
        
        if (response.ok) {
            const data = await response.json();
            cursosDisponibles = data.cursos;
            
            // Actualizar el select de filtros
            const filtroCursoSelect = document.getElementById('filtroCurso');
            cursosDisponibles.forEach(curso => {
                const option = document.createElement('option');
                option.value = curso;
                option.textContent = curso;
                filtroCursoSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al cargar cursos:', error);
    }
}

/**
 * Filtrar recursos por curso
 */
function filtrarRecursos() {
    const cursoSeleccionado = document.getElementById('filtroCurso').value;
    
    if (cursoSeleccionado === 'todos') {
        mostrarRecursos(todosLosRecursos);
        actualizarEstadisticas(todosLosRecursos.length);
    } else {
        const recursosFiltrados = todosLosRecursos.filter(
            recurso => recurso.curso === cursoSeleccionado
        );
        mostrarRecursos(recursosFiltrados);
        actualizarEstadisticas(recursosFiltrados.length);
    }
}

/**
 * Actualizar estadísticas en el dashboard
 * @param {number} total - Total de recursos a mostrar
 */
function actualizarEstadisticas(total) {
    document.getElementById('totalRecursos').textContent = total;
}

/**
 * Cerrar sesión
 */
async function cerrarSesion() {
    try {
        const response = await fetch('/api/usuarios/logout', {
            method: 'POST'
        });
        
        if (response.ok) {
            window.location.href = '/';
        } else {
            mostrarMensaje('Error al cerrar sesión', 'error');
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        mostrarMensaje('Error de conexión', 'error');
    }
}

/**
 * Mostrar mensaje temporal
 * @param {string} mensaje - Texto del mensaje
 * @param {string} tipo - 'exito', 'error' o 'info'
 */
function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.className = `mensaje ${tipo}`;
    mensajeDiv.classList.remove('oculto');
    
    setTimeout(() => {
        mensajeDiv.classList.add('oculto');
    }, 3000);
}

/**
 * Formatear fecha a formato legible
 * @param {string} fecha - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
function formatearFecha(fecha) {
    const date = new Date(fecha);
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('es-ES', opciones);
}

/**
 * Escapar HTML para prevenir XSS
 * @param {string} texto - Texto a escapar
 * @returns {string} Texto escapado
 */
function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}
