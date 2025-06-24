const AMISTAD_TYPE = Object.freeze({

    PENDIENTE: 'pendiente',
    ACEPTADA: 'aceptada',
    RECHAZADA: 'rechazada',

    isValid: (type) => Object.values(AMISTAD_TYPE).includes(type)
});

module.exports = AMISTAD_TYPE;