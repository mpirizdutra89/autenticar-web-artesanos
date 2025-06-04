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
        const query = `
            SELECT id, id_usuario, tipo_notificacion, id_referencia, mensaje, leida, fecha_creacion
            FROM notificaciones
            WHERE id_usuario = ? AND leida = FALSE
            ORDER BY fecha_creacion DESC
        `;
        const [rows] = await pool.execute(query, [id_usuario]);
        return rows;
    },

    /**
     * Marca una notificación específica como leída.
     * @param {number} id_notificacion - ID de la notificación a marcar.
     * @param {number} id_usuario - ID del usuario propietario de la notificación (para seguridad).
     * @returns {Promise<object>} - El resultado de la actualización.
     */
    markAsRead: async (id_notificacion, id_usuario) => {
        const query = `
            UPDATE notificaciones
            SET leida = TRUE
            WHERE id = ? AND id_usuario = ?
        `;
        const [rows] = await pool.execute(query, [id_notificacion, id_usuario]);
        return rows; // Retorna el objeto de resultado, incluyendo affectedRows
    }

    // Puedes añadir otras funciones aquí, como findById, delete, etc.
};

module.exports = Notificacion;