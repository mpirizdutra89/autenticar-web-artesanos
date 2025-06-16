/**
 * Función de ayuda para obtener un elemento del DOM por su ID.
 * Emite una advertencia si el elemento no se encuentra.
 * @param {string} id - El ID del elemento a buscar.
 * @returns {HTMLElement | null} El elemento encontrado o null si no existe.
 */
export function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        //console.warn(`Elemento con ID "${id}" no encontrado en el DOM. En caso de que la vista actual no lo use no abra fallos. Esto es solo un cartel de informacion`);
    }
    return element;
}
export function getQueryElement(id) {
    const element = document.querySelector(id);
    if (!element) {
        //console.warn(`Elemento con ID "${id}" no encontrado en el DOM. En caso de que la vista actual no lo use no abra fallos. Esto es solo un cartel de informacion`);
    }
    return element;
}

/**
 * Función de ayuda para obtener varios elementos del DOM por un selector.
 * @param {string} selector - El selector CSS para los elementos a buscar.
 * @returns {NodeListOf<HTMLElement>} Una NodeList de los elementos encontrados.
 */
export function getAllElements(selector) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
        // console.warn(`Ningún elemento encontrado con el selector "${selector}".`);
    }
    return elements;
}

/**
 * Calcula el tiempo transcurrido desde una fecha dada.
 * @param {Date} date - La fecha a partir de la cual calcular el tiempo transcurrido.
 * @returns {string} Una cadena que describe el tiempo transcurrido (ej: "5 minutos", "2 días").
 */
export function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " año" : " años");
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " mes" : " meses");
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " día" : " días");
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " hora" : " horas");
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " minuto" : " minutos");
    return Math.floor(seconds) + (Math.floor(seconds) === 1 ? " segundo" : " segundos");
}



export function origenLamadas(msj) {
    console.trace(`Origin de la llamada: ${msj}`);
}


/**
 * Convierte un nombre de color común a la clase de texto de Bootstrap 5.
 *
 * @param {string} nombreColor - El nombre del color (ej. "rojo", "azul", "verde").
 * @returns {string} La clase de Bootstrap 'text-*' correspondiente, o 'text-dark' si no se encuentra.
 */
export function obtenerClaseTextoBootstrap(nombreColor) {
    // Convertimos el nombre del color a minúsculas para hacer la comparación insensible a mayúsculas/minúsculas
    const colorNormalizado = nombreColor.toLowerCase();

    switch (colorNormalizado) {
        case 'rojo':
            return 'text-danger';
        case 'azul':
            return 'text-primary'; // El azul primario de Bootstrap
        case 'verde':
            return 'text-success';
        case 'amarillo':
            return 'text-warning';
        case 'cian':
            return 'text-info'; // El cian de Bootstrap
        case 'negro':
            return 'text-dark';
        case 'blanco':
            return 'text-white'; // Para usar en fondos oscuros
        case 'gris':
            return 'text-secondary'; // El gris de Bootstrap

        // Puedes añadir más casos según los colores que necesites mapear.

        default:
            // Si el color no coincide con ninguno de los casos, devolvemos un valor por defecto.
            // 'text-dark' es una buena opción si quieres que siempre haya un color visible.
            // O podrías devolver un string vacío '' si no quieres aplicar ninguna clase.
            console.warn(`Color '${nombreNormalizado}' no reconocido. Devolviendo 'text-dark'.`);
            return 'text-dark';
    }
}



export function estaModalAbierto(modalId = 'registerModal') {
    const modalElement = document.getElementById(modalId);
    if (!modalElement) {
        console.warn(`No se encontró el elemento modal con ID: ${modalId}`);
        return false;
    }
    // Verifica si el elemento tiene la clase 'show'
    return modalElement.classList.contains('show');
}


export const NOTIFICACION_TYPE = Object.freeze({

    SOLICITUD_AMISTAD: 'solicitud_amistad',
    SOLICITUD_AMISTAD_RESP: 'solicitud_amistad_resp',
    NUEVO_COMENTARIO: 'nuevo_comentario',
    ALERTAS_SISTEMA: 'alertas_sistema',
    OTRO_TIPO: 'otro_tipo',
    isValid: (type) => Object.values(NOTIFICACION_TYPE).includes(type)
});//ENUM('solicitud_amistad', 'solicitud_amistad_resp', 'nuevo_comentario',)


export function formatStringWithUnderscores(str) {
    if (!str || typeof str !== 'string') {
        return ''; // Devuelve una cadena vacía si la entrada no es válida
    }

    // 1. Reemplaza todos los guiones bajos por espacios
    // 2. Divide la cadena en palabras usando el espacio como delimitador
    // 3. Itera sobre cada palabra para capitalizar la primera letra
    const words = str.replace(/_/g, ' ').split(' ');

    const formattedWords = words.map(word => {
        if (word.length === 0) {
            return ''; // Maneja el caso de múltiples espacios o palabras vacías
        }
        // Capitaliza la primera letra y concatena con el resto de la palabra
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    // Une las palabras formateadas de nuevo en una sola cadena
    return formattedWords.join(' ');
}


/**
         * Muestra una alerta flotante que se desvanece automáticamente.
         *
         * @param {string} message - El mensaje a mostrar en la alerta.
         * @param {string} type - El tipo de alerta (e.g., 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark').
         * @param {string} position - La posición de la alerta ('top' para arriba-centro, 'bottom' para abajo-derecha).
         * @param {number} duration - Duración en milisegundos antes de que la alerta empiece a desvanecerse (por defecto 3000ms).
         */
export function showFloatingAlert(message, type, position, duration = 3000) {

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = message;


    alertDiv.style.position = 'fixed';
    alertDiv.style.zIndex = '1050';
    alertDiv.style.width = '90%';
    alertDiv.style.maxWidth = '400px';


    if (position === 'top') {
        alertDiv.style.top = '20px';
        alertDiv.style.left = '50%';
        alertDiv.style.transform = 'translateX(-50%)';
        alertDiv.style.right = 'auto';
    } else if (position === 'bottom') {
        alertDiv.style.bottom = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.left = 'auto';
        alertDiv.style.top = 'auto';
        alertDiv.style.transform = 'none';
    } else {
        console.warn('Posición de alerta no válida. Usando "bottom" por defecto.');
        alertDiv.style.bottom = '20px';
        alertDiv.style.right = '20px';
    }


    document.body.appendChild(alertDiv);


    setTimeout(() => {
        alertDiv.classList.remove('show');


        alertDiv.addEventListener('transitionend', function handler() {
            alertDiv.remove();
            alertDiv.removeEventListener('transitionend', handler);
        }, { once: true });
    }, duration);
}


export function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}



/**
 * Verifica si todos los campos en un objeto de datos (obtenidos de FormData)
 * están presentes y no vacíos.
 * Considera "vacío" si es undefined, null, o una cadena vacía (después de quitar espacios).
 *
 * @param {Object} data - El objeto de datos (ej. 'datos' obtenido de FormData).
 * @returns {boolean} - True si todos los campos encontrados en 'data' están presentes y no vacíos, false en caso contrario.
 */
export function VerificarCampos(data) {

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