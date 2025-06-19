// public/js/main.js

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

function renderSearchResults(data) {
    const searchResultsDiv = document.getElementById('searchResults');
    searchResultsDiv.innerHTML = ''; // Limpiar resultados anteriores

    let hasResults = false;

    // Categoría: Usuarios
    if (data.users && data.users.length > 0) {
        hasResults = true;
        const usersSection = document.createElement('div');
        usersSection.classList.add('search-category');
        usersSection.innerHTML = '<h3>Usuarios</h3>';
        data.users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('search-result-item');
            userElement.innerHTML = `
                <span class="icon">👤</span>
                <span class="name">${user.name}</span>
                <span class="meta">${user.email || ''}</span>
            `;
            userElement.addEventListener('click', () => {
                // Aquí puedes redirigir al perfil del usuario o disparar un evento
                alert(`Seleccionaste usuario: ${user.name}`);
                // window.location.href = `/users/${user.id}`;
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