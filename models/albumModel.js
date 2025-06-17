const pool = require('../db');
//(`idAlbum`, `usuarios_id`, `tipo_album`, `titulo`, `publico`, `fecha_creacion`
class AlbumModel {

    static tabla = 'albums'
    static tabla_img = 'images'

    static async imagenesByIdAlbum(id) {
        try {
            const [rows] = await pool.execute(`SELECT * FROM ${AlbumModel.tabla_img}  WHERE albums_idAlbums = ?`, [id]);
            // if (rows && rows[0]) { return rows[0]; } // poisblemnte no haga falta [0] , pero como funciona no lo toco.. no tengo tiempo pra estas boludesde
            return rows || [];
        } catch (error) {
            console.error('Error al buscar album por ID:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const [rows] = await pool.execute(`SELECT * FROM ${AlbumModel.tabla} WHERE idAlbum = ?`, [id]);
            // if (rows && rows[0]) { return rows[0]; } // poisblemnte no haga falta [0] , pero como funciona no lo toco.. no tengo tiempo pra estas boludesde
            return rows || [];
        } catch (error) {
            console.error('Error al buscar album por ID:', error);
            throw error;
        }
    }

    static async all(user_id, tipo = 'normal') {
        try {

            const [results] = await pool.execute('CALL loadAlbumUser(?,?)', [user_id, tipo]);
            if (results && results[0]) { return results[0]; }
            return [];

        } catch (error) {
            console.error('No hay albums para el usuario actual', error);
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
        //  console.log(`INSERT INTO ${AlbumModel.tabla} (usuarios_id, tipo_album,titulo, descripcion,portada) VALUES (${user_id},${tipo},${titulo},${descripcion},${portada})`)
        try {

            const [result] = await pool.execute(
                `INSERT INTO ${AlbumModel.tabla} (usuarios_id,tipo_album,titulo, descripcion,portada) VALUES (?,?,?,?,?)`,
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