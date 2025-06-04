// controllers/authController.js
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
        res.render('login', {
            prefijo: prefijo,
            title: "Iniciar secion"
        });
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

        if (!nombre || !apellido || !email || !password) {
            return res.redirect('/register?error=Todos los campos son obligatorios.');
        }

        try {
            // 1. Verificar si el email ya existe en la tabla 'usuarios'
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.redirect('/register?error=El correo electrónico ya está registrado.');
            }

            // 2. Crear el nuevo usuario en la tabla 'usuarios'
            const newUserId = await UserModel.create(email);
            if (!newUserId) {
                throw new Error('Error al crear el usuario principal.');
            }

            // 3. Hashear la contraseña
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            // 4. Crear las credenciales en la tabla 'credenciales'
            const credentialsCreated = await CredentialModel.create(newUserId, passwordHash);
            if (!credentialsCreated) {
                // Si falla la creación de credenciales, puedes considerar deshacer la creación del usuario
                // En un sistema real, esto se manejaría con transacciones.
                throw new Error('Error al crear credenciales para el usuario.');
            }

            // 5. Crear el perfil en la tabla 'perfiles'
            const profileCreated = await ProfileModel.create(newUserId, nombre, apellido);
            if (!profileCreated) {
                // Similarmente, considerar deshacer si el perfil no se crea
                throw new Error('Error al crear el perfil del usuario.');
            }

            // Iniciar sesión automáticamente después del registro
            req.session.user = { id: newUserId, email: email, nombre: nombre };
            res.redirect('/dashboard');

        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.redirect('/register?error=Error al registrar el usuario. Inténtalo de nuevo.');
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