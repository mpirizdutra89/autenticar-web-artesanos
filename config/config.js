if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config(); // Carga variables desde .env SOLO si NO estamos en producción
}
const config = {
    jwtSecret: process.env.JWTSECRET,
    email: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true para 465, false para otros puertos como 587
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSEMAIL
        }
    },
    appBaseUrl: `http://${process.env.HOST}:${process.env.PORT}` // URL base de tu aplicación frontend
};

module.exports = config;