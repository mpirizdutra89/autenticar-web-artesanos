import { getQueryElement, VerificarCampos, formatearTiempoDesde, formatStringWithUnderscores, modalOpenClose, estaModalAbierto, modalGenerico, isObjectEmpty, showFloatingAlert } from './funcionesjs/utils.js';


import { initializeCropper } from './funcionesjs/coverCropperHandler.js';

/**
 * @typedef {object} CachedDOMElements
 * @property {HTMLDivElement | null} coverCropperContainer // Solo un contenedor general
 * // Puedes añadir un contenedor para perfil si lo necesitas:
 * // @property {HTMLDivElement | null} profileCropperContainer

 * @property {HTMLElement | null} createAlbumModal
 * @property {HTMLElement | null} AlbumContainer
 * @property {HTMLFormElement | null} CrearAlbumNewForm
 * @property {HTMLElement | null }albumViewerModal
 * @property {HTMLElement | null }carouselInner
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
    elements.AlbumContainer = getQueryElement("#AlbumContainer");
    elements.carouselInner = getQueryElement("#carouselInner")
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


        /*  for (let pair of formData.entries()) {
             console.log(pair[0] + ': ' + pair[1]);
         } */

        try {
            const response = await fetch('/album/create-album', {
                method: 'POST',
                body: formData
            });



            if (!response.ok) {
                // Si la respuesta no es OK (ej. 400, 401, 500), intenta leer el error del servidor.
                // Es buena práctica intentar leerla como JSON primero, pero tener un fallback a texto.
                let errorData;
                try {
                    errorData = await response.json(); // El backend debería enviar errores en JSON

                } catch (jsonError) {
                    // Si la respuesta no es JSON, lee como texto para depuración
                    errorData = { msj: await response.text() || `Error de red o servidor, estado: ${response.status}` };
                }
                //throw new Error(errorData.msj || 'Error desconocido del servidor.');
                if (formGlobalErrorElement) {
                    formGlobalErrorElement.textContent = `Error al procesar la solicitud: ${errorData.msj}`;
                    formGlobalErrorElement.style.display = 'block';
                }
                return;
            }

            // 2. Parsear la respuesta JSON
            const result = await response.json(); // Esto convierte el cuerpo de la respuesta en un objeto JavaScript

            // 3. ¡Aquí tienes tu objeto JSON completo!
            //console.log("completo")
            //console.log(result)

            const data = result.albumsData[0]

            if (!isObjectEmpty(data)) {
                data.ultimaActualizacion = formatearTiempoDesde(data.ultimaActualizacion)
                const tarjetaNueva = crearTarjetaAlbum(data)

                elements.AlbumContainer.insertAdjacentHTML('afterbegin', tarjetaNueva);
            }

            elements.CrearAlbumNewForm.reset();
            document.querySelector("#coverImagePreview").style.display = 'none'
            modalOpenClose(false, 'createAlbumModal')
            formGlobalErrorElement.textContent = ''

            window.location.reload()

        } catch (error) {

            console.error(error);

            if (formGlobalErrorElement) {
                formGlobalErrorElement.textContent = `Error al procesar la solicitud: ${error.msj}`;
                formGlobalErrorElement.style.display = 'block';
            }
        }

        //submit final
    });



    //ver album evento botn
    elements.AlbumContainer.addEventListener('click', async function (event) {

        const button = event.target;
        if (button.closest('.verAlbum')) {


            const albumId = button.dataset.albumid || button.dataset.albumId
            let obras = []
            if (!albumId || albumId <= 0) {
                showFloatingAlert('No hay imagenes para este album', 'info', 'bottom', 4000)
                return;
            }

            try {
                const response = await fetch(`/album/imagenes/${albumId}`);

                if (!response.ok) {

                    let errorData;
                    try {
                        errorData = await response.json();

                    } catch (jsonError) {
                        // Si la respuesta no es JSON, lee como texto para depuración
                        errorData = { msj: await response.text() || `Error de red o servidor, estado: ${response.status}` };
                    }
                    showFloatingAlert('No hay imagenes para este album', 'info', 'bottom', 3000)
                    return;
                }


                const result = await response.json();
                obras = result.albumsData;
                if (obras.length > 0) {
                    console.log(obras)
                    loadCarouselItems(obras, 0)
                    modalGenerico(true, 'albumViewerModal')
                }


            } catch (error) {

                console.error(error);
                showFloatingAlert('No hay imagenes para este album', 'info', 'bottom', 3000)
            }

        }
    });

    const loadAlbum = (async () => { //alternativa si no necesitamos invocarla en otro lado (() => {
        try {
            const response = await fetch('/album/load-album', {
                method: 'POST'
            });



            if (!response.ok) {

                let errorData;
                try {
                    errorData = await response.json(); // El backend debería enviar errores en JSON

                } catch (jsonError) {
                    // Si la respuesta no es JSON, lee como texto para depuración
                    errorData = { msj: await response.text() || `Error de red o servidor, estado: ${response.status}` };
                }
                //throw new Error(errorData.msj || 'Error desconocido del servidor.');

                console.log(`Error al procesar la solicitud: ${errorData.msj}`)
                elements.AlbumContainer.innerHTML = `<h4 class='text-danger mx-auto'><i class="bi bi-exclamation-octagon"></i> No hay albums disponibles</4>`;


                return;
            }

            elements.AlbumContainer.innerHTML = ''

            const result = await response.json();

            const dataAlbum = result.albumsData

            if (!dataAlbum.length > 0) {
                elements.AlbumContainer.innerHTML = `<h4 class='text-danger mx-auto'><i class="bi bi-exclamation-octagon"></i> No hay albums disponibles</4>`;

            }
            dataAlbum.forEach(data => {
                data.fecha_update = formatearTiempoDesde(data.fecha_update === null || data.fecha_update === undefined || data.fecha_update === 'null' ? '' : data.fecha_update)
                //console.log(data.portada)
                const album = {
                    id: data.idAlbum,
                    portadaUrl: `${data.directorio}portada/cover.jpeg`,
                    titulo: data.titulo,
                    numObras: data.cantidad_imagenes,
                    ultimaActualizacion: data.fecha_update,
                    descripcion: data.descripcion
                }
                const tarjetaNueva = crearTarjetaAlbum(album)
                elements.AlbumContainer.insertAdjacentHTML('afterbegin', tarjetaNueva);
            })

        } catch (error) {

            console.error(error);

            elements.AlbumContainer.innerHTML = `<h4 class='text-danger mx-auto'><i class="bi bi-exclamation-octagon"></i> No hay albums disponibles</4>`;

        }
    })(); //auto ejecuta

    const crearTarjetaAlbum = (album) => {

        const {
            id = '', // ID para data-album-id
            portadaUrl = '/img/recursos/album.png', // URL por defecto de la portada
            titulo = 'Álbum sin Título',
            numObras = 0,
            ultimaActualizacion = 'sin cambios',
            descripcion = 'No hay descripción disponible para este álbum.',
            // Estos son IDs o títulos que necesitarás para los modales
            modalViewerId = 'albumViewerModal',
            modalManageWorksId = 'manageAlbumWorksModal',
            modalCreateAlbumId = 'createAlbumModal', // Asumiendo que es para editar
            // Puedes agregar más propiedades si las necesitas para los botones
        } = album;
        //data-bs-toggle="modal" data-bs-target="#${modalViewerId}"  este era el de ver album
        return `
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <img class="card-img-top card-img-top-fit" src="${portadaUrl}" alt="Portada de Álbum">
                    <div class="card-body">
                        <h5 class="card-title">${titulo}</h5>
                        <p class="card-text text-muted mb-2">
                            <small>${numObras} Obras | Última actualización: ${ultimaActualizacion}</small>
                        </p>
                        <p class="card-text">${descripcion}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <button class="btn btn-sm btn-outline-custom-primary me-2 verAlbum" type="button"                                     
                                    data-album-id="${id}">Ver Álbum</button>
                            <div>
                                <!--button class="btn btn-sm btn-secondary me-2" 
                                        data-bs-toggle="modal" data-bs-target="#${modalManageWorksId}" 
                                        data-album-title="${titulo}" data-album-id="${id}">
                                    <i class="bi bi-images"></i> Administrar Obras
                                </button !-->
                                <a class="btn btn-sm btn-secondary me-2" href='/album/album-administrar/${id}'><i class="bi bi-images"></i> Administrar Obras</a>

                                <button class="btn btn-sm btn-info text-white me-2" 
                                        data-bs-toggle="modal" data-bs-target="#${modalCreateAlbumId}" 
                                        title="Editar Álbum" data-album-id="${id}">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" title="Eliminar Álbum" data-album-id="${id}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
    }



    var RAIZ = '/uploads/'
    const loadCarouselItems = (images, startIndex) => {

        elements.carouselInner.innerHTML = '';

        images.forEach((image, index) => {

            const carouselItem = document.createElement('div');
            carouselItem.className = `carousel-item${index === startIndex ? ' active' : ''}`;
            carouselItem.innerHTML = `
                    <img src="${RAIZ}${image.url}" class="d-block w-100" alt="${image.detalle}">
                    <div class="carousel-caption d-none d-md-block">                       
                        <p>${image.detalle}</p>
                    </div>
                `;
            elements.carouselInner.appendChild(carouselItem);
        });

        // Re-inicializa el carrusel de Bootstrap para asegurarse de que los nuevos ítems sean reconocidos
        const bsCarousel = bootstrap.Carousel.getInstance(document.getElementById('modalCarousel'));
        if (bsCarousel) {
            // Si el carrusel ya está inicializado, lo reiniciamos y lo movemos al slide inicial
            bsCarousel.to(startIndex);
        } else {
            // Si no está inicializado, lo creamos y le indicamos el slide inicial
            new bootstrap.Carousel(document.getElementById('modalCarousel'), {
                interval: false // Deshabilita el auto-ciclo para el modal del carrusel de galería
            }).to(startIndex);
        }
    }


});