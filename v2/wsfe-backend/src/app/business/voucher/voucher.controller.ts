import fs from 'fs';
import path from 'path';
import { getCodDocByAccessKey } from '../../../utils/accessKey';
import { checkDateString, FullDate, getFullDate } from '../../../utils/date';
import { deleteAmpersand } from '../../../utils/global';
import { verifyToken } from '../../../utils/jwt';
import { _businessMessages, _messages } from '../../../utils/message/message';
import {
	_typeVoucher,
	BodyVoucher,
	detalle,
	Devolution,
	ResponseAutorizacionComprobante,
	TYPE_ENVIRONMENT,
	TYPE_VOUCHER_ENUM,
	VoucherSQLServer,
} from '../business.types';
import { validationVoucher_01 } from './validations/01';
import { Voucher } from './voucher.class';

export const validation = (voucher: Voucher, url: string, token: string) => {
	return new Promise<Voucher | Voucher[] | boolean | any>(
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
							url == '/recepcionComprobante' ||
							url == '/update' ||
							url == '/cancelVoucher' ||
							url == '/autorizacionComprobante' ||
							url == '/recepcionComprobanteInstantly' ||
							url == '/sendVoucherByBatchByInstitution' ||
							url == '/sendVoucherByBatchByTaxpayer' ||
							url == '/completeProcessByBatchByInstitution' ||
							url == '/completeProcess' ||
							url == '/getBodyVoucher' ||
							url == '/resolveRecepcionComprobante' ||
							url == '/bringVouchersOfSQLServer'
						) {
							attributeValidate(
								'id_user_',
								voucher.id_user_,
								'number',
								10
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/recepcionComprobante') {
							attributeValidate(
								'instantly',
								voucher.instantly,
								'boolean'
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (
							url == '/recepcionComprobante' ||
							url == '/resolveRecepcionComprobante' ||
							url == '/sendVoucherByBatchByInstitution' ||
							url == '/sendVoucherByBatchByTaxpayer' ||
							url == '/completeProcessByBatchByInstitution'
						) {
							attributeValidate(
								'type_voucher',
								voucher.type_voucher,
								'string',
								2
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (
							url == '/recepcionComprobante' ||
							url == '/autorizacionComprobante' ||
							url == '/cancelVoucher' ||
							url == '/reverseCancelVoucher' ||
							url == '/recepcionComprobanteInstantly' ||
							url == '/sendVoucherByBatchByInstitution' ||
							url == '/completeProcess' ||
							url == '/getBodyVoucher' ||
							url == '/resolveRecepcionComprobante' ||
							url == '/bringVouchersOfSQLServer' ||
							url == '/completeProcessByBatchByInstitution'
						) {
							attributeValidate(
								'id_institution',
								voucher.institution.id_institution,
								'number',
								5
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (url == '/sendVoucherByBatchByTaxpayer') {
							attributeValidate(
								'id_taxpayer',
								voucher.institution.taxpayer.id_taxpayer,
								'number',
								5
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (
							url == '/autorizacionComprobante' ||
							url == '/cancelVoucher' ||
							url == '/reverseCancelVoucher' ||
							url == '/recepcionComprobanteInstantly' ||
							url == '/completeProcess' ||
							url == '/getBodyVoucher' ||
							url == '/resolveRecepcionComprobante' ||
							url.substring(0, 16) == '/downloadVoucher'
						) {
							attributeValidate(
								'access_key_voucher',
								voucher.access_key_voucher,
								'string',
								49
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}

						if (
							url == '/sendVoucherByBatchByInstitution' ||
							url == '/sendVoucherByBatchByTaxpayer' ||
							url == '/completeProcessByBatchByInstitution' ||
							url == '/bringVouchersOfSQLServer'
						) {
							attributeValidate(
								'emission_date_voucher',
								voucher.emission_date_voucher,
								'string',
								30
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
							/**
							 * checkDateString
							 */
							await checkDateString(voucher.emission_date_voucher!)
								.then((fullDate: FullDate) => {
									voucher.emission_date_voucher = `${fullDate.fullYear}-${fullDate.month}-${fullDate.day}`;
								})
								.catch(() => {
									validationStatus = true;
									reject({
										..._messages[12],
										description: _messages[12].description.replace(
											'value_date',
											voucher.emission_date_voucher!
										),
									});
								});
						}
						/**
						 * Validation for read methods
						 */
						/**
						 * Validation type_environment
						 */
						if (
							(url.substring(0, 29) == '/byBuyerIdentifierVoucherRead' ||
								url.substring(0, 44) ==
									'/byBuyerIdentifierAndEmissionYearVoucherRead' ||
								url.substring(0, 31) == '/byRangeEmissionDateVoucherRead' ||
								url.substring(0, 49) ==
									'/byBuyerIdentifierVoucherAndSearchByParameterRead' ||
								url.substring(0, 49) ==
									'/byBuyerIdentifierAndRangeEmissionDateVoucherRead' ||
								url == '/byRangeEmissionDateVoucherRead') &&
							!(
								voucher.type_environment === '1' ||
								voucher.type_environment === '2'
							)
						) {
							reject({
								..._businessMessages[4],
								description: _businessMessages[4].description.replace(
									'businessMessages',
									'El type_environment ingresado es incorrecto se esperaba 1 | 2'
								),
							});
						}
						/**
						 * Validation buyer_identifier_voucher
						 */
						if (
							url.substring(0, 29) == '/byBuyerIdentifierVoucherRead' ||
							url.substring(0, 44) ==
								'/byBuyerIdentifierAndEmissionYearVoucherRead' ||
							url == '/signInWithBuyerIdentifierVoucher' ||
							url.substring(0, 49) ==
								'/byBuyerIdentifierVoucherAndSearchByParameterRead' ||
							url.substring(0, 49) ==
								'/byBuyerIdentifierAndRangeEmissionDateVoucherRead'
						) {
							attributeValidate(
								'buyer_identifier_voucher',
								voucher.buyer_identifier_voucher,
								'string',
								13
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}
						/**
						 * Validation emission_date_voucher
						 */
						if (
							url.substring(0, 44) ==
								'/byBuyerIdentifierAndEmissionYearVoucherRead' ||
							url.substring(0, 24) == '/vouchersOfSQLServerRead' ||
							url.substring(0, 31) == '/byRangeEmissionDateVoucherRead' ||
							url.substring(0, 49) ==
								'/byBuyerIdentifierAndRangeEmissionDateVoucherRead' ||
							url == '/byRangeEmissionDateVoucherRead' ||
							url === '/reportVouchersOfSQLServer' ||
							url === '/reportResumeVouchersOfSQLServer' ||
							url === '/reportByRangeEmissionDateVoucher'
						) {
							attributeValidate(
								'emission_date_voucher',
								voucher.emission_date_voucher,
								'string',
								10
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
							/**
							 * checkDateString
							 */
							await checkDateString(voucher.emission_date_voucher!)
								.then((fullDate: FullDate) => {
									voucher.emission_date_voucher = `${fullDate.fullYear}-${fullDate.month}-${fullDate.day} ${fullDate.hours}:${fullDate.minutes}:${fullDate.seconds}.${fullDate.milliSeconds}`;
								})
								.catch(() => {
									validationStatus = true;
									reject({
										..._messages[12],
										description: _messages[12].description.replace(
											'value_date',
											voucher.emission_date_voucher!
										),
									});
								});
						}
						/**
						 * Validation authorization_date_voucher
						 */
						if (
							url.substring(0, 24) == '/vouchersOfSQLServerRead' ||
							url.substring(0, 31) == '/byRangeEmissionDateVoucherRead' ||
							url.substring(0, 49) ==
								'/byBuyerIdentifierAndRangeEmissionDateVoucherRead' ||
							url == '/byRangeEmissionDateVoucherRead' ||
							url === '/reportVouchersOfSQLServer' ||
							url === '/reportResumeVouchersOfSQLServer' ||
							url === '/reportByRangeEmissionDateVoucher'
						) {
							attributeValidate(
								'authorization_date_voucher',
								voucher.authorization_date_voucher,
								'string',
								10
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
							/**
							 * checkDateString
							 */
							await checkDateString(voucher.authorization_date_voucher!)
								.then((fullDate: FullDate) => {
									voucher.authorization_date_voucher = `${fullDate.fullYear}-${fullDate.month}-${fullDate.day} ${fullDate.hours}:${fullDate.minutes}:${fullDate.seconds}.${fullDate.milliSeconds}`;
								})
								.catch(() => {
									validationStatus = true;
									reject({
										..._messages[12],
										description: _messages[12].description.replace(
											'value_date',
											voucher.authorization_date_voucher!
										),
									});
								});
						}
						/**
						 * Validation page_number
						 */
						if (
							url.substring(0, 29) == '/byBuyerIdentifierVoucherRead' ||
							url.substring(0, 44) ==
								'/byBuyerIdentifierAndEmissionYearVoucherRead'
						) {
							attributeValidate(
								'page_number',
								voucher.page_number,
								'string',
								3
							).catch((err) => {
								validationStatus = true;
								reject(err);
							});
						}
						/**
						 * Validation amount
						 */
						if (
							url.substring(0, 29) == '/byBuyerIdentifierVoucherRead' ||
							url.substring(0, 44) ==
								'/byBuyerIdentifierAndEmissionYearVoucherRead'
						) {
							attributeValidate('amount', voucher.amount, 'string', 3).catch(
								(err) => {
									validationStatus = true;
									reject(err);
								}
							);
						}
						/**
						 * Validation order_by
						 */
						if (
							(url.substring(0, 29) == '/byBuyerIdentifierVoucherRead' ||
								url.substring(0, 44) ==
									'/byBuyerIdentifierAndEmissionYearVoucherRead') &&
							!(voucher.order_by == 'asc' || voucher.order_by == 'desc')
						) {
							reject({
								..._businessMessages[4],
								description: _businessMessages[4].description.replace(
									'businessMessages',
									'El order_by ingresado es incorrecto se esperaba asc | desc'
								),
							});
						}
						/**
						 * Validation type_file_voucher
						 */
						if (
							url.substring(0, 16) == '/downloadVoucher' &&
							!(
								voucher.type_file_voucher == 'xml' ||
								voucher.type_file_voucher == 'pdf'
							)
						) {
							reject({
								..._businessMessages[4],
								description: _businessMessages[4].description.replace(
									'businessMessages',
									'El type_file_voucher ingresado es incorrecto se esperaba xml | pdf'
								),
							});
						}
						/**
						 * Validation internal_status_voucher
						 */
						if (
							(url.substring(0, 24) == '/vouchersOfSQLServerRead' ||
								url.substring(0, 31) == '/byRangeEmissionDateVoucherRead' ||
								url == '/byRangeEmissionDateVoucherRead') &&
							!(
								voucher.internal_status_voucher == 'pending' ||
								voucher.internal_status_voucher == 'authorized' ||
								voucher.internal_status_voucher == 'canceled' ||
								voucher.internal_status_voucher == 'removed' ||
								voucher.internal_status_voucher == '*'
							)
						) {
							reject({
								..._businessMessages[4],
								description: _businessMessages[4].description.replace(
									'businessMessages',
									'El internal_status_voucher ingresado es incorrecto se esperaba pending | authorized | canceled | removed | *'
								),
							});
						}
						/**
						 * Estado del tipo de comprobante (enabled or disabled)
						 */
						let isVoucherEnabled: boolean = false;
						if (
							url == '/recepcionComprobante' ||
							url == '/update' ||
							url == '/resolveRecepcionComprobante'
						) {
							isVoucherEnabled = _typeVoucher.find(
								(_voucher: TYPE_VOUCHER_ENUM) =>
									_voucher.value_type == voucher.type_voucher
							)?.enabled!;
						} else {
							isVoucherEnabled = true;
						}
						if (isVoucherEnabled) {
							/**
							 * Continuar solo si no ocurrio errores en la validación
							 */
							if (!validationStatus) {
								/**
								 * Instance the class
								 */
								const _voucher = new Voucher();
								/**
								 * Execute the url depending on the path
								 */
								if (url == '/recepcionComprobante') {
									/**
									 * Validation body_voucher
									 */
									if (voucher.type_voucher === '01') {
										await validationVoucher_01(voucher.body_voucher).catch(
											(error: any) => {
												validationStatus = true;
												reject(error);
											}
										);
									}

									if (!validationStatus) {
										/** set required attributes for action */
										_voucher.id_user_ = voucher.id_user_;
										_voucher.instantly = voucher.instantly;
										_voucher.number_voucher = voucher.number_voucher;
										_voucher.institution = voucher.institution;
										_voucher.type_voucher = voucher.type_voucher;
										/**
										 * Trim body_voucher and deleteAmpersand
										 */
										_voucher.body_voucher = trimBodyVoucher(
											voucher.body_voucher
										);
										/**
										 * Es por resolver
										 */
										const isToSolve: boolean = false;

										await _voucher
											.recepcionComprobante(
												_voucher,
												_voucher.body_voucher,
												isToSolve
											)
											.then((_voucher: Voucher | any) => {
												resolve(_voucher);
											})
											.catch((error: any) => {
												reject(error);
											});
									}
								} else if (url.substring(0, 5) == '/read') {
									/** set required attributes for action */
									_voucher.type_environment = voucher.type_environment;
									_voucher.access_key_voucher = voucher.access_key_voucher;
									await _voucher
										.read(_voucher)
										.then((_vouchers: Voucher[]) => {
											resolve(_vouchers);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url.substring(0, 13) == '/specificRead') {
									/** set required attributes for action */
									_voucher.id_voucher = voucher.id_voucher;
									await _voucher
										.specificRead(_voucher)
										.then((_voucher: Voucher) => {
											resolve(_voucher);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url.substring(0, 18) == '/byInstitutionRead') {
									/** set required attributes for action */
									_voucher.type_environment = voucher.type_environment;
									_voucher.institution = voucher.institution;
									await _voucher
										.byInstitutionRead(_voucher)
										.then((_vouchers: Voucher[]) => {
											resolve(_vouchers);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url.substring(0, 23) == '/byAccessKeyVoucherRead') {
									/** set required attributes for action */
									_voucher.access_key_voucher = voucher.access_key_voucher;
									await _voucher
										.byAccessKeyVoucherRead(_voucher)
										.then((_voucher: Voucher) => {
											resolve(_voucher);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (
									url.substring(0, 29) == '/byBuyerIdentifierVoucherRead'
								) {
									/** set required attributes for action */
									_voucher.type_environment = voucher.type_environment;
									_voucher.buyer_identifier_voucher =
										voucher.buyer_identifier_voucher;
									_voucher.page_number = voucher.page_number;
									_voucher.amount = voucher.amount;
									_voucher.order_by = voucher.order_by;
									await _voucher
										.byBuyerIdentifierVoucherRead(_voucher)
										.then((_vouchers: Voucher[]) => {
											resolve(_vouchers);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (
									url.substring(0, 49) ==
									'/byBuyerIdentifierVoucherAndSearchByParameterRead'
								) {
									/** set required attributes for action */
									_voucher.type_environment = voucher.type_environment;
									_voucher.buyer_identifier_voucher =
										voucher.buyer_identifier_voucher;
									_voucher.access_key_voucher = voucher.access_key_voucher;
									await _voucher
										.byBuyerIdentifierVoucherAndSearchByParameterRead(_voucher)
										.then((_vouchers: Voucher[]) => {
											resolve(_vouchers);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (
									url.substring(0, 44) ==
									'/byBuyerIdentifierAndEmissionYearVoucherRead'
								) {
									/** set required attributes for action */
									_voucher.type_environment = voucher.type_environment;
									_voucher.buyer_identifier_voucher =
										voucher.buyer_identifier_voucher;
									_voucher.emission_date_voucher =
										voucher.emission_date_voucher;
									_voucher.page_number = voucher.page_number;
									_voucher.amount = voucher.amount;
									_voucher.order_by = voucher.order_by;
									await _voucher
										.byBuyerIdentifierAndEmissionYearVoucherRead(_voucher)
										.then((_vouchers: Voucher[]) => {
											resolve(_vouchers);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (
									url.substring(0, 49) ==
									'/byBuyerIdentifierAndRangeEmissionDateVoucherRead'
								) {
									/** set required attributes for action */
									_voucher.type_environment = voucher.type_environment;
									_voucher.buyer_identifier_voucher =
										voucher.buyer_identifier_voucher;
									_voucher.emission_date_voucher =
										voucher.emission_date_voucher;
									_voucher.authorization_date_voucher =
										voucher.authorization_date_voucher;
									await _voucher
										.byBuyerIdentifierAndRangeEmissionDateVoucherRead(_voucher)
										.then((_vouchers: Voucher[]) => {
											resolve(_vouchers);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url.substring(0, 24) == '/vouchersOfSQLServerRead') {
									/** set required attributes for action */
									_voucher.emission_date_voucher =
										voucher.emission_date_voucher;
									_voucher.authorization_date_voucher =
										voucher.authorization_date_voucher;
									_voucher.institution = voucher.institution;
									_voucher.internal_status_voucher =
										voucher.internal_status_voucher;
									await _voucher
										.vouchersOfSQLServerRead(_voucher)
										.then((_rowsSQLServer: VoucherSQLServer[]) => {
											resolve(_rowsSQLServer);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (
									url.substring(0, 35) == '/vouchersOfSQLServerByParameterRead'
								) {
									/** set required attributes for action */
									_voucher.number_voucher = voucher.number_voucher;
									await _voucher
										.vouchersOfSQLServerByParameterRead(_voucher)
										.then((_rowsSQLServer: VoucherSQLServer[]) => {
											resolve(_rowsSQLServer);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (
									url.substring(0, 31) == '/byRangeEmissionDateVoucherRead'
								) {
									/** set required attributes for action */
									_voucher.type_environment = voucher.type_environment;
									_voucher.institution = voucher.institution;
									_voucher.emission_date_voucher =
										voucher.emission_date_voucher;
									_voucher.authorization_date_voucher =
										voucher.authorization_date_voucher;
									_voucher.internal_status_voucher =
										voucher.internal_status_voucher;
									await _voucher
										.byRangeEmissionDateVoucherRead(_voucher)
										.then((_vouchers: Voucher[]) => {
											resolve(_vouchers);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url == '/update') {
									/** set required attributes for action */
									_voucher.id_user_ = voucher.id_user_;
									_voucher.id_voucher = voucher.id_voucher;
									_voucher.institution = voucher.institution;
									_voucher.type_environment = voucher.type_environment;
									_voucher.type_emission = voucher.type_emission;
									_voucher.type_voucher = voucher.type_voucher;
									_voucher.number_voucher = voucher.number_voucher;
									_voucher.access_key_voucher = voucher.access_key_voucher;
									_voucher.emission_date_voucher =
										voucher.emission_date_voucher;
									_voucher.authorization_date_voucher =
										voucher.authorization_date_voucher;
									_voucher.buyer_identifier_voucher =
										voucher.buyer_identifier_voucher;
									_voucher.body_voucher = voucher.body_voucher;
									_voucher.internal_status_voucher =
										voucher.internal_status_voucher;
									_voucher.global_status_voucher =
										voucher.global_status_voucher;
									_voucher.action_pdf_voucher = voucher.action_pdf_voucher;
									_voucher.action_email_voucher = voucher.action_email_voucher;
									_voucher.action_alfresco_voucher =
										voucher.action_alfresco_voucher;
									_voucher.messages_voucher = voucher.messages_voucher;
									await _voucher
										.update(_voucher)
										.then((_voucher: Voucher) => {
											resolve(_voucher);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url.substring(0, 7) == '/delete') {
									/** set required attributes for action */
									_voucher.id_user_ = voucher.id_user_;
									_voucher.id_voucher = voucher.id_voucher;
									await _voucher
										.delete(_voucher)
										.then((response: boolean) => {
											resolve(response);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url == '/autorizacionComprobante') {
									/** set required attributes for action */
									_voucher.id_user_ = voucher.id_user_;
									_voucher.institution = voucher.institution;
									_voucher.access_key_voucher = voucher.access_key_voucher;
									_voucher.type_voucher = getCodDocByAccessKey(
										_voucher.access_key_voucher!
									);

									await _voucher
										.autorizacionComprobante(_voucher)
										.then(
											(
												_responseAutorizacionComprobante: ResponseAutorizacionComprobante
											) => {
												resolve(_responseAutorizacionComprobante);
											}
										)
										.catch((error: any) => {
											reject(error);
										});
								} else if (url == '/cancelVoucher') {
									/** set required attributes for action */
									_voucher.id_user_ = voucher.id_user_;
									_voucher.institution = voucher.institution;
									_voucher.access_key_voucher = voucher.access_key_voucher;
									await _voucher
										.cancelVoucher(_voucher)
										.then((voucher: Voucher) => {
											resolve(voucher);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url == '/reverseCancelVoucher') {
									/** set required attributes for action */
									_voucher.id_user_ = voucher.id_user_;
									_voucher.institution = voucher.institution;
									_voucher.access_key_voucher = voucher.access_key_voucher;
									await _voucher
										.reverseCancelVoucher(_voucher)
										.then((voucher: Voucher) => {
											resolve(voucher);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url == '/recepcionComprobanteInstantly') {
									/** set required attributes for action */
									_voucher.id_user_ = voucher.id_user_;
									_voucher.institution = voucher.institution;
									_voucher.access_key_voucher = voucher.access_key_voucher;
									_voucher.type_voucher = getCodDocByAccessKey(
										_voucher.access_key_voucher!
									);

									await _voucher
										.recepcionComprobanteInstantly(_voucher)
										.then((voucher: Voucher) => {
											resolve(voucher);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url == '/sendVoucherByBatchByInstitution') {
									/** set required attributes for action */
									_voucher.id_user_ = voucher.id_user_;
									_voucher.institution = voucher.institution;
									_voucher.emission_date_voucher =
										voucher.emission_date_voucher;
									_voucher.type_voucher = voucher.type_voucher;
									await _voucher
										.sendVoucherByBatchByInstitution(_voucher)
										.then((vouchers: string[]) => {
											resolve(vouchers);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url == '/sendVoucherByBatchByTaxpayer') {
									/** set required attributes for action */
									_voucher.id_user_ = voucher.id_user_;
									_voucher.institution = voucher.institution;
									_voucher.emission_date_voucher =
										voucher.emission_date_voucher;
									_voucher.type_voucher = voucher.type_voucher;
									await _voucher
										.sendVoucherByBatchByTaxpayer(_voucher)
										.then((vouchers: string[]) => {
											resolve(vouchers);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url == '/completeProcess') {
									/** set required attributes for action */
									_voucher.id_user_ = voucher.id_user_;
									_voucher.institution = voucher.institution;
									_voucher.access_key_voucher = voucher.access_key_voucher;
									_voucher.type_voucher = getCodDocByAccessKey(
										_voucher.access_key_voucher!
									);

									await _voucher
										.completeProcess(_voucher)
										.then((voucher: Voucher) => {
											resolve(voucher);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url == '/completeProcessByBatchByInstitution') {
									/** set required attributes for action */
									_voucher.id_user_ = voucher.id_user_;
									_voucher.institution = voucher.institution;
									_voucher.emission_date_voucher =
										voucher.emission_date_voucher;
									_voucher.type_voucher = voucher.type_voucher;
									await _voucher
										.completeProcessByBatchByInstitution(_voucher)
										.then((devolutions: Devolution[]) => {
											resolve(devolutions);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url == '/getBodyVoucher') {
									/** set required attributes for action */
									_voucher.id_user_ = voucher.id_user_;
									_voucher.institution = voucher.institution;
									_voucher.access_key_voucher = voucher.access_key_voucher;
									await _voucher
										.getBodyVoucher(_voucher)
										.then((voucher: Voucher) => {
											resolve(voucher);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url == '/resolveRecepcionComprobante') {
									/**
									 * Validation body_voucher
									 */
									if (voucher.type_voucher === '01') {
										await validationVoucher_01(voucher.body_voucher).catch(
											(error: any) => {
												validationStatus = true;
												reject(error);
											}
										);
									}

									if (!validationStatus) {
										/** set required attributes for action */
										_voucher.id_user_ = voucher.id_user_;
										_voucher.access_key_voucher = voucher.access_key_voucher;
										_voucher.number_voucher = voucher.number_voucher;
										_voucher.institution = voucher.institution;
										_voucher.type_voucher = voucher.type_voucher;
										/**
										 * Trim body_voucher and deleteAmpersand
										 */
										_voucher.body_voucher = trimBodyVoucher(
											voucher.body_voucher
										);
										/**
										 * Es por resolver
										 */
										const isToSolve: boolean = true;

										await _voucher
											.recepcionComprobante(
												_voucher,
												_voucher.body_voucher,
												isToSolve
											)
											.then((voucher: any) => {
												resolve(voucher);
											})
											.catch((error: any) => {
												reject(error);
											});
									}
								} else if (url == '/bringVouchersOfSQLServer') {
									/** set required attributes for action */
									_voucher.id_user_ = voucher.id_user_;
									_voucher.institution = voucher.institution;
									_voucher.emission_date_voucher =
										voucher.emission_date_voucher;
									await _voucher
										.bringVouchersOfSQLServer(_voucher)
										.then((voucher: any) => {
											resolve(voucher);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url.substring(0, 16) == '/downloadVoucher') {
									/** set required attributes for action */
									_voucher.institution = voucher.institution;
									_voucher.access_key_voucher = voucher.access_key_voucher;
									_voucher.type_file_voucher = voucher.type_file_voucher;

									await _voucher
										.downloadVoucher(_voucher)
										.then((voucher: Voucher) => {
											const _fullYear: FullDate = getFullDate(
												voucher.emission_date_voucher!,
												0
											);

											const id_taxpayer: number =
												voucher.institution.taxpayer.id_taxpayer;
											const id_institution: number =
												voucher.institution.id_institution;
											const type_environment: TYPE_ENVIRONMENT =
												voucher.type_environment!;
											const fullYear: number = _fullYear.fullYear;
											const month: string = _fullYear.month;
											const access_key_voucher: string =
												voucher.access_key_voucher!;
											const type_file_voucher = _voucher.type_file_voucher;

											const base_path_vocher: string = `/file_store/electronic_voucher/${id_taxpayer}/${id_institution}/${type_environment}/${voucher.type_voucher!}/${fullYear}/${month}/${access_key_voucher}/${access_key_voucher}.${type_file_voucher}`;

											/**
											 * Construimos el finalPath
											 */
											const finalPath = `${path.resolve(
												'./'
											)}${base_path_vocher}`;
											/**
											 * Verificamos si el recurso existe
											 */
											if (fs.existsSync(finalPath)) {
												resolve(finalPath);
											} else {
												reject({
													..._businessMessages[4],
													description: _businessMessages[4].description.replace(
														'businessMessages',
														'Recurso no encontrado 😱'
													),
												});
											}
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url === '/signInWithBuyerIdentifierVoucher') {
									/** set required attributes for action */
									_voucher.buyer_identifier_voucher =
										voucher.buyer_identifier_voucher;
									await _voucher
										.signInWithBuyerIdentifierVoucher(_voucher)
										.then((response: boolean) => {
											resolve(response);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url === '/reportByRangeEmissionDateVoucher') {
									/** set required attributes for action */
									_voucher.type_environment = voucher.type_environment;
									_voucher.institution = voucher.institution;
									_voucher.emission_date_voucher =
										voucher.emission_date_voucher;
									_voucher.authorization_date_voucher =
										voucher.authorization_date_voucher;
									_voucher.internal_status_voucher =
										voucher.internal_status_voucher;
									await _voucher
										.reportByRangeEmissionDateVoucher(_voucher)
										.then((response: boolean) => {
											resolve(response);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url === '/reportVouchersOfSQLServer') {
									/** set required attributes for action */
									_voucher.institution = voucher.institution;
									_voucher.emission_date_voucher =
										voucher.emission_date_voucher;
									_voucher.authorization_date_voucher =
										voucher.authorization_date_voucher;
									_voucher.internal_status_voucher =
										voucher.internal_status_voucher;
									await _voucher
										.reportVouchersOfSQLServer(_voucher)
										.then((response: boolean) => {
											resolve(response);
										})
										.catch((error: any) => {
											reject(error);
										});
								} else if (url === '/reportResumeVouchersOfSQLServer') {
									/** set required attributes for action */
									_voucher.institution = voucher.institution;
									_voucher.emission_date_voucher =
										voucher.emission_date_voucher;
									_voucher.authorization_date_voucher =
										voucher.authorization_date_voucher;
									_voucher.internal_status_voucher =
										voucher.internal_status_voucher;
									await _voucher
										.reportResumeVouchersOfSQLServer(_voucher)
										.then((response: boolean) => {
											resolve(response);
										})
										.catch((error: any) => {
											reject(error);
										});
								}
							}
						} else {
							reject(_businessMessages[1]);
						}
					})
					.catch((error) => {
						reject(error);
					});
			} else if (
				token === undefined &&
				url === '/signInWithBuyerIdentifierVoucher'
			) {
				/**
				 * Validation buyer_identifier_voucher
				 */
				if (
					url.substring(0, 29) == '/byBuyerIdentifierVoucherRead' ||
					url.substring(0, 44) ==
						'/byBuyerIdentifierAndEmissionYearVoucherRead' ||
					url == '/signInWithBuyerIdentifierVoucher'
				) {
					attributeValidate(
						'buyer_identifier_voucher',
						voucher.buyer_identifier_voucher,
						'string',
						13
					).catch((err) => {
						validationStatus = true;
						reject(err);
					});
				}
				/**
				 * Instance the class
				 */
				const _voucher = new Voucher();

				/** set required attributes for action */
				_voucher.buyer_identifier_voucher = voucher.buyer_identifier_voucher;
				await _voucher
					.signInWithBuyerIdentifierVoucher(_voucher)
					.then((response: boolean) => {
						resolve(response);
					})
					.catch((error: any) => {
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
export const attributeValidate = (
	attribute: string,
	value: any,
	type: string,
	_length: number = 0
): Promise<boolean> => {
	return new Promise<boolean>((resolve, reject) => {
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
/**
 * trimBodyVoucher
 * @param body_voucher
 * @returns
 */
const trimBodyVoucher = (body_voucher: BodyVoucher): BodyVoucher => {
	return {
		...body_voucher,
		guiaRemision: body_voucher.guiaRemision
			? body_voucher.guiaRemision.trim()
			: '',
		razonSocialComprador: deleteAmpersand(
			body_voucher.razonSocialComprador.trim()
		),
		identificacionComprador: body_voucher.identificacionComprador.trim(),
		direccionComprador: body_voucher.direccionComprador
			? deleteAmpersand(body_voucher.direccionComprador.trim())
			: '',
		moneda: body_voucher.moneda ? body_voucher.moneda.trim() : '',
		detalles: deleteAmpersandDetalle(body_voucher.detalles),
	};
};
/**
 * deleteAmpersandDetalle
 * @param detalles
 * @returns
 */
export const deleteAmpersandDetalle = (detalles: detalle[]): detalle[] => {
	detalles.map(async (_detalle: detalle, index: number) => {
		_detalle = {
			..._detalle,
			codigoAuxiliar: deleteAmpersand(_detalle.codigoAuxiliar!),
			descripcion: deleteAmpersand(_detalle.descripcion!),
		};
		detalles[index] = _detalle;
	});
	return detalles;
};
