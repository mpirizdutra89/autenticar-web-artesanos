// controllers/userController.js
// No necesita muchos cambios, ya que los datos de perfil ya están en la sesión.
const userController = {
    getDashboardPage: (req, res) => {
        // Los datos del usuario (incluyendo nombre/apellido) ya están en req.session.user
        res.render('dashboard', { username: req.session.user.nombre || req.session.user.email });
    }
};

module.exports = userController;