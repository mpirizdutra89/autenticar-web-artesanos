// routes/searchRoute.js

const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController'); // Importa el controlador

// Define la ruta /search?q=...
router.get('/', searchController.performSearch);

module.exports = router;