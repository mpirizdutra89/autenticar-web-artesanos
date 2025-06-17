const path = require('path');
const fs = require('fs');
const UPLOAD_DIR = path.join(__dirname, '../uploads');
const activeTab = 'albums'
const AlbumModel = require('../models/albumModel');
const { resolveObjectURL } = require('buffer');


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


const getAdministrarObras = async (req, res) => {

    const respuesta = {
        ok: false,
        albumsData: [],
        message: 'Falta la referencia del album'
    }
    const albumId = req.params.id;
    const obras = await AlbumModel.imagenesByIdAlbum(albumId)

    res.render('album_administrar', {
        title: 'Administrar Album',
        panel_notificacion: true,
        activeTab: activeTab,
        albumsData: obras
    });
}
// controllers/userController.js

/* const createAlbum2 = async (req, res) => {

    console.log('Datos del formulario de registro:', req.body); // Otros campos de texto del formulario
    console.log('Archivos subidos por Multer:', req.files); // Archivos de imagen
    try {


        const userId = req.userUploadsId;
        if (!userId) {
            return res.status(500).json({ ok: false, msj: 'Error interno: ID de usuario no determinado.' });
        }

        const profileImageFile = req.files && req.files.profile_image ? req.files.profile_image[0] : null;
        const coverImageFile = req.files && req.files.cover_image ? req.files.cover_image[0] : null;

        let profileImagePath = null;
        if (profileImageFile) {
            // Construye la ruta relativa de la imagen para guardar en la base de datos
            // /uploads/usuario_ID/perfil/profile.ext
            profileImagePath = `/uploads/usuario_${userId}/perfil/${profileImageFile.filename}`;
            console.log('Ruta de imagen de perfil:', profileImagePath);
        }

        let coverImagePath = null;
        if (coverImageFile) {
            // Construye la ruta relativa de la imagen para guardar en la base de datos
            // /uploads/usuario_ID/portada/cover.ext
            coverImagePath = `/uploads/usuario_${userId}/portada/${coverImageFile.filename}`;
            console.log('Ruta de imagen de portada:', coverImagePath);
        }

        if (!coverImageFile) {
            return res.status(401).json({
                ok: false,
                msj: 'Ocurrio un error con la imagen.',
                userId: userId,
                coverImage: coverImagePath
            });
        }

        //guardar en la base dedatos


        return res.status(200).json({
            ok: true,
            msj: 'Registro exitoso y/o imágenes subidas.',
            userId: userId,
            data: req.body,
            coverImage: coverImagePath
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msj: 'No se pudo resgistrar el album, fallo interno',
        });
    }
}; */

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
            albumCoverPath = `/uploads/usuario_${userId}/albums/album_${tempAlbumId}/portada/${albumCoverFile.filename}`;
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
                            portadaUrl: data.portada,
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
module.exports = {
    getpageAlbum,
    getPageAdministrarAlbum,
    createAlbum,
    loadAlbum,
    getAlbumImages,
    getAdministrarObras
};