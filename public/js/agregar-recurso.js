/**
 * AGREGAR-RECURSO.JS
 * Maneja el formulario para agregar nuevos recursos
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    verificarAutenticacion();
    
    const formAgregarRecurso = document.getElementById('formAgregarRecurso');
    const mensajeDiv = document.getElementById('mensaje');

    // Event listeners
    document.getElementById('btnCerrarSesion').addEventListener('click', cerrarSesion);
    formAgregarRecurso.addEventListener('submit', agregarRecurso);
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
 * Agregar un nuevo recurso
 * @param {Event} e - Evento del formulario
 */
async function agregarRecurso(e) {
    e.preventDefault();

    // Obtener valores del formulario
    const titulo = document.getElementById('titulo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const enlace = document.getElementById('enlace').value.trim();
    const curso = document.getElementById('curso').value.trim();
    const tipo = document.getElementById('tipo').value;

    // Validaciones básicas
    if (!titulo || !descripcion || !enlace || !curso || !tipo) {
        mostrarMensaje('Por favor completa todos los campos', 'error');
        return;
    }

    // Validar que el enlace sea una URL válida
    try {
        new URL(enlace);
    } catch (error) {
        mostrarMensaje('Por favor ingresa un enlace válido (debe comenzar con http:// o https://)', 'error');
        return;
    }

    // Deshabilitar el botón de envío para evitar envíos duplicados
    const btnSubmit = e.target.querySelector('button[type="submit"]');
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Guardando...';

    try {
        const response = await fetch('/api/recursos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo,
                descripcion,
                enlace,
                curso,
                tipo
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Recurso agregado exitosamente
            mostrarMensaje('✓ Recurso agregado exitosamente', 'exito');
            
            // Limpiar el formulario
            document.getElementById('formAgregarRecurso').reset();
            
            // Redirigir al dashboard después de 2 segundos
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        } else {
            // Error al agregar recurso
            mostrarMensaje(data.error || 'Error al agregar el recurso', 'error');
            btnSubmit.disabled = false;
            btnSubmit.textContent = '💾 Guardar Recurso';
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión. Por favor intenta de nuevo.', 'error');
        btnSubmit.disabled = false;
        btnSubmit.textContent = '💾 Guardar Recurso';
    }
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
 * Mostrar mensaje de éxito o error
 * @param {string} mensaje - Texto del mensaje
 * @param {string} tipo - 'exito', 'error' o 'info'
 */
function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.className = `mensaje ${tipo}`;
    mensajeDiv.classList.remove('oculto');

    // Scroll hacia el mensaje
    mensajeDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Ocultar el mensaje después de 5 segundos (solo si es error)
    if (tipo === 'error') {
        setTimeout(() => {
            mensajeDiv.classList.add('oculto');
        }, 5000);
    }
}

/**
 * Validación en tiempo real de URL
 */
document.addEventListener('DOMContentLoaded', () => {
    const enlaceInput = document.getElementById('enlace');
    
    if (enlaceInput) {
        enlaceInput.addEventListener('blur', () => {
            const enlace = enlaceInput.value.trim();
            
            if (enlace && !enlace.startsWith('http://') && !enlace.startsWith('https://')) {
                enlaceInput.setCustomValidity('El enlace debe comenzar con http:// o https://');
                enlaceInput.reportValidity();
            } else {
                enlaceInput.setCustomValidity('');
            }
        });
    }
});
