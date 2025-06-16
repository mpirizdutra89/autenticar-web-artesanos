const pool = require('../db');
//(`idAlbum`, `usuarios_id`, `tipo_album`, `titulo`, `publico`, `fecha_creacion`
class AlbumModel {

    static tabla = 'albums'
    static async findById(id) {
        try {
            const [rows] = await pool.execute(`SELECT * FROM ${AlbumModel.tabla} WHERE idAlbum = ?`, [id]);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar album por ID:', error);
            throw error;
        }
    }


    static async findByTitulo(titulo) {
        try {
            const [rows] = await pool.execute(`SELECT * FROM ${AlbumModel.tabla} WHERE tipo_album = ?`, [titulo]);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar album por titulo:', error);
            throw error;
        }
    }


    static async create(user_id, tipo = 'normal', titulo, descripcion, portada) {
        console.log(`INSERT INTO ${AlbumModel.tabla} (usuarios_id, tipo_album,titulo, descripcion,portada) VALUES (${user_id},${tipo},${titulo},${descripcion},${portada})`)
        try {

            const [result] = await pool.execute(
                `INSERT INTO ${AlbumModel.tabla} (usuarios_id, tipo_album,titulo, descripcion,portada) VALUES (?,?,?,?,?)`,
                [user_id, tipo, titulo, descripcion, portada]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error al crear album:', error);
            throw error;
        }
    }



    //falta el update

}

module.exports = AlbumModel;