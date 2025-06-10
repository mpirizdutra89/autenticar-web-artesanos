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
import { getElement, obtenerClaseTextoBootstrap } from './funcionesjs/utils.js';
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
            elements.errorMessageDisplay.classList.remove('text-warning');
            const classText = obtenerClaseTextoBootstrap('rojo')
            elements.errorMessageDisplay.classList.add(classText);

            // Opcional: Limpiar el formulario después del envío exitoso
            elements.loginForm.loginForm.reset();
            elements.loginForm.classList.remove('was-validated'); // Quitar los estilos de validación
        }

        // --- Función para manejar el submit del formulario de Registro ---
        async function handleRegisterSubmit(event) {
            event.preventDefault();
            event.stopPropagation();
            elements.errorMessageDisplay.style.display = 'none';
            elements.errorMessageDisplay.textContent = '';


            const passwordsMatch = checkPasswordsMatch();
            if (!passwordsMatch) {
                console.log('Las contraseñas no coinciden. Envío del formulario bloqueado.');

                return;
            }

            // Aplicar la validación de Bootstrap
            if (!elements.registerForm.checkValidity()) {
                // Si el formulario no es válido, agrega la clase para mostrar los mensajes de feedback
                elements.registerForm.classList.add('was-validated');
                console.log('Formulario de registro inválido.');
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



            try {
                const response = await fetch('/usuario/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos),
                    redirect: 'manual'
                });

                const responseData = await response.json();

                if (responseData.ok === false) { // Si el JSON indica un fallo
                    elements.errorMessageDisplay.textContent = responseData.msj || 'Error de registro.';
                    elements.errorMessageDisplay.style.display = 'block';
                } else {
                    if (responseData.ok === true) {
                        window.location.href = responseData.url; // Asume éxito y redirige
                    } else {
                        // Cualquier otro caso inesperado con JSON
                        elements.errorMessageDisplay.textContent = responseData.msj || 'Ocurrió un error inesperado en el servidor.';
                        elements.errorMessageDisplay.style.display = 'block';
                    }
                }

            } catch (error) {
                console.error('Error de red al enviar el formulario:', error);
                elements.errorMessageDisplay.textContent = 'No se pudo conectar con el servidor. Inténtalo de nuevo.';
                elements.errorMessageDisplay.style.display = 'block';
            }


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

        }

    }
});




function checkPasswordsMatch() {
    // Solo si ambos campos existen, realizamos la validación
    if (elements.repeatPasswordField && elements.passwordField) {
        if (elements.repeatPasswordField.value !== elements.passwordField.value) {
            // Las contraseñas NO coinciden

            // Establece un mensaje de validación personalizado (para validación nativa de HTML5)
            elements.repeatPasswordField.setCustomValidity('Las contraseñas no coinciden.');

            // Agrega la clase 'is-invalid' para mostrar el feedback de Bootstrap
            elements.repeatPasswordField.classList.add('is-invalid');
            // Asegúrate de remover 'is-valid' si estaba presente
            elements.repeatPasswordField.classList.remove('is-valid');

            // reportValidity() ayuda a que el navegador muestre el feedback nativo,
            // que a menudo se integra con Bootstrap.
            elements.repeatPasswordField.reportValidity();
            return false;
        } else {
            // Las contraseñas SÍ coinciden

            // Borra el mensaje de validación personalizado
            elements.repeatPasswordField.setCustomValidity('');

            // Agrega la clase 'is-valid' para mostrar el feedback de Bootstrap (opcional, pero buena práctica)
            elements.repeatPasswordField.classList.add('is-valid');
            // Remueve la clase 'is-invalid' si estaba presente
            elements.repeatPasswordField.classList.remove('is-invalid');

            // No es estrictamente necesario llamar a reportValidity() aquí si ya son válidas,
            // pero si usas el formulario para el submit, el navegador lo valida de todas formas.
            return true;
        }
    }
    // Si falta algún campo, asumimos que no coinciden para evitar el envío
    return false;
}

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

/* const abrirLogin = () => {
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
} */
const abrirLogin = () => {
    // Estas comprobaciones iniciales están bien, pero asegúrate de que 'elements'
    // esté definido y contenga 'loginForm' y 'registerModal' si los usas.

    if (!elements.loginForm && !elements.registerModal) {
        return;
    }


    if (window.location.hash) {
        const hash = window.location.hash; // Obtiene algo como '#loginmodal?msj=algo'

        // 1. Separar el hash principal del query string dentro del hash
        // Primero, removemos el '#' inicial
        const hashContent = hash.substring(1); // 'loginmodal?msj=algo'

        let modalId = '';
        let queryStringInHash = '';

        const questionMarkIndex = hashContent.indexOf('?');

        if (questionMarkIndex !== -1) {
            // Hay un query string dentro del hash
            modalId = hashContent.substring(0, questionMarkIndex); // 'loginmodal'
            queryStringInHash = hashContent.substring(questionMarkIndex + 1); // 'msj=algo'
        } else {
            // No hay query string, solo es el ID del modal
            modalId = hashContent; // 'loginmodal'
        }

        // 2. Obtener el parámetro 'msj' del queryStringInHash
        let mensaje = null;
        if (queryStringInHash) {
            const params = new URLSearchParams(queryStringInHash);
            mensaje = params.get('msj'); // 'algo'
            //console.log('Mensaje extraído:', mensaje); // Para depuración
        }


        // 3. Usar el modalId (que ahora es 'loginmodal' sin el query)
        const targetModal = document.getElementById(modalId); // Usamos getElementById ya que `modalId` es un ID

        if (targetModal) {
            const myModal = new bootstrap.Modal(targetModal);
            myModal.show();

            // Aquí puedes usar el 'mensaje' si es necesario, por ejemplo, para mostrarlo en el modal
            if (mensaje) {
                // Ejemplo: Asumiendo que tu modal tiene un elemento con la clase 'modal-body' o un ID específico para el mensaje
                const modalBody = targetModal.querySelector('.modal-footer'); // O el elemento que quieras
                if (modalBody) {
                    // Puedes crear un nuevo elemento o simplemente actualizar el texto de uno existente
                    let messageElement = modalBody.querySelector('#errorMessage');
                    if (!messageElement) {
                        messageElement = document.createElement('p');
                        messageElement.id = 'modalMessage';
                        modalBody.appendChild(messageElement);
                    }
                    messageElement.textContent = `Mensaje: ${mensaje}`;
                    messageElement.classList.remove('text-warning');
                    const classText = obtenerClaseTextoBootstrap('verde')

                    messageElement.classList.add(classText);
                    messageElement.style.display = 'block'
                }
            }
        }
    }
};

