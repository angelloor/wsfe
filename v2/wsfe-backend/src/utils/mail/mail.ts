import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Attachments, Mail } from './mail.types';
/**
 * sendMail
 * @param message
 * @param _SMTPTransport
 * @returns
 */
export const sendMail = (
	message: Mail,
	_SMTPTransport: SMTPTransport | any = {
		host: process.env.MAILER_HOST,
		port: parseInt(`${process.env.MAILER_PORT}`),
		secure: false,
		auth: {
			user: process.env.MAILER_USER,
			pass: process.env.MAILER_PASSWORD,
		},
	}
): Promise<string> => {
	return new Promise<string>((resolve, reject) => {
		try {
			/**
			 * Crear transporter con la configuración del app.config -> Nota: Si la integracion es
			 * con gmail se debe poner la clave de aplicaciones en el password y el secure es igual a true
			 * Ejemplo:
			 * host: 'smtp.gmail.com'
			 * port: 465
			 * secure: true
			 * user: 'angelloor.dev@gmail.com'
			 * password: 'kyiufepifrcassms'
			 */
			const transporter = nodemailer.createTransport(_SMTPTransport);
			/**
			 * sending
			 */
			transporter
				.sendMail(message)
				.then(() => {
					resolve(`MessageAPI: email sent to ${message.to}`);
				})
				.catch((error: any) => {
					reject(error.toString());
				});
		} catch (error: any) {
			reject(error.toString());
		}
	});
};
/**
 * generateMail
 * @param mail
 * @param subject
 * @param html
 * @param attachments
 * @returns string
 */
export const generateMail = (
	from: string,
	mail: string,
	subject: string,
	html: string,
	attachments: Attachments[] = []
): Mail => {
	return {
		from: from,
		to: mail,
		subject: subject,
		html: html,
		attachments: attachments,
	};
};

// /**
//  * Enviar el correo al administrador del Api
//  */
// export const sendMailAdmin = (correo, body, data, Subject) => {
// 	return new Promise(async (resolve, reject) => {
// 		let mensaje = {
// 			from: `"GADMCP" <${process.env.MAILER_USER}>`,
// 			to: correo,
// 			subject: Subject,
// 			html: `
//             <div style='color: #500050'>
//             <strong>Estimado(a),</strong><br>
//             Administrador<br><br>
//             Información del proceso<br>
//             <strong>Institución: </strong> ${body.institucion}<br>
//             <strong>Fecha: </strong> ${body.fecha}<br>
//             <br>
//             Adjunto la respuesta del servidor en formato: <strong>JSON</strong>
//         `,
// 			attachments: [
// 				{
// 					filename: `${Math.floor(Math.random() * 100)}_${body.fecha}.json`,
// 					content: JSON.stringify(data),
// 				},
// 			],
// 		};
// 		await transporterMail(mensaje)
// 			.then((response) => {
// 				resolve(response);
// 			})
// 			.catch((error) => {
// 				reject(error);
// 			});
// 	});
// };
