const path = require('path');
const fs = require('fs').promises;

async function eliminarFotoEspecifica(rutaRelativaFoto) {
    const UPLOAD_DIR = path.join(__dirname, '../uploads');
    // 2. Construye la ruta absoluta completa del archivo
    const rutaAbsolutaFoto = path.join(UPLOAD_DIR, rutaRelativaFoto);

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
const ruta = "usuario_30/albums/album_37ddc6ff-1862-4894-93bd-d406dbd857a7/obras/photo_1750205236726_18oho5.jpg"
const res = eliminarFotoEspecifica(ruta)
console.log(res)