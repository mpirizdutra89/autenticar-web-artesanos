// middleware/authMiddleware.js
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/?error=Debes iniciar sesión para acceder a esta página.');
    }
}

module.exports = isAuthenticated;