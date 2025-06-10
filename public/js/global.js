// public/js/global.js

// Lógica del modal del visor de álbumes (Carrusel) y sus comentarios
const albumViewerModal = document.getElementById('albumViewerModal');
const albumTitleElement = document.getElementById('albumViewerModalLabel');
const fullscreenToggleBtn = document.getElementById('fullscreenToggleBtn');
const carouselModalContent = albumViewerModal.querySelector('.modal-content');
const albumCarousel = document.getElementById('albumCarousel');
const commentsList = document.getElementById('commentsList');
const currentWorkCommentsTitle = document.getElementById('currentWorkCommentsTitle');
const addCommentForm = document.getElementById('addCommentForm');
const commentTextInput = document.getElementById('commentText');

//modal login y registro






// Al abrir el modal del visor de álbumes
albumViewerModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const albumId = button.getAttribute('data-album-id');

    let albumTitle = "Ver Álbum";
    if (albumId === 'urbanCollection') {
        albumTitle = "Mi Colección Urbana";
    } else if (albumId === 'naturePortraits') {
        albumTitle = "Retratos en la Naturaleza";
    } else if (albumId === 'abstractColor') {
        albumTitle = "Abstracción y Color";
    } else if (albumId === 'sharedUrban') {
        albumTitle = "ArtistaEjemplo y RicardoV: Colores Urbanos";
    } else if (albumId === 'sharedGarden') {
        albumTitle = "ArtistaEjemplo y ClaraL: Jardín Secreto";
    }
    albumTitleElement.textContent = albumTitle;

    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    albumViewerModal.classList.remove('fullscreen');
    fullscreenToggleBtn.querySelector('i').classList.replace('bi-fullscreen-exit', 'bi-arrows-fullscreen');

    // Renderizar comentarios de la primera obra activa al abrir el modal
    const activeWorkItem = albumCarousel.querySelector('.carousel-item.active');
    const currentWorkId = activeWorkItem ? activeWorkItem.getAttribute('data-work-id') : null;
    if (currentWorkId) {
        renderComments(currentWorkId);
    }
    commentTextInput.value = '';
});







// Lógica de pantalla completa para el modal del carrusel
fullscreenToggleBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        if (carouselModalContent.requestFullscreen) {
            carouselModalContent.requestFullscreen();
        } else if (carouselModalContent.mozRequestFullScreen) {
            carouselModalContent.mozRequestFullScreen();
        } else if (carouselModalContent.webkitRequestFullscreen) {
            carouselModalContent.webkitRequestFullscreen();
        } else if (carouselModalContent.msRequestFullscreen) {
            carouselModalContent.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
});

document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        albumViewerModal.classList.add('fullscreen');
        fullscreenToggleBtn.querySelector('i').classList.replace('bi-arrows-fullscreen', 'bi-fullscreen-exit');
        fullscreenToggleBtn.title = 'Salir de Pantalla Completa';
    } else {
        albumViewerModal.classList.remove('fullscreen');
        fullscreenToggleBtn.querySelector('i').classList.replace('bi-fullscreen-exit', 'bi-arrows-fullscreen');
        fullscreenToggleBtn.title = 'Pantalla Completa';
    }
});
document.addEventListener('webkitfullscreenchange', () => {
    if (document.webkitFullscreenElement) {
        albumViewerModal.classList.add('fullscreen');
        fullscreenToggleBtn.querySelector('i').classList.replace('bi-arrows-fullscreen', 'bi-fullscreen-exit');
        fullscreenToggleBtn.title = 'Salir de Pantalla Completa';
    } else {
        albumViewerModal.classList.remove('fullscreen');
        fullscreenToggleBtn.querySelector('i').classList.replace('bi-fullscreen-exit', 'bi-arrows-fullscreen');
        fullscreenToggleBtn.title = 'Pantalla Completa';
    }
});
document.addEventListener('mozfullscreenchange', () => {
    if (document.mozFullScreenElement) {
        albumViewerModal.classList.add('fullscreen');
        fullscreenToggleBtn.querySelector('i').classList.replace('bi-arrows-fullscreen', 'bi-fullscreen-exit');
        fullscreenToggleBtn.title = 'Salir de Pantalla Completa';
    } else {
        albumViewerModal.classList.remove('fullscreen');
        fullscreenToggleBtn.querySelector('i').classList.replace('bi-arrows-fullscreen', 'bi-fullscreen-exit');
        fullscreenToggleBtn.title = 'Pantalla Completa';
    }
});
document.addEventListener('msfullscreenchange', () => {
    if (document.msFullscreenElement) {
        albumViewerModal.classList.add('fullscreen');
        fullscreenToggleBtn.querySelector('i').classList.replace('bi-arrows-fullscreen', 'bi-fullscreen-exit');
        fullscreenToggleBtn.title = 'Salir de Pantalla Completa';
    } else {
        albumViewerModal.classList.remove('fullscreen');
        fullscreenToggleBtn.querySelector('i').classList.replace('bi-fullscreen-exit', 'bi-arrows-fullscreen');
        fullscreenToggleBtn.title = 'Pantalla Completa';
    }
});

albumViewerModal.addEventListener('hidden.bs.modal', () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
});


document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector("#countdownDisplay")) {
        redirigirConConteo('/', 3);
    }
});
/**
* Redirige a una URL después de un conteo regresivo visible.
*
* @param {string} url - La URL a la que se redirigirá.
* @param {number} segundos - El número de segundos para el conteo regresivo.
* @param {string} [elementoId='countdownDisplay'] - El ID del elemento HTML donde se mostrará el conteo.
*/
function redirigirConConteo(url, segundos, elementoId = 'countdownDisplay') {
    const display = document.getElementById(elementoId);
    let tiempoRestante = segundos;

    if (!display) {
        console.error(`Error: Elemento con ID '${elementoId}' no encontrado. Redirigiendo directamente.`);
        setTimeout(() => {
            window.location.href = url;
        }, segundos * 1000);
        return;
    }

    // Muestra el conteo inicial
    display.textContent = tiempoRestante;

    const intervalo = setInterval(() => {
        tiempoRestante--;
        display.textContent = tiempoRestante;

        if (tiempoRestante <= 0) {
            clearInterval(intervalo);
            window.location.href = url;
        }
    }, 1000);
}

