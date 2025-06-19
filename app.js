const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config(); // Carga variables desde .env SOLO si NO estamos en producción


// --- Importaciones de Redis para express-session ---
// CORRECCIÓN FINAL AQUÍ: Llama directamente a 'require('connect-redis')' como una función
// y pásale la instancia de 'session'.
const RedisStore = require('connect-redis')(session); // <--- CAMBIO CLAVE AQUÍ
const { createClient } = require('redis');

// --- NUEVAS IMPORTACIONES PARA SOCKET.IO Y REDIS ADAPTER ---
const { Server } = require('socket.io'); // Importa la clase Server de socket.io
const { createAdapter } = require('@socket.io/redis-adapter'); // Importa el adaptador de Redis

// Importa los módulos de rutas
const inicioRoutes = require('./routes/inicio');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const albumRoutes = require('./routes/albumRoutes')
const panelNotificacionesRoutes = require('./routes/panelNotificacion');
//multer
const { multerErrorHandler } = require('./middleware/uploadMiddleware');
// Importa el middleware de autenticación notificacion
const { isAuthenticated, loadUserIntoView } = require('./middleware/authMiddleware');
const loadNotificationsMiddleware = require('./middleware/notificationMiddleware'); // Importa tu nuevo middleware


const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3003
const HOST = process.env.HOST ? process.env.HOST : "localhost"
const SESSION_SECRET = "nicolas89"; //process.env.SESSION_SECRET ? process.env.SESSION_SECRET : "nicolas89"
const REDIS_URL = "redis://localhost:6379";//process.env.REDIS_URL ? process.env.REDIS_URL : "redis://localhost:6379"

app.use(express.static(path.join(__dirname, 'public')))
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')))
app.use('/bootstrap-icons', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')))// Esto expone la carpeta 'node_modules/bootstrap-icons/font' bajo la ruta '/bootstrap-icons'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Habilita 'trust proxy' ya que Nginx actúa como un proxy inverso.
// Esto es crucial para que Express maneje correctamente los encabezados X-Forwarded-For y X-Forwarded-Proto (HTTPS).
app.set('trust proxy', 1);

// --- Función asíncrona autoejecutable para iniciar la aplicación ---
(async () => {
    // 1. Configuración y Conexión a Redis para SESSIONS
    let redisClient = createClient({
        url: REDIS_URL
    });
    redisClient.on('connect', () => console.log('✅ Conectado a Redis para Sesiones!'));
    redisClient.on('error', (err) => console.error('❌ Error de conexión a Redis para Sesiones:', err));

    try {
        await redisClient.connect();
    } catch (err) {
        console.error('❌ No se pudo conectar a Redis para Sesiones. Error:', err);
        process.exit(1); // Sale de la aplicación si no puede conectar a Redis para sesiones
    }

    // Configuración del middleware de sesión de Express
    const sessionMiddleware = session({
        store: new RedisStore({ client: redisClient }), // Ahora RedisStore es una función constructor válida
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // Duración de la cookie (1 día)
            httpOnly: true, // La cookie solo es accesible a través de HTTP(S) y no JavaScript
            secure: true // 'true' ya que Nginx maneja HTTPS. La cookie solo se envía sobre HTTPS.
        }
    });

    app.use(sessionMiddleware);


    // Clientes de Redis para el adaptador de Socket.IO (necesita dos clientes: pub y sub)
    const pubClient = createClient({ url: REDIS_URL });
    const subClient = createClient({ url: REDIS_URL });

    pubClient.on('connect', () => console.log('✅ Conectado a Redis (PubClient) para Socket.IO!'));
    subClient.on('connect', () => console.log('✅ Conectado a Redis (SubClient) para Socket.IO!'));
    pubClient.on('error', (err) => console.error('❌ Error de conexión a Redis (PubClient) para Socket.IO:', err));
    subClient.on('error', (err) => console.error('❌ Error de conexión a Redis (SubClient) para Socket.IO:', err));

    try {
        await pubClient.connect();
        await subClient.connect();
    } catch (err) {
        console.error('❌ No se pudo conectar a Redis para Socket.IO. Error:', err);
        // Puedes decidir si la app debe fallar aquí o seguir sin real-time notifications
        process.exit(1); // Sale de la aplicación si no puede conectar a Redis para Socket.IO
    }

    // APLICA EL MIDDLEWARE loadUserIntoView GLOBALMENTE
    // Esto hace que `res.locals.user` esté disponible en todas las vistas.
    app.use(loadUserIntoView);
    // Aplica el Middleware de Notificaciones
    // Esto hará que 'res.locals.notificaciones' esté disponible en cada solicitud
    app.use(loadNotificationsMiddleware);


    app.use('/usuario', authRoutes);// Rutas de autenticación (login, logout, register)
    // Rutas del dashboard (protegidas por el middleware isAuthenticated)
    app.use('/dashboard', isAuthenticated, dashboardRoutes);
    app.use('/panel-notificacion', isAuthenticated, panelNotificacionesRoutes)
    app.use('/album', isAuthenticated, albumRoutes)




    //manejo de errores gloabales
    app.use(multerErrorHandler);
    app.use('/', inicioRoutes);
    // Este middleware debe ir DESPUÉS de TODAS tus rutas definidas
    app.use((req, res, next) => {

        res.status(404).render('404', {
            title: 'Página No Encontrada'
        });
    });

    // --- Manejo del Socket.IO (debe ir después de configurar la sesión, para acceder a req.session) ---

    const server = require('http').createServer(app);
    // Aquí es donde añades la configuración de CORS a la instancia de Socket.IO
    const io = new Server(server, {
        cors: {
            // El 'origin' debe ser el dominio de tu frontend tal como lo ve el navegador (a través de Nginx)
            origin: "https://artesanos.mpiridutra.site",
            methods: ["GET", "POST"], // Métodos HTTP permitidos para el handshake inicial
            credentials: true // Permite el envío de cookies de sesión a través de CORS
        },
        // Si tienes clientes Socket.IO muy antiguos (versiones 2.x o anteriores), podrías necesitar esto:
        // allowEIO3: true
    });

    // Usar el adaptador de Redis para Socket.IO (para escalabilidad)
    io.adapter(createAdapter(pubClient, subClient));

    // Middleware de Socket.IO para compartir la sesión de Express
    // Esto es CRUCIAL para acceder a `socket.request.session.user` en las conexiones de Socket.IO
    io.use((socket, next) => {
        // Usa la instancia de sessionMiddleware que ya creaste y pasaste a Express.
        // Esto asegura que la misma configuración de sesión se use para Express y Socket.IO.
        sessionMiddleware(socket.request, {}, next);
    });

    // Lógica de conexión de Socket.IO
    io.on('connection', (socket) => {
        console.log('Un usuario se ha conectado al Socket.IO:', socket.id);

        // Intenta obtener el ID del usuario de la sesión de Express
        const userId = socket.request.session.user?.id;

        if (userId) {
            // Unir al usuario a una "sala" basada en su ID de usuario
            // Esto permite enviar notificaciones directamente a un usuario específico
            socket.join(`user_${userId}`);
            console.log(`Usuario ${userId} unido a la sala user_${userId}`);

            // Enviar notificaciones no leídas al usuario cuando se conecta
            // (Esta parte se completará en el controlador)
            // socket.emit('notificaciones_iniciales', [...notificacionesNoLeidas]);
        } else {
            console.log('Usuario no autenticado conectado a Socket.IO. No se unirá a ninguna sala específica.');
        }

        socket.on('disconnect', () => {
            console.log('Un usuario se ha desconectado del Socket.IO:', socket.id);
            if (userId) {
                // Opcional: Abandonar la sala al desconectar
                socket.leave(`user_${userId}`);
                console.log(`Usuario ${userId} abandonó la sala user_${userId}`);
            }
        });

        // Puedes agregar más manejadores de eventos de Socket.IO aquí
        // socket.on('algun_evento_personalizado', (data) => { ... });
    });

    // Exportar 'io' para que pueda ser utilizado en otros módulos (controladores)
    app.set('socketio', io); // Almacenar la instancia de Socket.IO en el objeto 'app'

    // --- Inicio del Servidor HTTP con Socket.IO ---
    server.listen(PORT, HOST, () => { // Cambia app.listen por server.listen
        console.log(`🚀 Servidor escuchando en http://${HOST}:${PORT}`);
        console.log(`🔗 Visita http://${HOST}:${PORT}/usuario en tu navegador para iniciar la aplicación.`);
        console.log(`📝 Primero, regístrate en http://http://${HOST}:${PORT}/usuario/register`);
    });
})(); // -> La función se ejecuta automáticamente