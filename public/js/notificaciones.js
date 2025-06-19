

import { NOTIFICACION_TYPE, formatStringWithUnderscores, showFloatingAlert, isObjectEmpty } from './funcionesjs/utils.js';
//#notificacion-container   #nrNotificacion


//const socket = io();
/* const socket = io('https://artesanos.mpiridutra.site', {
    transports: ['websocket', 'polling'], // Especifica los transportes a utilizar
    reconnection: true, // Habilita la reconexión automática
    reconnectionAttempts: 5, // Intentos de reconexión
    reconnectionDelay: 1000, // Retraso entre intentos de reconexión (en milisegundos)
    timeout: 20000, // Tiempo de espera para conectar (en milisegundos)
    //  query: { token: 'mi_token_aqui' }, // Pasar parámetros en la query string
    autoConnect: true, // Conectar automáticamente

}); */
/* const socket = io('https://artesanos.mpiridutra.site', {
    transports: ['websocket', 'polling'], // Aún especificamos esto para la prioridad
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
    autoConnect: true,
    // NO se envían 'query' ni 'extraHeaders' aquí para el token
}); */

const socket = io(obtenerBaseUrlNavegador(), {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
    autoConnect: true,
    // ... otras opciones
});
console.log(obtenerBaseUrlNavegador())

const notificationList = document.getElementById('notification-list-container')
const notificationCountBadge = document.getElementById('notification-count')
const noNotificationsMessage = document.getElementById('no-notifications')
//const listaNotificaciones = document.getElementById('listaNotificaciones')

//panel
const notificacionUnread = document.getElementById("unread")
const notificacionRead = document.getElementById("read")
const btnTabRead = document.getElementById("read-tab")
// 'io()' debe estar disponible globalmente gracias al <script src="/socket.io/socket.io.js">


function obtenerBaseUrlNavegador() {
    const urlObj = new URL(window.location.href);
    let baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;
    if (urlObj.port) {
        baseUrl += `:${urlObj.port}`;
    }
    return baseUrl;
}


let unreadCount = 0;

// Tu función para actualizar el contador
function updateUnreadCount(change) {
    unreadCount += change;
    if (notificationCountBadge) { // Añade una comprobación por si el elemento no existe
        notificationCountBadge.textContent = unreadCount;
        notificationCountBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }
    if (unreadCount > 0 && noNotificationsMessage) {
        noNotificationsMessage.style.display = 'none';
    } else if (unreadCount === 0 && notificationList && notificationList.children.length === 0) {
        if (noNotificationsMessage) noNotificationsMessage.style.display = 'block';
    }
}

// Lógica de DOMContentLoaded para inicializar notificaciones existentes
document.addEventListener('DOMContentLoaded', () => {


    // Accede a la variable global que creaste en Pug
    const initialNotifications = window.initialNotificationsData || [];

    // Limpia el contenido actual si es necesario antes de añadir
    if (notificationList) notificationList.innerHTML = '';

    initialNotifications.forEach(notif => {
        if (!notif.leida) {
            updateUnreadCount(1);
        }
        //header
        if (notificationList) { // Asegúrate de que notificationList exista
            notificationList.prepend(crearItemPersonalisado(notif));

        } else if (notificacionUnread) {

            notificacionUnread.prepend(crearItemPersonalisadoPanel(notif));
        }

        //panel
    });
    if (notificacionUnread) {
        if (isObjectEmpty(initialNotifications)) {
            notificacionUnread.innerHTML = `
                     <p class="text-center text-muted mt-4">
                        <i class="bi bi-check-circle-fill me-2"></i> ¡No tienes notificaciones sin leer!
                    </p> `
        }
    }

    if (notificationList) {
        notificationList.appendChild(crearItemPersonalisado(null, true))
    }

    // Ajusta el mensaje de "No hay notificaciones" al cargar
    if (unreadCount === 0 && initialNotifications.length === 0) {

        if (noNotificationsMessage) noNotificationsMessage.style.display = 'block';
    } else if (noNotificationsMessage) {
        noNotificationsMessage.style.display = 'none';

    }
    // inicializarTooltips();
});

// NOTA: la funcion no trae notificaciones leidas, deverias gnerar un funcion para el hitorial de la leidas
//aprte de lo otro
function crearItemPersonalisadoPanel(notif) {
    let tipo = notif.tipo_notificacion
    let leida = notif.leida


    const notificationItem = document.createElement('div')
    notificationItem.id = `notif-${notif.id}`
    notificationItem.className = leida === 0 ? 'notification-list-item unread' : 'notification-list-item read'
    notificationItem.innerHTML = ''
    // <button class="btn btn-outline-success me-2 mark-as-read-btn" data-id="${notif.id}" data-referens="${notif.id_referencia}">Aceptar</button>

    switch (tipo) {
        case NOTIFICACION_TYPE.SOLICITUD_AMISTAD: {

            notificationItem.innerHTML += `               
                     ${tipoIcono(tipo)} 
                      <div class="notification-content">
                            <div class="notification-header">
                                <span class="notification-type">${formatStringWithUnderscores(tipo)}</span>
                                <small>${new Date(notif.fecha_creacion).toLocaleString()}</small>
                            </div>
                            <p class="notification-message">
                               ${notif.mensaje}
                            </p>
                            <div class="notification-meta">
                               
                                <div class="buttons-group" style="display:${leida === 0 ? 'block' : 'none'}">
                                     <button class="btn btn-md btn-outline-success rounded-pill btn-action mark-as-read-btn" data-id="${notif.id}" data-referens="${notif.id_referencia}" data-tipo="${tipo}" >Aceptar</button>
                                    <button class="btn btn-md btn-outline-danger rounded-pill btn-action mark-as-read-btn" data-id="${notif.id}"  data-tipo="${tipo}">Rechazar</button>
                                </div>
                            </div>
                        </div>`
            break
        }
        case NOTIFICACION_TYPE.SOLICITUD_AMISTAD_RESP: {
            notificationItem.innerHTML += `               
                     ${tipoIcono(tipo)} 
                      <div class="notification-content">
                            <div class="notification-header">
                                <span class="notification-type">${formatStringWithUnderscores(tipo)}</span>
                                <small>${new Date(notif.fecha_creacion).toLocaleString()}</small>
                            </div>
                            <p class="notification-message">
                               ${notif.mensaje}
                            </p>
                            <div class="notification-meta">
                               
                                <div class="buttons-group" style="display:${leida === 0 ? 'block' : 'none'}" >
                                     <button class="btn btn-md btn-outline-success rounded-pill btn-action mark-as-read-btn" data-id="${notif.id}" data-tipo="${tipo}"  data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Marcar como leida" ><i class="bi bi-check-square-fill"></i></button>
                                    
                                </div>
                            </div>
                        </div>`
            break
        }
        case NOTIFICACION_TYPE.NUEVO_COMENTARIO: {
            notificationItem.innerHTML += `               
                     ${tipoIcono(tipo)} 
                      <div class="notification-content">
                            <div class="notification-header">
                                <span class="notification-type">${formatStringWithUnderscores(tipo)}</span>
                                <small>${new Date(notif.fecha_creacion).toLocaleString()}</small>
                            </div>
                            <p class="notification-message">
                               ${notif.mensaje}
                            </p>
                            <div class="notification-meta">
                               
                                <div class="buttons-group" style="display:${leida === 0 ? 'block' : 'none'}">
                                    <button class="btn btn-md btn-outline-success rounded-pill btn-action mark-as-read-btn" data-id="${notif.id}" data-referens="${notif.id_referencia}" data-tipo="${tipo}" >ver</button>
                       
                                </div>
                            </div>
                        </div>`

            break
        }
        case NOTIFICACION_TYPE.OTRO_TIPO: {
            notificationItem.innerHTML += `               
                     ${tipoIcono(tipo)} 
                      <div class="notification-content">
                            <div class="notification-header">
                                <span class="notification-type">${formatStringWithUnderscores(tipo)}</span>
                                <small>${new Date(notif.fecha_creacion).toLocaleString()}</small>
                            </div>
                            <p class="notification-message">
                               ${notif.mensaje}
                            </p>
                            <div class="notification-meta">
                               
                                <div class="buttons-group" style="display:${leida === 0 ? 'block' : 'none'}">
                                     <button class="btn btn-md btn-outline-success rounded-pill btn-action mark-as-read-btn" data-id="${notif.id}" data-tipo="${tipo}"  data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Marcar como leida" ><i class="bi bi-check-square-fill"></i></button>
                                    
                                </div>
                            </div>
                        </div>`
            break
            //mark-as-read-btn data-tipo="${tipo}"
        }
        case NOTIFICACION_TYPE.ALERTAS_SISTEMA: {

            break
        }

        default: {
            notificationItem.innerHTML += "<a class='dropdown-item text-center text-warning' href='#'> Ver todas las notificaciones</a>"
            break
        }

    }

    notificationItem.innerHTML += '</div>'

    //console.log(notificationItem.innerHTML)
    return notificationItem;
}

function crearItemPersonalisado(notif, final = false) {
    let tipo = ''
    const notificationItem = document.createElement('li')

    if (final) {
        tipo = 'final'
    } else {
        tipo = notif.tipo_notificacion
        notificationItem.id = `notif-${notif.id}`
    }

    //notificationItem.className = ' ' /* + (notif.leida ? '' : 'list-group-item-warning') */
    notificationItem.innerHTML = ''

    switch (tipo) {
        case NOTIFICACION_TYPE.SOLICITUD_AMISTAD: {
            notificationItem.innerHTML += `                
               <a class="dropdown-item d-flex align-items-center notifications-dropdown-item" href="#"> 
                    ${tipoIcono(tipo)} 
                    <div class="notification-info flex-grow-1">  
                        <p class="mb-1">
                            ${notif.mensaje}
                        </p>
                        <div class="d-flex justify-content-end mt-2 mb-1">  
                            <button class="btn btn-outline-success me-2 mark-as-read-btn" data-id="${notif.id}" data-referens="${notif.id_referencia}" data-tipo="${tipo}">Aceptar</button>
                            <button class="btn btn-outline-danger mark-as-read-btn" data-id="${notif.id}" data-referens="${notif.id_referencia} " data-tipo="${tipo}">Rechazar</button>
                        </div >
                        <small class="text-muted">${new Date(notif.fecha_creacion).toLocaleString()}</small>`
            break
        }
        case NOTIFICACION_TYPE.SOLICITUD_AMISTAD_RESP: {
            notificationItem.innerHTML += `               
                <a class="dropdown-item d-flex align-items-center notifications-dropdown-item" href="#"> 
                     ${tipoIcono(tipo)}
                    <div class="notification-info flex-grow-1">   
                    <p class="mb-1">
                        ${notif.mensaje}
                    </p>
                    <div class="d-flex justify-content-end mt-2">
                        <button class="btn btn-outline-danger me-2 mark-as-read-btn" data-id="${notif.id}" data-referens="${notif.id_referencia}" data-tipo="${tipo}" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Marcar como leida" ><i class="bi bi-check-square-fill"></i></button>
                    </div >
                    <small class="text-muted">${new Date(notif.fecha_creacion).toLocaleString()}</small>`
            break
        }
        case NOTIFICACION_TYPE.NUEVO_COMENTARIO: {

            notificationItem.innerHTML += `                
                <a class="dropdown-item d-flex align-items-center notifications-dropdown-item" href="#">
                    ${tipoIcono(tipo)} 
                    <div class="notification-info flex-grow-1">   
                    <p class="mb-1">
                        ${notif.mensaje}
                    </p>
                    <div class="d-flex justify-content-end mt-2">
                        <button class="btn btn-outline-success me-2 mark-as-read-btn" data-id="${notif.id}" data-referens="${notif.id_referencia}" data-tipo="${tipo}">ver</button>
                    </div >
                    <small class="text-muted">${new Date(notif.fecha_creacion).toLocaleString()}</small>`
            break
        }
        case NOTIFICACION_TYPE.OTRO_TIPO: {
            notificationItem.innerHTML += `                
                <a class="dropdown-item d-flex align-items-center notifications-dropdown-item" href="#">
                    ${tipoIcono(tipo)} 
                    <div class="notification-info flex-grow-1">   
                    <p class="mb-1">
                        ${notif.mensaje}
                    </p>
                    <div class="d-flex justify-content-end mt-2">
                        <button class="btn btn-outline-info  me-2 mark-as-read-btn" data-id="${notif.id}" data-tipo="${tipo}" data-referens="0"  data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Marcar como leida" ><i class="bi bi-check-square-fill "></i></button>
                    </div >
                    <small class="text-muted">${new Date(notif.fecha_creacion).toLocaleString()}</small>`
            break

        }
        case NOTIFICACION_TYPE.ALERTAS_SISTEMA: {

            break
        }

        default: {
            notificationItem.innerHTML += "<a class='dropdown-item text-center text-warning' href='/panel-notificacion/'> Ver todas las notificaciones</a>"
            break
        }

    }

    notificationItem.innerHTML += '</div></a>'

    //console.log(notificationItem.innerHTML)
    return notificationItem;
}


function tipoIcono(tipo) {
    let icon = '<i class="bi bi-chat-right text-primary notification-icon"></i>'
    switch (tipo) {
        case NOTIFICACION_TYPE.SOLICITUD_AMISTAD:
            icon = '<i class="bi bi-person-plus-fill text-success notification-icon"></i>'
            break;
        case NOTIFICACION_TYPE.SOLICITUD_AMISTAD_RESP:
            icon = '<i class="bi bi-person-plus-fill text-danger notification-icon"></i>'
            break;
        case NOTIFICACION_TYPE.NUEVO_COMENTARIO:
            icon = '<i class="bi bi-chat-right-text-fill text-primary  notification-icon"></i>'

            break;

        case NOTIFICACION_TYPE.OTRO_TIPO: {
            icon = '<i class="bi bi-chat-right text-info  notification-icon"></i>'
            break
        }
        case NOTIFICACION_TYPE.ALERTAS_SISTEMA: {
            icon = '<i class="bi bi-person-plus-fill text-primary notification-icon"></i>'
            break
        }
    }
    return icon;
}

//if (notificacionUnread || notificationList) {
socket.on('nueva_notificacion', (notificacion) => {
    console.log('Nueva notificación recibida:', notificacion);
    /*   const notificationItem = document.createElement('div');
      notificationItem.id = `notif-${notificacion.id}`;
      notificationItem.className = 'list-group-item notification-item list-group-item-warning';
      notificationItem.innerHTML = `
        <div class="d-flex w-100 justify-content-between">
          <h6 class="mb-1">${notificacion.mensaje}</h6>
          <button class="btn btn-sm btn-outline-secondary mark-as-read-btn" data-id="${notificacion.id}">Marcar como leída</button>
        </div>
        <small class="text-muted">${new Date(notificacion.fecha_creacion).toLocaleString()}</small>
      `; */
    if (notificationList) {
        // notificationList.prepend(notificationItem);
        notificationList.prepend(crearItemPersonalisado(notificacion));
    }
    updateUnreadCount(1);
    if (noNotificationsMessage) noNotificationsMessage.style.display = 'none';
});
//}
socket.on('notificaciones_iniciales', (notificaciones) => {
    // Este listener es útil si, por ejemplo, el servidor reenvía todas las notificaciones
    // en una reconexión. Podrías querer vaciar y recrear la lista aquí.
    console.log('Notificaciones iniciales recibidas por Socket.IO (reconexión/carga):', notificaciones);
    // Lógica para reemplazar/actualizar la lista completa de notificaciones si es necesario
});

if (notificacionUnread) {
    btnTabRead.addEventListener('click', async (event) => {
        try {

            const response = await fetch('/panel-notificacion/notificaciones-read/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (data.ok) {
                const listaLeida = data.data

                if (listaLeida) {
                    notificacionRead.innerHTML = ''
                    listaLeida.forEach(notif => {

                        if (!notificacionRead) {
                            return;
                        }

                        notificacionRead.prepend(crearItemPersonalisadoPanel(notif));


                    });
                }


            }
            if (!data.ok) {

                notificacionRead.innerHTML = `
                    <p class="text-center text-muted mt-4">
                        <i i class="bi bi-archive-fill me-2" ></i> Tu historial de notificaciones leídas está vacío.
                    </p > `

            }

        } catch (error) {
            console.error('No se pudo listar las notifiaciones leidas', error);
        }
    })

    notificacionUnread.addEventListener('click', async (event) => {
        const btnActual = event.target.closest('.mark-as-read-btn')
        if (btnActual) {

            const notificationId = btnActual.dataset.id;
            const tipoNotificacion = btnActual.dataset.tipo
            const itemToUpdate = document.getElementById(`notif-${notificationId}`);

            if (tipoNotificacion !== NOTIFICACION_TYPE.SOLICITUD_AMISTAD && tipoNotificacion !== NOTIFICACION_TYPE.NUEVO_COMENTARIO) {

                try {
                    const response = await fetch(`/panel-notificacion/marcar-leida/${notificationId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    if (data.ok) {

                        if (itemToUpdate) {

                            itemToUpdate.remove();
                            updateUnreadCount(-1);
                            showFloatingAlert('La notificacion fue leida', 'success', 3000)

                        }
                    } else {
                        console.error('Error al marcar como leída:', data.message);
                        showFloatingAlert('La notificacion no se pudo dar de baja', danger, 3000)
                    }
                } catch (error) {
                    console.error('Error de red al marcar como leída:', error);
                }
            }
        }
    });
}
function inicializarTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}