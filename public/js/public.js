/* document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessageDisplay = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previene el envío por defecto del formulario

        // Oculta cualquier mensaje de error anterior
        errorMessageDisplay.style.display = 'none';
        errorMessageDisplay.textContent = '';

        const formData = new FormData(event.target);
        const datos = {};
        formData.forEach((value, key) => {
            datos[key] = value;
        });

        console.log(datos); // Para depuración, puedes ver los datos que se envían

        try {
            const response = await fetch('/usuario/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos),
                redirect: 'manual'
            });

            const responseData = await response.json();

            if (responseData.ok === false) { // Si el JSON indica un fallo
                errorMessageDisplay.textContent = responseData.msj || 'Error de credenciales.';
                errorMessageDisplay.style.display = 'block';
            } else {
                if (responseData.ok === true) {
                    window.location.href = responseData.url; // Asume éxito y redirige
                } else {
                    // Cualquier otro caso inesperado con JSON
                    errorMessageDisplay.textContent = responseData.msj || 'Ocurrió un error inesperado en el servidor.';
                    errorMessageDisplay.style.display = 'block';
                }
            }

        } catch (error) {
            console.error('Error de red al enviar el formulario:', error);
            errorMessageDisplay.textContent = 'No se pudo conectar con el servidor. Inténtalo de nuevo.';
            errorMessageDisplay.style.display = 'block';
        }
    });
});
 */
import { getElement } from './funcionesjs/utils.js';
const elements = {};

function cacheDOMElements() {
    elements.loginModal = getElement('loginModal')
    elements.registerModal = getElement('registerModal')
    elements.albumViewerModal = getElement('albumViewerModal')
    elements.errorMessageDisplay = getElement('errorMessage')

    elements.loginForm = getElement("loginForm")
    elements.registerForm = getElement("registerForm")

    elements.passwordField = getElement('registerPassword')
    elements.repeatPasswordField = getElement('confirmPassword')
    /*  elements.passwordMatchFeedback = getElement('passwordMatchFeedback') */
    elements.body = document.body;


    if (!elements.loginForm || !elements.albumViewerModal) {
        console.error('Elementos cruciales del modal de portafolio no encontrados.')
        return false;
    }

    return true;
}

document.addEventListener('DOMContentLoaded', function () {


    if (cacheDOMElements()) {
        abrirLogin()
        async function handleLoginSubmit(event) {
            event.preventDefault();
            event.stopPropagation();
            elements.errorMessageDisplay.style.display = 'none';
            elements.errorMessageDisplay.textContent = '';


            // Aplicar la validación de Bootstrap
            if (!elements.loginForm.checkValidity()) {
                // Si el formulario no es válido, agrega la clase para mostrar los mensajes de feedback
                elements.loginForm.classList.add('was-validated');
                console.log('Formulario de Login inválido.');
                return; // Detener la ejecución si hay errores de validación
            }



            const formData = new FormData(event.target);
            const datos = {};
            formData.forEach((value, key) => {
                datos[key] = value;
            });

            if (!VerificarCampos(datos)) {
                elements.errorMessageDisplay.style.display = 'block';
                elements.errorMessageDisplay.textContent = 'Todo los campos son obligatorios';
                return;
            }





            /* if (VerificarCampos(datos)) {
                elements.errorMessageDisplay.textContent = 'Todo los campos son obligatorios';
                elements.errorMessageDisplay.style.display = 'block';
                return;
            } */


            try {
                const response = await fetch('/usuario/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos),
                    redirect: 'manual'
                });

                const responseData = await response.json();

                if (responseData.ok === false) { // Si el JSON indica un fallo
                    elements.errorMessageDisplay.textContent = responseData.msj || 'Error de credenciales.';
                    elements.errorMessageDisplay.style.display = 'block';
                } else {
                    if (responseData.ok === true) {
                        window.location.href = responseData.url; // Asume éxito y redirige
                    } else {
                        // Cualquier otro caso inesperado con JSON
                        elements.errorMessageDisplay.textContent = responseData.msj || 'Ocurrió un error inesperado en el servidor1.';
                        elements.errorMessageDisplay.style.display = 'block';
                    }
                }

            } catch (error) {
                console.error('Error de red al enviar el formulario:', error);
                elements.errorMessageDisplay.textContent = 'No se pudo conectar con el servidor. Inténtalo de nuevo.';
                elements.errorMessageDisplay.style.display = 'block';
            }


            // Opcional: Limpiar el formulario después del envío exitoso
            elements.loginForm.loginForm.reset();
            elements.loginForm.loginForm.classList.remove('was-validated'); // Quitar los estilos de validación
        }

        // --- Función para manejar el submit del formulario de Registro ---
        function handleRegisterSubmit(event) {
            event.preventDefault(); // Evitar el envío por defecto del formulario
            event.stopPropagation(); // Detener la propagación del evento

            // Limpiar estilos de validación anteriores si es necesario (opcional)
            // registerForm.classList.remove('was-validated');

            // Validar que las contraseñas coincidan antes de la validación de Bootstrap


            let passwordsMatch = true;
            if (elements.passwordField.value !== elements.repeatPasswordField.value) {
                elements.repeatPasswordField.setCustomValidity('Las contraseñas no coinciden.');
                passwordsMatch = false;
            } else {
                elements.repeatPasswordField.setCustomValidity('');
            }

            // Aplicar la validación de Bootstrap
            if (!registerForm.checkValidity() || !passwordsMatch) {
                // Si el formulario no es válido o las contraseñas no coinciden, agrega la clase
                elements.registerForm.classList.add('was-validated');
                console.log('Formulario de Registro inválido.');
                return; // Detener la ejecución si hay errores de validación
            }

            // Si el formulario es válido y las contraseñas coinciden, podemos acceder a los datos
            /* const name = registerForm.elements.name.value;
            const lastName = registerForm.elements.lastName.value;
            const email = registerForm.elements.email.value;
            const password = registerForm.elements.password.value; // Ya sabemos que coincide */

            /*  console.log('Datos del Registro:', { name, lastName, email, password }); */

            // Aquí es donde normalmente enviarías estos datos a tu backend
            // Ejemplo de fetch (simulado):
            // fetch('/api/register', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({ name, lastName, email, password })
            // })
            // .then(response => response.json())
            // .then(data => {
            //     if (data.success) {
            //         alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            //         // Opcional: Redirigir al usuario al formulario de login
            //         window.location.href = '#loginForm';
            //     } else {
            //         alert('Error al registrarse: ' + data.message);
            //     }
            // })
            // .catch(error => {
            //     console.error('Error en la solicitud de registro:', error);
            //     alert('Ocurrió un error al intentar registrarte.');
            // });

            alert('Simulación de registro exitoso para: ' + email);
            // Opcional: Limpiar el formulario después del envío exitoso
            elements.registerForm.reset();
            elements.registerForm.classList.remove('was-validated'); // Quitar los estilos de validación
        }

        // --- Asignar los event listeners a cada formulario ---
        if (elements.loginForm) {
            elements.loginForm.addEventListener('submit', handleLoginSubmit);
        }

        if (elements.registerForm) {
            elements.registerForm.addEventListener('submit', handleRegisterSubmit);



            function checkPasswordsMatch() {
                if (elements.repeatPasswordField.value !== elements.passwordField.value) {
                    elements.repeatPasswordField.setCustomValidity('Las contraseñas no coinciden.');
                } else {
                    elements.repeatPasswordField.setCustomValidity('');
                }
                // Disparar la validación visual de Bootstrap para el campo
                elements.repeatPasswordField.reportValidity();
            }

            elements.passwordField.addEventListener('input', checkPasswordsMatch);
            elements.repeatPasswordField.addEventListener('input', checkPasswordsMatch);
        }
    }
});


/**
 * Verifica si todos los campos en un objeto de datos (obtenidos de FormData)
 * están presentes y no vacíos.
 * Considera "vacío" si es undefined, null, o una cadena vacía (después de quitar espacios).
 *
 * @param {Object} data - El objeto de datos (ej. 'datos' obtenido de FormData).
 * @returns {boolean} - True si todos los campos encontrados en 'data' están presentes y no vacíos, false en caso contrario.
 */
function VerificarCampos(data) {

    const allFieldNames = Object.keys(data);


    if (allFieldNames.length === 0) {
        console.warn("Validación: El objeto de datos no contiene ningún campo.");

        return true;
    }

    for (const fieldName of allFieldNames) {
        const value = data[fieldName];

        if (value === undefined || value === null) {
            console.error(`Validación Fallida: El campo '${fieldName}' tiene un valor ausente o nulo.`);
            return false;
        }

        if (typeof value === 'string') {
            if (value.trim() === '') {
                console.error(`Validación Fallida: El campo '${fieldName}' está vacío.`);
                return false;
            }
        }
    }

    return true;
}

const abrirLogin = () => {
    if (!elements.loginForm && !elements.registerModal) {
        return;
    }
    if (window.location.hash) {
        //const modalId = window.location.hash//.substring(1); // Elimina el '#'
        const targetModal = document.querySelector(window.location.hash);

        if (targetModal) {
            const myModal = new bootstrap.Modal(targetModal);
            myModal.show();
        }
    }
}