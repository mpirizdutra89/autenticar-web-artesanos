/* // routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// El middleware isAuthenticated ya se aplica a /dashboard en app.js
router.get('/', userController.getDashboardPage);

module.exports = router; */
// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/', dashboardController.getDashboard);
router.post('/generar-notificacion-test', dashboardController.generarNotificacionTest);
router.post('/marcar-leida/:id', dashboardController.marcarNotificacionLeida); // Ruta POST para marcar como leída

module.exports = router;