import { verifyToken } from '../../../utils/jwt';
import { _messages } from '../../../utils/message/message';
import { Validation } from '../validation/validation.class';
import { view_validation_inner_company_user } from '../validation/validation.store';
import { Auth } from './auth.class';
import { auth_check_session } from './auth.store';
import { AppInitialData, Session } from './auth.types';

export const validation = (
	dataLogin: Auth,
	url: string,
	session: Session = { host: '' }
) => {
	return new Promise<any>(async (resolve, reject) => {
		/**
		 * Capa de validaciones
		 */
		if (
			url == '/sign-in' ||
			url == '/unlock-session' ||
			url == '/reset-password'
		) {
			/** User Validation */
			if (dataLogin.name_user) {
				if (typeof dataLogin.name_user == 'string') {
					if (dataLogin.name_user.toString().length > 320) {
						reject({
							..._messages[8],
							description: _messages[8].description
								.replace('_nombreCampo', 'name_user')
								.replace('_caracteresEsperados', '320'),
						});
					}
				} else {
					reject({
						..._messages[7],
						description: _messages[7].description
							.replace('_nombreCampo', 'name_user')
							.replace('_tipoEsperado', 'string'),
					});
				}
			} else {
				reject({
					..._messages[6],
					description: _messages[6].description.replace(
						'_nombreCampo',
						'name_user'
					),
				});
			}
			/**
			 * Password Validation
			 * Validated all except unlock-session
			 */
			if (url != '/unlock-session') {
				if (dataLogin.password_user) {
					if (typeof dataLogin.password_user == 'string') {
						if (dataLogin.password_user.toString().length > 250) {
							reject({
								..._messages[8],
								description: _messages[8].description
									.replace('_nombreCampo', 'password_user')
									.replace('_caracteresEsperados', '250'),
							});
						}
					} else {
						reject({
							..._messages[7],
							description: _messages[7].description
								.replace('_nombreCampo', 'password_user')
								.replace('_tipoEsperado', 'string'),
						});
					}
				} else {
					reject({
						..._messages[6],
						description: _messages[6].description.replace(
							'_nombreCampo',
							'password_user'
						),
					});
				}
			}
		}

		if (url == '/refresh-access-token') {
			/**
			 * Token Validation
			 */
			if (dataLogin.access_token) {
				if (typeof dataLogin.access_token != 'string') {
					reject({
						..._messages[7],
						description: _messages[7].description
							.replace('_nombreCampo', 'access_token')
							.replace('_tipoEsperado', 'string'),
					});
				}
			} else {
				reject({
					..._messages[6],
					description: _messages[6].description.replace(
						'_nombreCampo',
						'access_token'
					),
				});
			}
			/**
			 * Expiration token Validation
			 */
			if (dataLogin.expiration_token) {
				if (typeof dataLogin.expiration_token != 'string') {
					reject({
						..._messages[7],
						description: _messages[7].description
							.replace('_nombreCampo', 'expiration_token')
							.replace('_tipoEsperado', 'string'),
					});
				}
			} else {
				reject({
					..._messages[6],
					description: _messages[6].description.replace(
						'_nombreCampo',
						'_tipoEsperado'
					),
				});
			}
		}

		if (url == '/sign-out' || url == '/check-session') {
			/**
			 * Token Validation
			 */
			if (dataLogin.access_token) {
				if (typeof dataLogin.access_token != 'string') {
					reject({
						..._messages[7],
						description: _messages[7].description
							.replace('_nombreCampo', 'access_token')
							.replace('_tipoEsperado', 'string'),
					});
				}
			} else {
				reject({
					..._messages[6],
					description: _messages[6].description.replace(
						'_nombreCampo',
						'access_token'
					),
				});
			}
		}
		/**
		 * Instance SecurityCap
		 */
		if (url == '/reset-password') {
			/**
			 * ExpReg Validation Password Pattern
			 */
			await view_validation_inner_company_user(
				'validationPassword',
				dataLogin.name_user,
				dataLogin.password_user
			).then((validation: Validation) => {
				/**
				 * Parse to String RegExp to RegExp
				 */
				if (validation != undefined && validation.pattern_validation) {
					let validationPasswordRegExp = new RegExp(
						validation.pattern_validation!
					);
					if (
						!validationPasswordRegExp.test(validation.password_user_decrypt)
					) {
						reject({
							..._messages[9],
							description: _messages[9].description.replace(
								'_formatoEstablecido',
								validation.message_validation!
							),
						});
					}
				}
			});
		}
		/**
		 * Instance the class
		 */
		let _auth = new Auth();
		/**
		 * Execute the action depending of url route
		 */
		if (url == '/sign-in') {
			_auth.name_user = dataLogin.name_user;
			_auth.password_user = dataLogin.password_user;
			await _auth
				.signIn(session)
				.then((response: AppInitialData) => {
					resolve(response);
				})
				.catch((err) => {
					reject(err);
				});
		} else if (url == '/refresh-access-token') {
			_auth.access_token = dataLogin.access_token;
			_auth.expiration_token = dataLogin.expiration_token;
			await _auth
				.signInUsingToken()
				.then((response: AppInitialData) => {
					resolve(response);
				})
				.catch((err) => {
					reject(err);
				});
		} else if (url == '/unlock-session') {
			_auth.name_user = dataLogin.name_user;
			_auth.password_user = dataLogin.password_user;
			await _auth
				.unlockSession(session)
				.then((response: AppInitialData) => {
					resolve(response);
				})
				.catch((err: any) => {
					reject(err);
				});
		} else if (url == '/check-session') {
			if (dataLogin.access_token) {
				await verifyToken(dataLogin.access_token)
					.then(async (decoded: any) => {
						/**
						 * Verificación de la session (host, agent)
						 */
						await auth_check_session(decoded.id_session, session)
							.then((response: boolean) => {
								resolve(response);
							})
							.catch((error: any) => {
								reject(error);
							});
					})
					.catch((error) => {
						reject(error);
					});
			} else {
				reject(_messages[5]);
			}
			await _auth
				.unlockSession(session)
				.then((response: AppInitialData) => {
					resolve(response);
				})
				.catch((err: any) => {
					reject(err);
				});
		} else if (url == '/sign-out') {
			if (dataLogin.access_token) {
				await verifyToken(dataLogin.access_token)
					.then(async (decoded: any) => {
						/**
						 * Verificación de la session (host, agent)
						 */
						await auth_check_session(decoded.id_session, session)
							.then(async (response: boolean) => {
								if (response) {
									await _auth
										.signOut(decoded.name_user, decoded.id_session)
										.then((response: boolean) => {
											resolve(response);
										})
										.catch((err: any) => {
											reject(err);
										});
								}
							})
							.catch((error: any) => {
								reject(error);
							});
					})
					.catch((error) => {
						reject(error);
					});
			} else {
				reject(_messages[5]);
			}
		} else if (url == '/forgot-password') {
			_auth.name_user = dataLogin.name_user;
			await _auth
				.forgotPassword()
				.then((response) => {
					resolve(response);
				})
				.catch((err: any) => {
					reject(err);
				});
		} else if (url == '/reset-password') {
			_auth.name_user = dataLogin.name_user;
			_auth.password_user = dataLogin.password_user;
			await _auth
				.resetPassword()
				.then((response) => {
					resolve(response);
				})
				.catch((err: any) => {
					reject(err);
				});
		} else if (url == '/sign-up') {
			resolve('/sign-up');
		} else if (url == '/confirmation-required') {
			resolve('/confirmation-required');
		}
	});
};
/**
 * getSession
 * @param req
 * @returns Session
 */
export const getSession = (req: any): Session => {
	return {
		host: req.headers.host,
		agent: {
			browser: req.useragent.browser,
			version: req.useragent.version,
			os: req.useragent.os,
			platform: req.useragent.platform,
			source: req.useragent.source,
		},
	};
};
