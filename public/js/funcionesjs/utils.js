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



