// routes/authRoutes.js
// Este archivo define las rutas relacionadas con la autenticación (login, logout, register).

const express = require('express');
const router = express.Router(); // Crea una nueva instancia de Express Router
const authController = require('../controllers/authController'); // Importa el controlador de autenticación

// Ruta GET para la página de inicio (formulario de inicio de sesión)
router.get('/', authController.getLoginPage);

// Ruta GET para la página de registro
router.get('/register', authController.getRegisterPage);

// Ruta POST para manejar el envío del formulario de registro
router.post('/register', authController.postRegister);

// Ruta POST para manejar el envío del formulario de inicio de sesión
router.post('/login', authController.postLogin);

// Ruta POST para cerrar sesión
router.post('/logout', authController.postLogout);

module.exports = router; // Exporta el router
