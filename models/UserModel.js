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

    //Buscador
    /*  static async buscarUsuarioYPerfil(emailBusqueda, nombreApellidoBusqueda) {
         let connection;
         try {
             connection = await pool.getConnection(); // Obtener una conexión del pool
 
 
             const [rows] = await connection.execute(
                 'CALL buscar_usuario_y_perfil(?, ?)',
                 [emailBusqueda, nombreApellidoBusqueda]
             );
 
 
             if (rows && rows.length > 0 && rows[0].length > 0) {
 
                 if (rows[0][0] && rows[0][0].Mensaje) {
                     console.log("Mensaje del procedimiento:", rows[0][0].Mensaje);
                     return { success: false, message: rows[0][0].Mensaje };
                 } else {
                     console.log("Resultados de la búsqueda:", rows[0]);
                     return { success: true, data: rows[0] };
                 }
             } else {
                 console.log("No se encontraron resultados o la respuesta fue inesperada.");
                 return { success: true, data: [] }; // No se encontraron resultados
             }
 
         } catch (error) {
             console.error('Error al ejecutar el procedimiento almacenado:', error);
             // Aquí podrías loggear el error o enviarlo a un servicio de monitoreo
             throw new Error('Fallo en la búsqueda de usuario/perfil: ' + error.message);
         } finally {
             if (connection) {
                 connection.release(); // Liberar la conexión de vuelta al pool
             }
         }
     } */
    static async searchUsers(query) {
        let connection;
        try {
            connection = await pool.getConnection(); // Obtenemos una conexión del pool

            // Pasamos la 'query' a ambos parámetros del procedimiento almacenado
            const [rows] = await connection.execute(
                'CALL buscar_usuario_y_perfil(?)',
                [query]
            );

            const results = rows[0];

            // Verificamos si el procedimiento nos devolvió un mensaje de error
            if (results && results.length > 0 && results[0].Mensaje) {
                console.warn("Mensaje del procedimiento:", results[0].Mensaje);
                return []; // Retorna un array vacío si el SP devolvió un mensaje de error
            }

            // Mapeamos los resultados de la base de datos al formato deseado
            // y ¡quitamos el .slice(0, 5)!
            return results.map(userRow => ({
                id: userRow.id,
                name: userRow.nombre ? `${userRow.nombre} ${userRow.apellido || ''}`.trim() : null,
                email: userRow.email
            }));

        } catch (error) {
            console.error('Error al buscar usuarios en la base de datos:', error);
            throw new Error('Fallo en la búsqueda de usuarios: ' + error.message);
        } finally {
            if (connection) {
                connection.release(); // Siempre liberamos la conexión
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