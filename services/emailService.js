const nodemailer = require('nodemailer');
const config = require('../config/config');

// Crear un transportador de Nodemailer
const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass
    }
    // Opcional: Desactivar la verificación de certificado SSL si estás usando un servidor local o de prueba con certificados auto-firmados
    // tls: {
    //     rejectUnauthorized: false
    // }
});

const sendVerificationEmail = async (userEmail, verificationLink) => {
    try {
        await transporter.sendMail({
            from: `"Artesanos.mpd" <${config.email.auth.user}>`, // Remitente
            to: userEmail, // Lista de destinatarios
            subject: "Confirma tu Correo Electrónico", // Asunto
            html: `
                <p>Hola,</p>
                <p>Gracias por registrarte en nuestra aplicación. Por favor, confirma tu dirección de correo electrónico haciendo clic en el siguiente enlace:</p>
                <p><a href="${verificationLink}">Confirmar Correo Electrónico</a></p>
                <p>Este enlace expirará en 1 hora.</p>
                <p>Si no te registraste en nuestra aplicación, por favor ignora este correo.</p>
                <p>Saludos,</p>
                
            `, // Contenido HTML del correo
        });
        console.log(`Correo de verificación enviado a ${userEmail}`);
        return true;
    } catch (error) {
        console.error(`Error al enviar correo de verificación a ${userEmail}:`, error);
        return false;
    }
};

module.exports = {
    sendVerificationEmail
};