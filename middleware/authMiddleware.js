// Este archivo contiene el middleware para verificar la autenticación del usuario.

function isAuthenticated(req, res, next) {
    // Verifica si hay un usuario en la sesión
    if (req.session && req.session.user) {
        // Si el usuario está autenticado, permite que la solicitud continúe
        return next();
    } else {
        // Si no está autenticado, redirige al formulario de inicio de sesión
        // y añade un mensaje de error como parámetro de consulta
        res.redirect('/?error=Debes iniciar sesión para acceder a esta página.');
    }
}

module.exports = isAuthenticated; // Exporta el middleware