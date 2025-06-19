
require('dotenv').config(); // Carga variables desde .env SOLO si NO estamos en producción
const EMAIL = process.env.EMAIL ? process.env.EMAIL : "artesanos.mpd@gmail.com"
const PASSEMAIL = process.env.PASSEMAIL ? process.env.PASSEMAIL : "edarauhwijpipdrq"
const config = {
    jwtSecret: process.env.JWTSECRET || "$2b$10$LDs84NnwMC48/PSF9lMOo.AJJ794AB4r79mCmVZqQJ77JpSW0Kr82",
    email: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true para 465, false para otros puertos como 587
        auth: {
            user: EMAIL,
            pass: PASSEMAIL
        }
    },
    appBaseUrl: process.env.NODE_ENV === 'production' ? 'http://artesanos.mpiridutra.site' : `http://localhost:3003` //`http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3003}` // URL base de tu aplicación frontend
};

module.exports = config;