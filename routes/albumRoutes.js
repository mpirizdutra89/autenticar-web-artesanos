/* const express = require('express');
const router = express.Router();
const album = require('../controllers/albumController');



/* router.post('/generar-notificacion-test', dashboardController.generarNotificacionTest);
router.post('/marcar-leida/:id', dashboardController.marcarNotificacionLeida); // Ruta POST para marcar como leída

//router.post('/album',)
router.get('/', dashboardController.getDashboard); */

/*
router.get('/album_administrar', album.getPageAdministrarAlbum)
router.get('/', album.getpageAlbum)



module.exports = router; */
// routes/albumRoutes.js
const express = require('express');
const albumController = require('../controllers/albumController');
const upload = require('../middleware/uploadMiddleware');
const generateAlbumId = require('../middleware/generateAlbumId');
const router = express.Router();

// -------------------------------------------------------------
// Rutas de Álbumes (YA ESTÁN PROTEGIDAS POR isAuthenticated en app.js)
// -------------------------------------------------------------

// Ruta para subir fotos a un álbum específico
// Ya no necesitas 'isAuthenticated' aquí porque el 'app.use' de app.js se encarga
//router.post('/upload/:id', albumPhotosUpload, albumController.uploadAlbumPhotos);

// Ejemplo de otras rutas de álbumes (sin 'isAuthenticated' aquí)
// router.get('/:id', albumController.getAlbumDetails);
//router.put('/:id', albumController.updateAlbum);
//router.delete('/:id', albumController.deleteAlbum);
router.post('/create-album', generateAlbumId, upload.createAlbumUpload, albumController.createAlbum);
router.get('/', albumController.getpageAlbum);

module.exports = router;