// models/searchModel.js

// --- SIMULACIÓN DE CONEXIÓN A DB Y QUERIES ---
// En una aplicación real, aquí usarías un ORM (Sequelize, Mongoose)
// o un cliente de base de datos (pg, mysql, tedious)
// y harías las consultas SQL o NoSQL apropiadas.

// const db = require('./db'); // Si tienes un archivo db.js para la conexión

const globalSearch = async (query) => {
    // Escapa la query para evitar inyección SQL si estás usando consultas directas
    // Si usas un ORM o prepared statements, esto se maneja automáticamente.
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapa caracteres especiales para regex

    const results = {
        users: [],
        albumsByTitle: [],
        albumsByTag: [],
    };

    try {
        // --- SIMULACIÓN DE CONSULTAS ---
        // Aquí es donde iría tu lógica real de base de datos.
        // Por ejemplo, para PostgreSQL con 'pg'
        // const { rows: userRows } = await db.query('SELECT id, name, email FROM users WHERE name ILIKE $1 OR email ILIKE $1 LIMIT 5', [`%${query}%`]);
        // results.users = userRows;

        // Simulamos resultados para usuarios
        results.users = await searchUsers(escapedQuery);

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

async function searchUsers(query) {
    // Ejemplo de búsqueda en una tabla 'users' por 'name' o 'email'
    // En SQL sería algo como:
    // SELECT id, name, email FROM users WHERE name LIKE '%${query}%' OR email LIKE '%${query}%' LIMIT 5;
    // O con MongoDB (Mongoose):
    // return User.find({ $or: [{ name: { $regex: query, $options: 'i' } }, { email: { $regex: query, $options: 'i' } }] }).limit(5);

    // Simulación con datos estáticos
    const dummyUsers = [
        { id: 1, name: 'Martín Pérez', email: 'martin.p@example.com' },
        { id: 2, name: 'Ana García', email: 'ana.g@example.com' },
        { id: 3, name: 'Carlos Díaz', email: 'carlos.d@example.com' },
        { id: 4, name: 'Laura Martinez', email: 'laura.m@example.com' },
        { id: 5, name: 'Juan Sanchez', email: 'juan.s@example.com' },
    ];
    return dummyUsers.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limitar a 5 resultados
}

async function searchAlbumsByTitle(query) {
    // Ejemplo de búsqueda en una tabla 'albums' por 'title'
    // En SQL sería algo como:
    // SELECT id, title, artist FROM albums WHERE title LIKE '%${query}%' LIMIT 5;
    // O con MongoDB (Mongoose):
    // return Album.find({ title: { $regex: query, $options: 'i' } }).limit(5);

    // Simulación con datos estáticos
    const dummyAlbums = [
        { id: 101, title: 'Revolución Sonora', artist: 'Banda X' },
        { id: 102, title: 'Ecos del Tiempo', artist: 'Solista Y' },
        { id: 103, title: 'Luces de Ciudad', artist: 'Grupo Z' },
        { id: 104, title: 'Sueños Perdidos', artist: 'Cantante A' },
        { id: 105, title: 'Noches Blancas', artist: 'Dúo B' },
    ];
    return dummyAlbums.filter(album =>
        album.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limitar a 5 resultados
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