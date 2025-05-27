// controllers/authController.js
// Este archivo contiene la lógica para las operaciones de autenticación (registro, login, logout).

const bcrypt = require('bcrypt'); // Módulo para el hash de contraseñas
const db = require('../db'); // Importa el pool de conexiones a la base de datos

const authController = {
    // Renderiza la página de inicio de sesión
    getLoginPage: (req, res) => {
        // Si el usuario ya está logueado, redirige al dashboard directamente
        if (req.session.user) {
            return res.redirect('/dashboard');
        }
        // Renderiza la plantilla 'login.pug' y pasa el mensaje de error si existe
        res.render('login', { error: req.query.error });
    },

    // Renderiza la página de registro
    getRegisterPage: (req, res) => {
        // Si el usuario ya está logueado, redirige al dashboard directamente
        if (req.session.user) {
            return res.redirect('/dashboard');
        }
        // Renderiza la plantilla 'register.pug' y pasa el mensaje de error si existe
        res.render('register', { error: req.query.error });
    },

    // Maneja el envío del formulario de registro
    postRegister: async (req, res) => {
        const { nombre, apellido, email, password } = req.body;
        console.log(req.body)
        // Validaciones básicas
        if (!nombre || !apellido || !email || !password) {
            return res.redirect('/register?error=Todos los campos son obligatorios.');
        }

        try {
            // Genera un hash de la contraseña
            const saltRounds = 10; // Número de rondas de sal para bcrypt (más alto = más seguro, más lento)
            const password_hash = await bcrypt.hash(password, saltRounds);

            // Inserta el nuevo usuario en la base de datos
            const [result] = await db.execute(
                'INSERT INTO Usuarios2 (nombre, apellido, email, password_hash) VALUES (?, ?, ?, ?)',
                [nombre, apellido, email, password_hash]
            );

            // Opcional: Iniciar sesión automáticamente después del registro
            req.session.user = { id: result.insertId, email: email };
            res.redirect('/dashboard');

        } catch (error) {
            console.error('Error al registrar usuario:', error);
            // Manejo de errores, por ejemplo, si el email ya existe (UNIQUE constraint)
            if (error.code === 'ER_DUP_ENTRY') {
                return res.redirect('/register?error=El correo electrónico ya está registrado.');
            }
            res.redirect('/register?error=Error al registrar el usuario. Inténtalo de nuevo.');
        }
    },

    // Maneja el envío del formulario de inicio de sesión
    postLogin: async (req, res) => {
        const { email, password } = req.body;
        try {
            // Busca el usuario por email en la base de datos
            const [rows] = await db.execute('SELECT * FROM Usuarios2 WHERE email = ?', [email]);
            const user = rows[0];
            console.log(user)
            if (user) {
                // Si el usuario existe, compara la contraseña proporcionada con el hash almacenado
                const passwordMatch = await bcrypt.compare(password, user.password_hash);

                if (passwordMatch) {
                    // Si las contraseñas coinciden:
                    // Almacena información no sensible del usuario en la sesión.
                    req.session.user = { id: user.id, email: user.email, nombre: user.nombre };
                    res.redirect('/dashboard'); // Redirige al dashboard
                } else {
                    // Contraseña incorrecta
                    res.redirect('/?error=Credenciales inválidas. Inténtalo de nuevo.');
                }
            } else {
                // Usuario no encontrado
                res.redirect('/?error=Credenciales inválidas. Inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            res.redirect('/?error=Error en el servidor. Inténtalo de nuevo más tarde.');
        }
    },

    // Maneja el cierre de sesión
    postLogout: (req, res) => {
        // Destruye la sesión del usuario.
        req.session.destroy(err => {
            if (err) {
                console.error('Error al destruir la sesión:', err);
                return res.redirect('/dashboard');
            }
            res.redirect('/'); // Redirige al formulario de inicio de sesión
        });
    }
};

module.exports = authController;
