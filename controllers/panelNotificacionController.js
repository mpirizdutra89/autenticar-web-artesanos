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

const readNotificacion = async (req, res) => {
    const user = req.session.user
    if (!user) {
        //responda que no se puede
    }
    const notificaciones_leer = await Notificacion.findAllread()
    if (notificaciones_leer) {
        //aca responder con el objeto o vacio o lleno y resivirlo en el front pedido por tab historial.
    }
    //llamo al c
};


module.exports = {
    GetnotificacionPage,
    readNotificacion
};