// middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '../uploads');

// ... getSecureUserId (sin cambios, ya definido antes) ...
function getSecureUserId(req) {
    if (req.user && req.user.id) {
        return String(req.user.id);
    }
    if (req.res && req.res.locals && req.res.locals.user && req.res.locals.user.id) {
        return String(req.res.locals.user.id);
    }
    return `guest_${Date.now()}`;
}


/**
 * Función auxiliar para determinar la ruta de destino de un archivo.
 * @param {object} req - El objeto de la solicitud Express.
 * @param {object} file - El objeto de archivo de Multer.
 * @returns {string} La ruta completa del directorio donde se guardará el archivo.
 * @throws {Error} Si un ID requerido (ej. albumId) no está presente.
 */
function getFileDestination(req, file) {
    const userId = getSecureUserId(req);
    req.userUploadsId = userId; // Adjuntamos el userId seguro para el controlador

    const userUploadsDir = path.join(UPLOAD_DIR, `usuario_${userId}`);
    if (!fs.existsSync(userUploadsDir)) {
        fs.mkdirSync(userUploadsDir, { recursive: true });
    }

    let subPath;
    // Priorizamos req.newAlbumId (para la creación de álbum) sobre req.params.id
    // Si req.newAlbumId existe, significa que estamos en el flujo de creación de un nuevo álbum.
    const albumIdToUse = req.newAlbumId || req.params.id;

    if (file.fieldname === 'profile_image') {
        subPath = 'perfil';
    } else if (file.fieldname === 'cover_image') {
        // Esta es la 'cover_image' global del usuario. No está ligada a un álbum.
        subPath = 'portada';
    } else if (file.fieldname === 'album_initial_cover') { // <-- ¡NUEVO CAMPO!
        // Esta es la portada inicial para la CREACIÓN de un NUEVO ÁLBUM.
        if (!albumIdToUse) {
            throw new Error('Album ID es requerido para la portada inicial del álbum.');
        }
        subPath = path.join('albums', `album_${albumIdToUse}`, 'portada');
    } else if (file.fieldname === 'album_photos') {
        // Estas son las fotos "obras" que van a la subcarpeta 'obras'.
        if (!albumIdToUse) {
            throw new Error('Album ID es requerido para subir fotos a un álbum.');
        }
        subPath = path.join('albums', `album_${albumIdToUse}`, 'obras'); // <-- ¡NUEVA SUBCARPETA!
    } else {
        subPath = ''; // Por defecto, si no coincide ningún campo específico
    }

    const destinationPath = path.join(userUploadsDir, subPath);

    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
    }
    return destinationPath;
}

/**
 * Función auxiliar para determinar el nombre de archivo.
 * Mantenemos nombres fijos para portada/perfil y únicos para obras.
 */
function getFileName(req, file) {
    const ext = path.extname(file.originalname);
    let filename;

    if (file.fieldname === 'profile_image') {
        filename = 'profile' + ext;
    } else if (file.fieldname === 'cover_image' || file.fieldname === 'album_initial_cover') {
        // Ambas portadas (global y de álbum) pueden tener el mismo nombre fijo
        filename = 'cover' + ext;
    } else if (file.fieldname === 'album_photos') {
        filename = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    } else {
        filename = `file_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    }
    return filename;
}


// --- Configuración de Multer (las exportaciones) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            const destination = getFileDestination(req, file);
            cb(null, destination);
        } catch (error) {
            cb(error, null); // Pasa el error a Multer
        }
    },
    filename: function (req, file, cb) {
        const filename = getFileName(req, file);
        cb(null, filename);
    }
});

const uploadImages = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido. Solo imágenes JPG, PNG, WEBP.'), false);
        }
    }
});

// Exportaciones existentes (para registro/perfil de usuario global)
exports.userRegistrationUpload = uploadImages.fields([
    { name: 'profile_image', maxCount: 1 },
    { name: 'cover_image', maxCount: 1 } // Esta es la 'cover_image' del perfil global
]);

// Exportación para subir fotos "obras" a un álbum existente
exports.albumPhotosUpload = uploadImages.array('album_photos', 20);

// --- ¡NUEVA EXPORTACIÓN! Para la creación inicial de un álbum (incluye su portada) ---
// Usamos 'fields' porque incluye el título y descripción (en req.body) y la imagen.
exports.createAlbumUpload = uploadImages.fields([
    { name: 'album_initial_cover', maxCount: 1 } // La portada al crear el álbum
    // Otros campos de texto como 'title', 'description' estarán en req.body
]);

exports.multerErrorHandler = (err, req, res, next) => { /* ... sin cambios ... */ };