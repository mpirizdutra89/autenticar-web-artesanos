// models/Notificacion.js
const pool = require('../db'); // Importa tu pool de conexiones de mysql2/promise

const Notificacion = {


    findById: async (id) => {
        try {
            const [rows] = await pool.execute(`SELECT * FROM notificaciones WHERE id = ?`, [id]);
            // if (rows && rows[0]) { return rows[0]; } // poisblemnte no haga falta [0] , pero como funciona no lo toco.. no tengo tiempo pra estas boludesde
            return rows || [];
        } catch (error) {
            console.error('Error al buscar notificacion por ID:', error);
            throw error;
        }
    },


    /**
     * Crea una nueva notificación en la base de datos.
     * @param {number} id_usuario - ID del usuario que recibe la notificación.
     * @param {string} tipo_notificacion - Tipo de la notificación (ej. 'seguidor', 'comentario').
     * @param {number|null} id_referencia - ID del elemento relacionado (puede ser null).
     * @param {string} mensaje - El mensaje de la notificación.
     * @returns {Promise<object>} - El resultado de la inserción.
     */
    create: async (id_usuario, tipo_notificacion, id_referencia, mensaje) => {
        const query = `
            INSERT INTO notificaciones (id_usuario, tipo_notificacion, id_referencia, mensaje)
            VALUES (?, ?, ?, ?)
        `;
        const [rows] = await pool.execute(query, [id_usuario, tipo_notificacion, id_referencia, mensaje]);
        return rows; // Retorna el objeto de resultado, incluyendo insertId
    },

    /**
     * Obtiene todas las notificaciones no leídas para un usuario.
     * @param {number} id_usuario - ID del usuario.
     * @returns {Promise<Array<object>>} - Un array de objetos de notificación.
     */
    findAllUnread: async (id_usuario) => {
        try {
            const [results] = await pool.execute('CALL GetNotificationsByUserIdAndReadStatus(?, ?,?)', [id_usuario, false, 0]);
            if (results && results[0]) { return results[0]; }
            return [];

        } catch (error) {
            console.error('Error al llamar al procedimiento almacenado unificado para no leídas:', error);
            throw error;
        }

    },
    /**
 * Responde a una solicitud de amistad (aceptar o rechazar) y maneja las notificaciones.
 * @param {number} idAmistad - El ID de la solicitud de amistad en la tabla 'amistad'.
 * @param {'aceptada' | 'rechazada'} estadoRespuesta - El nuevo estado para la solicitud.
 * @param {number} idNotificacionOriginal - El ID de la notificación que el RECEPTOR recibió originalmente.
 * @param {number} idUsuarioQueResponde - El ID del usuario que está respondiendo (el receptor de la solicitud original).
 * @returns {Promise<object>} Un objeto con el resultado de la operación (éxito, mensaje, datos actualizados).
 */
    responderSolicitud: async (idAmistad, estadoRespuesta, idNotificacionOriginal, idUsuarioQueResponde) => {
        let connection;
        try {
            connection = await pool.getConnection();


            const [rows] = await connection.execute(
                'CALL responder_solicitud_amistad(?, ?, ?, ?)',
                [idAmistad, estadoRespuesta, idNotificacionOriginal, idUsuarioQueResponde]
            );


            const resultData = rows[0];

            if (resultData && resultData.length > 0) {

                const data = resultData[0];
                console.log("Respuesta de solicitud de amistad exitosa:", data.Mensaje);
                return {
                    success: true,
                    message: data.Mensaje,
                    idAmistadActualizada: data.idAmistadActualizada,
                    nuevoEstado: data.nuevoEstado,
                    idSolicitanteNotificado: data.idSolicitanteNotificado,
                    idNotificacionGenerada: data.idNotificacionNueva
                };
            } else {

                console.log("Respuesta de solicitud de amistad procesada, pero sin detalles de éxito específicos.");
                return { success: true, message: "Operación de respuesta de solicitud de amistad completada." };
            }

        } catch (error) {

            console.error('Error al responder solicitud de amistad:', error.message);
            return { success: false, message: error.message };

        } finally {

            if (connection) {
                connection.release();
            }
        }
    },
    /**
     * Obtiene todas las notificaciones  leídas para un usuario.
     * @param {number} id_usuario - ID del usuario.
     * @returns {Promise<Array<object>>} - Un array de objetos de notificación.
     */
    findAllread: async (id_usuario) => {
        try {
            const [results] = await pool.execute('CALL GetNotificationsByUserIdAndReadStatus(?, ?,?)', [id_usuario, true, 10]);
            if (results && results[0]) { return results[0]; }
            return [];
        } catch (error) {
            console.error('Error al llamar al procedimiento almacenado unificado para leídas:', error);
            throw error;
        }

    },

    /**
      * Marca una notificación específica como leída usando un procedimiento almacenado.
      * @param {number} id_notificacion - ID de la notificación a marcar.
      * @param {number} id_usuario - ID del usuario propietario de la notificación (para seguridad).
      * @returns {Promise<object>} - El objeto de resultado de la operación (incluye affectedRows).
      */
    markAsRead: async (id_notificacion, id_usuario) => {
        try {
            // Llamada al procedimiento almacenado para marcar como leída
            const [results] = await pool.execute('CALL MarkNotificationAsRead(?, ?)', [id_notificacion, id_usuario]);
            // Los procedimientos que hacen UPDATE/INSERT/DELETE devuelven metadatos
            // en el primer elemento del array `results` que mysql2/promise retorna.
            // `affectedRows` es una propiedad clave para verificar si la operación fue exitosa.
            return results;
        } catch (error) {
            console.error('Error al llamar al procedimiento almacenado MarkNotificationAsRead:', error);
            throw error;
        }
    }

    // Puedes añadir otras funciones aquí, como findById, delete, etc.
};

module.exports = Notificacion;