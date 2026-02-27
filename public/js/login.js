/**
 * LOGIN.JS
 * Maneja el formulario de inicio de sesión
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');
    const mensajeDiv = document.getElementById('mensaje');

    // Manejar el envío del formulario
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevenir el envío normal del formulario

        // Obtener los valores del formulario
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Hacer la petición POST al servidor
            const response = await fetch('/api/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Login exitoso
                mostrarMensaje('¡Inicio de sesión exitoso! Redirigiendo...', 'exito');
                
                // Redirigir al dashboard después de 1 segundo
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            } else {
                // Error en el login
                mostrarMensaje(data.error || 'Error al iniciar sesión', 'error');
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

        // Ocultar el mensaje después de 5 segundos
        setTimeout(() => {
            mensajeDiv.classList.add('oculto');
        }, 5000);
    }
});
