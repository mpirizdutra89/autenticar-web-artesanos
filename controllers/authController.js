// controllers/authController.js
const pool = require('../db');
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');       // Importa el nuevo Modelo de Usuario
const CredentialModel = require('../models/CredentialModel'); // Importa el nuevo Modelo de Credenciales
const ProfileModel = require('../models/ProfileModel');     // Importa el nuevo Modelo de Perfil
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../services/emailService'); // Ajusta la ruta si es necesario
const config = require('../config/config');
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
        //console.log(config)
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
                //throw new Error('Error al obtener el ID del usuario principal.');
                console.log('Error al obtener el ID del usuario principal.')

                return res.status(401).json(respuesta);
            }

            // 3. Hashear la contraseña
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            // 4. Crear las credenciales en la tabla 'credenciales' usando CredentialModel.create
            // También pasamos la 'connection' aquí.
            const credentialsCreated = await CredentialModel.create(newUserId, passwordHash, connection);
            if (!credentialsCreated) {
                // throw new Error('Error al crear credenciales para el usuario.');
                console.log('Error al crear credenciales para el usuario.')
                return res.status(401).json(respuesta);
            }

            // 5. Crear el perfil en la tabla 'perfiles' usando ProfileModel.create
            // Y aquí también pasamos la 'connection'.
            const profileCreated = await ProfileModel.create(newUserId, nombre, apellido, connection);
            if (!profileCreated) {

                console.log('Error al crear el perfil del usuario.')
                return res.status(401).json(respuesta);
            }




            // Si todas las operaciones de los modelos fueron exitosas, confirmamos la transacción.
            await connection.commit();

            // Si todo el registro fue exitoso, iniciar sesión automáticamente y redirigir
            //req.session.user = { id: newUserId, email: email, nombre: nombre };
            respuesta.msj = `¡Registro exitoso! Por favor, inicia secion y verifica tu email. `//podria decirle que verifique el correo electronico
            respuesta.ok = true
            respuesta.url = `#loginModal?msj=${respuesta.msj}`
            return res.status(200).json(respuesta)

        } catch (error) {
            // Si ocurrió algún error, intentamos hacer rollback.
            if (connection) {
                await connection.rollback();
                console.error('Transacción de registro revertida debido a un error.');
            }
            console.error('Error al registrar usuario:', error);

            respuesta.msj = "Error al registrar el usuario. Inténtalo de nuevo.";
            respuesta.error = error.message;
            return res.status(500).json(respuesta);
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
                        verified: user.verified,
                        nombre: profile ? profile.nombre : 'Usuario', // Usa nombre del perfil si existe
                        apellido: profile ? profile.apellido : ''
                    };
                    respuesta.msj = `Sesion exitosa, bienvenido ${req.session.user.email}`
                    respuesta.ok = true

                    respuesta.url = req.session.user.verified == 1 ? '/dashboard' : 'usuario/crear-verificacion' // aca si no esta verificado , redireccionar a una view para la verificaion
                    console.log(respuesta.url)
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
    },
    getCrearteverify: async (req, res) => {
        verificarSecion(req, res)
        try {

            let msj = "No se puede crear la verifcacion."
            const vista = "crear_verificacion"



            const { id, email, verified, nombre, apellido } = req.session.user;
            if (req.session.user.verified == 1) {
                msj = "Su cuenta ya fue verificada, ya puede ingresar al sistema"

                render2(res, vista, msj, 'Verificacion', true)
                return;
            }
            console.log()
            let emailRenvio = ""
            if (req.query.email) {
                emailRenvio = req.query.email
            } else {
                emailRenvio = email
            }


            // --- confirmación de email ---
            // Generar un JWT para la verificación de email
            const verificationToken = jwt.sign(
                { userId: id, email: email },
                config.jwtSecret,
                { expiresIn: '1h' } // El token expira en 1 hora
            );

            // Calcular la fecha de expiración para guardar en la BD
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora en milisegundos

            // Guardar el token de verificación en la base de datos
            const tokenSaved = await UserModel.saveVerificationToken(id, verificationToken, expiresAt);
            if (!tokenSaved) {
                //throw new Error('Error al guardar el token de verificación.');
                console.log('Error al guardar el token de verificación.')
                /* return res.status(401).json(respuesta); */
                render2(res, vista, msj, 'Verificacion')
                return;
            }

            // Construir el enlace de verificación
            const verificationLink = `${config.appBaseUrl}/usuario/verify-email?token=${verificationToken}`;

            // Enviar el correo de verificación

            const emailSent = await sendVerificationEmail(emailRenvio, verificationLink);
            if (!emailSent) {

                console.log('No se pudo enviar el correo de verificación. El usuario podrá intentarlo más tarde.');
                //throw new Error('Error al enviar el correo de verificación.');// si comento el usuario se creao con todo lo que se hizo pero no se verifica  el usuario
                // return res.status(401).json(respuesta);
                render2(res, vista, msj, 'Verificacion')
                return;
            }
            msj = `Se envio el link de verificacion a  ${email}  .` //podria decirle que verifique el correo electronico
            msj += ' Ingresa y verificar tu cuenta. Si no ves el correo, revisa la casilla de spam.'

            //respuesta.ok = true
            //res.status(200).json(respuesta);
            render2(res, vista, msj, 'Verificacion', true)
            return;
            // ---------------------------------------------------
        } catch (error) {
            console.error('Error al iniciar sesión Error de servidor catch:', error);

            msj = "Error en el servidor. Inténtalo de nuevo más tarde."

            render2(res, vista, msj, 'Verificacion')
            return;
        }
    },
    verifyEmail: async (req, res) => {
        if (!(req.session && req.session.user)) {
            render2(res, 'denegado', '', 'denegado', false)
            return;
        }



        try {

            const { token } = req.query; // Obtener el token de los parámetros de la URL
            let verificado = req.session.user ? req.session.user.verified : 0
            let msj = ""
            const vista = "verifica_email"
            const respuesta = {
                ok: false,
                data: null,
                error: null,
                url: '',
                msj: "No se pudo verificar."
            }

            if (verificado == 1) {
                msj = 'Tu cuenta ya ha sido verificado. ¡Gracias!'
                render2(res, vista, msj)
                return;
            }

            if (!token) {
                //return res.status(400).send('Token de verificación no proporcionado.');
                //respuesta.msj="Token de verificación no proporcionado."
                // res.status(400).json(respuesta);
                msj = "Token de verificación no proporcionado."
                render2(res, vista, msj)
                return;
            }
            // 1. Verificar la firma y expiración del token JWT
            let decodedToken;

            try {
                decodedToken = jwt.verify(token, config.jwtSecret);
            } catch (jwtError) {
                msj = 'Token de verificación inválido o corrupto.'
                if (jwtError.name === 'TokenExpiredError') {
                    msj = 'El enlace de verificación ha expirado. Por favor, solicita uno nuevo.'
                }

                render2(res, vista, msj)
                return;
            }

            // 2. Buscar al usuario por el token en la base de datos
            const user = await UserModel.findByVerificationToken(token);

            if (user == null) {

                msj = 'Su cuenta no se pudo verificar.'
                render2(res, vista, msj, 'No se pudo verficar', false)
                return;
            }

            // 3. Verificar si el email ya está verificado
            if (user) {



                // 4. Verificar la expiración del token en la base de datos (doble chequeo por seguridad)
                // Aunque JWT ya verifica la expiración, es bueno tener un chequeo en la BD si el token no se borró.
                if (user.email_verification_expires_at && new Date() > user.email_verification_expires_at) {
                    msj = 'El enlace de verificación ha expirado. Por favor, solicita uno nuevo.'
                    render2(res, vista, msj)
                    return;
                }

                // 5. Marcar el email como verificado en la base de datos
                const emailVerified = await UserModel.markEmailAsVerified(user.id);

                if (emailVerified > 0) {
                    // Opcional: Iniciar sesión al usuario automáticamente después de la verificación
                    // req.session.user = { id: user.id, email: user.email };
                    //return res.redirect('./#loginModal?msj=El email fue verificado con exito, ya puede iniciar secion'); // redirige para iniciar secion
                    msj = "Cuenta verificada con exito !!"
                    req.session.user.verified = 1
                    render2(res, vista, msj, 'verifica cuenta ok', true)
                    return;
                } else {
                    msj = 'No se pudo verificar el correo electrónico. Inténtalo de nuevo.'
                    render2(res, vista, msj)
                    return;
                }
            }

        } catch (error) {
            console.error('Error en la verificación de email:', error);
            /* return res.status(500).send(''); */
            msj = 'Ocurrió un error interno al verificar el correo electrónico.'
            render2(res, vista, msj)
            return;
        }
    }
};

const verificarSecion = (req, res, msj = '') => {
    if (!(req.session && req.session.user)) {
        render2(res, 'denegado', msj, 'denegado', false)
        return;
    }
}



const render2 = (res, vista = 'verifica_email', msj = '', title = 'Verificacion email', ok = false) => {
    // console.log(`${ok}  - ${vista}`)
    res.render(vista, {
        msj: msj,
        title: title,
        ok: ok
    });

}

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