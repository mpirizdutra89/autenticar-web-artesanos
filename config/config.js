
require('dotenv').config(); // Carga variables desde .env SOLO si NO estamos en producción

const config = {
    jwtSecret: process.env.JWTSECRET || "$2b$10$LDs84NnwMC48/PSF9lMOo.AJJ794AB4r79mCmVZqQJ77JpSW0Kr82",
    email: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true para 465, false para otros puertos como 587
        auth: {
            user: process.env.EMAIL || "artesanos.mpd@gmail.com",
            pass: process.env.PASSEMAIL || "edarauhwijpipdrq"
        }
    },
    appBaseUrl: `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3003}` // URL base de tu aplicación frontend
};

module.exports = config;