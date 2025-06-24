// models/UserModel.js
const pool = require('../db'); // Importa el pool de conexiones

class AmistadModel {
    static tabla = 'amistad'

    static async findById(id) {
        try {
            const [rows] = await pool.execute(`SELECT * FROM ${AmistadModel.tabla} WHERE idAmistad = ?`, [id]);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar amistad por ID:', error);
            throw error;
        }
    }



    static async AceptarRechazarsolicitud(idAmistad, tipo) {
        try {

            const [result] = await pool.execute(
                `UPDATE ${AmistadModel.tabla} SET estado=?,fecha_respuesta=NOW() WHERE idAmistad=?`,
                [tipo, idAmistad]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al crear una solicitud de amistad:', error);
            throw error;
        }
    }

    static async enviarSolicitudAmistad(solicitanteId, receptorId, mensajeNotificacion) {
        let connection;
        try {

            connection = await pool.getConnection();


            const [rows] = await connection.execute(
                'CALL enviar_solicitud_amistad(?, ?, ?)',
                [solicitanteId, receptorId, mensajeNotificacion]
            );


            const resultData = rows[0];

            if (resultData && resultData.length > 0 && resultData[0].Mensaje) {
                console.log("Procedimiento exitoso:", resultData[0].Mensaje);
                return {
                    success: true,
                    message: resultData[0].Mensaje,
                    idAmistad: resultData[0].idAmistadGenerado,
                    idNotificacionGenerada: resultData[0].idNotificacionGenerada
                };
            } else {

                console.log("Solicitud procesada, pero sin mensaje de éxito esperado.");
                return { success: true, message: "Operación de solicitud de amistad completada." };
            }

        } catch (error) {

            console.error('Error al enviar solicitud de amistad:', error.message);
            return { success: false, message: error.message };

        } finally {

            if (connection) {
                connection.release();
            }
        }
    }


}

module.exports = AmistadModel;



