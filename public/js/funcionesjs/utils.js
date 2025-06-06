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
