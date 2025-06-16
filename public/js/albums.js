import { getQueryElement, VerificarCampos } from './funcionesjs/utils.js';


import { initializeCropper } from './funcionesjs/coverCropperHandler.js';

/**
 * @typedef {object} CachedDOMElements
 * @property {HTMLDivElement | null} coverCropperContainer // Solo un contenedor general
 * // Puedes añadir un contenedor para perfil si lo necesitas:
 * // @property {HTMLDivElement | null} profileCropperContainer

 * @property {HTMLElement | null} createAlbumModal
 * @property {HTMLFormElement | null} CrearAlbumNewForm
 * @property {HTMLBodyElement} body
 */

/** @type {CachedDOMElements} */
const elements = {};
let coverCropperData = null; // Contendrá { croppedImageBlob: {value: Blob}, reset: Function }


function cacheDOMElements() {


    // SOLO el contenedor principal para el cropper de portada
    elements.coverCropperContainer = getQueryElement('#coverCropperContainer');

    elements.createAlbumModal = getQueryElement("#createAlbumModal");
    elements.CrearAlbumNewForm = getQueryElement("#CrearAlbumNew");
    elements.body = document.body;

    // Validación mínima
    if (!elements.CrearAlbumNewForm || !elements.coverCropperContainer) {
        console.error('Uno o más elementos cruciales del DOM no fueron encontrados. Revisa tus IDs HTML.');
        return false;
    }
    return true;
}




document.addEventListener('DOMContentLoaded', () => {
    if (!cacheDOMElements()) {
        return;
    }

    // --- Inicialización del Cropper de Portada ---
    coverCropperData = initializeCropper(
        elements.coverCropperContainer,
        'cover' // <-- Aquí especificas el tipo de cropper: 'cover' o 'profile'
    );

    // --- Lógica de envío del formulario completo ---
    elements.CrearAlbumNewForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const formGlobalErrorElement = getQueryElement('#formGlobalError');


        if (formGlobalErrorElement) formGlobalErrorElement.style.display = 'none';


        const formData = new FormData(this);

        if (!elements.CrearAlbumNewForm.checkValidity()) {

            elements.CrearAlbumNewForm.classList.add('was-validated');
            console.log('Formulario de registro inválido.');
            return;
        }


        // Validación: Hacer obligatoria la imagen de portada
        console.log(coverCropperData.croppedImageBlob.value)
        if (!coverCropperData.croppedImageBlob.value) {
            if (formGlobalErrorElement) {
                formGlobalErrorElement.textContent = 'Por favor, selecciona y recorta una imagen de portada.';
                formGlobalErrorElement.style.display = 'block';
            } else {
                console.error('Elemento de error global no encontrado.');
            }
            return;
        }

        formData.append('album_initial_cover', coverCropperData.croppedImageBlob.value, 'cover.jpeg');
        console.log('Imagen de portada recortada (Blob) añadida al FormData.');

        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        try {
            const response = await fetch('/album/create-album', { // Asegúrate de que esta URL sea la correcta
                method: 'POST',
                body: formData
            });
            console.log(response)
            if (response.ok) {
                const result = await response.json();
                console.log("exito")
                console.log(result);


                elements.CrearAlbumNewForm.reset();
                coverCropperData.reset(); // Usamos la función de reseteo proporcionada por initializeCropper

            } else {
                const errorData = await response.json();
                console.error('Error en la operación:', errorData);
                if (formGlobalErrorElement) {
                    formGlobalErrorElement.textContent = 'Error al procesar la solicitud: ' + (errorData.message || 'Desconocido');
                    formGlobalErrorElement.style.display = 'block';
                } else {
                    //alert('Error al procesar la solicitud: ' + (errorData.message || 'Desconocido'));
                }
            }
        } catch (error) {
            console.error('Error de red al enviar datos:', error);
            if (formGlobalErrorElement) {
                formGlobalErrorElement.textContent = 'Error de conexión o de red.';
                formGlobalErrorElement.style.display = 'block';
            } else {
                //  alert('Error de conexión o de red.');
            }
        }
    });
});