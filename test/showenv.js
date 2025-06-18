// showEnvVars.js
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

console.log('--- Variables de Entorno del Proyecto ---');

// Variables del servidor
console.log(`PORT: ${process.env.PORT || 'No definida'}`);
console.log(`HOST: ${process.env.HOST || 'No definida'}`);

// Variables de la base de datos MySQL
console.log(`DB_HOST: ${process.env.DB_HOST || 'No definida'}`);
console.log(`DB_USER: ${process.env.DB_USER || 'No definida'}`);
console.log(`DB_NAME: ${process.env.DB_NAME || 'No definida'}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? '****** (Definida)' : 'No definida'}`); // Por seguridad

// Variables de seguridad y sesiones
console.log(`SESSION_SECRET: ${process.env.SESSION_SECRET ? '****** (Definida)' : 'No definida'}`); // Por seguridad
console.log(`JWTSECRET: ${process.env.JWTSECRET ? '****** (Definida)' : 'No definida'}`); // Por seguridad

// Variables de Redis
console.log(`REDIS_URL: ${process.env.REDIS_URL || 'No definida'}`);

// Variables de correo electrónico
console.log(`EMAIL: ${process.env.EMAIL || 'No definida'}`);
console.log(`PASSEMAIL: ${process.env.PASSEMAIL ? '****** (Definida)' : 'No definida'}`); // Por seguridad

console.log('-------------------------------------------');

// Advertencia si falta alguna variable crítica
if (
    !process.env.PORT ||
    !process.env.DB_HOST ||
    !process.env.DB_USER ||
    !process.env.DB_PASSWORD ||
    !process.env.DB_NAME ||
    !process.env.SESSION_SECRET ||
    !process.env.REDIS_URL ||
    !process.env.JWTSECRET ||
    !process.env.EMAIL ||
    !process.env.PASSEMAIL
) {
    console.warn('\n¡Advertencia! Parece que una o más variables de entorno importantes no están definidas.');
    console.warn('Asegúrate de que tu archivo .env contenga todas las variables necesarias.');
}