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
    if (req.session && req.session.user && req.session.user.id) {
        try {
            const user = req.session.user
            const respuesta = {
                ok: false,
                data: null,
                error: null,
                url: '',
                msj: "No hay historial, de notificaciones leidas."
            };
            if (!user) {
                //responda que no se puede
                return res.status(401).json(respuesta);
            }

            const notificaciones_leer = await Notificacion.findAllread(user.id)
            if (Object.keys(notificaciones_leer).length > 0) {

                respuesta.ok = true
                respuesta.data = notificaciones_leer

                return res.status(200).json(respuesta);
            } else {
                respuesta.ok = false
                respuesta.data = []
                return res.status(401).json(respuesta);
            }
        } catch (error) {
            console.error('Ocurrio un fallo al intentar listar notificaciones leidas', error);
            respuesta.ok = false
            respuesta.data = []
            return res.status(401).json(respuesta);

        }

    } else {
        respuesta.ok = false
        respuesta.data = []
        return res.status(401).json(respuesta);
    }

};
const marcarNotificacionLeida = async (req, res) => {
    const respuesta = {
        ok: false,
        data: null,
        error: null,
        url: '',
        msj: "No se pudo marcar la notificacion"
    };
    const user = req.session.user;
    if (!user) {
        return res.status(401).json(respuesta);
    }

    const { id } = req.params; // ID de la notificación a marcar

    try {
        // Usar la nueva función markAsRead
        const result = await Notificacion.markAsRead(id, user.id);

        if (result.affectedRows > 0) { // Si se afectó al menos una fila, fue exitoso
            respuesta.ok = true
            respuesta.msj = 'Notificación marcada como leída.'
            res.status(200).json(respuesta);
        } else {
            respuesta.ok = false
            respuesta.msj = 'Notificación no encontrada o no pertenece al usuario.'
            res.status(401).json(respuesta);
        }
    } catch (error) {
        console.error(' Cach:Error al marcar notificación como leída:', error);

        res.status(500).json(respuesta);
    }
};
//body: JSON.stringify({ referenciaId: referenciaId, action: accion, idNotficacion: idNotficacion })
const aceptarORechazarSolicitud = async (req, res) => {
    try {


        const { referenciaId, action, idNotficacion } = req.body;
        const receptorId = req.session.user.id
        if (referenciaId == 0 || idNotficacion == 0) {
            res.status(401).json({
                message: 'Error: Falta informacion crucial para proceder.',
                success: false
            })
        }

        const resultado = await Notificacion.responderSolicitud(referenciaId, action, idNotficacion, receptorId)
        if (!resultado.success) {
            res.status(401).json({
                message: 'Error: ID de usuario no proporcionado en el cuerpo de la solicitud.',
                success: false
            });
        }
        //envio de notificacion
        generarNotificacionTest(req, resultado.idNotificacionGenerada, resultado.idSolicitanteNotificado)

        res.status(200).json({
            message: resultado.message,
            status: resultado.nuevoEstado,
            timestamp: new Date().toISOString()
        });


    } catch (error) {
        res.status(500).render('error', {
            title: 'Error Interno',
            message: 'Ocurrió un error al generar .'
        });
    }

}



const generarNotificacionTest = async (req, notificacionoID, userId) => {


    try {
        if (!notificacionoID && !userId) {
            return;
        }
        console.log(`generarNotificacionTest(): notificacion id: ${notificacionoID} -- receptor id ${userId}`)
        const createdNotif = await Notificacion.findById(notificacionoID);


        const io = req.app.get('socketio');
        if (io && createdNotif) {
            io.to(`user_${userId}`).emit('nueva_notificacion', createdNotif);
            console.log(`Notificación emitida en tiempo real para usuario ${userId}:`, createdNotif);
        } else {
            console.warn('Socket.IO no está disponible o no se pudo recuperar la notificación creada.');
        }



    } catch (error) {
        console.error('Error al generar notificación de prueba:', error);

    }
};



module.exports = {
    GetnotificacionPage,
    readNotificacion,
    marcarNotificacionLeida,
    aceptarORechazarSolicitud

};