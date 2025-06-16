// coverCropperHandler.js
// Asume que Croppie ya está cargado globalmente o que lo importas aquí si es un módulo.
// Si Croppie es un módulo y lo instalaste con npm, descomenta la siguiente línea:
// import Croppie from 'croppie';

/**
 * @typedef {object} ElementsRef
 * @property {HTMLElement | null} imageUpload - Referencia al input type="file".
 * @property {HTMLElement | null} cropperWrapperParent - El contenedor general donde todo se creará.
 * @property {HTMLElement | null} dynamicCropperContainer - Contenedor div específico para la instancia de Croppie y sus botones.
 * @property {HTMLElement | null} imagePreview - Elemento img para previsualizar la imagen final.
 * @property {HTMLElement | null} previewText - Elemento de texto de previsualización.
 * @property {HTMLElement | null} previewSubtext - Subtexto de previsualización.
 * @property {HTMLElement | null} imageError - Elemento para mostrar errores.
 * @property {{value: Croppie | null}} croppieInstance - Referencia mutable a la instancia de Croppie.
 * @property {{value: HTMLElement | null}} currentCropperElement - Referencia mutable al elemento div del cropper.
 * @property {{value: Blob | null}} croppedImageBlob - Referencia mutable al blob de la imagen recortada.
 * @property {HTMLElement | null} cropButton - Referencia al botón de recorte (se creará dinámicamente).
 * @property {HTMLElement | null} cancelButton - Referencia al botón de cancelar (se creará dinámicamente).
 * @property {string} cropperType - El tipo de cropper ('profile' o 'cover').
 */


/**
 * Resetea la interfaz de usuario del cropper y limpia el blob.
 * @param {ElementsRef} refs - Objeto con las referencias a los elementos y variables de Croppie.
 */
export function resetCropperUI(refs) {
    if (refs.croppieInstance.value) {
        refs.croppieInstance.value.destroy();
        refs.croppieInstance.value = null;
    }
    if (refs.currentCropperElement.value && refs.dynamicCropperContainer && refs.dynamicCropperContainer.contains(refs.currentCropperElement.value)) {
        refs.dynamicCropperContainer.removeChild(refs.currentCropperElement.value);
        refs.currentCropperElement.value = null;
    }

    // Remover dinámicamente los botones si existen
    if (refs.cropButton && refs.cropButton.parentNode) {
        refs.cropButton.parentNode.removeChild(refs.cropButton);
        refs.cropButton = null;
    }
    if (refs.cancelButton && refs.cancelButton.parentNode) {
        refs.cancelButton.parentNode.removeChild(refs.cancelButton);
        refs.cancelButton = null;
    }

    if (refs.dynamicCropperContainer) {
        refs.dynamicCropperContainer.style.display = 'none';
        refs.dynamicCropperContainer.innerHTML = ''; // Limpiar el contenido del contenedor principal del cropper
    }

    // Ocultar elementos de previsualización y error
    if (refs.imageError) refs.imageError.style.display = 'none';
    /*  if (refs.imagePreview) {
         refs.imagePreview.src = '';
         refs.imagePreview.style.display = 'none';
     } */
    // Mostrar textos de previsualización
    if (refs.previewText) refs.previewText.style.display = 'block';
    if (refs.previewSubtext) refs.previewSubtext.style.display = 'block';

    // refs.croppedImageBlob.value = null; // Limpiar el blob de la imagen recortada

}

/**
 * Maneja el evento de cambio del input de archivo para la imagen.
 * Inicializa el cropper con la imagen seleccionada y el tipo de plantilla elegido.
 * @param {Event} event - El evento 'change' del input de archivo.
 * @param {ElementsRef} refs - Objeto con las referencias a los elementos y variables de Croppie.
 */
export function handleImageUpload(event, refs) {
    const files = event.target.files;

    if (refs.imageError) refs.imageError.style.display = 'none';
    if (files && files.length > 0) {
        // alert("2")
        const file = files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            resetCropperUI(refs); // Resetea antes de cargar una nueva imagen

            // Asegurarse de que el contenedor dinámico del cropper esté visible
            refs.dynamicCropperContainer.style.display = 'block';

            const currentElement = document.createElement('div');
            refs.dynamicCropperContainer.appendChild(currentElement);
            refs.currentCropperElement.value = currentElement;

            let viewportConfig;
            let boundaryConfig;
            let resultSize; // Tamaño final del resultado

            if (refs.cropperType === 'profile') {
                viewportConfig = { width: 150, height: 150, type: 'circle' };
                boundaryConfig = { width: 250, height: 250 };
                resultSize = { width: 300, height: 300 }; // Un poco más grande para mejor calidad
            } else { // default to 'cover'
                /*  viewportConfig = { width: 400, height: 100, type: 'square' };
                 boundaryConfig = { width: 550, height: 137.5 };
                 resultSize = { width: 800, height: 200 }; */
                viewportConfig = { width: 400, height: 200, type: 'square' }; // Nuevo viewport: 400x200
                boundaryConfig = { width: 500, height: 250 }; // Ajusta el boundary a algo un poco más grande que el viewport
                resultSize = { width: 400, height: 200 };
            }

            // Crear botones dinámicamente
            refs.cropButton = document.createElement('button');
            refs.cropButton.type = 'button';
            refs.cropButton.id = 'dynamicCropButton_' + refs.cropperType; // ID único
            refs.cropButton.className = 'btn btn-info mt-2 me-2';
            refs.cropButton.textContent = 'Recortar Imagen';

            refs.cancelButton = document.createElement('button');
            refs.cancelButton.type = 'button';
            refs.cancelButton.id = 'dynamicCancelButton_' + refs.cropperType; // ID único
            refs.cancelButton.className = 'btn btn-secondary mt-2';
            refs.cancelButton.textContent = 'Cancelar';

            refs.dynamicCropperContainer.appendChild(refs.cropButton);
            refs.dynamicCropperContainer.appendChild(refs.cancelButton);

            // Ocultar elementos de previsualización mientras el cropper está activo
            if (refs.imagePreview) refs.imagePreview.style.display = 'none';
            if (refs.previewText) refs.previewText.style.display = 'none';
            if (refs.previewSubtext) refs.previewSubtext.style.display = 'none';


            try {
                // eslint-disable-next-line no-undef
                const newCroppieInstance = new Croppie(currentElement, { // Asumiendo que Croppie es global
                    viewport: viewportConfig,
                    boundary: boundaryConfig,
                    enableOrientation: true,
                    enableExif: true,
                    enableZoom: true,
                    mouseWheelZoom: true,
                    showZoomer: true
                });

                refs.croppieInstance.value = newCroppieInstance;
                //console.log('Imagen lista para bindear:', e.target.result.substring(0, 50) + '...');

                newCroppieInstance.bind({
                    url: e.target.result,
                    orientation: 1
                }).catch(bindError => {
                    console.error('Error al bindear imagen a Croppie:', bindError);

                    if (refs.imageError) {
                        refs.imageError.textContent = `Error al cargar la imagen: ${bindError.message}`;
                        refs.imageError.style.display = 'block';
                    }
                    resetCropperUI(refs);
                });

                // Adjuntar listeners a los botones creados dinámicamente
                refs.cropButton.onclick = () => {
                    if (refs.croppieInstance.value) {
                        refs.croppieInstance.value.result({
                            type: 'blob',
                            size: resultSize, // Usar el tamaño de resultado configurado
                            format: 'jpeg',
                            quality: 0.8
                        }).then(function (blob) {

                            refs.croppedImageBlob.value = blob;

                            if (refs.imagePreview) {


                                const imageUrl = URL.createObjectURL(blob);
                                refs.imagePreview.src = imageUrl;

                                refs.imagePreview.style.display = 'block';
                            }
                            if (refs.previewText) refs.previewText.style.display = 'block';
                            if (refs.previewSubtext) refs.previewSubtext.style.display = 'block';
                            if (refs.imageError) refs.imageError.style.display = 'none';

                            resetCropperUI(refs); // Resetea el cropper y los botones después del recorte exitoso

                        }).catch(resultError => {
                            console.error('Error al obtener el resultado del recorte:', resultError);
                            if (refs.imageError) {
                                refs.imageError.textContent = `Error al recortar la imagen: ${resultError.message}`;
                                refs.imageError.style.display = 'block';
                            }
                            resetCropperUI(refs);
                        });
                    }
                };

                refs.cancelButton.onclick = () => {
                    resetCropperUI(refs);
                    if (refs.imageUpload) refs.imageUpload.value = ''; // Limpiar el input file
                };

            } catch (error) {
                console.error('ERROR: Fallo al crear Croppie instance:', error);
                if (refs.imageError) {
                    refs.imageError.textContent = `Error interno del cropper: ${error.message}`;
                    refs.imageError.style.display = 'block';
                }
                resetCropperUI(refs);
            }
        };
        reader.readAsDataURL(file);
    } else {
        resetCropperUI(refs);
    }
}

/**
 * Crea o inicializa los elementos DOM necesarios para el cropper dentro de un contenedor padre.
 * @param {HTMLElement} parentContainer - El contenedor DIV principal donde se creará toda la UI del cropper (excepto el input file).
 * @param {string} type - El tipo de cropper ('profile' o 'cover').
 * @returns {object} Un objeto con las referencias mutables para la imagen recortada y la función de reseteo.
 */
export function initializeCropper(parentContainer, type) {
    // 1. Crear el input file si no existe o limpiarlo
    let imageUploadElement = parentContainer.querySelector('input[type="file"].dynamic-cropper-input');
    if (!imageUploadElement) {
        imageUploadElement = document.createElement('input');
        imageUploadElement.type = 'file';
        imageUploadElement.className = 'form-control dynamic-cropper-input mt-2';
        imageUploadElement.id = 'imageUpload_' + type; // ID único
        imageUploadElement.accept = 'image/*';
        imageUploadElement.required = true;
        // Añadir una label asociada al input
        const label = document.createElement('label');
        label.htmlFor = imageUploadElement.id;
        label.className = 'form-label';
        label.textContent = `Imagen de ${type === 'profile' ? 'Perfil' : 'Portada'}`;
        parentContainer.appendChild(label);
        parentContainer.appendChild(imageUploadElement);
    } else {
        imageUploadElement.value = ''; // Limpiar el input si ya existe
    }

    // 2. Crear el contenedor específico del cropper (donde Croppie inyectará su UI)
    let dynamicCropperContainer = parentContainer.querySelector('.dynamic-cropper-instance-container');
    if (!dynamicCropperContainer) {
        dynamicCropperContainer = document.createElement('div');
        dynamicCropperContainer.className = 'dynamic-cropper-instance-container mt-3';
        parentContainer.appendChild(dynamicCropperContainer);
    }

    // 3. Crear el elemento img para la previsualización
    let imagePreviewElement = parentContainer.querySelector('.dynamic-image-preview');
    if (!imagePreviewElement) {
        imagePreviewElement = document.createElement('img');
        imagePreviewElement.id = "coverImagePreview";
        imagePreviewElement.className = 'img-fluid mt-2 dynamic-image-preview';
        imagePreviewElement.alt = `Previsualización de ${type === 'profile' ? 'perfil' : 'portada'}`;
        imagePreviewElement.style.display = 'none';
        parentContainer.appendChild(imagePreviewElement);
    }

    // 4. Crear los elementos de texto de previsualización
    let previewTextElement = parentContainer.querySelector('.dynamic-preview-text');
    if (!previewTextElement) {
        previewTextElement = document.createElement('p');
        previewTextElement.className = 'mt-2 dynamic-preview-text';
        previewTextElement.textContent = `Sube una imagen para tu ${type === 'profile' ? 'perfil' : 'portada'}.`;
        parentContainer.appendChild(previewTextElement);
    }

    let previewSubtextElement = parentContainer.querySelector('.dynamic-preview-subtext');
    if (!previewSubtextElement) {
        previewSubtextElement = document.createElement('p');
        previewSubtextElement.className = 'dynamic-preview-subtext';
        previewSubtextElement.textContent = 'Formato: JPG, PNG, GIF. Máx 2MB.';
        parentContainer.appendChild(previewSubtextElement);
    }

    // 5. Crear el elemento para mostrar errores
    let errorElement = parentContainer.querySelector('.dynamic-image-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'invalid-feedback dynamic-image-error';
        errorElement.style.display = 'none';
        parentContainer.appendChild(errorElement);
    }


    const croppieInstance = { value: null };
    const currentCropperElement = { value: null };
    const croppedImageBlob = { value: null };

    // Creamos un objeto 'ElementsRef' local para esta instancia del cropper
    const refs = {
        imageUpload: imageUploadElement,
        cropperWrapperParent: parentContainer, // El contenedor general que le pasamos
        dynamicCropperContainer: dynamicCropperContainer, // El div específico donde vive Croppie
        imagePreview: imagePreviewElement,
        previewText: previewTextElement,
        previewSubtext: previewSubtextElement,
        imageError: errorElement,
        croppieInstance: croppieInstance,
        currentCropperElement: currentCropperElement,
        croppedImageBlob: croppedImageBlob,
        cropperType: type,
        cropButton: null, // Se llenarán dinámicamente
        cancelButton: null // Se llenarán dinámicamente
    };

    resetCropperUI(refs); // Resetea la UI al inicializar

    // imageUploadElement.addEventListener('change', (event) => handleImageUpload(event, refs));
    parentContainer.addEventListener('change', (event) => {

        // Asegúrate de que el evento provenga del input file correcto que acabamos de crear
        if (event.target === imageUploadElement) {

            handleImageUpload(event, refs);
        }
    });

    // Devolvemos el blob y la función de reseteo para que main.js pueda acceder a ellos
    return {
        croppedImageBlob: croppedImageBlob,
        reset: () => resetCropperUI(refs)
    };
}