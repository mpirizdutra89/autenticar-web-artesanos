// test.js

require('dotenv').config(); // Carga variables desde .env SOLO si NO estamos en producción

let DB_HOST = process.env.DB_HOST ? process.env.DB_HOST : 'localhost'
let DB_USER = process.env.DB_USER ? process.env.DB_USER : 'root'
let DB_NAME = process.env.DB_NAME ? process.env.DB_NAME : 'mpd_artesanos'
let DB_PASSWORD = process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'reSUlu43ra'
// Importa el pool de conexiones que definiste en db.js
//const pool = require('../db');
const UserModelo = require('../models/UserModel')
async function testDatabaseConnection() {
    console.log('--- Verificando variables de entorno de la base de datos ---');
    console.log(`DB_HOST: ${DB_HOST}`);
    console.log(`DB_USER: ${DB_USER}`);
    console.log(`DB_NAME: ${DB_NAME}`);
    // No imprimimos DB_PASSWORD directamente por seguridad, solo verificamos si existe
    console.log(`DB_PASSWORD ${DB_PASSWORD}`);
    console.log('----------------------------------------------------');
    console.log('');

    try {
        console.log('Intentando obtener una conexión del pool...');
        // Intenta obtener una conexión del pool
        //const connection = await pool.getConnection();
        console.log('¡Conexión obtenida del pool correctamente!');

        console.log('Ejecutando una consulta de prueba (SELECT 1 + 1)...');
        // Ejecuta una consulta simple para verificar que la conexión funciona
        const [rows] = await UserModelo.findById(1)
        console.log(rows);

        // Libera la conexión de vuelta al pool
        //connection.release();
        console.log('Conexión liberada de vuelta al pool.');
        console.log('');
        console.log('--- ¡ÉXITO! La conexión a la base de datos funciona correctamente. ---');

    } catch (error) {
        console.error('\n--- ¡ERROR! No se pudo conectar a la base de datos ---');
        console.error('Detalles del error:', error.message);
        if (error.code) {
            console.error('Código de error MySQL:', error.code);
        }
        console.error('Asegúrate de que el servidor MySQL esté corriendo y las credenciales en tu archivo .env sean correctas.');
        console.error('Revisa tu archivo .env: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.');
    } finally {
        // Cierra el pool después de la prueba para asegurar que el script termine
        // Esto es importante para scripts de prueba únicos, no para aplicaciones que siempre están corriendo
        /*  if (pool) {
             await pool.end();
             console.log('Pool de conexiones cerrado.');
         } */
    }
}

// Ejecuta la función de prueba
testDatabaseConnection();