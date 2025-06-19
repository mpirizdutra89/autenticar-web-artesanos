const pool = require('../db');
//(`idAlbum`, `usuarios_id`, `tipo_album`, `titulo`, `publico`, `fecha_creacion`
class AlbumModel {

    static tabla = 'albums'
    static tabla_img = 'images'
    //
    //DELETE FROM `images` WHERE `idimage`=
    static async deleteObras(id) {
        try {
            const [rows] = await pool.execute(`DELETE FROM ${this.tabla_img} WHERE idimage= ? `, [id]);
            return rows.affectedRows;
        } catch (error) {
            console.error('Error al eliminar la imagen', error);
            throw error;
        }
    }

    static async findByIdObras(id) {
        try {
            const [rows] = await pool.execute(`SELECT * FROM ${AlbumModel.tabla_img} WHERE idimage= ? `, [id]);//`SELECT * FROM ${AlbumModel.tabla_img}  WHERE albums_idAlbums = ?`, [id]);
            if (rows && rows[0]) { return rows[0]; } // poisblemnte no haga falta [0] , pero como funciona no lo toco.. no tengo tiempo pra estas boludesde
            return [];
        } catch (error) {
            console.error('Error al buscar album por ID:', error);
            throw error;
        }
    }

    static async imagenesByIdAlbum(id) {
        try {
            const [rows] = await pool.execute(`SELECT idimage,albums_idAlbums,detalle,url,directorio FROM ${AlbumModel.tabla}, ${AlbumModel.tabla_img} WHERE albums_idAlbums=idAlbum  and albums_idAlbums=?`, [id]);//`SELECT * FROM ${AlbumModel.tabla_img}  WHERE albums_idAlbums = ?`, [id]);
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


    static async create(user_id, tipo = 'normal', titulo, descripcion, directorio) {
        //  console.log(`INSERT INTO ${AlbumModel.tabla} (usuarios_id, tipo_album,titulo, descripcion,portada) VALUES (${user_id},${tipo},${titulo},${descripcion},${portada})`)
        try {

            const [result] = await pool.execute(
                `INSERT INTO ${AlbumModel.tabla} (usuarios_id,tipo_album,titulo, descripcion,directorio) VALUES (?,?,?,?,?)`,
                [user_id, tipo, titulo, descripcion, directorio]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error al crear album:', error);
            throw error;
        }
    }

    static async uploadImg(dataArray) {
        try {
            const valueStrings = dataArray.map(item => `(${pool.escape(item[0])}, ${pool.escape(item[1])}, '${item[2]}')`);
            const sql = `INSERT INTO images (albums_idAlbums, detalle, url) VALUES ${valueStrings.join(',')}`;
            const [result] = await pool.execute(sql);
            console.log(`Cantidad de imagenes subidas ${result.affectedRows}`);
            return result.affectedRows;
        } catch (error) {
            console.error('Error al insertar múltiples imágenes:', error);
            return 0
        }


    }



    //falta el update

}

module.exports = AlbumModel;