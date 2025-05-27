// routes/dashboardRoutes.js
// Este archivo define las rutas relacionadas con el dashboard (páginas protegidas).

const express = require('express');
const router = express.Router(); // Crea una nueva instancia de Express Router
const userController = require('../controllers/userController'); // Importa el controlador de usuario

// Ruta GET para el dashboard (página protegida)
router.get('/', userController.getDashboardPage);

module.exports = router; // Exporta el router
