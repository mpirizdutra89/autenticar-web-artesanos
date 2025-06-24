// models/UserModel.js
const pool = require('../db'); // Importa el pool de conexiones

class UserModel {
    // Busca un usuario por su ID
    static async findById(id) {
        try {
            const [rows] = await pool.execute('SELECT id, email, fecha_registro FROM usuarios WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar usuario por ID:', error);
            throw error;
        }
    }

    // Busca un usuario por su email
    static async findByEmail(email) {
        try {
            const [rows] = await pool.execute('SELECT id, email, is_email_verified as verified ,fecha_registro FROM usuarios WHERE email = ?', [email]);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar usuario por email:', error);
            throw error;
        }
    }


    static async searchUsers(query, user_id) {
        let connection;
        try {
            connection = await pool.getConnection();


            const [rows] = await connection.execute(
                'CALL buscar_usuario_y_perfil(?,?)',
                [query, user_id]
            );

            const results = rows[0];


            if (results && results.length > 0 && results[0].Mensaje) {
                console.warn("Mensaje del procedimiento:", results[0].Mensaje);
                return [];
            }



            return results.map(userRow => {
                let buttonText;
                let buttonAction;


                if (userRow.estadoAmistad == null) {
                    buttonText = "Enviar Solicitud";
                    buttonAction = "send_request";
                } else if (userRow.estadoAmistad == 'pendiente') {
                    buttonText = "Solicitud Enviada";
                    buttonAction = "cancel_request";
                } else if (userRow.estadoAmistad == 'aceptada') {
                    buttonText = "Amigos";
                    buttonAction = "view_profile";
                } else if (userRow.estadoAmistad == 'rechazada') {
                    buttonText = "Solicitud Rechazada";
                    buttonAction = "resend_request";
                } else {
                    buttonText = "Estado Desconocido";
                    buttonAction = "none";
                }

                return {
                    id: userRow.id,
                    name: userRow.nombre ? `${userRow.nombre} ${userRow.apellido || ''}`.trim() : null,
                    email: userRow.email,
                    profileImageUrl: userRow.imagen_perfil_url,
                    estadoAmistad: userRow.estado_amistad,
                    button: {
                        text: buttonText,
                        action: buttonAction
                    }
                };
            });

        } catch (error) {
            console.error('Error al buscar usuarios en la base de datos:', error);
            throw new Error('Fallo en la búsqueda de usuarios: ' + error.message);
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    // Crea un nuevo usuario en la tabla 'usuarios'
    static async create(email, conn = pool) { // Por defecto usa el pool, si se pasa 'conn' usa esa conexión
        try {
            // Usa la conexión proporcionada (o el pool por defecto)
            const [result] = await conn.execute(
                'INSERT INTO usuarios (email) VALUES (?)',
                [email]
            );
            return result.insertId; // Retorna el ID del nuevo usuario
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    /* Guarda el token de verificación de email y su fecha de expiración para un usuario.
     * @param {number} userId - El ID del usuario.
     * @param {string} token - El token de verificación.
     * @param {Date} expiresAt - La fecha y hora de expiración del token.
     * @param {object} [conn=pool] - La conexión de la base de datos (opcional, para transacciones).
     * @returns {boolean} True si se actualizó correctamente.
     */
    static async saveVerificationToken(userId, token, expiresAt) {
        try {
            const [result] = await pool.execute(
                'UPDATE usuarios SET email_verification_token = ?, email_verification_expires_at = ?, is_email_verified = 0 WHERE is_email_verified = 0 and id = ?',
                [token, expiresAt, userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al guardar token de verificación:', error);
            throw error;
        }
    }

    /**
     * Busca un usuario por su token de verificación.
     * @param {string} token - El token de verificación.
     * @returns {object|null} El objeto de usuario o null si no se encuentra.
     */
    static async findByVerificationToken(token) {
        try {
            const [rows] = await pool.execute('SELECT id, email, is_email_verified, email_verification_expires_at FROM usuarios WHERE is_email_verified = 0 and email_verification_token = ?', [token]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error al buscar usuario por token de verificación:', error);
            throw error;
        }
    }

    /**
     * Marca el email de un usuario como verificado y limpia los campos del token.
     * @param {number} userId - El ID del usuario.
     * @param {object} [conn=pool] - La conexión de la base de datos (opcional, para transacciones).
     * @returns {boolean} True si se actualizó correctamente.
     */
    static async markEmailAsVerified(userId, conn = pool) {
        try {
            const [result] = await conn.execute(
                'UPDATE usuarios SET is_email_verified = 1, email_verification_token = NULL, email_verification_expires_at = NULL, fecha_registro=NOW() WHERE id = ?',
                [userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al marcar email como verificado:', error);
            throw error;
        }
    }
}

module.exports = UserModel;