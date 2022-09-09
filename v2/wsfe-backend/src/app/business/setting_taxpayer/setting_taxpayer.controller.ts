import fs from 'fs';
import path from 'path';
import { verifyToken } from '../../../utils/jwt';
import { _messages } from '../../../utils/message/message';
import { SettingTaxpayer } from './setting_taxpayer.class';

export const validation = (
	setting_taxpayer: SettingTaxpayer,
	url: string,
	token: string
) => {
	return new Promise<SettingTaxpayer | SettingTaxpayer[] | boolean | any>(
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
								setting_taxpayer.id_user_,
								'number',
								10
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'id_setting_taxpayer',
								setting_taxpayer.id_setting_taxpayer,
								'number',
								5
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'mailing_setting_taxpayer',
								setting_taxpayer.mailing_setting_taxpayer,
								'boolean'
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'from_setting_taxpayer',
								setting_taxpayer.from_setting_taxpayer,
								'string',
								250
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'subject_setting_taxpayer',
								setting_taxpayer.subject_setting_taxpayer,
								'string',
								250
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'html_setting_taxpayer',
								setting_taxpayer.html_setting_taxpayer,
								'string',
								999999999999999
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'download_note_setting_taxpayer',
								setting_taxpayer.download_note_setting_taxpayer,
								'string',
								500
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'logo_path_setting_taxpayer',
								setting_taxpayer.logo_path_setting_taxpayer,
								'string',
								100
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						/**
						 * Validation mailServer
						 */

						if (
							url == '/update' &&
							setting_taxpayer.mail_server.id_mail_server != null
						) {
							attributeValidate(
								'id_mail_server',
								setting_taxpayer.mail_server.id_mail_server,
								'number',
								2
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
							const _setting_taxpayer = new SettingTaxpayer();
							/**
							 * Execute the url depending on the path
							 */
							if (url.substring(0, 5) == '/read') {
								/** set required attributes for action */
								_setting_taxpayer.html_setting_taxpayer =
									setting_taxpayer.html_setting_taxpayer;
								await _setting_taxpayer
									.read()
									.then((_settingTaxpayers: SettingTaxpayer[]) => {
										resolve(_settingTaxpayers);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 13) == '/specificRead') {
								/** set required attributes for action */
								_setting_taxpayer.id_setting_taxpayer =
									setting_taxpayer.id_setting_taxpayer;
								await _setting_taxpayer
									.specificRead()
									.then((_settingTaxpayer: SettingTaxpayer) => {
										resolve(_settingTaxpayer);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url == '/update') {
								/** set required attributes for action */
								_setting_taxpayer.id_user_ = setting_taxpayer.id_user_;
								_setting_taxpayer.id_setting_taxpayer =
									setting_taxpayer.id_setting_taxpayer;
								_setting_taxpayer.mail_server = setting_taxpayer.mail_server;
								_setting_taxpayer.mailing_setting_taxpayer =
									setting_taxpayer.mailing_setting_taxpayer;
								_setting_taxpayer.from_setting_taxpayer =
									setting_taxpayer.from_setting_taxpayer;
								_setting_taxpayer.subject_setting_taxpayer =
									setting_taxpayer.subject_setting_taxpayer;
								_setting_taxpayer.html_setting_taxpayer =
									setting_taxpayer.html_setting_taxpayer;
								_setting_taxpayer.download_note_setting_taxpayer =
									setting_taxpayer.download_note_setting_taxpayer;
								_setting_taxpayer.logo_path_setting_taxpayer =
									setting_taxpayer.logo_path_setting_taxpayer;
								await _setting_taxpayer
									.update()
									.then((_settingTaxpayer: SettingTaxpayer) => {
										resolve(_settingTaxpayer);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url == '/uploadLogo') {
								/** set required attributes for action */
								_setting_taxpayer.id_user_ = setting_taxpayer.id_user_;
								_setting_taxpayer.id_setting_taxpayer =
									setting_taxpayer.id_setting_taxpayer;
								await _setting_taxpayer
									.uploadLogo()
									.then((response: any) => {
										resolve(response);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url == '/removeLogo') {
								/** set required attributes for action */
								_setting_taxpayer.id_user_ = setting_taxpayer.id_user_;
								_setting_taxpayer.id_setting_taxpayer =
									setting_taxpayer.id_setting_taxpayer;
								await _setting_taxpayer
									.removeLogo()
									.then((response: any) => {
										resolve(response);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url == '/downloadLogo') {
								/**
								 * Armar el path final
								 */
								const pathBase: string = path.resolve('./');

								const logoPathBase: string =
									_setting_taxpayer.logo_path_base.substring(
										1,
										_setting_taxpayer.logo_path_base.length
									);

								const pathFinal = `${pathBase}${logoPathBase}/${setting_taxpayer.logo_path_setting_taxpayer}`;
								/**
								 * Si existe el comprobante segun el path, resolvemos el path Final
								 */
								if (
									setting_taxpayer.logo_path_setting_taxpayer != '' &&
									fs.existsSync(pathFinal)
								) {
									resolve(pathFinal);
								} else {
									reject('No se encontro el recurso!');
								}
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
