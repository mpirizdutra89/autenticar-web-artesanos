// models/Notificacion.js
const pool = require('../db'); // Importa tu pool de conexiones de mysql2/promise

const Notificacion = {
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