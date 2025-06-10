const nodemailer = require('nodemailer');
require('dotenv').config();
//console.log(process.env)
// --- Configuración de Email (AJUSTA ESTO CON TUS DATOS REALES) ---
// Es crucial que esta configuración coincida con la que usas en config/config.js
// Asegúrate de que 'user' sea tu correo de Gmail y 'pass' sea tu contraseña de aplicación (si usas 2FA).
const emailConfig = {
    host: 'smtp.gmail.com', // O el host de tu proveedor de email
    port: 587,
    secure: false, // true para puerto 465, false para otros como 587
    auth: {
        user: process.env.EMAIL, // <-- ¡CAMBIA ESTO! Tu dirección de correo
        pass: process.env.PASSEMAIL//'edarauhwijpipdrq' // <-- ¡CAMBIA ESTO! Tu contraseña de aplicación (sin espacios) o tu contraseña normal
    },
    // Opcional: Para entornos de desarrollo donde el certificado SSL puede dar problemas
    // tls: {
    //     rejectUnauthorized: false
    // }
};

// Crear un transportador de Nodemailer
const transporter = nodemailer.createTransport(emailConfig);

/**
 * Función para enviar un correo electrónico de prueba.
 * @param {string} recipientEmail - La dirección de correo del destinatario.
 * @param {string} subject - El asunto del correo.
 * @param {string} htmlContent - El contenido HTML del correo.
 * @returns {boolean} True si el correo se envió exitosamente, false en caso contrario.
 */
const sendTestEmail = async (recipientEmail, subject, htmlContent) => {
    try {
        let info = await transporter.sendMail({
            from: `"Test de Aplicación" <${emailConfig.auth.user}>`, // Remitente
            to: recipientEmail, // Destinatario
            subject: subject, // Asunto
            html: htmlContent, // Contenido HTML
        });

        console.log(`Correo de prueba enviado a ${recipientEmail}`);
        console.log("ID del mensaje:", info.messageId);
        console.log("Vista previa URL (si disponible):", nodemailer.getTestMessageUrl(info));
        return true;
    } catch (error) {
        console.error(`Error al enviar correo de prueba a ${recipientEmail}:`, error);
        return false;
    }
};

// --- Uso de la función de prueba ---
// Define el correo al que quieres enviar el test
const testRecipient = 'mpirizdutra@gmail.com'; // <-- ¡CAMBIA ESTO! Un correo al que tengas acceso para verificar

const testSubject = "Correo de Prueba desde Node.js";
const testHtml = `
    <h1>¡Hola, Martin!</h1>
    <p>Este es un correo de prueba enviado desde tu script Node.js.</p>
    <p>Si recibes esto, ¡significa que la configuración de tu email es correcta!</p>
    <p>Saludos,</p>
    <p>Tu Aplicación</p>
`;

// Llama a la función para enviar el correo de prueba
sendTestEmail(testRecipient, testSubject, testHtml)
    .then(success => {
        if (success) {
            console.log("El script de prueba de correo se ejecutó con éxito.");
        } else {
            console.log("El script de prueba de correo encontró un error.");
        }
    })
    .catch(error => {
        console.error("Error inesperado en el script de prueba:", error);
    });

