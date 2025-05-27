const express = require('express'); // Framework web para Node.js
const session = require('express-session'); // Middleware para manejo de sesiones
const bodyParser = require('body-parser'); // Middleware para parsear cuerpos de solicitudes HTTP
const path = require('path'); // Módulo para trabajar con rutas de archivos y directorios
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

// Importa los módulos de rutas
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Importa el middleware de autenticación
const isAuthenticated = require('./middleware/authMiddleware');

const app = express(); // Inicializa la aplicación Express
const port = 3000; // Define el puerto en el que se ejecutará el servidor

// --- Configuración de Middleware ---

// Configura body-parser para procesar datos de formularios URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));

// Configura express-session
app.use(session({
    secret: process.env.SESSION_SECRET, // Usa la clave secreta de las variables de entorno
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 horas
        httpOnly: true,
        secure: false // true en producción si usas HTTPS y el dominio es seguro
    }
}));

// Configura Pug como motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // Define la ubicación de las plantillas Pug

// --- Rutas de la Aplicación ---
// Usa los routers definidos en archivos separados
app.use('/', authRoutes); // Rutas de autenticación (login, logout, register)
// Las rutas del dashboard usan el middleware isAuthenticated para protegerlas
app.use('/dashboard', isAuthenticated, dashboardRoutes);


// --- Inicio del Servidor ---
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
    console.log('Visita http://localhost:3000 en tu navegador para iniciar la aplicación.');
    console.log('Primero, regístrate en http://localhost:3000/register');
});