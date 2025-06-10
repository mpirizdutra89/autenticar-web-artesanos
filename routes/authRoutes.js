// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { loginValidationRules, registerValidationRules } = require('../validation/authValidation');
// Importar el middleware que maneja los resultados de la validación
const validate = require('../middleware/validatorMiddleware');



router.post('/register', registerValidationRules(), validate, authController.postRegister);

router.post('/login', loginValidationRules(), validate, authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/register', authController.getRegisterPage);
router.get('/crear-verificacion', authController.getCrearteverify)
router.get('/verify-email', authController.verifyEmail);
router.get('/', authController.getLoginPage);

module.exports = router;


//Notas de seguridad Para redi, cuando lo despligue en la vps.
/* ¿Implicaciones de Seguridad?
Esto significa que si la seguridad de tu servidor Redis se ve comprometida (por ejemplo, si un atacante obtiene acceso a tu servidor donde corre Redis), podría leer los datos de las sesiones de tus usuarios. Por lo tanto, es crucial:

Asegurar tu servidor Redis: Configura contraseñas fuertes para Redis, restringe el acceso al puerto de Redis (6379) solo a tu aplicación Node.js y a las IPs de administración, y no lo expongas directamente a Internet.
No almacenar información extremadamente sensible en la sesión: Para datos como contraseñas o números de tarjetas de crédito (que nunca deberían guardarse de forma legible en ningún sitio), no los guardes en la sesión. La sesión es para el estado de login y preferencias de usuario, no para datos bancarios.
Así que, tu observación es muy pertinente. El SESSION_SECRET no encripta el contenido de la sesión guardado en Redis, sino que se centra en proteger la integridad y autenticidad del identificador de sesión que se envía en la cookie al cliente. */