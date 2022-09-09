import { verifyToken } from '../../../utils/jwt';
import { _messages } from '../../../utils/message/message';
import { TypeUser } from './type_user.class';

export const validation = (type_user: TypeUser, url: string, token: string) => {
	return new Promise<TypeUser | TypeUser[] | boolean | any>(
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
								type_user.id_user_,
								'number',
								10
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'id_type_user',
								type_user.id_type_user,
								'number',
								5
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'name_type_user',
								type_user.name_type_user,
								'string',
								100
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'description_type_user',
								type_user.description_type_user,
								'string',
								250
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/update') {
							attributeValidate(
								'status_type_user',
								type_user.status_type_user,
								'boolean'
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						/**
						 * Validation company
						 */

						if (url == '/update') {
							attributeValidate(
								'id_company',
								type_user.company.id_company,
								'number',
								5
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						/**
						 * Validation profile
						 */

						if (url == '/update') {
							attributeValidate(
								'id_profile',
								type_user.profile.id_profile,
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
							const _type_user = new TypeUser();
							/**
							 * Execute the url depending on the path
							 */
							if (url == '/create') {
								/** set required attributes for action */
								_type_user.id_user_ = type_user.id_user_;
								await _type_user
									.create()
									.then((_typeUser: TypeUser) => {
										resolve(_typeUser);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 5) == '/read') {
								/** set required attributes for action */
								_type_user.name_type_user = type_user.name_type_user;
								await _type_user
									.read()
									.then((_typeUsers: TypeUser[]) => {
										resolve(_typeUsers);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 13) == '/specificRead') {
								/** set required attributes for action */
								_type_user.id_type_user = type_user.id_type_user;
								await _type_user
									.specificRead()
									.then((_typeUser: TypeUser) => {
										resolve(_typeUser);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url == '/update') {
								/** set required attributes for action */
								_type_user.id_user_ = type_user.id_user_;
								_type_user.id_type_user = type_user.id_type_user;
								_type_user.company = type_user.company;
								_type_user.profile = type_user.profile;
								_type_user.name_type_user = type_user.name_type_user;
								_type_user.description_type_user =
									type_user.description_type_user;
								_type_user.status_type_user = type_user.status_type_user;
								await _type_user
									.update()
									.then((_typeUser: TypeUser) => {
										resolve(_typeUser);
									})
									.catch((error: any) => {
										reject(error);
									});
							} else if (url.substring(0, 7) == '/delete') {
								/** set required attributes for action */
								_type_user.id_user_ = type_user.id_user_;
								_type_user.id_type_user = type_user.id_type_user;
								await _type_user
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
