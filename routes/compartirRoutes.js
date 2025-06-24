const express = require('express');
const router = express.Router();
const compartir = require('../controllers/compartirController');


router.post('/solicitud-amistad', compartir.solicitud)

router.get('/', compartir.getPageCompartir)

module.exports = router;