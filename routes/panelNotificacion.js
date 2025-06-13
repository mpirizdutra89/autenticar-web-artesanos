const express = require('express');
const router = express.Router();
const panel = require('../controllers/panelNotificacionController');



//router.post('/generar-notificacion-test', dashboardController.generarNotificacionTest);
//router.post('/marcar-leida/:id', dashboardController.marcarNotificacionLeida); // Ruta POST para marcar como leída

//router.post('/album',)
router.post('/notificaciones-read', panel.readNotificacion)
router.get('/', panel.GetnotificacionPage);
module.exports = router;