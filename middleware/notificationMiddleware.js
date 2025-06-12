const Notificacion = require('../models/Notificacion'); // Asegúrate de que la ruta a tu modelo sea correcta

const loadNotifications = async (req, res, next) => {
    // Solo intentamos cargar notificaciones si hay un usuario logueado
    if (req.session && req.session.user && req.session.user.id) {
        try {
            const userId = req.session.user.id;
            const notificacionesNoLeidas = await Notificacion.findAllUnread(userId);

            // Hacer las notificaciones disponibles para todas las vistas a través de res.locals
            // 'notificaciones' será el nombre de la variable en tu plantilla Pug
            res.locals.notificaciones = notificacionesNoLeidas;

            // Opcional: Si quieres que el servidor re-envíe las notificaciones iniciales por Socket.IO
            // en CADA carga de página (no solo en el dashboard), puedes mover esta lógica aquí.
            // Si lo dejas solo en getDashboard, solo se enviará por Socket.IO al entrar al dashboard.
            // La línea de Pug (window.initialNotificationsData) es la que realmente asegura
            // que el cliente tenga las notificaciones al cargar la página, independientemente del Socket.IO.
            const io = req.app.get('socketio');
            if (io) {
                io.to(`user_${userId}`).emit('notificaciones_iniciales', notificacionesNoLeidas);
            }

        } catch (error) {
            console.error('Error al cargar notificaciones en el middleware:', error);

            res.locals.notificaciones = [];
        }
    } else {
        // Si no hay usuario logueado, 'notificaciones' será un array vacío
        res.locals.notificaciones = [];
    }

    next();
};

module.exports = loadNotifications;