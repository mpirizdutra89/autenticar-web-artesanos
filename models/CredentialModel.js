// models/CredentialModel.js
const db = require('../db'); // Importa el pool de conexiones

class CredentialModel {
    // Busca las credenciales por usuario_id
    static async findByUserId(userId) {
        try {
            const [rows] = await db.execute(
                'SELECT usuario_id, password_hash FROM credenciales WHERE usuario_id = ?',
                [userId]
            );
            return rows[0];
        } catch (error) {
            console.error('Error al buscar credenciales por usuario_id:', error);
            throw error;
        }
    }

    // Crea nuevas credenciales para un usuario
    static async create(usuarioId, passwordHash) {
        try {
            const [result] = await db.execute(
                'INSERT INTO credenciales (usuario_id, password_hash, fecha_ultimo_cambio_password) VALUES (?, ?, NOW())',
                [usuarioId, passwordHash]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al crear credenciales:', error);
            throw error;
        }
    }

    // Actualiza el hash de la contraseña de un usuario
    static async updatePassword(usuarioId, newPasswordHash) {
        try {
            const [result] = await db.execute(
                'UPDATE credenciales SET password_hash = ?, fecha_ultimo_cambio_password = NOW() WHERE usuario_id = ?',
                [newPasswordHash, usuarioId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al actualizar contraseña:', error);
            throw error;
        }
    }
}

module.exports = CredentialModel;