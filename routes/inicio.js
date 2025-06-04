const express = require('express')
const router = express.Router();
const { inicio, obrasPublica } = require('../controllers/inicioController');


router.get('/portafolio-publico', obrasPublica)
router.get('/', inicio)


module.exports = router