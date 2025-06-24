const AMISTAD_TYPE = require('../models/enumAmistad');
const AmistadModel = require('../models/amistadModelo')
const Notificacion = require('../models/Notificacion')
const activeTab = 'shared-albums'

const getPageCompartir = async (req, res) => {
    res.render('shared_albums', {
        title: 'Album compartidos',
        panel_notificacion: true,
        activeTab: activeTab

    });

}



const solicitud = async (req, res) => {
    try {


        const { userId, action } = req.body;//action es el estado del enum en amistad
        const solicitanteId = req.session.user.id
        const nombre = req.session.user.nombre
        const receptorId = userId
        const estado = action
        let idAmistad = 0
        console.log("metodo Solicitud()", userId, action, solicitanteId)
        if (userId <= 0 || receptorId <= 0 || !AMISTAD_TYPE.isValid(estado)) {
            res.status(400).json({
                message: 'Error: Falta informacion crucial para proceder.',
                success: false
            })

        }

        const resultado = await AmistadModel.enviarSolicitudAmistad(solicitanteId, receptorId, `El usuario ${nombre} quiere ser tu amigo!`)
        if (!resultado.success) {
            res.status(400).json({
                message: 'Error: ID de usuario no proporcionado en el cuerpo de la solicitud.',
                success: false
            });
        }

        //envio de notificacion
        generarNotificacionTest(req, resultado.idNotificacionGenerada, receptorId)

        res.status(200).json({
            message: resultado.message,
            status: action,
            requestedUserId: receptorId,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).render('error', { // Podrías tener una vista 'error.pug' también
            title: 'Error Interno',
            message: 'Ocurrió un error al generar la notificación.'
        });
    }
}

const generarNotificacionTest = async (req, notificacionoID, userId) => {


    try {

        console.log(`notificacion id: ${notificacionoID} -- receptor id ${userId}`)
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
    solicitud,
    getPageCompartir
}