export const NOTIFICACION_TYPE = Object.freeze({

    SOLICITUD_AMISTAD: 'solicitud_amistad',
    SOLICITUD_AMISTAD_RESP: 'solicitud_amistad_resp',
    NUEVO_COMENTARIO: 'nuevo_comentario',
    ALERTAS_SISTEMA: 'alertas_sistema',
    OTRO_TIPO: 'otro_tipo',
    isValid: (type) => Object.values(NOTIFICACION_TYPE).includes(type)
});//ENUM('solicitud_amistad', 'solicitud_amistad_resp', 'nuevo_comentario',)