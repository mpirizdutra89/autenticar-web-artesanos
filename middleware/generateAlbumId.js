// middlewares/generateAlbumId.js
const { v4: uuidv4 } = require('uuid'); // Necesitarás instalar 'uuid': npm install uuid

module.exports = (req, res, next) => {
    // Generamos un ID único para el nuevo álbum
    req.newAlbumId = uuidv4();
    console.log(`Generado nuevo Album ID temporal: ${req.newAlbumId}`);
    next();
};