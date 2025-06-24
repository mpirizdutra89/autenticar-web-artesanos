// controllers/searchController.js

const searchModel = require('../models/searchModel'); // Importa el modelo de búsqueda

const performSearch = async (req, res) => {
    const query = req.query.q; // Obtiene el parámetro 'q' de la URL
    const user_id = req.session.user ? req.session.user.id : 0
    if (!query || query.trim() === '') {
        return res.json({ users: [], albumsByTitle: [], albumsByTag: [] }); // Devolver vacío si no hay query
    }

    try {
        const results = await searchModel.globalSearch(query.trim(), user_id);
        res.json(results);
    } catch (error) {
        console.error('Error en el controlador de búsqueda:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar la búsqueda.' });
    }
};

module.exports = {
    performSearch,
};