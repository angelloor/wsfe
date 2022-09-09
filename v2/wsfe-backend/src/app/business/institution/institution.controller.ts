import { verifyToken } from '../../../utils/jwt';
import { _messages } from '../../../utils/message/message';
import { Institution } from './institution.class';

export const validation = (
	institution: Institution,
	url: string,
	token: string
) => {
	return new Promise<Institution | Institution[] | boolean | any>(
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
							url == '/changeStatusByBatchInstitution'
						) {
							attributeValidate(
								'id_user_',
								institution.id_user_,
								'number',
								10
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update' || url == '/changeStatusByBatchInstitution') {
							attributeValidate(
								'id_institution',
								institution.id_institution,
								'number',
								5
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'type_environment',
								institution.type_environment,
								'string',
								1
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'name_institution',
								institution.name_institution,
								'string',
								100
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'description_institution',
								institution.description_institution,
								'string',
								250
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'address_institution',
								institution.address_institution,
								'string',
								300
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'status_institution',
								institution.status_institution,
								'boolean'
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update' || url == '/changeStatusByBatchInstitution') {
							attributeValidate(
								'status_by_batch_institution',
								institution.status_by_batch_institution,
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
								institution.taxpayer.id_taxpayer,
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
							const _institution = new Institution();
							/**
							 * Execute the url depending on the path
							 */
							if (url == '/create') {
								/** set required attributes for action */
								_institution.id_user_ = institution.id_user_;
								_institution.taxpayer = institution.taxpayer;
								await _institution
									.create()
									.then((_institution: Institution) => {
										resolve(_institution);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 5) == '/read') {
								/** set required attributes for action */
								_institution.name_institution = institution.name_institution;
								await _institution
									.read()
									.then((_institutions: Institution[]) => {
										resolve(_institutions);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 15) == '/byTaxpayerRead') {
								/** set required attributes for action */
								_institution.taxpayer = institution.taxpayer;
								_institution.name_institution = institution.name_institution;
								await _institution
									.byTaxpayerRead()
									.then((_institutions: Institution[]) => {
										resolve(_institutions);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 13) == '/specificRead') {
								/** set required attributes for action */
								_institution.id_institution = institution.id_institution;
								await _institution
									.specificRead()
									.then((_institution: Institution) => {
										resolve(_institution);
									})
									.catch((error: string) => {
										reject(error);
									});
							} else if (url == '/update') {
								/** set required attributes for action */
								_institution.id_user_ = institution.id_user_;
								_institution.id_institution = institution.id_institution;
								_institution.taxpayer = institution.taxpayer;
								_institution.type_environment = institution.type_environment;
								_institution.name_institution = institution.name_institution;
								_institution.description_institution =
									institution.description_institution;
								_institution.address_institution =
									institution.address_institution;
								_institution.status_institution =
									institution.status_institution;
								_institution.status_by_batch_institution =
									institution.status_by_batch_institution;
								await _institution
									.update()
									.then((_institution: Institution) => {
										resolve(_institution);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url == '/changeStatusByBatchInstitution') {
								/** set required attributes for action */
								_institution.id_user_ = institution.id_user_;
								_institution.id_institution = institution.id_institution;
								_institution.status_by_batch_institution =
									institution.status_by_batch_institution;
								await _institution
									.changeStatusByBatchInstitution(_institution)
									.then((response: boolean) => {
										resolve(response);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 7) == '/delete') {
								/** set required attributes for action */
								_institution.id_user_ = institution.id_user_;
								_institution.id_institution = institution.id_institution;
								await _institution
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
