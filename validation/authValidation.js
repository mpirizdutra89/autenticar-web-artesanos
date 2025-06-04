const { body } = require('express-validator');

// Reglas de validación para el formulario de Login
const loginValidationRules = () => {
    return [
        body('email')
            .notEmpty().withMessage('El correo electrónico es obligatorio.')
            .isEmail().withMessage('El formato del correo electrónico no es válido.')
            .normalizeEmail(), // Sanitiza: convierte el email a minúsculas y elimina puntos en Gmail, etc.

        body('password')
            .notEmpty().withMessage('La contraseña es obligatoria.')
            .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
            // Para el LOGIN, SOLO VERIFICAR CARACTERES SEGUROS (letras, números, comunes)
            // Esto es crucial para la seguridad contra inyección SQL.

            .matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/) // Permite caracteres comunes y alfanuméricos
            .withMessage('La contraseña contiene caracteres no permitidos.')
    ];
};

// Reglas de validación para el formulario de Registro
const registerValidationRules = () => {
    return [
        body('nombre')
            .notEmpty().withMessage('El nombre es obligatorio.')
            .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres.')
            .trim() // Sanitiza: elimina espacios en blanco al inicio y final
            .escape(), // Sanitiza: convierte caracteres HTML especiales a entidades HTML (ej. < a &lt;)

        body('apellido')
            .notEmpty().withMessage('El apellido es obligatorio.')
            .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres.')
            .trim()
            .escape(),

        body('email')
            .notEmpty().withMessage('El correo electrónico es obligatorio.')
            .isEmail().withMessage('El formato del correo electrónico no es válido.')
            .normalizeEmail(),

        body('password')
            .notEmpty().withMessage('La contraseña es obligatoria.')
            .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
        // Aquí podrías añadir una regex más estricta para la complejidad de la contraseña
        // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        // .withMessage('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.'),

        body('confirmPassword')
            .notEmpty().withMessage('Por favor, repite la contraseña.')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Las contraseñas no coinciden.');
                }
                return true;
            })
    ];
};

module.exports = {
    loginValidationRules,
    registerValidationRules
};