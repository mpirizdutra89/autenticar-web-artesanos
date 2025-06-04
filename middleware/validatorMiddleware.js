const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next(); // Si no hay errores, pasa al siguiente middleware o a la función del controlador
    }

    // Si hay errores, formatearlos y enviarlos como respuesta JSON
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
    console.log(extractedErrors)
    return res.status(422).json({ // 422 Unprocessable Entity es el código estándar para errores de validación
        success: false,
        message: 'Errores de validación',
        errors: extractedErrors,
    });
};

module.exports = validate;