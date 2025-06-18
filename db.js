// db.js
// Este archivo maneja la conexión a la base de datos MySQL.
const mysql = require('mysql2/promise'); // Importa el módulo mysql2 con soporte para promesas

require('dotenv').config();


// Crea un pool de conexiones a la base de datos
// Un pool es más eficiente que abrir y cerrar una conexión para cada consulta.
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',     // Host de la base de datos (ej. 'localhost')
    user: process.env.DB_USER || 'root',     // Usuario de la base de datos
    password: process.env.DB_PASSWORD || 'nicolas89', // Contraseña del usuario de la base de datos
    database: process.env.DB_NAME || 'mpd_artesanos',   // Nombre de la base de datos
    waitForConnections: true,      // Si no hay conexiones disponibles, espera
    connectionLimit: 10,           // Número máximo de conexiones en el pool
    queueLimit: 0                  // Límite de solicitudes en cola (0 = sin límite)
});

// Exporta el pool para que pueda ser usado en otros archivos
module.exports = pool;
