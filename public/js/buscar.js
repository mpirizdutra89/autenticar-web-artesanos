// public/js/main.js
import { showFloatingAlert } from './funcionesjs/utils.js';
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchResultsDiv = document.getElementById('searchResults');
    let debounceTimeoutId;

    if (!searchInput || !searchResultsDiv) {
        console.error('Elementos de búsqueda no encontrados. Asegúrate de que los IDs sean correctos.');
        return;
    }

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimeoutId); // Limpia el timeout anterior

        const query = searchInput.value.trim();

        if (query.length < 3) { // Evitar búsquedas con pocos caracteres
            searchResultsDiv.innerHTML = '';
            searchResultsDiv.style.display = 'none'; // Ocultar si no hay resultados o query corta
            return;
        }

        debounceTimeoutId = setTimeout(async () => {
            try {
                const response = await fetch(`/search?q=${encodeURIComponent(query)}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                renderSearchResults(data);

            } catch (error) {
                console.error('Error al realizar la búsqueda:', error);
                searchResultsDiv.innerHTML = `<div class="error-message">Hubo un error al buscar: ${error.message}</div>`;
                searchResultsDiv.style.display = 'block';
            }
        }, 300); // Debounce: espera 300ms antes de enviar la solicitud
    });

    // Opcional: Ocultar resultados si el usuario hace clic fuera del campo de búsqueda/resultados
    document.addEventListener('click', (event) => {
        if (!searchInput.contains(event.target) && !searchResultsDiv.contains(event.target)) {
            searchResultsDiv.innerHTML = '';
            searchResultsDiv.style.display = 'none';
        }
    });

    // Opcional: Mostrar resultados de nuevo si el input tiene texto y se enfoca
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length >= 2 && searchResultsDiv.children.length > 0) {
            searchResultsDiv.style.display = 'block';
        }
    });
});


async function handleFriendRequest(btnEvent) {
    // event.stopPropagation(); // Evita que el clic se propague al userElement padre


    const userId = btnEvent.dataset.userId;
    const estadouser = btnEvent.dataset.userEstado;
    const buttonTextSpan = btnEvent.querySelector('.button-text');
    const spinnerSpan = btnEvent.querySelector('.spinner-border');

    if (estadouser == 0) {


        btnEvent.setAttribute('disabled', true);
        if (buttonTextSpan) { // Asegurarse de que el span existe
            buttonTextSpan.classList.add('d-none'); // Oculta el texto
        }
        if (spinnerSpan) { // Asegurarse de que el spinner existe
            spinnerSpan.classList.remove('d-none'); // Muestra el spinner
        }

        try {

            const response = await fetch('/compartir/solicitud-amistad', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // 'Authorization': 'Bearer tu_token_aqui' // Si necesitas autenticación
                },
                body: JSON.stringify({ userId: userId, action: 'pendiente' })
            });

            // 3. Simular un retardo adicional para que el spinner se vea bien (opcional)
            await new Promise(resolve => setTimeout(resolve, 1500)); // Espera 1.5 segundos

            if (response.ok) {

                const result = await response.json(); // Si esperas un JSON de respuesta
                console.log('Solicitud enviada, respuesta:', result); // Para depuración




                if (buttonTextSpan) {
                    buttonTextSpan.textContent = result.status ? result.status : 'Solicitud';
                    buttonTextSpan.classList.remove('d-none');
                }
                if (spinnerSpan) {
                    spinnerSpan.classList.add('d-none');
                }
                btnEvent.classList.remove('btn-primary');
                btnEvent.classList.add('btn-secondary'); // Cambiar color para indicar estado
                btnEvent.setAttribute('disabled', true); // Mantener deshabilitado si ya se envió
                showFloatingAlert(result.message ? result.message : 'Solisitud enviada con exito', 'success', 'bottom', 3000)
            } else {

                const errorText = await response.text(); // Leer como texto si no es JSON
                console.error(`Error ${response.status}:`, errorText); // Para depuración



                if (buttonTextSpan) {
                    buttonTextSpan.classList.remove('d-none');
                    buttonTextSpan.textContent = 'Solicitud'; // Volver al texto original
                }
                if (spinnerSpan) {
                    spinnerSpan.classList.add('d-none');
                }
                btnEvent.removeAttribute('disabled');
                showFloatingAlert('Ocurrio un fallo en el envio de la solicitud', 'danger', 'bottom', 5000)
            }
        } catch (error) {

            console.error('Error de conexión o al enviar solicitud:', error);
            //alert(`Hubo un problema de conexión al enviar la solicitud (ID: ${userId}). Intenta de nuevo.`);


            if (buttonTextSpan) {
                buttonTextSpan.classList.remove('d-none');
                buttonTextSpan.textContent = 'Solicitud'; // Volver al texto original
            }
            if (spinnerSpan) {
                spinnerSpan.classList.add('d-none');
            }
            btnEvent.removeAttribute('disabled');
            showFloatingAlert('Ocurrio un fallo en el envio de la solicitud', 'danger', 'bottom', 5000)
        }
    }
}


function renderSearchResults(data) {
    const searchResultsDiv = document.getElementById('searchResults');
    searchResultsDiv.innerHTML = ''; // Limpiar resultados anteriores

    let hasResults = false;

    // Categoría: Usuarios
    if (data.users && data.users.length > 0) {
        hasResults = true; // Asegúrate de que hasResults esté definido en el scope correcto
        const usersSection = document.createElement('div');
        usersSection.classList.add('search-category');
        usersSection.innerHTML = '<h3>Usuarios</h3>';

        data.users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('search-result-item');
            userElement.classList.add('sinhover'); // Tu clase original
            console.log(user)
            const text = user.estadoAmistad === null ? 'solicitud' : user.estadoAmistad;
            const estilo = user.estadoAmistad === null ? 'btn-primary' : 'btn-secondary'
            const desabilitar = user.estadoAmistad === null ? '' : 'disabled'
            userElement.innerHTML = `
            <span class="icon">👤</span>
            <span class="name">${user.name}</span>
            <span class="meta">${user.email || ''}</span>
            <button type="button" class="btn ${estilo}  btn-sm ms-2  friend-request-btn ${desabilitar}" data-user-estado='${user.estadoAmistad === null ? '0' : user.estadoAmistad}' data-user-id="${user.id}">
                <i class="bi bi-person-plus-fill"></i> <span class="button-text">${text}</span>
                <span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>
            </button>
        `;


            userElement.addEventListener('click', (event) => {
                const button = event.target

                const btnEvent = button.closest('.friend-request-btn');
                if (btnEvent) { handleFriendRequest(btnEvent) }
            });

            usersSection.appendChild(userElement);
        });


        searchResultsDiv.appendChild(usersSection);
    }

    // Categoría: Álbumes por Título
    if (data.albumsByTitle && data.albumsByTitle.length > 0) {
        hasResults = true;
        const albumsTitleSection = document.createElement('div');
        albumsTitleSection.classList.add('search-category');
        albumsTitleSection.innerHTML = '<h3>Álbumes (por Título)</h3>';
        data.albumsByTitle.forEach(album => {
            const albumElement = document.createElement('div');
            albumElement.classList.add('search-result-item');
            albumElement.innerHTML = `
                <span class="icon">🖼️</span>
                <span class="name">${album.titulo}</span>
                <span class="meta">${album.artista || ''}</span>
            `;
            albumElement.addEventListener('click', () => {
                // Aquí puedes redirigir a la página del álbum
                alert(`Seleccionaste álbum: ${album.title}`);
                // window.location.href = `/albums/${album.id}`;
            });
            albumsTitleSection.appendChild(albumElement);
        });
        searchResultsDiv.appendChild(albumsTitleSection);
    }

    // Categoría: Álbumes por Etiqueta (Tag)
    if (data.albumsByTag && data.albumsByTag.length > 0) {
        hasResults = true;
        const albumsTagSection = document.createElement('div');
        albumsTagSection.classList.add('search-category');
        albumsTagSection.innerHTML = '<h3>Álbumes (por Etiqueta)</h3>';
        data.albumsByTag.forEach(album => {
            const albumElement = document.createElement('div');
            albumElement.classList.add('search-result-item');
            albumElement.innerHTML = `
                <span class="icon">🏷️</span>
                <span class="name">${album.title}</span>
                <span class="meta">Tags: ${album.tags ? album.tags.join(', ') : ''}</span>
            `;
            albumElement.addEventListener('click', () => {
                // Aquí puedes redirigir a la página del álbum
                alert(`Seleccionaste álbum: ${album.title}`);
                // window.location.href = `/albums/${album.id}`;
            });
            albumsTagSection.appendChild(albumElement);
        });
        searchResultsDiv.appendChild(albumsTagSection);
    }

    if (!hasResults) {
        searchResultsDiv.innerHTML = `<div class="no-results">No se encontraron resultados para "${searchInput.value}".</div>`;
    }

    searchResultsDiv.style.display = 'block'; // Asegúrate de que el contenedor sea visible
}