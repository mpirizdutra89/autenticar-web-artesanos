// models/ProfileModel.js
const db = require('../db'); // Importa el pool de conexiones

class ProfileModel {
    // Busca el perfil por ID de usuario
    static async findByUserId(userId) {
        try {
            const [rows] = await db.execute(
                'SELECT nombre, apellido, imagen_perfil_url, intereses, antecedentes, es_portafolio_publico FROM perfiles WHERE usuarios_id = ?',
                [userId]
            );
            return rows[0];
        } catch (error) {
            console.error('Error al buscar perfil por usuario_id:', error);
            throw error;
        }
    }

    // Crea un nuevo perfil para un usuario
    static async create(userId, nombre, apellido) {
        try {
            const [result] = await db.execute(
                'INSERT INTO perfiles (usuarios_id, nombre, apellido) VALUES (?, ?, ?)',
                [userId, nombre, apellido]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al crear perfil:', error);
            throw error;
        }
    }

    // Actualiza un perfil existente
    static async update(userId, data) {
        // Ejemplo de cómo construir una consulta UPDATE dinámica
        const fields = [];
        const values = [];

        if (data.nombre !== undefined) { fields.push('nombre = ?'); values.push(data.nombre); }
        if (data.apellido !== undefined) { fields.push('apellido = ?'); values.push(data.apellido); }
        if (data.imagen_perfil_url !== undefined) { fields.push('imagen_perfil_url = ?'); values.push(data.imagen_perfil_url); }
        if (data.intereses !== undefined) { fields.push('intereses = ?'); values.push(data.intereses); }
        if (data.antecedentes !== undefined) { fields.push('antecedentes = ?'); values.push(data.antecedentes); }
        if (data.es_portafolio_publico !== undefined) { fields.push('es_portafolio_publico = ?'); values.push(data.es_portafolio_publico); }

        if (fields.length === 0) {
            return false; // No hay nada que actualizar
        }

        const query = `UPDATE perfiles SET ${fields.join(', ')} WHERE usuarios_id = ?`;
        values.push(userId);

        try {
            const [result] = await db.execute(query, values);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            throw error;
        }
    }
}

module.exports = ProfileModel;