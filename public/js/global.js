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

// Función para renderizar comentarios de una obra específica (ahora usa fetch)
/* async function renderComments(workId) {
    try {
        const response = await fetch(`/api/works/${workId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const work = await response.json();

        if (!work) {
            commentsList.innerHTML = `<div class="no-comments-message"><i class="bi bi-exclamation-circle"></i><p>Obra no encontrada.</p></div>`;
            currentWorkCommentsTitle.textContent = "Obra Desconocida";
            return;
        }

        currentWorkCommentsTitle.textContent = work.title;
        commentsList.innerHTML = ''; // Limpiar comentarios anteriores

        // Mostrar el título y la descripción de la obra en la sección de comentarios
        const workInfoHtml = `
            <h5 class="mb-1">${work.title}</h5>
            <p class="text-muted small mb-3">${work.description}</p>
            <hr class="my-2">
        `;
        // Insertar antes del commentsList pero después del h6 del título de comentarios
        const commentsSectionTitle = commentsList.closest('.comments-section').querySelector('h6');
        // Eliminar información de la obra anterior si existe
        let existingWorkInfo = commentsSectionTitle.nextElementSibling;
        while (existingWorkInfo && (existingWorkInfo.tagName === 'H5' || existingWorkInfo.tagName === 'P' || existingWorkInfo.tagName === 'HR')) {
            const nextElement = existingWorkInfo.nextElementSibling;
            existingWorkInfo.remove();
            existingWorkInfo = nextElement;
        }
        commentsSectionTitle.insertAdjacentHTML('afterend', workInfoHtml);


        if (work.comments && work.comments.length > 0) {
            work.comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment-item');
                commentDiv.innerHTML = `
                    <p class="mb-0">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-date">${new Date(comment.date).toLocaleDateString()}</span>
                    </p>
                    <p class="comment-text">${comment.text}</p>
                `;
                commentsList.appendChild(commentDiv);
            });
        } else {
            commentsList.innerHTML = `
                <div class="no-comments-message">
                    <i class="bi bi-chat-dots"></i>
                    <p>Sé el primero en comentar esta obra.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error al cargar los comentarios de la obra:", error);
        commentsList.innerHTML = `<div class="no-comments-message text-danger"><i class="bi bi-exclamation-triangle"></i><p>Error al cargar comentarios.</p></div>`;
    }
}
 */
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