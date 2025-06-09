// controllers/authController.js
const pool = require('../db');
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');       // Importa el nuevo Modelo de Usuario
const CredentialModel = require('../models/CredentialModel'); // Importa el nuevo Modelo de Credenciales
const ProfileModel = require('../models/ProfileModel');     // Importa el nuevo Modelo de Perfil
//NOTAAA:
const prefijo = "/usuario/" //aca la barra al principio hace la diferencha para desde el action del formulario no duplicar la ruta,
const authController = {
    getLoginPage: (req, res) => {
        if (req.session.user) {
            return res.redirect('/dashboard');
        }

        console.log(`Erro getLoginPage(): ${req.query.error}`)
        return res.redirect('./#loginModal')
    },

    getRegisterPage: (req, res) => {
        if (req.session.user) {
            return res.redirect('/dashboard');
        }
        console.log(`Erro getRegisterPage(): ${req.query.error}`)
        res.render('register', {
            prefijo: prefijo,
            title: "Registro"
        });
    },

    postRegister: async (req, res) => {
        const { nombre, apellido, email, password } = req.body;

        const respuesta = {
            ok: false,
            data: null,
            error: null,
            url: '',
            msj: "No se pudo registrar."
        };

        let connection;

        try {

            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                respuesta.msj = "El correo electrónico ya está registrado.";
                return res.status(401).json(respuesta);
            }

            // Obtener una conexión del pool. Es crucial usar esta MISMA conexión para toda la transacción.
            connection = await pool.getConnection();
            // Iniciar la transacción.
            await connection.beginTransaction();

            // 2. Crear el nuevo usuario en la tabla 'usuarios' usando UserModel.create
            // Ahora, pasamos la 'connection' específica a tu método UserModel.create.
            const newUserId = await UserModel.create(email, connection);
            if (!newUserId) {
                throw new Error('Error al obtener el ID del usuario principal.');
            }

            // 3. Hashear la contraseña
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            // 4. Crear las credenciales en la tabla 'credenciales' usando CredentialModel.create
            // También pasamos la 'connection' aquí.
            const credentialsCreated = await CredentialModel.create(newUserId, passwordHash, connection);
            if (!credentialsCreated) {
                throw new Error('Error al crear credenciales para el usuario.');
            }

            // 5. Crear el perfil en la tabla 'perfiles' usando ProfileModel.create
            // Y aquí también pasamos la 'connection'.
            const profileCreated = await ProfileModel.create(newUserId, nombre, apellido, connection);
            if (!profileCreated) {
                throw new Error('Error al crear el perfil del usuario.');
            }

            // Si todas las operaciones de los modelos fueron exitosas, confirmamos la transacción.
            await connection.commit();

            // Si todo el registro fue exitoso, iniciar sesión automáticamente y redirigir
            req.session.user = { id: newUserId, email: email, nombre: nombre };
            respuesta.msj = `Se a registrado correctamente, ${req.session.user.email}`//podria decirle que verifique el correo electronico
            respuesta.ok = true
            res.status(200).json(respuesta);

        } catch (error) {
            // Si ocurrió algún error, intentamos hacer rollback.
            if (connection) {
                await connection.rollback();
                console.error('Transacción de registro revertida debido a un error.');
            }
            console.error('Error al registrar usuario:', error);

            respuesta.msj = "Error al registrar el usuario. Inténtalo de nuevo.";
            respuesta.error = error.message;
            res.status(500).json(respuesta);
        } finally {
            // Siempre liberar la conexión al pool.
            if (connection) {
                connection.release();
                console.log('Conexión liberada al pool.');
            }
        }
    },

    postLogin: async (req, res) => {

        if (req.body) {

            const { email, password } = req.body

            const respuesta = {
                ok: false,
                data: null,
                error: null,
                url: '',
                msj: "La credenciales son incorrectas."
            }

            try {
                //console.log(req.body)
                // 1. Buscar el usuario por email en la tabla 'usuarios'
                const user = await UserModel.findByEmail(email);

                if (!user) {
                    res.status(401).json(respuesta);
                }

                // 2. Buscar las credenciales del usuario en la tabla 'credenciales'
                const credentials = await CredentialModel.findByUserId(user.id);
                if (!credentials) {
                    // Esto no debería pasar si el registro es atómico
                    res.status(401).json(respuesta);
                }

                // 3. Comparar la contraseña proporcionada con el hash almacenado
                const passwordMatch = await bcrypt.compare(password, credentials.password_hash);

                if (passwordMatch) {
                    // 4. Si las contraseñas coinciden, buscar el perfil del usuario
                    const profile = await ProfileModel.findByUserId(user.id);

                    // Almacenar información relevante en la sesión (combinando usuario y perfil)
                    req.session.user = {
                        id: user.id,
                        email: user.email,
                        nombre: profile ? profile.nombre : 'Usuario', // Usa nombre del perfil si existe
                        apellido: profile ? profile.apellido : ''
                    };
                    respuesta.msj = `Sesion exitosa, bienvenido ${req.session.user.email}`
                    respuesta.ok = true
                    respuesta.url = '/dashboard'
                    res.status(200).json(respuesta);
                    //res.redirect('/dashboard'); // Redirige al dashboard
                } else {

                    res.status(401).json(respuesta);
                }
            } catch (error) {
                console.error('Error al iniciar sesión Error de servidor catch:', error);

                respuesta.msj = "Error en el servidor. Inténtalo de nuevo más tarde."

                res.status(500).json(respuesta);
            }
        } else {
            respuesta.msj = "No llegan las credenciales"

            res.status(401).json(respuesta);
        }
    },

    postLogout: (req, res) => {
        req.session.destroy(err => {
            if (err) {
                console.error('Error al destruir la sesión:', err);
                return res.redirect('/dashboard');
            }
            res.redirect('/');
        });
    }
};

module.exports = authController;

//Nota la redireccion LEER:

/* No, la redirección en la función postLogin de controllers/authController.js no es siempre a donde vino la petición original (referente al "referer" del HTTP).

La redirección en ese caso específico es explícita y estática:

res.redirect('/dashboard');: Si el login es exitoso, el usuario siempre será redirigido a la ruta /dashboard.
res.redirect('/?error=...');: Si el login falla, el usuario siempre será redirigido de vuelta a la ruta raíz (/), que es donde se encuentra el formulario de login, y se le pasará un mensaje de error como parámetro de consulta.
¿Qué significa "de donde vino la petición"?
Si te refieres a si se redirige a la URL que estaba visitando el usuario antes de llegar a la página de login (ej., si intentó acceder a /admin y fue redirigido al login), esa lógica no está implementada en el código actual.

Para implementar eso (redirigir al usuario a la página que intentó visitar antes de ser interceptado por la autenticación), se suele hacer lo siguiente:

Al interceptar la ruta protegida (isAuthenticated middleware):
Guardar la URL original que el usuario intentó visitar en la sesión (ej., req.session.returnTo = req.originalUrl;).
Luego, redirigir al / (login).
En el postLogin exitoso:
Después de un login exitoso, verificar si req.session.returnTo existe.
Si existe, redirigir a req.session.returnTo y luego eliminar esa variable de la sesión.
Si no existe, redirigir al /dashboard por defecto.
En resumen:
En el código actual:

Éxito: Redirecciona siempre a /dashboard.
Fallo: Redirecciona siempre a / (la página de login).
No hay lógica para recordar y redirigir a la URL previa a la que el usuario fue interceptado por el middleware de autenticación. */