// middleware/authMiddleware.js
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        const ruta = req.originalUrl || ""
        const msj = `La ruta (${ruta}) a la que intentas acceder esta proteguida.`
        console.log(ruta)
        res.render('denegado', {
            msj: msj,
            title: "Denegado"
        });
    }
}

/**
 * Middleware para cargar la información del usuario de la sesión en res.locals.
 * Esto hace que la variable 'user' esté disponible en todas las plantillas Pug.
 * Siempre llama a next(), permitiendo el acceso a la ruta, sea el usuario autenticado o no.
 */
function loadUserIntoView(req, res, next) {

    if (req.session && req.session.user) {
        res.locals.user = req.session.user;
    } else {

        res.locals.user = null;
    }
    next(); // Siempre llama a next() para permitir que la solicitud continúe
}

module.exports = {
    isAuthenticated,
    loadUserIntoView
};