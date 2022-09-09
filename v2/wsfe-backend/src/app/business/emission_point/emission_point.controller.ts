import { verifyToken } from '../../../utils/jwt';
import { _messages } from '../../../utils/message/message';
import { EmissionPoint } from './emission_point.class';

export const validation = (
	emission_point: EmissionPoint,
	url: string,
	token: string
) => {
	return new Promise<EmissionPoint | EmissionPoint[] | boolean | any>(
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
								emission_point.id_user_,
								'number',
								10
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'id_emission_point',
								emission_point.id_emission_point,
								'number',
								5
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'value_emission_point',
								emission_point.value_emission_point,
								'string',
								3
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'description_emission_point',
								emission_point.description_emission_point,
								'string',
								250
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
								emission_point.taxpayer.id_taxpayer,
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
							const _emission_point = new EmissionPoint();
							/**
							 * Execute the url depending on the path
							 */
							if (url == '/create') {
								/** set required attributes for action */
								_emission_point.id_user_ = emission_point.id_user_;
								_emission_point.taxpayer = emission_point.taxpayer;
								await _emission_point
									.create()
									.then((_emissionPoint: EmissionPoint) => {
										resolve(_emissionPoint);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 5) == '/read') {
								/** set required attributes for action */
								_emission_point.value_emission_point =
									emission_point.value_emission_point;
								await _emission_point
									.read()
									.then((_emissionPoints: EmissionPoint[]) => {
										resolve(_emissionPoints);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 15) == '/byTaxpayerRead') {
								/** set required attributes for action */
								_emission_point.taxpayer = emission_point.taxpayer;
								_emission_point.value_emission_point =
									emission_point.value_emission_point;
								await _emission_point
									.byTaxpayerRead()
									.then((_emissionPoints: EmissionPoint[]) => {
										resolve(_emissionPoints);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 13) == '/specificRead') {
								/** set required attributes for action */
								_emission_point.id_emission_point =
									emission_point.id_emission_point;
								await _emission_point
									.specificRead()
									.then((_emissionPoint: EmissionPoint) => {
										resolve(_emissionPoint);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url == '/update') {
								/** set required attributes for action */
								_emission_point.id_user_ = emission_point.id_user_;
								_emission_point.id_emission_point =
									emission_point.id_emission_point;
								_emission_point.taxpayer = emission_point.taxpayer;
								_emission_point.value_emission_point =
									emission_point.value_emission_point;
								_emission_point.description_emission_point =
									emission_point.description_emission_point;
								await _emission_point
									.update()
									.then((_emissionPoint: EmissionPoint) => {
										resolve(_emissionPoint);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 7) == '/delete') {
								/** set required attributes for action */
								_emission_point.id_user_ = emission_point.id_user_;
								_emission_point.id_emission_point =
									emission_point.id_emission_point;
								await _emission_point
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
