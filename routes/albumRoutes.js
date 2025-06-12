const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/albumController');



/* router.post('/generar-notificacion-test', dashboardController.generarNotificacionTest);
router.post('/marcar-leida/:id', dashboardController.marcarNotificacionLeida); // Ruta POST para marcar como leída

//router.post('/album',)
router.get('/', dashboardController.getDashboard); */
module.exports = router;