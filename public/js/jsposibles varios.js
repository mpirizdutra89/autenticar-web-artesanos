//const manageAlbumWorksModal = document.getElementById('manageAlbumWorksModal');

/* manageAlbumWorksModal.addEventListener('show.bs.modal', async event => {
    const button = event.relatedTarget;
    const albumTitle = button.getAttribute('data-album-title');
    const albumId = button.getAttribute('data-album-id');

    document.getElementById('currentAlbumTitle').textContent = albumTitle;

    const currentWorksList = document.getElementById('currentWorksList');
    currentWorksList.innerHTML = '';

    try {
        const response = await fetch(`/api/albums/${albumId}/works`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const worksForThisAlbum = await response.json();

        if (worksForThisAlbum.length > 0) {
            worksForThisAlbum.forEach(work => {
                const workItem = document.createElement('div');
                workItem.classList.add('work-item');
                workItem.innerHTML = `
                    <div class="d-flex align-items-center">
                        <img src="${work.src}" class="work-thumbnail" alt="${work.title}">
                        <span>${work.title}</span>
                    </div>
                    <button class="btn btn-sm btn-danger" data-work-id="${work.id}"><i class="bi bi-trash"></i> Eliminar</button>
                `;
                currentWorksList.appendChild(workItem);

                workItem.querySelector('.btn-danger').addEventListener('click', async (e) => {
                    if (confirm(`¿Estás seguro de que quieres eliminar la obra "${work.title}"?`)) {
                        try {
                            const deleteResponse = await fetch(`/api/albums/${albumId}/works/${work.id}`, {
                                method: 'DELETE'
                            });

                            if (!deleteResponse.ok) {
                                throw new Error(`HTTP error! status: ${deleteResponse.status}`);
                            }

                            const result = await deleteResponse.json();
                            console.log(result.message);
                            workItem.remove(); // Eliminar visualmente

                            if (currentWorksList.children.length === 1 && currentWorksList.querySelector('.empty-state')) {
                                currentWorksList.querySelector('.empty-state').classList.remove('d-none');
                            } else if (currentWorksList.children.length === 0) { // Si ya no quedan obras
                                const emptyStateDiv = document.createElement('div');
                                emptyStateDiv.classList.add('empty-state');
                                emptyStateDiv.innerHTML = `<i class="bi bi-folder-x"></i><p>Este álbum no tiene obras aún. ¡Añade algunas!</p>`;
                                currentWorksList.appendChild(emptyStateDiv);
                            }
                        } catch (error) {
                            console.error("Error al eliminar la obra:", error);
                            alert("Hubo un error al eliminar la obra.");
                        }
                    }
                });
            });
            currentWorksList.querySelector('.empty-state')?.classList.add('d-none'); // Ocultar si hay obras
        } else {
            currentWorksList.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-folder-x"></i>
                    <p>Este álbum no tiene obras aún. ¡Añade algunas!</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error al cargar las obras del álbum:", error);
        currentWorksList.innerHTML = `<div class="empty-state text-danger"><i class="bi bi-exclamation-triangle"></i><p>Error al cargar las obras.</p></div>`;
    }

    document.getElementById('workUpload').value = '';
    document.getElementById('workTitle').value = '';
    document.getElementById('workDescription').value = '';
}); */

/* document.querySelector('#pills-add-works form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const workUpload = document.getElementById('workUpload');
    const workTitle = document.getElementById('workTitle').value;
    const workDescription = document.getElementById('workDescription').value;
    const currentAlbumId = document.getElementById('manageAlbumWorksModal').querySelector('#currentAlbumTitle').dataset.albumId; // Obtener el ID del álbum actual

    if (workUpload.files.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < workUpload.files.length; i++) {
            formData.append('files', workUpload.files[i]);
        }
        formData.append('title', workTitle);
        formData.append('description', workDescription);

        try {
            // Aquí, en un entorno real, usarías un middleware como 'multer' en Express
            // para procesar el formData y guardar los archivos.
            // Para esta simulación, solo enviamos un JSON simple.
            const response = await fetch(`/api/albums/${currentAlbumId}/works`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Para la simulación, aunque para archivos reales sería 'multipart/form-data'
                },
                body: JSON.stringify({ // Enviamos solo metadatos para la simulación
                    filesCount: workUpload.files.length,
                    title: workTitle,
                    description: workDescription
                })
                // body: formData // Esto sería lo real con Multer
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            alert(`Mensaje del servidor: ${result.message}`);

            // Simular recarga de obras si se subieron con éxito
            const manageAlbumWorksModalInstance = bootstrap.Modal.getInstance(manageAlbumWorksModal);
            if (manageAlbumWorksModalInstance) {
                manageAlbumWorksModalInstance.hide(); // Cerrar el modal
                // Y podrías disparar un evento o recargar la página para ver los cambios si el backend persiste
            }
            // O directamente:
            // await fetchAndRenderWorks(currentAlbumId); // Si tuvieras una función para esto
            document.getElementById('workUpload').value = '';
            document.getElementById('workTitle').value = '';
            document.getElementById('workDescription').value = '';

        } catch (error) {
            console.error("Error al subir obras:", error);
            alert("Hubo un error al subir las obras. Inténtalo de nuevo.");
        }
    } else {
        alert('Por favor, selecciona al menos un archivo para subir.');
    }
}); */