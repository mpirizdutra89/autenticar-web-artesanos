// controllers/userController.js
// Este archivo contiene la lógica para las operaciones relacionadas con el usuario (ej. dashboard).

const userController = {
    // Renderiza la página del dashboard
    getDashboardPage: (req, res) => {
        // Renderiza la plantilla 'dashboard.pug' y pasa el nombre de usuario de la sesión
        // req.session.user ahora contiene más detalles del usuario de la DB
        res.render('dashboard', { username: req.session.user.nombre || req.session.user.email });
    }
};

module.exports = userController;
