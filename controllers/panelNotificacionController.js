const Notificacion = require('../models/Notificacion'); // Importa tu nuevo modelo Notificacion (ahora es un objeto con funciones)


const GetnotificacionPage = async (req, res) => {
    /* const user = req.session.user;

    if (!user) {
        return res.redirect('/usuario/');
    }
 */
    res.render('panel_notificaciones', {
        title: 'Panel de notificacion',
        panel_notificacion: true
        //user: user,
        // message: req.query.message
    });
};


module.exports = {
    GetnotificacionPage
};