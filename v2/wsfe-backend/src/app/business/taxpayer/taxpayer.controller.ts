import fs from 'fs';
import path from 'path';
import { verifyToken } from '../../../utils/jwt';
import { _messages } from '../../../utils/message/message';
import { Taxpayer } from './taxpayer.class';

export const validation = (taxpayer: Taxpayer, url: string, token: string) => {
	return new Promise<Taxpayer | Taxpayer[] | boolean | any>(
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
						if (
							url == '/create' ||
							url == '/update' ||
							url == '/changeStatusByBatchTaxpayer'
						) {
							attributeValidate(
								'id_user_',
								taxpayer.id_user_,
								'number',
								10
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update' || url == '/changeStatusByBatchTaxpayer') {
							attributeValidate(
								'id_taxpayer',
								taxpayer.id_taxpayer,
								'number',
								5
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'id_company',
								taxpayer.company.id_company,
								'number',
								5
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'type_emission',
								taxpayer.type_emission,
								'string',
								1
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'business_name_taxpayer',
								taxpayer.business_name_taxpayer,
								'string',
								300
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'tradename_taxpayer',
								taxpayer.tradename_taxpayer,
								'string',
								300
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'ruc_taxpayer',
								taxpayer.ruc_taxpayer,
								'string',
								13
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'dir_matriz_taxpayer',
								taxpayer.dir_matriz_taxpayer,
								'string',
								300
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'signature_password_taxpayer',
								taxpayer.signature_password_taxpayer,
								'string',
								250
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'signature_path_taxpayer',
								taxpayer.signature_path_taxpayer,
								'string',
								250
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'status_taxpayer',
								taxpayer.status_taxpayer,
								'boolean'
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'accounting_obliged',
								taxpayer.accounting_obliged,
								'string',
								2
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update' || url == '/changeStatusByBatchTaxpayer') {
							attributeValidate(
								'status_by_batch_taxpayer',
								taxpayer.status_by_batch_taxpayer,
								'boolean'
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						/**
						 * User
						 */
						if (url == '/update') {
							attributeValidate(
								'id_user',
								taxpayer.user.id_user,
								'number',
								10
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'name_user',
								taxpayer.user.name_user,
								'string',
								320
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'password_user',
								taxpayer.user.password_user,
								'string',
								250
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'avatar_user',
								taxpayer.user.avatar_user,
								'string',
								50
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'status_user',
								taxpayer.user.status_user,
								'boolean'
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						/**
						 * Validation person
						 */

						if (url == '/update') {
							attributeValidate(
								'id_person',
								taxpayer.user.person.id_person,
								'number',
								10
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'id_academic',
								taxpayer.user.person.academic.id_academic,
								'number',
								10
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'title_academic',
								taxpayer.user.person.academic.title_academic,
								'string',
								250
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'abbreviation_academic',
								taxpayer.user.person.academic.abbreviation_academic,
								'string',
								50
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'nivel_academic',
								taxpayer.user.person.academic.nivel_academic,
								'string',
								100
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'id_job',
								taxpayer.user.person.job.id_job,
								'number',
								10
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'name_job',
								taxpayer.user.person.job.name_job,
								'string',
								200
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'address_job',
								taxpayer.user.person.job.address_job,
								'string',
								200
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'phone_job',
								taxpayer.user.person.job.phone_job,
								'string',
								13
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'position_job',
								taxpayer.user.person.job.position_job,
								'string',
								150
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'dni_person',
								taxpayer.user.person.dni_person,
								'string',
								20
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'name_person',
								taxpayer.user.person.name_person,
								'string',
								150
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'last_name_person',
								taxpayer.user.person.last_name_person,
								'string',
								150
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'address_person',
								taxpayer.user.person.address_person,
								'string',
								150
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'phone_person',
								taxpayer.user.person.phone_person,
								'string',
								13
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						/**
						 * Validation type_user
						 */

						if (url == '/update') {
							attributeValidate(
								'id_type_user',
								taxpayer.user.type_user.id_type_user,
								'number',
								5
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						/**
						 * Validation id_setting_taxpayer
						 */

						if (url == '/update') {
							attributeValidate(
								'id_setting_taxpayer',
								taxpayer.setting_taxpayer.id_setting_taxpayer,
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
							const _taxpayer = new Taxpayer();
							/**
							 * Execute the url depending on the path
							 */
							if (url == '/create') {
								/** set required attributes for action */
								_taxpayer.id_user_ = taxpayer.id_user_;
								await _taxpayer
									.create()
									.then((_taxpayer: Taxpayer) => {
										resolve(_taxpayer);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 5) == '/read') {
								/** set required attributes for action */
								_taxpayer.business_name_taxpayer =
									taxpayer.business_name_taxpayer;
								await _taxpayer
									.read()
									.then((_taxpayers: Taxpayer[]) => {
										resolve(_taxpayers);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 13) == '/specificRead') {
								/** set required attributes for action */
								_taxpayer.id_taxpayer = taxpayer.id_taxpayer;
								await _taxpayer
									.specificRead()
									.then((_taxpayer: Taxpayer) => {
										resolve(_taxpayer);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url == '/update') {
								/** set required attributes for action */
								_taxpayer.id_user_ = taxpayer.id_user_;
								_taxpayer.id_taxpayer = taxpayer.id_taxpayer;
								_taxpayer.company = taxpayer.company;
								_taxpayer.user = taxpayer.user;
								_taxpayer.setting_taxpayer = taxpayer.setting_taxpayer;
								_taxpayer.type_emission = taxpayer.type_emission;
								_taxpayer.business_name_taxpayer =
									taxpayer.business_name_taxpayer;
								_taxpayer.tradename_taxpayer = taxpayer.tradename_taxpayer;
								_taxpayer.ruc_taxpayer = taxpayer.ruc_taxpayer;
								_taxpayer.dir_matriz_taxpayer = taxpayer.dir_matriz_taxpayer;
								_taxpayer.signature_password_taxpayer =
									taxpayer.signature_password_taxpayer;
								_taxpayer.signature_path_taxpayer =
									taxpayer.signature_path_taxpayer;
								_taxpayer.status_taxpayer = taxpayer.status_taxpayer;
								_taxpayer.accounting_obliged = taxpayer.accounting_obliged;
								_taxpayer.status_by_batch_taxpayer =
									taxpayer.status_by_batch_taxpayer;
								await _taxpayer
									.update()
									.then((_taxpayer: Taxpayer) => {
										resolve(_taxpayer);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url == '/changeStatusByBatchTaxpayer') {
								/** set required attributes for action */
								_taxpayer.id_user_ = taxpayer.id_user_;
								_taxpayer.id_taxpayer = taxpayer.id_taxpayer;
								_taxpayer.status_by_batch_taxpayer =
									taxpayer.status_by_batch_taxpayer;
								await _taxpayer
									.changeStatusByBatchTaxpayer(_taxpayer)
									.then((response: boolean) => {
										resolve(response);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 7) == '/delete') {
								/** set required attributes for action */
								_taxpayer.id_user_ = taxpayer.id_user_;
								_taxpayer.id_taxpayer = taxpayer.id_taxpayer;
								await _taxpayer
									.delete()
									.then((response: boolean) => {
										resolve(response);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url == '/uploadSignature') {
								/** set required attributes for action */
								_taxpayer.id_user_ = taxpayer.id_user_;
								_taxpayer.id_taxpayer = taxpayer.id_taxpayer;
								await _taxpayer
									.uploadSignature()
									.then((response: any) => {
										resolve(response);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url == '/removeSignature') {
								/** set required attributes for action */
								_taxpayer.id_user_ = taxpayer.id_user_;
								_taxpayer.id_taxpayer = taxpayer.id_taxpayer;
								await _taxpayer
									.removeSignature()
									.then((response: any) => {
										resolve(response);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 18) == '/downloadSignature') {
								/**
								 * Armar el path final
								 */
								const pathBase: string = path.resolve('./');

								const signaturePathBase: string =
									_taxpayer.signature_path_base.substring(
										1,
										_taxpayer.signature_path_base.length
									);

								const pathFinal = `${pathBase}${signaturePathBase}/${taxpayer.signature_path_taxpayer}`;
								/**
								 * Si existe el comprobante segun el path, resolvemos el path Final
								 */
								if (
									taxpayer.signature_path_taxpayer != '' &&
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
