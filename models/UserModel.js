// models/UserModel.js
const db = require('../db'); // Importa el pool de conexiones

class UserModel {
    // Busca un usuario por su ID
    static async findById(id) {
        try {
            const [rows] = await db.execute('SELECT id, email, fecha_registro FROM usuarios WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar usuario por ID:', error);
            throw error;
        }
    }

    // Busca un usuario por su email
    static async findByEmail(email) {
        try {
            const [rows] = await db.execute('SELECT id, email, fecha_registro FROM usuarios WHERE email = ?', [email]);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar usuario por email:', error);
            throw error;
        }
    }

    // Crea un nuevo usuario en la tabla 'usuarios'
    static async create(email) {
        try {
            const [result] = await db.execute(
                'INSERT INTO usuarios (email) VALUES (?)',
                [email]
            );
            return result.insertId; // Retorna el ID del nuevo usuario
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    // Puedes añadir más métodos para operaciones CRUD en la tabla 'usuarios' si los necesitas.
}

module.exports = UserModel;