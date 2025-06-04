// controllers/dashboardController.js
// NO uses "const Notificacion = require('../models/Notificacion');"
// Usa el nuevo import
const Notificacion = require('../models/Notificacion'); // Importa tu nuevo modelo Notificacion (ahora es un objeto con funciones)

const getDashboard = async (req, res) => {
    const user = req.session.user;

    if (!user) {
        return res.redirect('/usuario/');
    }

    let notificacionesNoLeidas = [];
    try {
        // 1. Obtener notificaciones no leídas de la DB usando la nueva función
        notificacionesNoLeidas = await Notificacion.findAllUnread(user.id);

        // 2. Si el usuario está conectado a Socket.IO, enviarle las notificaciones iniciales
        const io = req.app.get('socketio');
        if (io) {
            // Envía las notificaciones como vienen directamente de mysql2 (ya son objetos JS)
            io.to(`user_${user.id}`).emit('notificaciones_iniciales', notificacionesNoLeidas);
        }

    } catch (error) {
        console.error('Error al obtener notificaciones no leídas:', error);
    }

    res.render('dashboard', {
        title: 'Dashboard del Usuario',
        user: user,
        notificaciones: notificacionesNoLeidas, // Ya son objetos JS, no necesitas .map(n => n.toJSON())
        message: req.query.message
    });
};


// --- Ruta de prueba: Generar Notificación ---
const generarNotificacionTest = async (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.status(401).render('unauthorized', {
            title: 'Acceso No Autorizado', // Título para la página
            message: 'Debes iniciar sesión para generar notificaciones.' // Mensaje opcional para la vista
        });
    }

    try {
        // 1. Guardar la notificación en la base de datos usando la nueva función create
        const result = await Notificacion.create(
            user.id,
            'otro_tipo', // Tipo de notificación
            null,        // id_referencia (por ahora null)
            `¡Hola ${user.nombre}! Esta es una notificación de prueba desde el servidor para ti.`
        );

        // Opcional: Recuperar la notificación recién creada para enviarla con su ID y fecha
        // Esto es útil si tu UI necesita el ID para marcarla como leída.
        // Asumiendo que el ID se auto-incrementa y se retorna en result.insertId
        const newNotifId = result.insertId;
        const [createdNotif] = await Notificacion.findAllUnread(user.id); // Solo para obtener la que acabamos de crear, o hacer un findById

        // 2. Emitir la notificación en tiempo real a través de Socket.IO
        const io = req.app.get('socketio');
        if (io && createdNotif) { // Asegúrate de que la notificación se haya creado y recuperado
            io.to(`user_${user.id}`).emit('nueva_notificacion', createdNotif);
            console.log(`Notificación emitida en tiempo real para usuario ${user.id}:`, createdNotif);
        } else {
            console.warn('Socket.IO no está disponible o no se pudo recuperar la notificación creada.');
        }

        res.redirect('/dashboard?message=Notificación de prueba generada y enviada.');

    } catch (error) {
        console.error('Error al generar notificación de prueba:', error);
        res.status(500).render('error', { // Podrías tener una vista 'error.pug' también
            title: 'Error Interno',
            message: 'Ocurrió un error al generar la notificación.'
        });
    }
};

// --- Ruta para Marcar Notificación como Leída ---
const marcarNotificacionLeida = async (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.status(401).json({ success: false, message: 'No autorizado' });
    }

    const { id } = req.params; // ID de la notificación a marcar

    try {
        // Usar la nueva función markAsRead
        const result = await Notificacion.markAsRead(id, user.id);

        if (result.affectedRows > 0) { // Si se afectó al menos una fila, fue exitoso
            res.json({ success: true, message: 'Notificación marcada como leída.' });
        } else {
            res.status(404).json({ success: false, message: 'Notificación no encontrada o no pertenece al usuario.' });
        }
    } catch (error) {
        console.error('Error al marcar notificación como leída:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};


module.exports = {
    getDashboard,
    generarNotificacionTest,
    marcarNotificacionLeida
};