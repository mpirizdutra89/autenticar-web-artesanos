import { getQueryElement, VerificarCampos, formatearTiempoDesde, formatStringWithUnderscores, modalOpenClose, estaModalAbierto, modalGenerico, isObjectEmpty, showFloatingAlert } from './funcionesjs/utils.js';



/**
 * @typedef {object} CachedDOMElements
 * @property {HTMLElement | null} imgContainer
 * @property {HTMLElement | null} btnAddObras
 * @property {HTMLElement | NULL} manageAlbumWorksModal
 * 
 * @property {HTMLElement | NULL} imageUploadInput
 * @property {HTMLElement | NULL} imagePreviewContainer
 * @property {HTMLElement | NULL} noImagesText
 * @property {HTMLElement | NULL} uploadButton
 * @property {HTMLBodyElement} body
 */

/** @type {CachedDOMElements} */
const elements = {};
const cache = () => {
    elements.imgContainer = getQueryElement("#imgContainer")
    elements.btnAddObras = getQueryElement("#btnAddObras")
    elements.manageAlbumWorksModal = getQueryElement("#manageAlbumWorksModal")
    elements.imageUploadInput = getQueryElement("#imageUpload")
    elements.imagePreviewContainer = getQueryElement("#imagePreviewContainer")
    elements.noImagesText = getQueryElement("#noImagesText")
    elements.uploadButton = getQueryElement("#uploadButton")


    elements.body = document.body;

    if (!elements.imgContainer) {
        console.error('Uno o más elementos cruciales del DOM no fueron encontrados. Revisa tus IDs HTML.');
        return false;
    }
    return true;
}


document.addEventListener('DOMContentLoaded', () => {
    const obrasList = window.albumsData || [];
    if (cache()) {
        loadImg(obrasList)
        elements.btnAddObras.addEventListener('click', function () {
            modalGenerico(true, 'manageAlbumWorksModal')
        })

        subirImg();
    }



});

function subirImg() {

    const selectedFilesMap = new Map();
    let fileCounter = 0;

    // Límite de tamaño en bytes (2 MB)
    const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB = 2 * 1024 KB * 1024 Bytes

    // Tipos de MIME aceptados
    const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

    // **NUEVA RESTRICCIÓN: Máximo de imágenes por subida**
    const MAX_IMAGES_COUNT = 10;

    // --- Función para mostrar una previsualización (sin cambios) ---
    const displayImagePreview = (file, fileId) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const previewItem = document.createElement('div');
            previewItem.classList.add('image-preview-item');
            previewItem.dataset.fileId = fileId;

            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = file.name;

            const removeButton = document.createElement('button');
            removeButton.classList.add('remove-image-btn');
            removeButton.innerHTML = '&times;';
            removeButton.title = 'Eliminar imagen';

            removeButton.addEventListener('click', () => {
                selectedFilesMap.delete(fileId);
                previewItem.remove();
                updateUploadButtonState();
            });

            previewItem.appendChild(img);
            previewItem.appendChild(removeButton);
            imagePreviewContainer.appendChild(previewItem);
        };

        reader.readAsDataURL(file);
    };

    // --- Función para actualizar el estado del botón de subir (sin cambios) ---
    const updateUploadButtonState = () => {
        if (selectedFilesMap.size > 0) {
            elements.uploadButton.disabled = false;
            elements.noImagesText.style.display = 'none';
        } else {
            elements.uploadButton.disabled = true;
            elements.noImagesText.style.display = 'block';
        }
        // Opcional: Deshabilitar input si ya se alcanzó el límite
        // elements.imageUploadInput.disabled = selectedFilesMap.size >= MAX_IMAGES_COUNT;
    };

    // --- Listener para el cambio en el input de archivo ---
    elements.imageUploadInput.addEventListener('change', (event) => {
        const files = event.target.files;

        if (files.length === 0) {
            updateUploadButtonState();
            return;
        }

        // Si quieres que las nuevas imágenes reemplacen las anteriores, descomenta estas líneas:
        // elements.imagePreviewContainer.innerHTML = '<p id="noImagesText">No hay imágenes seleccionadas.</p>';
        // selectedFilesMap.clear();
        // fileCounter = 0;

        // **NUEVA VALIDACIÓN: Límite total de imágenes**
        if (selectedFilesMap.size + files.length > MAX_IMAGES_COUNT) {
            const msj = `No puedes seleccionar más de ${MAX_IMAGES_COUNT} imágenes en total. Ya tienes ${selectedFilesMap.size} seleccionadas.`;
            showFloatingAlert(msj, 'danger', 'bottom', 3000)
            // Limpiar el input para que el usuario pueda volver a seleccionar
            elements.imageUploadInput.value = '';
            return;
        }

        for (const file of files) {
            // **Validación de Tipo de Archivo**
            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                const msj = `"${file.name}" no es un archivo de imagen válido. Solo se aceptan JPG/JPEG y PNG.`;
                showFloatingAlert(msj, 'danger', 'bottom', 3000)
                continue; // Pasa al siguiente archivo
            }

            // **Validación de Tamaño de Archivo**
            if (file.size > MAX_FILE_SIZE_BYTES) {
                const msj = `"${file.name}" es demasiado grande. El tamaño máximo permitido es de ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.`;
                showFloatingAlert(msj, 'danger', 'bottom', 3000)
                continue; // Pasa al siguiente archivo
            }

            const currentFileId = `file-${fileCounter++}`;
            selectedFilesMap.set(currentFileId, file);
            displayImagePreview(file, currentFileId);
        }

        // Es buena práctica limpiar el valor del input después de procesar
        // para que, si el usuario selecciona los mismos archivos dos veces,
        // el evento 'change' se dispare de nuevo.
        elements.imageUploadInput.value = '';

        updateUploadButtonState();
    });

    // --- Listener para el botón de subir imágenes (sin cambios significativos) ---
    elements.uploadButton.addEventListener('click', async () => {
        if (selectedFilesMap.size === 0) {
            const msj = 'No hay imágenes para subir.';
            showFloatingAlert(msj, 'danger', 'bottom', 3000)
            return;
        }

        // También podrías añadir una última validación aquí antes de enviar, por si acaso
        if (selectedFilesMap.size > MAX_IMAGES_COUNT) {
            const msj = `Demasiadas imágenes seleccionadas (${selectedFilesMap.size}). El límite es ${MAX_IMAGES_COUNT}. Por favor, elimina algunas.`;
            showFloatingAlert(msj, 'danger', 'bottom', 3000)
            return;
        }

        const formData = new FormData();
        selectedFilesMap.forEach((file, fileId) => {
            formData.append('images[]', file, file.name);
        });

        elements.uploadButton.disabled = true;
        elements.uploadButton.textContent = 'Subiendo...';

        try {
            const response = await fetch('/api/upload-images', { // Ajusta tu URL aquí
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error al subir imágenes: ${response.status}`);
            }

            const result = await response.json();
            const msj = '¡Imágenes subidas exitosamente!';
            showFloatingAlert(msj, 'success', 'bottom', 3000)
            console.log('Respuesta del servidor:', result);

            // Limpiar después de subir
            elements.imagePreviewContainer.innerHTML = '<p id="noImagesText">No hay imágenes seleccionadas.</p>';
            selectedFilesMap.clear();
            updateUploadButtonState();

        } catch (error) {
            console.error('Error al subir imágenes:', error);
            const msj = `Hubo un error al subir las imágenes: ${error.message}`;
            showFloatingAlert(msj, 'success', 'bottom', 3000)
        } finally {
            elements.uploadButton.disabled = false;
            elements.uploadButton.textContent = 'Subir Imágenes';
        }
    });

    updateUploadButtonState();
}




const loadImg = (obras) => {
    //`idimage`, `albums_idAlbums`, `detalle`, `url`, `fecha_subida`
    obras.forEach(obra => {
        const img = {
            id: obra.idimage,
            portadaUrl: obra.url,
            detalle: obra.detalle || 'Detalle de la obra'
        }
        const nueva = crearImg(img)
        elements.imgContainer.insertAdjacentHTML('afterbegin', nueva);
    });
    /* for (let i = 0; i < 8; i++) {
        const nueva = crearImg({
            id: i, // ID para data-album-id
            portadaUrl: '/img/recursos/album.png',
            detalle: 'Álbum sin Título'
        })
        elements.imgContainer.insertAdjacentHTML('afterbegin', nueva);

    } */
}


const crearImg = (obra) => {
    const {
        id = '', // ID para data-album-id
        portadaUrl = '/img/recursos/album.png',
        detalle = 'Álbum sin Título'
    } = obra;

    return `
        <div class="col">
                <div class="image-container">
                    <img src="${obra.portadaUrl}" class="img-fluid" alt="${obra.detalle}">
                    <button class="btn btn-danger btn-sm delete-button" title="Eliminar"  data-id="${obra.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                    <div class="image-caption">                        
                        <p>${obra.detalle}</p>
                    </div>
                </div>
        </div>`;
}


