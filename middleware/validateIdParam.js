// Contenido del middleware validateIdParam.js que ya tienes
const validateIdParam = (req, res, next) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: 'El ID es requerido.' });
    }

    if (!/^\d+$/.test(id)) {
        return res.status(400).json({ message: 'El ID debe ser un número entero sin decimales.' });
    }

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
        return res.status(400).json({ message: 'El ID debe ser un número entero positivo.' });
    }

    req.idParam = parsedId; // Adjunta el ID parseado a req
    next();
};

module.exports = validateIdParam;