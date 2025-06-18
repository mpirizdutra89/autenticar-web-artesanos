const path = require('path');
const fs = require('fs');
const UPLOAD_DIR = path.join(__dirname, '../uploads');
const activeTab = 'albums'
const AlbumModel = require('../models/albumModel');
const { resolveObjectURL } = require('buffer');
const { response } = require('express');


const getpageAlbum = (req, res) => {

    res.render('album', {
        title: 'Gestion Album',
        panel_notificacion: true,
        activeTab: activeTab

    });
};



const getPageAdministrarAlbum = async (req, res) => {

    res.render('album_administrar', {
        title: 'Administrar obras',
        panel_notificacion: true,
        activeTab: activeTab

    });
};

const getAlbumImages = async (req, res) => {
    const respuesta = {
        ok: false,
        albumsData: [],
        msj: 'No hay fotos para este album'
    }
    try {
        const albumId = req.params.id;
        if (!albumId) {
            respuesta.ok = false;
            respuesta.msj = 'El album esta corrupto'
            return res.status(400).json(respuesta);
        }


        const obras = await AlbumModel.imagenesByIdAlbum(albumId);
        //console.log(obras)
        if (obras.length === 0) {
            respuesta.ok = false
            return res.status(404).json(respuesta);
        }

        respuesta.ok = true
        respuesta.msj = `Se recuperaron ${obras.length} obras del album ${albumId}`
        respuesta.albumsData = obras
        res.status(200).json(respuesta);

    } catch (error) {
        console.error('Error al obtener imágenes del álbum:', error);
        respuesta.ok = false
        respuesta.msj = 'Error interno del servidor al obtener imágenes.'
        res.status(500).json(respuesta);
    }
}

const getDeletObra = async (req, res) => {

}

const getAdministrarObras = async (req, res) => {

    const respuesta = {
        ok: false,
        albumsData: [],
        message: 'Falta la referencia del album'
    }
    const albumId = req.params.id;
    const obras = await AlbumModel.imagenesByIdAlbum(albumId)
    const album = await AlbumModel.findById(albumId)
    /*  let directorio = ''
     if (album.length > 0) {
         directorio = album.directorio
     } */
    console.log(album)
    res.render('album_administrar', {
        title: 'Administrar Album',
        panel_notificacion: true,
        activeTab: activeTab,
        albumsData: obras,
        album: album
    });
}

const deleteObra = async (req, res) => {
    const idobra = req.params.id
    const fs = require('fs').promises; // Importa la versión con promesas de fs
    const path = require('path');
    const UPLOADS_BASE_DIR = path.join(process.cwd(), 'uploads');
    let repuesta = {
        ok: false,
        mjs: 'Falta la rederencia de la obra',
        albumsData: []
    }

    try {

        if (!idobra) {
            return res.status(403).json(repuesta);
        }


        const obras = await AlbumModel.findByIdObras(idobra)
        if (!obras) {
            repuesta.msj = 'No exite la obra'
            return res.status(403).json(repuesta);
        }

        const result = await AlbumModel.deleteObras(idobra)
        if (!result > 0) {
            repuesta.msj = 'No se pudo elminar el registro'
            return res.status(403).json(repuesta);
        }
        const rutaRelativaFoto = obras.url



        const eliminada = await eliminarFotoEspecifica(rutaRelativaFoto);
        if (eliminada) {
            console.log('Proceso de eliminación de foto completado.');
            repuesta.ok = true
            repuesta.msj = 'Proceso de eliminación de foto completado con exito'
            return res.status(200).json(repuesta);
        } else {
            console.log('La foto no pudo ser eliminada (posiblemente no existía o hubo otro problema).');
            repuesta.ok = false
            repuesta.msj = 'La foto no pudo ser eliminada (posiblemente no existía o hubo otro problema).'
            return res.status(403).json(repuesta);
        }
    } catch (err) {
        console.error('Un error inesperado atrapó la eliminación de la foto:', err.message);

        repuesta.ok = false
        repuesta.msj = 'Un error inesperado atrapó la eliminación de la foto:'
        return res.status(500).json(repuesta);
    }




    //--- 1. Define tu directorio base de uploads-- -
    // Asume que tu carpeta 'uploads' está en la raíz de tu proyecto.
    // `process.cwd()` te da la ruta del directorio de trabajo actual de Node.js.
    //const UPLOADS_BASE_DIR = path.join(process.cwd(), 'uploads');
    // Si tu carpeta 'uploads' está en otro lugar, ajusta esta ruta.
    // Ejemplo: path.join(__dirname, '..', 'uploads'); si 'uploads' está un nivel arriba de donde está tu script.

    async function eliminarFotoEspecifica(rutaRelativaFoto) {
        // 2. Construye la ruta absoluta completa del archivo
        const rutaAbsolutaFoto = path.join(UPLOADS_BASE_DIR, rutaRelativaFoto);

        try {
            await fs.unlink(rutaAbsolutaFoto);
            console.log(`Foto '${rutaRelativaFoto}' eliminada con éxito.`);
            return true;
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.warn(`La foto '${rutaRelativaFoto}' no existe en la ruta '${rutaAbsolutaFoto}'. No se puede eliminar.`);
                return false;
            } else {
                console.error(`Error al eliminar la foto '${rutaRelativaFoto}' en la ruta '${rutaAbsolutaFoto}':`, error);
                throw error; // Relanza el error para manejo superior
            }
        }
    }
}

const createAlbum = async (req, res) => {

    let oldAlbumFolderPath = null;     // Para almacenar la ruta temporal
    const user = req.session.user;

    try {
        console.log('¡Petición de creación de álbum recibida en el controlador!');

        const userId = user.id;
        if (!user) {

            return res.status(401).json({ ok: false, msj: 'Acceso no autorizado. ID de usuario no disponible.' });
        }

        const tempAlbumId = req.newAlbumId; // ID temporal para la carpeta
        if (!tempAlbumId) {

            return res.status(401).json({ ok: false, msj: 'Error interno: ID de álbum temporal no generado.' });
        }

        const { titulo, descripcion } = req.body;
        if (!titulo) {
            // Si el título falta, la imagen ya se subió a la carpeta temporal.
            // Necesitamos limpiar esa carpeta.
            oldAlbumFolderPath = path.join(UPLOAD_DIR, `usuario_${userId}`, 'albums', `album_${tempAlbumId}`);
            if (fs.existsSync(oldAlbumFolderPath)) {
                fs.rmSync(oldAlbumFolderPath, { recursive: true, force: true });
                console.log(`Carpeta temporal '${oldAlbumFolderPath}' eliminada debido a validación fallida.`);
            }

            return res.status(400).json({ message: 'El título del álbum es requerido.' });
        }

        const albumCoverFile = req.files && req.files.album_initial_cover ? req.files.album_initial_cover[0] : null;
        let albumCoverPath = null; // Ruta relativa para la BD       


        if (albumCoverFile) {
            //Modificado para que sea mas facil tener el  directorio prinsipal del album
            //portada es una ruta fija para todo los album
            albumCoverPath = `/uploads/usuario_${userId}/albums/album_${tempAlbumId}/`;//portada/${albumCoverFile.filename}
            console.log('Ruta de portada inicial del álbum (temporal):', albumCoverPath);
        } else {
            console.warn('No se subió portada inicial para el álbum. Se usará una por defecto o se dejará en blanco.');
        }
        let albumId_DB = 0;
        let albumsData = []
        if (titulo && descripcion && albumCoverFile) {
            albumId_DB = await AlbumModel.create(userId, undefined, titulo, descripcion, albumCoverPath)
            if (albumId_DB > 0) {

                const data = await AlbumModel.findById(albumId_DB)

                if (Object.keys(data).length !== 0) {
                    albumsData = [
                        {//`idAlbum`, `usuarios_id`,  `titulo`, `descripcion`,  `portada`, `fecha_creacion`
                            id: data.idAlbum,
                            portadaUrl: `${data.directorio}portada/${albumCoverFile.filename}`,
                            titulo: data.titulo,
                            numObras: 0,
                            descripcion: data.descripcion,
                            ultimaActualizacion: data.fecha_update === null || data.fecha_update === undefined || data.fecha_update === 'null' ? '' : data.fecha_update

                        }]
                    console.log(albumsData)
                }
                return res.status(200).json({
                    ok: true,
                    msj: 'Álbum creado con éxito!',
                    albumsData: albumsData,
                });
            }

        }
        if (albumId_DB <= 0 || !albumCoverFile) {

            return res.status(401).json({
                ok: false,
                msj: 'No se pudo crear el registro para este album'
            });
        }



    } catch (error) {
        console.error('Error en createAlbum:', error);
        // Si hay un error *después* de que la carpeta temporal fue creada pero *antes* de renombrarse,
        // o si falla el renombrado, necesitamos limpiar la carpeta temporal para evitar archivos huérfanos.
        if (tempAlbumFolderCreated && oldAlbumFolderPath && fs.existsSync(oldAlbumFolderPath)) {
            fs.rmSync(oldAlbumFolderPath, { recursive: true, force: true });
            console.log(`Carpeta temporal '${oldAlbumFolderPath}' eliminada debido a un error.`);
        }
        // Si el error ocurrió después del renombrado pero antes de guardar en DB (menos probable si rename es sync)
        // y quieres revertir, necesitarías lógica más compleja (ej. borrar newAlbumFolderPath).

        res.status(500).json({ ok: false, mjs: 'Error interno del servidor durante la creación del álbum.' });
    }
};


const loadAlbum = async (req, res) => {
    const user = req.session.user;
    const userId = user.id
    let repuesta = {
        ok: false,
        mjs: 'No hay albums para el usuario',
        albumsData: []
    }
    if (!user) {
        return res.status(401).json(repuesta);
    }

    const albumsData = await AlbumModel.all(userId, undefined)

    if (Object.keys(albumsData).length === 0) {
        repuesta.ok = false
        return res.status(401).json(repuesta);
    }
    repuesta.ok = true
    repuesta.msj = 'El user tiene datos'
    repuesta.albumsData = albumsData
    return res.status(200).json(repuesta);
}

const uploadObras = async (req, res) => {
    try {
        // *** CAMBIO CLAVE AQUÍ: Obtener el albumId desde req.body ***
        const albumId = req.body.albumId; // Multer parsea los campos de texto a req.body
        const directorio = req.body.newAlbumId
        console.log(albumId, directorio)

        if (!albumId) {
            return res.status(400).json({ ok: false, message: 'El ID del álbum es requerido.' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ ok: false, message: 'No se subieron archivos.' });
        }
        // `albums_idAlbums`, `detalle`, `url`, `fecha_subida
        const values = req.files.map(file => {
            const relativePath = file.path.replace(/\\/g, '/').split('/uploads/')[1];

            return [
                parseInt(albumId),
                file.filename,
                relativePath
            ];
        });
        console.log(` ${values.length} fotos subidas al album álbum ${albumId}.`);
        console.log('Información de las fotos:', values);

        /*  const album = await AlbumModel.findById(albumId);
         if (!album) {
             return res.status(404).json({ ok: false, message: 'Álbum no encontrado.' });
         } */

        const subida = await AlbumModel.uploadImg(values)
        if (!subida > 0) {
            return res.status(404).json({ ok: false, message: 'Fallo la carga de informacion en la bd.' });
        }


        return res.status(200).json({
            ok: true,
            message: 'Fotos subidas y añadidas al álbum exitosamente.'
        });

    } catch (error) {
        console.log('Error al subir fotos al álbum:', error);
        res.status(500).json({ ok: false, message: 'Error interno del servidor al subir fotos.' });
    }
}

module.exports = {
    getpageAlbum,
    getPageAdministrarAlbum,
    createAlbum,
    loadAlbum,
    getAlbumImages,
    getAdministrarObras,
    uploadObras,
    getDeletObra
};