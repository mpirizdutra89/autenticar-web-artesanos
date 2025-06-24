// models/searchModel.js

// --- SIMULACIÓN DE CONEXIÓN A DB Y QUERIES ---
// En una aplicación real, aquí usarías un ORM (Sequelize, Mongoose)
// o un cliente de base de datos (pg, mysql, tedious)
// y harías las consultas SQL o NoSQL apropiadas.

const UserModelo = require('../models/UserModel');
const AlbumModel = require('../models/albumModel')

const globalSearch = async (query, user_id) => {
    // Escapa la query para evitar inyección SQL si estás usando consultas directas
    // Si usas un ORM o prepared statements, esto se maneja automáticamente.
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapa caracteres especiales para regex

    const results = {
        users: [],
        albumsByTitle: [],
        albumsByTag: [],
    };

    try {


        // Simulamos resultados para usuarios
        results.users = await searchUsers(escapedQuery, user_id);

        // Simulamos resultados para álbumes por título
        results.albumsByTitle = await searchAlbumsByTitle(escapedQuery);

        // Simulamos resultados para álbumes por etiqueta
        results.albumsByTag = await searchAlbumsByTag(escapedQuery);

        return results;

    } catch (error) {
        console.error('Error en globalSearch del modelo:', error);
        throw error; // Propagar el error para que el controlador lo maneje
    }
};

// --- FUNCIONES SIMULADAS DE BÚSQUEDA ---
// Reemplaza estas funciones con tus consultas reales a la base de datos

async function searchUsers(query, user_id) {


    const foundUsers = await UserModelo.searchUsers(query, user_id);
    console.log(`Buscar usuario......${query}`)
    console.log(foundUsers);
    return foundUsers;
}

async function searchAlbumsByTitle(query) {

    const foundUsers = await AlbumModel.searchAlbumPortafolio(query);
    console.log(`Buscar Album portafolio solo publico......${query}`)
    console.log(foundUsers);
    return foundUsers;
}

async function searchAlbumsByTag(query) {
    // Ejemplo de búsqueda en una tabla 'albums' donde 'tags' es un array de strings
    // En SQL con algún tipo de JSONB o texto plano con LIKE:
    // SELECT id, title, artist, tags FROM albums WHERE tags::text LIKE '%${query}%' LIMIT 5;
    // O con MongoDB (Mongoose):
    // return Album.find({ tags: { $regex: query, $options: 'i' } }).limit(5);

    // Simulación con datos estáticos
    const dummyAlbumsWithTags = [
        { id: 201, title: 'Ritmo Urbano', tags: ['hiphop', 'rap', 'calle'] },
        { id: 202, title: 'Melodías del Alma', tags: ['folk', 'acústico'] },
        { id: 203, title: 'Electrónica Profunda', tags: ['techno', 'house', 'electronica'] },
        { id: 204, title: 'Rock de los 80', tags: ['rock', 'clásico', 'banda'] },
        { id: 205, title: 'Jazz Lounge', tags: ['jazz', 'instrumental'] },
    ];
    return dummyAlbumsWithTags.filter(album =>
        album.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 5); // Limitar a 5 resultados
}

module.exports = {
    globalSearch,
};