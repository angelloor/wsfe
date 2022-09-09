import { verifyToken } from '../../../utils/jwt';
import { _messages } from '../../../utils/message/message';
import { MailServer } from './mail_server.class';

export const validation = (
	mail_server: MailServer,
	url: string,
	token: string
) => {
	return new Promise<MailServer | MailServer[] | boolean | any>(
		async (resolve, reject) => {
			/**
			 * Capa de Autentificación con el token
			 */
			let validationStatus: boolean = false;

			if (token) {
				await verifyToken(token)
					.then(async () => {
						/**
						 * Capa de validaciones
						 */
						if (url == '/create' || url == '/update') {
							attributeValidate(
								'id_user_',
								mail_server.id_user_,
								'number',
								10
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'id_mail_server',
								mail_server.id_mail_server,
								'number',
								2
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'type_mail_server',
								mail_server.type_mail_server,
								'string',
								9
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'host_mail_server',
								mail_server.host_mail_server,
								'string',
								67
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'port_mail_server',
								mail_server.port_mail_server,
								'number',
								5
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'secure_mail_server',
								mail_server.secure_mail_server,
								'boolean'
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'user_mail_server',
								mail_server.user_mail_server,
								'string',
								320
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'password_mail_server',
								mail_server.password_mail_server,
								'string',
								250
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'status_mail_server',
								mail_server.status_mail_server,
								'boolean'
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						/**
						 * Validation taxpayer
						 */

						if (url == '/update') {
							attributeValidate(
								'id_taxpayer',
								mail_server.taxpayer.id_taxpayer,
								'number',
								5
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						/**
						 * Continuar solo si no ocurrio errores en la validación
						 */
						if (!validationStatus) {
							/**
							 * Instance the class
							 */
							const _mail_server = new MailServer();
							/**
							 * Execute the url depending on the path
							 */
							if (url == '/create') {
								/** set required attributes for action */
								_mail_server.id_user_ = mail_server.id_user_;
								_mail_server.taxpayer = mail_server.taxpayer;
								await _mail_server
									.create()
									.then((_mailServer: MailServer) => {
										resolve(_mailServer);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 5) == '/read') {
								/** set required attributes for action */
								_mail_server.host_mail_server = mail_server.host_mail_server;
								await _mail_server
									.read()
									.then((_mailServers: MailServer[]) => {
										resolve(_mailServers);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 15) == '/byTaxpayerRead') {
								/** set required attributes for action */
								_mail_server.host_mail_server = mail_server.host_mail_server;
								_mail_server.taxpayer = mail_server.taxpayer;
								await _mail_server
									.byTaxpayerRead()
									.then((_mailServers: MailServer[]) => {
										resolve(_mailServers);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 13) == '/specificRead') {
								/** set required attributes for action */
								_mail_server.id_mail_server = mail_server.id_mail_server;
								await _mail_server
									.specificRead()
									.then((_mailServer: MailServer) => {
										resolve(_mailServer);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url == '/update') {
								/** set required attributes for action */
								_mail_server.id_user_ = mail_server.id_user_;
								_mail_server.id_mail_server = mail_server.id_mail_server;
								_mail_server.taxpayer = mail_server.taxpayer;
								_mail_server.type_mail_server = mail_server.type_mail_server;
								_mail_server.host_mail_server = mail_server.host_mail_server;
								_mail_server.port_mail_server = mail_server.port_mail_server;
								_mail_server.secure_mail_server =
									mail_server.secure_mail_server;
								_mail_server.user_mail_server = mail_server.user_mail_server;
								_mail_server.password_mail_server =
									mail_server.password_mail_server;
								_mail_server.status_mail_server =
									mail_server.status_mail_server;
								await _mail_server
									.update()
									.then((_mailServer: MailServer) => {
										resolve(_mailServer);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 7) == '/delete') {
								/** set required attributes for action */
								_mail_server.id_user_ = mail_server.id_user_;
								_mail_server.id_mail_server = mail_server.id_mail_server;
								await _mail_server
									.delete()
									.then((response: boolean) => {
										resolve(response);
									})
									.catch((error: any) => {
										reject(error);
									});
							}
						}
					})
					.catch((error) => {
						reject(error);
					});
			} else {
				reject(_messages[5]);
			}
		}
	);
};

/**
 * Función para validar un campo de acuerdo a los criterios ingresados
 * @param attribute nombre del atributo a validar
 * @param value valor a validar
 * @param type tipo de dato correcto del atributo (string, number, boolean, object)
 * @param _length longitud correcta del atributo
 * @returns true || error
 */
const attributeValidate = (
	attribute: string,
	value: any,
	type: string,
	_length: number = 0
) => {
	return new Promise<Boolean>((resolve, reject) => {
		if (value != undefined || value != null) {
			if (typeof value == `${type}`) {
				if (typeof value == 'string' || typeof value == 'number') {
					if (value.toString().length > _length) {
						reject({
							..._messages[8],
							description: _messages[8].description
								.replace('_nombreCampo', `${attribute}`)
								.replace('_caracteresEsperados', `${_length}`),
						});
					} else {
						resolve(true);
					}
				} else {
					resolve(true);
				}
			} else {
				reject({
					..._messages[7],
					description: _messages[7].description
						.replace('_nombreCampo', `${attribute}`)
						.replace('_tipoEsperado', `${type}`),
				});
			}
		} else {
			reject({
				..._messages[6],
				description: _messages[6].description.replace(
					'_nombreCampo',
					`${attribute}`
				),
			});
		}
	});
};
