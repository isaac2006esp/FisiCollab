/**
 * REGISTRO.JS
 * Maneja el formulario de registro de nuevos usuarios
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const formRegistro = document.getElementById('formRegistro');
    const mensajeDiv = document.getElementById('mensaje');

    // Manejar el envío del formulario
    formRegistro.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevenir el envío normal del formulario

        // Obtener los valores del formulario
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmar_password = document.getElementById('confirmar_password').value;

        // Validaciones del lado del cliente
        if (!nombre || !email || !password || !confirmar_password) {
            mostrarMensaje('Por favor completa todos los campos', 'error');
            return;
        }

        if (password !== confirmar_password) {
            mostrarMensaje('Las contraseñas no coinciden', 'error');
            return;
        }

        if (password.length < 6) {
            mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        try {
            // Hacer la petición POST al servidor
            const response = await fetch('/api/usuarios/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    email,
                    password,
                    confirmar_password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Registro exitoso
                mostrarMensaje('¡Registro exitoso! Redirigiendo...', 'exito');
                
                // Limpiar el formulario
                formRegistro.reset();
                
                // Redirigir al dashboard después de 1.5 segundos
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            } else {
                // Error en el registro
                mostrarMensaje(data.error || 'Error al registrar usuario', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error de conexión. Por favor intenta de nuevo.', 'error');
        }
    });

    /**
     * Mostrar mensaje de éxito o error
     * @param {string} mensaje - Texto del mensaje
     * @param {string} tipo - 'exito' o 'error'
     */
    function mostrarMensaje(mensaje, tipo) {
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

    // Validación en tiempo real de coincidencia de contraseñas
    const passwordInput = document.getElementById('password');
    const confirmarPasswordInput = document.getElementById('confirmar_password');

    confirmarPasswordInput.addEventListener('input', () => {
        if (confirmarPasswordInput.value && passwordInput.value !== confirmarPasswordInput.value) {
            confirmarPasswordInput.setCustomValidity('Las contraseñas no coinciden');
        } else {
            confirmarPasswordInput.setCustomValidity('');
        }
    });
});
