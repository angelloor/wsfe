import { verifyToken } from '../../../utils/jwt';
import { _messages } from '../../../utils/message/message';
import { Sequence } from './sequence.class';

export const validation = (sequence: Sequence, url: string, token: string) => {
	return new Promise<Sequence | Sequence[] | boolean | any>(
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
								sequence.id_user_,
								'number',
								10
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'id_sequence',
								sequence.id_sequence,
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
								sequence.type_environment,
								'string',
								1
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'type_voucher',
								sequence.type_voucher,
								'string',
								2
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'number_code_sequence',
								sequence.number_code_sequence,
								'string',
								8
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'status_sequence',
								sequence.status_sequence,
								'boolean'
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						/**
						 * Validation institution
						 */

						if (url == '/update') {
							attributeValidate(
								'id_institution',
								sequence.institution.id_institution,
								'number',
								5
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						/**
						 * Validation establishment
						 */

						if (url == '/update') {
							attributeValidate(
								'id_establishment',
								sequence.establishment.id_establishment,
								'number',
								5
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						/**
						 * Validation emissionPoint
						 */

						if (url == '/update') {
							attributeValidate(
								'id_emission_point',
								sequence.emission_point.id_emission_point,
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
							const _sequence = new Sequence();
							/**
							 * Execute the url depending on the path
							 */
							if (url == '/create') {
								/** set required attributes for action */
								_sequence.id_user_ = sequence.id_user_;
								_sequence.institution = sequence.institution;
								await _sequence
									.create()
									.then((_sequence: Sequence) => {
										resolve(_sequence);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 5) == '/read') {
								/** set required attributes for action */
								_sequence.type_voucher = sequence.type_voucher;
								await _sequence
									.read()
									.then((_sequences: Sequence[]) => {
										resolve(_sequences);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 18) == '/byInstitutionRead') {
								/** set required attributes for action */
								_sequence.type_voucher = sequence.type_voucher;
								_sequence.institution = sequence.institution;
								await _sequence
									.byInstitutionRead()
									.then((_sequences: Sequence[]) => {
										resolve(_sequences);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 13) == '/specificRead') {
								/** set required attributes for action */
								_sequence.id_sequence = sequence.id_sequence;
								await _sequence
									.specificRead()
									.then((_sequence: Sequence) => {
										resolve(_sequence);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url == '/update') {
								/** set required attributes for action */
								_sequence.id_user_ = sequence.id_user_;
								_sequence.id_sequence = sequence.id_sequence;
								_sequence.institution = sequence.institution;
								_sequence.establishment = sequence.establishment;
								_sequence.emission_point = sequence.emission_point;
								_sequence.type_environment = sequence.type_environment;
								_sequence.type_voucher = sequence.type_voucher;
								_sequence.number_code_sequence = sequence.number_code_sequence;
								_sequence.status_sequence = sequence.status_sequence;
								await _sequence
									.update()
									.then((_sequence: Sequence) => {
										resolve(_sequence);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 7) == '/delete') {
								/** set required attributes for action */
								_sequence.id_user_ = sequence.id_user_;
								_sequence.id_sequence = sequence.id_sequence;
								await _sequence
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
