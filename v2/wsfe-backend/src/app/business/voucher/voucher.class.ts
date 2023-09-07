import fs from 'fs';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import path from 'path';
import util from 'util';
import format from 'xml-formatter';
import { SecurityCap } from '../../../utils/SecurityCap';
import {
	generateAccessKey,
	getFullYearByAccessKey,
	getMothByAccessKey,
	getSecuencialByAccessKey,
} from '../../../utils/accessKey';
import { Alfresco } from '../../../utils/alfresco/alfresco';
import {
	Documento,
	Models,
	Path,
	Sities,
	Types,
} from '../../../utils/alfresco/alfresco.types';
import {
	FullDate,
	getFullDate,
	parseDateToString,
	parseDateToStringWithTimeZone,
} from '../../../utils/date';
import { generateFolder } from '../../../utils/generateFolder';
import {
	generateDetalle,
	generateInfoAdicional,
	generatePagos,
	generateTotalConImpuestos,
} from '../../../utils/generateXmlContent';
import {
	addCero,
	deleteAmpersand,
	generateRandomNumber,
} from '../../../utils/global';
import { currentDateEC } from '../../../utils/internationalDate';
import { generateToken } from '../../../utils/jwt';
import { generateMail, sendMail } from '../../../utils/mail/mail';
import { Attachments, Mail } from '../../../utils/mail/mail.types';
import { _businessMessages, _messages } from '../../../utils/message/message';
import { MessageAPI } from '../../../utils/message/message.type';
import { signVoucher } from '../../../utils/signSHA1';
import {
	autorizacionComprobante,
	validarComprobante,
} from '../../../utils/wsSRI';
import {
	Company,
	Payload,
	Person,
	Profile,
	Setting,
	TypeUser,
	User,
} from '../../core/auth/auth.types';
import { Setting as SettingCompany } from '../../core/company/setting/setting.class';
import { User as UserClass } from '../../core/user/user.class';
import { Report } from '../../report/report.class';
import {
	reportByRangeEmissionDateVoucher,
	reportResumeVouchersOfSQLServer,
	reportVouchersOfSQLServer,
} from '../../report/report.declarate';
import {
	BodyVoucher,
	INSTITUTION_SQLSERVER,
	InstitutionSQLServer,
	ResponseAutorizacionComprobante,
	ResponseBrindVoucher,
	ResponseRecepcionComprobante,
	RespuestaRecepcionComprobante,
	SERVICE,
	TABLA_6,
	TYPE_EMISSION,
	TYPE_ENVIRONMENT,
	TYPE_SERVICE_ENUM,
	TYPE_VOUCHER,
	TYPE_VOUCHER_ENUM,
	TYPE_VOUCHER_STATUS,
	ValoresExtras,
	VoucherSQLServer,
	_bodyVoucher,
	_typeServices,
	_typeVoucher,
	campoAdicional,
	detAdicional,
} from '../business.types';
import { Institution } from '../institution/institution.class';
import { _institution } from '../institution/institution.data';
import { MailServer } from '../mail_server/mail_server.class';
import { Ride } from '../ride/ride.class';
import { Sequence } from '../sequence/sequence.class';
import { SettingTaxpayer } from '../setting_taxpayer/setting_taxpayer.class';
import { Taxpayer } from '../taxpayer/taxpayer.class';
import {
	auth_sign_in_with_buyer_identifier_voucher,
	dml_voucher_bring_of_sqlserver,
	dml_voucher_by_batch_by_institution,
	dml_voucher_by_batch_by_taxpayer,
	dml_voucher_cancel,
	dml_voucher_complete_process,
	dml_voucher_create,
	dml_voucher_delete,
	dml_voucher_download,
	dml_voucher_reception,
	dml_voucher_reception_instantly,
	dml_voucher_reverse_cancel,
	dml_voucher_update,
	dml_voucher_validation,
	view_voucher,
	view_voucher_by_access_key_voucher_read,
	view_voucher_by_buyer_identifier_and_emission_year_voucher_read,
	view_voucher_by_buyer_identifier_and_range_emission_date_voucher_read,
	view_voucher_by_buyer_identifier_voucher_and_search_by_parameter_read,
	view_voucher_by_buyer_identifier_voucher_read,
	view_voucher_by_institution_read,
	view_voucher_by_range_emission_date_voucher_read,
	view_voucher_of_sqlserver_by_parameter_read,
	view_voucher_of_sqlserver_read,
	view_voucher_specific_read,
} from './voucher.store';

const setTimeoutPromise = util.promisify(setTimeout);

export class Voucher {
	/** Attributes */
	public id_user_?: number;
	public instantly?: boolean;
	public id_voucher: number;
	public institution: Institution;
	public type_environment?: TYPE_ENVIRONMENT;
	public type_emission?: TYPE_EMISSION;
	public type_voucher?: TYPE_VOUCHER;
	public number_voucher?: string;
	public access_key_voucher?: string;
	public emission_date_voucher?: string;
	public authorization_date_voucher?: string;
	public buyer_identifier_voucher?: string;
	public body_voucher: BodyVoucher;
	public internal_status_voucher?: TYPE_VOUCHER_STATUS;
	public global_status_voucher?: TYPE_VOUCHER_STATUS;
	public action_pdf_voucher?: boolean;
	public action_email_voucher?: boolean;
	public action_alfresco_voucher?: boolean;
	public messages_voucher?: string;
	public deleted_voucher?: boolean;
	securityCap = new SecurityCap();
	/**
	 * Extras Attributes (Pagination)
	 */
	public page_number?: string;
	public amount?: string;
	public order_by?: string;

	public type_file_voucher?: string;
	/**
	 * Time of process duration
	 */
	public process_time?: number = 20000;
	/** Constructor */
	constructor(
		id_user_: number = 0,
		id_voucher: number = 0,
		institution: Institution = _institution,
		type_environment: TYPE_ENVIRONMENT = '1',
		type_emission: TYPE_EMISSION = '1',
		type_voucher: TYPE_VOUCHER = '01',
		number_voucher: string = '',
		access_key_voucher: string = '',
		emission_date_voucher: string = '',
		authorization_date_voucher: string = '',
		buyer_identifier_voucher: string = '',
		body_voucher: BodyVoucher = _bodyVoucher,
		internal_status_voucher: TYPE_VOUCHER_STATUS = 'pending',
		global_status_voucher: TYPE_VOUCHER_STATUS = 'pending',
		action_pdf_voucher: boolean = false,
		action_email_voucher: boolean = false,
		action_alfresco_voucher: boolean = false,
		messages_voucher: string = '',
		deleted_voucher: boolean = false
	) {
		this.id_user_ = id_user_;
		this.id_voucher = id_voucher;
		this.institution = institution;
		this.type_environment = type_environment;
		this.type_emission = type_emission;
		this.type_voucher = type_voucher;
		this.number_voucher = number_voucher;
		this.access_key_voucher = access_key_voucher;
		this.emission_date_voucher = emission_date_voucher;
		this.authorization_date_voucher = authorization_date_voucher;
		this.buyer_identifier_voucher = buyer_identifier_voucher;
		this.body_voucher = body_voucher;
		this.internal_status_voucher = internal_status_voucher;
		this.global_status_voucher = global_status_voucher;
		this.action_pdf_voucher = action_pdf_voucher;
		this.action_email_voucher = action_email_voucher;
		this.action_alfresco_voucher = action_alfresco_voucher;
		this.messages_voucher = messages_voucher;
		this.deleted_voucher = deleted_voucher;
	}
	/** Setters and Getters */
	set _id_user_(id_user_: number) {
		this.id_user_ = id_user_;
	}
	get _id_user_() {
		return this.id_user_!;
	}

	set _id_voucher(id_voucher: number) {
		this.id_voucher = id_voucher;
	}
	get _id_voucher() {
		return this.id_voucher;
	}

	set _institution(institution: Institution) {
		this.institution = institution;
	}
	get _institution() {
		return this.institution;
	}

	set _type_environment(type_environment: TYPE_ENVIRONMENT) {
		this.type_environment = type_environment;
	}
	get _type_environment() {
		return this.type_environment!;
	}

	set _type_emission(type_emission: TYPE_EMISSION) {
		this.type_emission = type_emission;
	}
	get _type_emission() {
		return this.type_emission!;
	}

	set _type_voucher(type_voucher: TYPE_VOUCHER) {
		this.type_voucher = type_voucher;
	}
	get _type_voucher() {
		return this.type_voucher!;
	}

	set _number_voucher(number_voucher: string) {
		this.number_voucher = number_voucher;
	}
	get _number_voucher() {
		return this.number_voucher!;
	}

	set _access_key_voucher(access_key_voucher: string) {
		this.access_key_voucher = access_key_voucher;
	}
	get _access_key_voucher() {
		return this.access_key_voucher!;
	}

	set _emission_date_voucher(emission_date_voucher: string) {
		this.emission_date_voucher = emission_date_voucher;
	}
	get _emission_date_voucher() {
		return this.emission_date_voucher!;
	}

	set _authorization_date_voucher(authorization_date_voucher: string) {
		this.authorization_date_voucher = authorization_date_voucher;
	}
	get _authorization_date_voucher() {
		return this.authorization_date_voucher!;
	}

	set _buyer_identifier_voucher(buyer_identifier_voucher: string) {
		this.buyer_identifier_voucher = buyer_identifier_voucher;
	}
	get _buyer_identifier_voucher() {
		return this.buyer_identifier_voucher!;
	}

	set _body_voucher(body_voucher: BodyVoucher) {
		this.body_voucher = body_voucher;
	}
	get _body_voucher() {
		return this.body_voucher!;
	}

	set _internal_status_voucher(internal_status_voucher: TYPE_VOUCHER_STATUS) {
		this.internal_status_voucher = internal_status_voucher;
	}
	get _internal_status_voucher() {
		return this.internal_status_voucher!;
	}

	set _global_status_voucher(global_status_voucher: TYPE_VOUCHER_STATUS) {
		this.global_status_voucher = global_status_voucher;
	}
	get _global_status_voucher() {
		return this.global_status_voucher!;
	}

	set _action_pdf_voucher(action_pdf_voucher: boolean) {
		this.action_pdf_voucher = action_pdf_voucher;
	}
	get _action_pdf_voucher() {
		return this.action_pdf_voucher!;
	}

	set _action_email_voucher(action_email_voucher: boolean) {
		this.action_email_voucher = action_email_voucher;
	}
	get _action_email_voucher() {
		return this.action_email_voucher!;
	}

	set _action_alfresco_voucher(action_alfresco_voucher: boolean) {
		this.action_alfresco_voucher = action_alfresco_voucher;
	}
	get _action_alfresco_voucher() {
		return this.action_alfresco_voucher!;
	}

	set _messages_voucher(messages_voucher: string) {
		this.messages_voucher = messages_voucher;
	}
	get _messages_voucher() {
		return this.messages_voucher!;
	}

	set _deleted_voucher(deleted_voucher: boolean) {
		this.deleted_voucher = deleted_voucher;
	}
	get _deleted_voucher() {
		return this.deleted_voucher!;
	}
	/** Methods */
	/**
	 * recepcionComprobante
	 * @returns
	 */
	recepcionComprobante(
		voucher: Voucher,
		body_voucher_: BodyVoucher,
		isToSolve: boolean
	) {
		return new Promise<Voucher | any>(async (resolve, reject) => {
			/**
			 * Estado del tipo de comprobante (enabled or disabled)
			 */
			let validationStatus: boolean = false;

			await dml_voucher_reception(voucher, isToSolve)
				.then(async (sequences: Sequence[]) => {
					if (sequences.length > 0) {
						/**
						 * Obtener la secuencia de acuerdo a la validación del comprobante
						 */
						const _sequence = new Sequence();
						const sequence = _sequence.mutateResponse(sequences)[0];
						/**
						 * Obtener las variables necesarias para la generaciÓn del XML
						 */

						const type_voucher: TYPE_VOUCHER = _sequence.type_voucher!;

						const establishment: string =
							sequence.establishment.value_establishment!;
						const emission_point: string =
							sequence.emission_point.value_emission_point!;
						const number_code_sequence: string = sequence.number_code_sequence!;
						const serie: string = `${establishment}${emission_point}`;
						const finalSequence: string = isToSolve
							? getSecuencialByAccessKey(voucher.access_key_voucher!)
							: addCero(sequence.sequence!);

						const institution: Institution = sequence.institution;
						const taxpayer: Taxpayer = sequence.institution.taxpayer;

						const dir_matriz_taxpayer: string = taxpayer.dir_matriz_taxpayer!;

						/**
						 * Check the status of voucher
						 */
						if (!voucher.internal_status_voucher) {
							voucher.internal_status_voucher = this.internal_status_voucher;
						}
						if (!voucher.global_status_voucher) {
							voucher.global_status_voucher = this.global_status_voucher;
						}
						/**
						 * Obtenemos la fecha actual FullDate
						 */
						//const todayDate: FullDate = getFullDate(currentDateEC);
						const todayDate: FullDate = getFullDate(new Date().toString());

						/**
						 * Armar la clave de acceso
						 */

						const access_key_voucher: string = isToSolve
							? voucher.access_key_voucher!
							: generateAccessKey(
									todayDate,
									type_voucher!,
									taxpayer.ruc_taxpayer!,
									institution.type_environment!,
									serie,
									finalSequence,
									number_code_sequence!,
									taxpayer.type_emission!
							  );
						/**
						 * Set access_key_voucher and identificacionComprador
						 */

						voucher.id_user_ = this.id_user_;
						voucher.institution = this.institution;

						voucher.body_voucher = body_voucher_;
						const body_voucher: BodyVoucher = voucher.body_voucher;

						voucher.access_key_voucher = access_key_voucher;
						voucher.buyer_identifier_voucher =
							body_voucher.identificacionComprador;
						/**
						 * Armamos los paths del comprobante
						 */
						const base_path_vocher_exclude_root: string = `/file_store/electronic_voucher/${
							taxpayer.id_taxpayer
						}/${
							institution.id_institution
						}/${institution.type_environment!}/${type_voucher!}/${
							todayDate.fullYear
						}/${todayDate.month}/${access_key_voucher}`;

						const base_path_vocher: string = `.${base_path_vocher_exclude_root}`;
						/**
						 * Obtener la información de del body_voucher para la generación del XML
						 */
						const tipoIdentificacionComprador: TABLA_6 =
							body_voucher.tipoIdentificacionComprador;
						const guiaRemision: string = body_voucher.guiaRemision!;
						const razonSocialComprador: string =
							body_voucher.razonSocialComprador;
						const identificacionComprador: string =
							body_voucher.identificacionComprador;
						const direccionComprador: string = body_voucher.direccionComprador!;
						const totalSinImpuestos: number = body_voucher.totalSinImpuestos;
						const totalDescuento: number = body_voucher.totalDescuento;
						/**
						 * generate totalConImpuestos
						 */
						let totalConImpuestos: string = '';
						await generateTotalConImpuestos(body_voucher.totalConImpuestos)
							.then((_totalConImpuestos: string) => {
								totalConImpuestos = _totalConImpuestos;
							})
							.catch((messageAPI: MessageAPI) => {
								validationStatus = true;
								reject(messageAPI);
							});
						/**
						 * Return if an error has occurred
						 */
						if (validationStatus) {
							return;
						}

						const propina: number = body_voucher.propina;
						const importeTotal: number = body_voucher.importeTotal;
						const moneda: string = body_voucher.moneda!;
						/**
						 * generate pagos
						 */
						let pagos: string = '';
						await generatePagos(body_voucher.pagos)
							.then((_pagos: string) => {
								pagos = _pagos;
							})
							.catch((messageAPI: MessageAPI) => {
								validationStatus = true;
								reject(messageAPI);
							});
						/**
						 * Return if an error has occurred
						 */
						if (validationStatus) {
							return;
						}
						/**
						 * generate detalles
						 */
						let detalles: string = '';
						await generateDetalle(body_voucher.detalles)
							.then((_detalles: string) => {
								detalles = _detalles;
							})
							.catch((messageAPI: MessageAPI) => {
								validationStatus = true;
								reject(messageAPI);
							});
						/**
						 * Return if an error has occurred
						 */
						if (validationStatus) {
							return;
						}
						/**
						 * Obtener los valores extras (solo aplica para EL GADMCP)
						 */
						const valoresExtras: ValoresExtras = body_voucher.valoresExtras!;

						if (valoresExtras) {
							const { tasaProcesamiento, interes, otros } =
								this.parseValoresExtrasTOcampoAdicional(
									valoresExtras,
									body_voucher.detalles.length
								);

							if (tasaProcesamiento && body_voucher.infoAdicional) {
								body_voucher.infoAdicional.push(tasaProcesamiento);
							}
							if (interes && body_voucher.infoAdicional) {
								body_voucher.infoAdicional.push(interes);
							}
							if (otros && body_voucher.infoAdicional) {
								body_voucher.infoAdicional.push(otros);
							}
						}
						/**
						 * generate infoAdicional
						 */
						let infoAdicional: string = '';
						await generateInfoAdicional(body_voucher.infoAdicional!)
							.then((_infoAdicional: string) => {
								infoAdicional = _infoAdicional;
							})
							.catch((messageAPI: MessageAPI) => {
								validationStatus = true;
								reject(messageAPI);
							});
						/**
						 * Return if an error has occurred
						 */
						if (validationStatus) {
							return;
						}
						/**
						 * Armar el XML con toda la información recibida
						 */
						const VOUCHER_VERSION: string = '1.0.0';

						let stringXML = `<?xml version="1.0" encoding="UTF-8"?>
					 <factura id="comprobante" version="${VOUCHER_VERSION}">
						 <infoTributaria>
							 <ambiente>${institution.type_environment}</ambiente>
							 <tipoEmision>${taxpayer.type_emission}</tipoEmision>
							 <razonSocial>${taxpayer.business_name_taxpayer}</razonSocial>
							 ${
									taxpayer.tradename_taxpayer
										? `<nombreComercial>${taxpayer.tradename_taxpayer}</nombreComercial>`
										: ``
								}
							 <ruc>${taxpayer.ruc_taxpayer}</ruc>
							 <claveAcceso>${access_key_voucher}</claveAcceso>
							 <codDoc>${type_voucher}</codDoc>
							 <estab>${establishment}</estab>
							 <ptoEmi>${emission_point}</ptoEmi>
							 <secuencial>${finalSequence}</secuencial>
							 <dirMatriz>${dir_matriz_taxpayer}</dirMatriz>
						 </infoTributaria>
						 <infoFactura>
							 <fechaEmision>${todayDate.day}/${todayDate.month}/${
							todayDate.fullYear
						}</fechaEmision>
							 ${
									institution.address_institution
										? `<dirEstablecimiento>${institution.address_institution}</dirEstablecimiento>`
										: ``
								}
							 ${
									taxpayer.accounting_obliged
										? `<obligadoContabilidad>${taxpayer.accounting_obliged}</obligadoContabilidad>`
										: ``
								}
							 <tipoIdentificacionComprador>${tipoIdentificacionComprador}</tipoIdentificacionComprador>
							 ${guiaRemision ? `<guiaRemision>${guiaRemision}</guiaRemision>` : ``}
							 <razonSocialComprador>${razonSocialComprador}</razonSocialComprador>
							 <identificacionComprador>${identificacionComprador}</identificacionComprador>
							 ${
									direccionComprador
										? `<direccionComprador>${direccionComprador}</direccionComprador>`
										: ``
								}
							 <totalSinImpuestos>${totalSinImpuestos}</totalSinImpuestos>
							 <totalDescuento>${totalDescuento}</totalDescuento>
							 <totalConImpuestos>
								 ${totalConImpuestos}
							 </totalConImpuestos>
							 <propina>${propina}</propina>
							 <importeTotal>${importeTotal}</importeTotal>
							 ${moneda ? `<moneda>${moneda}</moneda>` : ``}
							 ${
									pagos
										? `
							 <pagos>
								 ${pagos}
							 </pagos>`
										: ``
								}
						 </infoFactura>
						 <detalles>
							 ${detalles}
						 </detalles>
						${infoAdicional ? `<infoAdicional>${infoAdicional}</infoAdicional>` : ''}
					 </factura>`;
						/**
						 * Farmatear XML
						 */
						var stringXMLFormatted = format(stringXML, {
							collapseContent: true,
						});
						/**
						 * Generar carpeta para guardar los archivos
						 */
						generateFolder(
							taxpayer.id_taxpayer,
							institution.id_institution,
							institution.type_environment!,
							type_voucher!,
							todayDate,
							access_key_voucher
						);
						/**
						 * Obtenemos la firma(./file_store/signature/)
						 */
						const signature_taxpayer: Buffer = fs.readFileSync(
							`./file_store/signature/${taxpayer.signature_path_taxpayer}`
						);
						/**
						 * Desencriptamos la contraseña
						 */
						const signature_password_taxpayer: string =
							taxpayer.signature_password_taxpayer!;
						/**
						 * Realizamos el firmado mediante el módulo sign
						 */
						let signedXML: string;
						signVoucher(
							signature_taxpayer,
							signature_password_taxpayer,
							stringXMLFormatted
						)
							.then(async (_signedXML: string) => {
								signedXML = _signedXML;
								/**
								 * Guardamos el comprobante firmado en el file_store
								 */
								fs.writeFileSync(
									`${base_path_vocher}/${access_key_voucher}.xml`,
									signedXML
								);

								if (isToSolve) {
									console.log('MessageAPI: voucher to solve');
									voucher.id_voucher = sequence.id_voucher!;
									voucher.type_environment = sequence.type_environment;
									voucher.type_emission = taxpayer.type_emission;
									voucher.type_voucher = sequence.type_voucher;
									voucher.number_voucher = sequence.number_voucher;
									voucher.emission_date_voucher =
										sequence.emission_date_voucher;

									await this.individualVoucherProcess(
										voucher,
										sequence,
										finalSequence,
										todayDate,
										access_key_voucher,
										base_path_vocher,
										base_path_vocher_exclude_root,
										_typeServices
									)
										.then(async () => {
											await this.update(voucher)
												.then((_voucher: Voucher) => {
													resolve(_voucher);
												})
												.catch((error: string) => {
													reject(error);
												});
										})
										.catch((error: any) => {
											reject(error);
										});
								} else {
									/**
									 * Guardamos el comprobante en la base de datos
									 */
									await dml_voucher_create(voucher)
										.then(async (vouchers: Voucher[]) => {
											/**
											 * Mutate response
											 */
											let _voucher: Voucher = this.mutateResponse(vouchers)[0];
											/**
											 * Actualizar los atributos que vienen de la base de datos
											 */
											voucher.id_voucher = _voucher.id_voucher;
											voucher.number_voucher = _voucher.number_voucher;
											voucher.emission_date_voucher = parseDateToString(
												new Date(`${_voucher.emission_date_voucher}`)
											);
											/**
											 * Verificar instantly
											 */
											if (this.instantly) {
												await this.individualVoucherProcess(
													voucher,
													sequence,
													finalSequence,
													todayDate,
													access_key_voucher,
													base_path_vocher,
													base_path_vocher_exclude_root,
													_typeServices
												)
													.then(async () => {
														await this.update(voucher)
															.then((_voucher: Voucher) => {
																resolve(_voucher);
															})
															.catch((error: string) => {
																reject(error);
															});
													})
													.catch((error: any) => {
														reject(error);
													});
											} else {
												resolve(_voucher);
											}
										})
										.catch((error: string) => {
											reject(error);
										});
								}
							})
							.catch((error: any) => {
								reject(error);
							});
					} else {
						reject({
							..._businessMessages[2],
							description: _businessMessages[2].description.replace(
								'businessMessages',
								`La institucion no tiene secuenciales registradas`
							),
						});
					}
				})
				.catch((error: string) => {
					reject(error);
				});
		});
	}
	/**
	 * parseValoresExtrasTOcampoAdicional
	 * @param valoresExtras
	 * @param detallesLength
	 * @returns
	 */
	parseValoresExtrasTOcampoAdicional(
		valoresExtras: ValoresExtras,
		detallesLength: number
	) {
		const tasaProcesamiento = `{ "tasaProcesamiento": "${(
			detallesLength * valoresExtras.tasaProcesamiento
		).toFixed(2)}" }`;
		const interes = `{ "interes": "${valoresExtras.interes.toFixed(2)}" }`;
		const otros = `{ "otros": "${valoresExtras.otros.toFixed(2)}" }`;

		return {
			tasaProcesamiento: JSON.parse(tasaProcesamiento),
			interes: JSON.parse(interes),
			otros: JSON.parse(otros),
		};
	}
	/**
	 *
	 * @param voucher
	 * @returns
	 */
	read(voucher: Voucher) {
		return new Promise<Voucher[]>(async (resolve, reject) => {
			await view_voucher(voucher)
				.then((vouchers: Voucher[]) => {
					/**
					 * Mutate response
					 */
					const _vouchers = this.mutateResponse(vouchers);
					resolve(_vouchers);
				})
				.catch((error: string) => {
					reject(error);
				});
		});
	}
	/**
	 * specificRead
	 * @param voucher
	 * @returns
	 */
	specificRead(voucher: Voucher) {
		return new Promise<Voucher>(async (resolve, reject) => {
			await view_voucher_specific_read(voucher)
				.then((vouchers: Voucher[]) => {
					/**
					 * Mutate response
					 */
					const _vouchers = this.mutateResponse(vouchers);
					resolve(_vouchers[0]);
				})
				.catch((error: string) => {
					reject(error);
				});
		});
	}
	/**
	 * update
	 * @param voucher
	 * @returns
	 */
	update(voucher: Voucher) {
		return new Promise<Voucher>(async (resolve, reject) => {
			await dml_voucher_update(voucher)
				.then((vouchers: Voucher[]) => {
					/**
					 * Mutate response
					 */
					const _vouchers = this.mutateResponse(vouchers);

					resolve(_vouchers[0]);
				})
				.catch((error: string) => {
					reject(error);
				});
		});
	}
	/**
	 * byInstitutionRead
	 * @param voucher
	 * @returns
	 */
	byInstitutionRead(voucher: Voucher) {
		return new Promise<Voucher[]>(async (resolve, reject) => {
			await view_voucher_by_institution_read(voucher)
				.then((vouchers: Voucher[]) => {
					/**
					 * Mutate response
					 */
					const _vouchers = this.mutateResponse(vouchers);

					resolve(_vouchers);
				})
				.catch((error: string) => {
					reject(error);
				});
		});
	}
	/**
	 * byAccessKeyVoucherRead
	 * @param voucher
	 * @returns
	 */
	byAccessKeyVoucherRead(voucher: Voucher) {
		return new Promise<Voucher>(async (resolve, reject) => {
			await view_voucher_by_access_key_voucher_read(voucher)
				.then((vouchers: Voucher[]) => {
					/**
					 * Mutate response
					 */
					const _vouchers = this.mutateResponse(vouchers);
					resolve(_vouchers[0]);
				})
				.catch((error: string) => {
					reject(error);
				});
		});
	}
	/**
	 * byBuyerIdentifierVoucherRead
	 * @param voucher
	 * @returns
	 */
	byBuyerIdentifierVoucherRead(voucher: Voucher) {
		return new Promise<Voucher[]>(async (resolve, reject) => {
			await view_voucher_by_buyer_identifier_voucher_read(voucher)
				.then((vouchers: Voucher[]) => {
					/**
					 * Mutate response
					 */
					const _vouchers = this.mutateResponse(vouchers);
					resolve(_vouchers);
				})
				.catch((error: string) => {
					reject(error);
				});
		});
	}
	/**
	 * byBuyerIdentifierVoucherAndSearchByParameterRead
	 * @param voucher
	 * @returns
	 */
	byBuyerIdentifierVoucherAndSearchByParameterRead(voucher: Voucher) {
		return new Promise<Voucher[]>(async (resolve, reject) => {
			await view_voucher_by_buyer_identifier_voucher_and_search_by_parameter_read(
				voucher
			)
				.then((vouchers: Voucher[]) => {
					/**
					 * Mutate response
					 */
					const _vouchers = this.mutateResponse(vouchers);
					resolve(_vouchers);
				})
				.catch((error: string) => {
					reject(error);
				});
		});
	}
	/**
	 * byBuyerIdentifierAndEmissionYearVoucherRead
	 * @param voucher
	 * @returns
	 */
	byBuyerIdentifierAndEmissionYearVoucherRead(voucher: Voucher) {
		return new Promise<Voucher[]>(async (resolve, reject) => {
			await view_voucher_by_buyer_identifier_and_emission_year_voucher_read(
				voucher
			)
				.then((vouchers: Voucher[]) => {
					/**
					 * Mutate response
					 */
					const _vouchers = this.mutateResponse(vouchers);
					resolve(_vouchers);
				})
				.catch((error: string) => {
					reject(error);
				});
		});
	}
	/**
	 * byBuyerIdentifierAndRangeEmissionDateVoucherRead
	 * @param voucher
	 * @returns
	 */
	byBuyerIdentifierAndRangeEmissionDateVoucherRead(voucher: Voucher) {
		return new Promise<Voucher[]>(async (resolve, reject) => {
			await view_voucher_by_buyer_identifier_and_range_emission_date_voucher_read(
				voucher
			)
				.then((vouchers: Voucher[]) => {
					/**
					 * Mutate response
					 */
					const _vouchers = this.mutateResponse(vouchers);
					resolve(_vouchers);
				})
				.catch((error: string) => {
					reject(error);
				});
		});
	}
	/**
	 * ONLY GADMCP
	 */
	/**
	 * byBuyerIdentifierAndEmissionYearVoucherRead
	 * @param voucher
	 * @returns
	 */
	vouchersOfSQLServerRead(voucher: Voucher) {
		return new Promise<VoucherSQLServer[]>(async (resolve, reject) => {
			const id_institution: any = voucher.institution;
			let institutionToBring: InstitutionSQLServer;

			if (id_institution === '*') {
				institutionToBring = INSTITUTION_SQLSERVER[0];
			} else {
				institutionToBring = INSTITUTION_SQLSERVER.find(
					(item: InstitutionSQLServer) => item.id_institution == id_institution
				)!;
			}

			if (institutionToBring) {
				await view_voucher_of_sqlserver_read(institutionToBring, voucher)
					.then((rowsSQLServer: VoucherSQLServer[]) => {
						resolve(rowsSQLServer);
					})
					.catch((error: string) => {
						reject(error);
					});
			} else {
				reject({
					..._businessMessages[4],
					description: _businessMessages[4].description.replace(
						'businessMessages',
						`No se encontró la institución con el id ${id_institution}`
					),
				});
			}
		});
	}
	/**
	 * ONLY GADMCP
	 */
	/**
	 * vouchersOfSQLServerByParameterRead
	 * @param voucher
	 * @returns
	 */
	vouchersOfSQLServerByParameterRead(voucher: Voucher) {
		return new Promise<VoucherSQLServer[]>(async (resolve, reject) => {
			await view_voucher_of_sqlserver_by_parameter_read(voucher)
				.then((rowsSQLServer: VoucherSQLServer[]) => {
					resolve(rowsSQLServer);
				})
				.catch((error: string) => {
					reject(error);
				});
		});
	}
	/**
	 * byRangeEmissionDateVoucherRead
	 * @param voucher
	 * @returns
	 */
	byRangeEmissionDateVoucherRead(voucher: Voucher) {
		return new Promise<Voucher[]>(async (resolve, reject) => {
			await view_voucher_by_range_emission_date_voucher_read(voucher)
				.then((vouchers: Voucher[]) => {
					/**
					 * Mutate response
					 */
					const _vouchers = this.mutateResponse(vouchers);
					resolve(_vouchers);
				})
				.catch((error: string) => {
					reject(error);
				});
		});
	}
	/**
	 * delete
	 * @param voucher
	 * @returns
	 */
	delete(voucher: Voucher) {
		return new Promise<boolean>(async (resolve, reject) => {
			await dml_voucher_delete(voucher)
				.then((response: boolean) => {
					resolve(response);
				})
				.catch((error: string) => {
					reject(error);
				});
		});
	}
	/**
	 * signInWithBuyerIdentifierVoucher
	 * @param voucher
	 * @returns
	 */
	signInWithBuyerIdentifierVoucher(voucher: Voucher) {
		return new Promise<any>(async (resolve, reject) => {
			await auth_sign_in_with_buyer_identifier_voucher(voucher)
				.then(async (sequences: Sequence[] | any) => {
					if (sequences.length > 0) {
						const navigation: any = sequences[0].navigation;
						/**
						 * Obtener la secuencia de acuerdo a la validación del comprobante
						 */
						const _sequence = new Sequence();
						const sequence = _sequence.mutateResponse(sequences)[0];

						const user: UserClass = sequence.institution.taxpayer.user;

						const setting: Setting = user.company.setting;

						const identificacionComprador: string =
							sequence.body_voucher?.identificacionComprador!;
						const razonSocialComprador: string =
							sequence.body_voucher?.razonSocialComprador!;

						const _setting: Setting = {
							id_setting: setting.id_setting,
							expiration_token: setting.expiration_token,
							inactivity_time: setting.inactivity_time,
						};

						const _company: Company = {
							id_company: user.company.id_company,
							setting: _setting,
						};

						const _person: Person = {
							dni_person: identificacionComprador,
							name_person: razonSocialComprador,
						};

						const _profile: Profile = {
							id_profile: 0,
						};

						const _typeUser: TypeUser = {
							id_type_user: 0,
							profile: _profile,
						};

						const _user: User = {
							id_user: user.id_user,
							company: _company,
							person: _person,
							type_user: _typeUser,
							name_user: identificacionComprador,
							avatar_user: 'default.svg',
							status_user: true,
						};

						const payload: Payload = {
							id_session: 'S/N',
							name_user: identificacionComprador,
							name_person: razonSocialComprador,
							company: _company,
						};

						const expiration_token: number = parseInt(
							setting.expiration_token!.toString()
						);

						await generateToken(payload, expiration_token)
							.then((token: string) => {
								resolve({
									access_token: token,
									user: _user,
									navigation,
								});
							})
							.catch((err: any) => {
								reject(err);
							});

						/**
						 * Mutate response
						 */
						resolve(sequence);
					} else {
						reject({
							..._businessMessages[4],
							description: _businessMessages[4].description.replace(
								'businessMessages',
								'Ocurrio un error al consultar los comprobantes'
							),
						});
					}
				})
				.catch((error: string) => {
					reject(error);
				});
		});
	}
	/**
	 * Reports
	 */
	reportByRangeEmissionDateVoucher(voucher: Voucher) {
		return new Promise<any>(async (resolve, reject) => {
			await view_voucher_by_range_emission_date_voucher_read(voucher)
				.then(async (vouchers: Voucher[]) => {
					if (vouchers.length > 0) {
						/**
						 * Mutate response
						 */
						const _vouchers = this.mutateResponse(vouchers);

						const name_report = `report${generateRandomNumber(9)}`;

						const pathFinal = `${path.resolve(
							'./'
						)}/file_store/report/${name_report}.pdf`;
						/**
						 * Generar html
						 */
						const html = await reportByRangeEmissionDateVoucher(
							voucher,
							_vouchers
						);
						/**
						 * Instance the class
						 */
						const _report = new Report();

						const landscape: boolean = false;

						await _report
							.generateReport(name_report, html, landscape)
							.then(() => {
								resolve({ pathFinal, name_report });
							})
							.catch((error: any) => {
								reject(error);
							});
					} else {
						reject(_messages[10]);
					}
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}
	/**
	 *
	 * @param voucher
	 * @returns
	 */
	reportVouchersOfSQLServer(voucher: Voucher) {
		return new Promise<any>(async (resolve, reject) => {
			const id_institution: any = voucher.institution.id_institution;
			let institutionToBring: InstitutionSQLServer;

			if (id_institution === '*') {
				institutionToBring = INSTITUTION_SQLSERVER[0];
			} else {
				institutionToBring = INSTITUTION_SQLSERVER.find(
					(item: InstitutionSQLServer) => item.id_institution == id_institution
				)!;
			}

			if (institutionToBring) {
				await view_voucher_of_sqlserver_read(institutionToBring, voucher)
					.then(async (rowsSQLServer: VoucherSQLServer[]) => {
						if (rowsSQLServer.length > 0) {
							/**
							 * Mutate response
							 */
							const name_report = `report${generateRandomNumber(9)}`;

							const pathFinal = `${path.resolve(
								'./'
							)}/file_store/report/${name_report}.pdf`;
							/**
							 * Generar html
							 */
							const html = await reportVouchersOfSQLServer(
								voucher,
								rowsSQLServer
							);
							/**
							 * Instance the class
							 */
							const _report = new Report();

							const landscape: boolean = false;

							await _report
								.generateReport(name_report, html, landscape)
								.then(() => {
									resolve({ pathFinal, name_report });
								})
								.catch((error: any) => {
									reject(error);
								});
						} else {
							reject(_messages[10]);
						}
					})
					.catch((error: string) => {
						reject(error);
					});
			} else {
				reject({
					..._businessMessages[4],
					description: _businessMessages[4].description.replace(
						'businessMessages',
						`No se encontró la institución con el id ${id_institution}`
					),
				});
			}
		});
	}
	/**
	 *
	 * @param voucher
	 * @returns
	 */
	reportResumeVouchersOfSQLServer(voucher: Voucher) {
		return new Promise<any>(async (resolve, reject) => {
			const id_institution: any = voucher.institution.id_institution;
			let institutionToBring: InstitutionSQLServer;

			if (id_institution === '*') {
				institutionToBring = INSTITUTION_SQLSERVER[0];
			} else {
				institutionToBring = INSTITUTION_SQLSERVER.find(
					(item: InstitutionSQLServer) => item.id_institution == id_institution
				)!;
			}

			if (institutionToBring) {
				await view_voucher_of_sqlserver_read(institutionToBring, voucher)
					.then(async (rowsSQLServer: VoucherSQLServer[]) => {
						if (rowsSQLServer.length > 0) {
							/**
							 * Mutate response
							 */
							const name_report = `report${generateRandomNumber(9)}`;

							const pathFinal = `${path.resolve(
								'./'
							)}/file_store/report/${name_report}.pdf`;
							/**
							 * Generar html
							 */
							const html = await reportResumeVouchersOfSQLServer(
								voucher,
								rowsSQLServer
							);
							/**
							 * Instance the class
							 */
							const _report = new Report();

							const landscape: boolean = false;

							await _report
								.generateReport(name_report, html, landscape)
								.then(() => {
									resolve({ pathFinal, name_report });
								})
								.catch((error: any) => {
									reject(error);
								});
						} else {
							reject(_messages[10]);
						}
					})
					.catch((error: string) => {
						reject(error);
					});
			} else {
				reject({
					..._businessMessages[4],
					description: _businessMessages[4].description.replace(
						'businessMessages',
						`No se encontró la institución con el id ${id_institution}`
					),
				});
			}
		});
	}
	/**
	 * Global methods
	 */
	/**
	 * cancelVoucher
	 * @param voucher
	 * @returns
	 */
	cancelVoucher(voucher: Voucher) {
		return new Promise<Voucher>(async (resolve, reject) => {
			await dml_voucher_cancel(voucher)
				.then((vouchers: Voucher[]) => {
					/**
					 * Mutate response
					 */
					const _vouchers = this.mutateResponse(vouchers);
					resolve(_vouchers[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}
	/**
	 * autorizacionComprobante
	 * @param voucher
	 * @returns
	 */
	autorizacionComprobante(voucher: Voucher) {
		return new Promise<ResponseAutorizacionComprobante>(
			async (resolve, reject) => {
				await dml_voucher_validation(voucher)
					.then((vouchers: Voucher[]) => {
						if (vouchers.length > 0) {
							/**
							 * Mutate response
							 */
							const voucher = this.mutateResponse(vouchers)[0];
							/**
							 * Obtener la url de consulta al SRI dependiendo del ambiente y servicio del SRI
							 */
							const ServiceAutorizacionComprobantesOffline: SERVICE =
								_typeServices.find(
									(service: any) =>
										service.environment ==
											voucher.institution.type_environment &&
										service.type_service ==
											TYPE_SERVICE_ENUM.AutorizacionComprobantesOffline
								)!;
							/**
							 * Consultar comprobante
							 */
							this.autorizacionComprobanteSRI(
								ServiceAutorizacionComprobantesOffline.url,
								voucher.access_key_voucher!
							)
								.then(
									(
										_responseAutorizacionComprobante: ResponseAutorizacionComprobante
									) => {
										resolve(_responseAutorizacionComprobante);
									}
								)
								.catch((error: string) => {
									reject(error);
								});
						} else {
							reject({
								..._businessMessages[4],
								description: _businessMessages[4].description.replace(
									'businessMessages',
									'El comprobante no se encuentra registrado en WSFE'
								),
							});
						}
					})
					.catch((error: any) => {
						reject(error);
					});
			}
		);
	}
	/**
	 * autorizacionComprobanteSRI
	 * Comprobar el estado del comprobante en el SRI
	 * @param urlSend
	 * @param claveAcceso
	 * @returns
	 */
	autorizacionComprobanteSRI = (
		urlSend: string,
		claveAcceso: string
	): Promise<ResponseAutorizacionComprobante> => {
		return new Promise<ResponseAutorizacionComprobante>((resolve, reject) => {
			autorizacionComprobante(urlSend, claveAcceso)
				.then(
					(
						_responseAutorizacionComprobante: ResponseAutorizacionComprobante
					) => {
						resolve(_responseAutorizacionComprobante);
					}
				)
				.catch((error: string) => {
					reject(error);
				});
		});
	};
	/**
	 * reverseCancelVoucher
	 * @param voucher
	 * @returns
	 */
	reverseCancelVoucher(voucher: Voucher) {
		return new Promise<Voucher>(async (resolve, reject) => {
			await dml_voucher_reverse_cancel(voucher)
				.then((vouchers: Voucher[]) => {
					/**
					 * Mutate response
					 */
					const _vouchers = this.mutateResponse(vouchers);

					resolve(_vouchers[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}
	/**
	 * recepcionComprobanteInstantly
	 * @param voucher
	 * @returns
	 */
	recepcionComprobanteInstantly(voucher: Voucher) {
		return new Promise<Voucher>(async (resolve, reject) => {
			await dml_voucher_reception_instantly(voucher)
				.then(async (sequences: Sequence[]) => {
					/**
					 * Obtener la secuencia de acuerdo a la validación del comprobante
					 */
					const _sequence = new Sequence();
					const sequence = _sequence.mutateResponse(sequences)[0];
					/**
					 * Obtener las variables necesarias para realizar individualVoucherProcess
					 */
					const institution: Institution = sequence.institution;
					const taxpayer: Taxpayer = sequence.institution.taxpayer;
					/**
					 * Read by access key
					 */
					await this.byAccessKeyVoucherRead(voucher)
						.then(async (_voucher: Voucher) => {
							/**
							 * Actualizar los attributos
							 */
							voucher.id_voucher = _voucher.id_voucher;
							voucher.institution = _voucher.institution;
							voucher.type_environment = _voucher.type_environment;
							voucher.type_emission = _voucher.type_emission;
							voucher.type_voucher = _voucher.type_voucher;
							voucher.number_voucher = _voucher.number_voucher;
							voucher.access_key_voucher = _voucher.access_key_voucher;
							voucher.emission_date_voucher = parseDateToString(
								new Date(_voucher.emission_date_voucher!)
							);
							voucher.authorization_date_voucher =
								_voucher.authorization_date_voucher;
							voucher.buyer_identifier_voucher =
								_voucher.buyer_identifier_voucher;
							voucher.body_voucher = _voucher.body_voucher;
							voucher.internal_status_voucher =
								_voucher.internal_status_voucher;
							voucher.global_status_voucher = _voucher.global_status_voucher;
							voucher.action_pdf_voucher = _voucher.action_pdf_voucher;
							voucher.action_email_voucher = _voucher.action_email_voucher;
							voucher.action_alfresco_voucher =
								_voucher.action_alfresco_voucher;
							voucher.messages_voucher = _voucher.messages_voucher;
							voucher.deleted_voucher = _voucher.deleted_voucher;

							const finalSequence: string = getSecuencialByAccessKey(
								voucher.access_key_voucher!
							);
							const fullYear: string = getFullYearByAccessKey(
								voucher.access_key_voucher!
							);
							const month: string = getMothByAccessKey(
								voucher.access_key_voucher!
							);
							/**
							 * Obtenemos la fecha actual FullDate
							 */
							const todayDate: FullDate = getFullDate(currentDateEC);
							/**
							 * Armamos los paths del comprobante
							 */
							const base_path_vocher_exclude_root: string = `/file_store/electronic_voucher/${
								taxpayer.id_taxpayer
							}/${
								institution.id_institution
							}/${institution.type_environment!}/${voucher.type_voucher!}/${fullYear}/${month}/${
								voucher.access_key_voucher
							}`;

							const base_path_vocher: string = `.${base_path_vocher_exclude_root}`;

							voucher.body_voucher = sequence.body_voucher!;

							/**
							 * individualVoucherProcess
							 */
							await this.individualVoucherProcess(
								voucher,
								sequence,
								finalSequence,
								todayDate,
								voucher.access_key_voucher!,
								base_path_vocher,
								base_path_vocher_exclude_root,
								_typeServices
							)
								.then(async () => {
									await this.update(voucher)
										.then((_voucher: Voucher) => {
											resolve(_voucher);
										})
										.catch((error: any) => {
											reject(error);
										});
								})
								.catch((error: any) => {
									reject(error);
								});
						})
						.catch((error: any) => {
							reject(error);
						});
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}
	/**
	 * sendVoucherByBatchByInstitution
	 * @param voucher
	 * @returns
	 */
	sendVoucherByBatchByInstitution(voucher: Voucher) {
		return new Promise<string[]>(async (resolve, reject) => {
			const IS_BY_TAXPAYER: boolean = false;
			/**
			 * First check validation
			 */
			await dml_voucher_by_batch_by_institution(voucher)
				.then(async (sequences: Sequence[]) => {
					if (sequences.length > 0) {
						/**
						 * Obtener la secuencia de acuerdo a la validación del comprobante
						 */
						const _sequence = new Sequence();
						/**
						 * Mutate response
						 */
						const _sequences = _sequence.mutateResponse(sequences);
						let vouchers: string[] = this.getStringArrayAccessKey(_sequences);
						/**
						 * sendVoucherByBatch
						 */
						this.sendVoucherByBatch(voucher, _sequences, IS_BY_TAXPAYER)
							.then(() => {
								resolve(vouchers);
							})
							.catch((error) => {
								console.log(error);
							});
					} else {
						reject({
							..._businessMessages[4],
							description: _businessMessages[4].description.replace(
								'businessMessages',
								'No se encontraron comprobantes registrados con los parámetros ingresados'
							),
						});
					}
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}
	/**
	 * sendVoucherByBatchByTaxpayer
	 * @param voucher
	 * @returns
	 */
	sendVoucherByBatchByTaxpayer(voucher: Voucher) {
		return new Promise<string[]>(async (resolve, reject) => {
			const IS_BY_TAXPAYER: boolean = true;
			/**
			 * First check validation
			 */
			await dml_voucher_by_batch_by_taxpayer(voucher)
				.then(async (sequences: Sequence[]) => {
					if (sequences.length > 0) {
						/**
						 * Obtener la secuencia de acuerdo a la validación del comprobante
						 */
						const _sequence = new Sequence();
						/**
						 * Mutate response
						 */
						const _sequences = _sequence.mutateResponse(sequences);
						let vouchers: string[] = this.getStringArrayAccessKey(_sequences);
						/**
						 * sendVoucherByBatch
						 */
						this.sendVoucherByBatch(voucher, _sequences, IS_BY_TAXPAYER)
							.then(() => {
								resolve(vouchers);
							})
							.catch((error) => {
								console.log(error);
							});
					} else {
						reject({
							..._businessMessages[4],
							description: _businessMessages[4].description.replace(
								'businessMessages',
								'No se encontraron comprobantes registrados con los parámetros ingresados'
							),
						});
					}
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}
	/**
	 * sendVoucherByBatch
	 * @param voucher
	 * @param sequences
	 * @returns
	 */
	sendVoucherByBatch(
		voucher: Voucher,
		sequences: Sequence[],
		isByTaxpayer: boolean
	): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			const setting: SettingCompany =
				sequences[0].institution.taxpayer.user.company.setting;

			const batch_shipping: boolean = setting.batch_shipping!;
			const max_generation_pdf: number = setting.max_generation_pdf!;
			const wait_generation_pdf: number = setting.wait_generation_pdf! * 1000;

			const _institution = new Institution();
			const _taxpayer = new Taxpayer();

			if (batch_shipping) {
				console.log(`MessageAPI: process with ByBatch`);
				let INC: number = 1;
				const counter: Generator<number, void, unknown> = this.generator(
					sequences.length
				);

				for (let index: number = 0; index < sequences.length; index++) {
					if (index < max_generation_pdf * INC) {
						setTimeout(async () => {
							/**
							 * Obtener las variables necesarias para realizar individualVoucherProcess
							 */
							const institution: Institution = sequences[index].institution;
							const taxpayer: Taxpayer = sequences[index].institution.taxpayer;
							voucher.access_key_voucher = sequences[index].access_key_voucher!;

							const last_voucher: string =
								sequences[sequences.length - 1].access_key_voucher!;

							if (voucher.access_key_voucher === last_voucher) {
								if (isByTaxpayer) {
									_taxpayer.id_user_ = voucher.id_user_;
									_taxpayer.id_taxpayer =
										voucher.institution.taxpayer.id_taxpayer;
									_taxpayer.status_by_batch_taxpayer = false;

									setTimeout(async () => {
										await _taxpayer
											.changeStatusByBatchTaxpayer(_taxpayer)
											.then(() => {
												console.log(
													`MessageAPI: changeStatusByBatchTaxpayer -> ${_taxpayer.id_taxpayer}`
												);
											})
											.catch((error: string) => {
												console.log(error);
											});
									}, this.process_time);
								} else {
									_institution.id_user_ = voucher.id_user_;
									_institution.id_institution =
										voucher.institution.id_institution;
									_institution.status_by_batch_institution = false;

									setTimeout(async () => {
										await _institution
											.changeStatusByBatchInstitution(_institution)
											.then(() => {
												console.log(
													`MessageAPI: changeStatusByBatchInstitution -> ${_institution.id_institution}`
												);
											})
											.catch((error: string) => {
												console.log(error);
											});
									}, this.process_time);
								}
							}
							/**
							 * Read by access key
							 */
							await this.byAccessKeyVoucherRead(voucher)
								.then(async (_voucher: Voucher) => {
									/**
									 * Actualizar los attributos
									 */
									let voucher_: Voucher = _voucher;
									voucher_.id_user_ = voucher.id_user_;

									voucher_.id_voucher = _voucher.id_voucher;
									voucher_.institution = _voucher.institution;
									voucher_.type_environment = _voucher.type_environment;
									voucher_.type_emission = _voucher.type_emission;
									voucher_.type_voucher = _voucher.type_voucher;
									voucher_.number_voucher = _voucher.number_voucher;
									voucher_.access_key_voucher = _voucher.access_key_voucher;
									voucher_.emission_date_voucher = parseDateToString(
										new Date(_voucher.emission_date_voucher!)
									);
									voucher_.authorization_date_voucher =
										_voucher.authorization_date_voucher;
									voucher_.buyer_identifier_voucher =
										_voucher.buyer_identifier_voucher;
									voucher_.body_voucher = _voucher.body_voucher;
									voucher_.internal_status_voucher =
										_voucher.internal_status_voucher;
									voucher_.global_status_voucher =
										_voucher.global_status_voucher;
									voucher_.action_pdf_voucher = _voucher.action_pdf_voucher;
									voucher_.action_email_voucher = _voucher.action_email_voucher;
									voucher_.action_alfresco_voucher =
										_voucher.action_alfresco_voucher;
									voucher_.messages_voucher = _voucher.messages_voucher;
									voucher_.deleted_voucher = _voucher.deleted_voucher;

									const finalSequence: string = getSecuencialByAccessKey(
										voucher_.access_key_voucher!
									);
									const fullYear: string = getFullYearByAccessKey(
										voucher.access_key_voucher!
									);
									const month: string = getMothByAccessKey(
										voucher.access_key_voucher!
									);
									/**
									 * Obtenemos la fecha actual FullDate
									 */
									const todayDate: FullDate = getFullDate(currentDateEC);
									/**
									 * Armamos los paths del comprobante
									 */
									const base_path_vocher_exclude_root: string = `/file_store/electronic_voucher/${
										taxpayer.id_taxpayer
									}/${
										institution.id_institution
									}/${institution.type_environment!}/${voucher_.type_voucher!}/${fullYear}/${month}/${
										voucher_.access_key_voucher
									}`;

									const base_path_vocher: string = `.${base_path_vocher_exclude_root}`;
									/**
									 * individualVoucherProcess
									 */
									await this.individualVoucherProcess(
										voucher_,
										sequences[index],
										finalSequence,
										todayDate,
										voucher_.access_key_voucher!,
										base_path_vocher,
										base_path_vocher_exclude_root,
										_typeServices
									)
										.then(async () => {
											await this.update(voucher_)
												.then((_voucher: Voucher) => {
													console.log(
														`MessageAPI: ended process -> ${_voucher.access_key_voucher}`
													);
												})
												.catch((error: any) => {
													console.log(error);
												});
										})
										.catch((error: any) => {
											console.log(error);
										});
								})
								.catch((error: any) => {
									console.log(error);
								});
							/**
							 * next generator
							 */
							counter.next();
						}, wait_generation_pdf * INC);
						if (index + 1 == max_generation_pdf * INC) {
							INC = INC + 1;
						}
					}
				}
			} else {
				console.log(`MessageAPI: process without ByBatch`);
				sequences.map(async (_sequence: Sequence, index: number) => {
					/**
					 * Obtener las variables necesarias para realizar individualVoucherProcess
					 */
					const institution: Institution = _sequence.institution;
					const taxpayer: Taxpayer = _sequence.institution.taxpayer;
					voucher.access_key_voucher = _sequence.access_key_voucher!;
					/**
					 * Read by access key
					 */
					await this.byAccessKeyVoucherRead(voucher)
						.then(async (_voucher: Voucher) => {
							/**
							 * Actualizar los attributos
							 */
							let voucher_: Voucher = _voucher;
							voucher_.id_user_ = voucher.id_user_;

							voucher_.id_voucher = _voucher.id_voucher;
							voucher_.institution = _voucher.institution;
							voucher_.type_environment = _voucher.type_environment;
							voucher_.type_emission = _voucher.type_emission;
							voucher_.type_voucher = _voucher.type_voucher;
							voucher_.number_voucher = _voucher.number_voucher;
							voucher_.access_key_voucher = _voucher.access_key_voucher;
							voucher_.emission_date_voucher = parseDateToString(
								new Date(_voucher.emission_date_voucher!)
							);
							voucher_.authorization_date_voucher =
								_voucher.authorization_date_voucher;
							voucher_.buyer_identifier_voucher =
								_voucher.buyer_identifier_voucher;
							voucher_.body_voucher = _voucher.body_voucher;
							voucher_.internal_status_voucher =
								_voucher.internal_status_voucher;
							voucher_.global_status_voucher = _voucher.global_status_voucher;
							voucher_.action_pdf_voucher = _voucher.action_pdf_voucher;
							voucher_.action_email_voucher = _voucher.action_email_voucher;
							voucher_.action_alfresco_voucher =
								_voucher.action_alfresco_voucher;
							voucher_.messages_voucher = _voucher.messages_voucher;
							voucher_.deleted_voucher = _voucher.deleted_voucher;

							const finalSequence: string = getSecuencialByAccessKey(
								voucher_.access_key_voucher!
							);
							const fullYear: string = getFullYearByAccessKey(
								voucher.access_key_voucher!
							);
							const month: string = getMothByAccessKey(
								voucher.access_key_voucher!
							);
							/**
							 * Obtenemos la fecha actual FullDate
							 */
							const todayDate: FullDate = getFullDate(currentDateEC);
							/**
							 * Armamos los paths del comprobante
							 */
							const base_path_vocher_exclude_root: string = `/file_store/electronic_voucher/${
								taxpayer.id_taxpayer
							}/${
								institution.id_institution
							}/${institution.type_environment!}/${voucher_.type_voucher!}/${fullYear}/${month}/${
								voucher_.access_key_voucher
							}`;

							const base_path_vocher: string = `.${base_path_vocher_exclude_root}`;

							voucher_.body_voucher = _sequence.body_voucher!;

							/**
							 * individualVoucherProcess
							 */
							await this.individualVoucherProcess(
								voucher_,
								_sequence,
								finalSequence,
								todayDate,
								voucher_.access_key_voucher!,
								base_path_vocher,
								base_path_vocher_exclude_root,
								_typeServices
							)
								.then(async () => {
									await this.update(voucher_)
										.then((_voucher: Voucher) => {
											console.log(
												`MessageAPI: ended process -> ${_voucher.access_key_voucher}`
											);
										})
										.catch((error: any) => {
											console.log(error);
										});
								})
								.catch((error: any) => {
									console.log(error);
								});
						})
						.catch((error: any) => {
							console.log(error);
						});

					if (index + 1 == sequences.length) {
						if (isByTaxpayer) {
							_taxpayer.id_user_ = voucher.id_user_;
							_taxpayer.id_taxpayer = voucher.institution.taxpayer.id_taxpayer;
							_taxpayer.status_by_batch_taxpayer = false;

							setTimeout(async () => {
								await _taxpayer
									.changeStatusByBatchTaxpayer(_taxpayer)
									.then(() => {
										console.log(
											`MessageAPI: changeStatusByBatchTaxpayer -> ${_taxpayer.id_taxpayer}`
										);
									})
									.catch((error: string) => {
										console.log(error);
									});
							}, this.process_time);
						} else {
							_institution.id_user_ = voucher.id_user_;
							_institution.id_institution = voucher.institution.id_institution;
							_institution.status_by_batch_institution = false;

							setTimeout(async () => {
								await _institution
									.changeStatusByBatchInstitution(_institution)
									.then(() => {
										console.log(
											`MessageAPI: changeStatusByBatchInstitution -> ${_institution.id_institution}`
										);
									})
									.catch((error: string) => {
										console.log(error);
									});
							}, this.process_time);
						}
					}
				});
			}
			resolve(true);
		});
	}
	/**
	 * generator
	 * @param longitud
	 */
	*generator(longitud: number): Generator<number, void, unknown> {
		let index: number = 0;
		while (index < longitud) {
			yield index;
			index = index + 1;
		}
	}
	/**
	 * getStringArrayAccessKey
	 * @param sequences
	 */
	getStringArrayAccessKey(sequences: Sequence[]): string[] {
		let vouchers: string[] = [];
		sequences.map((sequence: Sequence) => {
			vouchers.push(sequence.access_key_voucher!);
		});
		return this.removeDuplicates(vouchers);
	}
	/**
	 * removeDuplicates
	 * @param array
	 * @returns
	 */
	removeDuplicates(array: string[]) {
		return array.filter((item, index) => array.indexOf(item) === index);
	}
	/**
	 * completeProcess
	 * @param voucher
	 * @returns
	 */
	completeProcess(voucher: Voucher) {
		return new Promise<Voucher>(async (resolve, reject) => {
			await dml_voucher_complete_process(voucher)
				.then(async (sequences: Sequence[]) => {
					if (sequences.length > 0) {
						/**
						 * Obtener la secuencia de acuerdo a la validación del comprobante
						 */
						const _sequence = new Sequence();
						const sequence = _sequence.mutateResponse(sequences)[0];
						/**
						 * Obtener las variables necesarias para realizar individualVoucherProcess
						 */
						const institution: Institution = sequence.institution;
						const taxpayer: Taxpayer = sequence.institution.taxpayer;
						/**
						 * Read by access key
						 */
						await this.byAccessKeyVoucherRead(voucher)
							.then(async (_voucher: Voucher) => {
								/**
								 * Actualizar los attributos
								 */
								voucher.id_voucher = _voucher.id_voucher;
								voucher.institution = _voucher.institution;
								voucher.type_environment = _voucher.type_environment;
								voucher.type_emission = _voucher.type_emission;
								voucher.type_voucher = _voucher.type_voucher;
								voucher.number_voucher = _voucher.number_voucher;
								voucher.access_key_voucher = _voucher.access_key_voucher;
								voucher.emission_date_voucher = parseDateToString(
									new Date(_voucher.emission_date_voucher!)
								);
								voucher.authorization_date_voucher =
									_voucher.authorization_date_voucher;
								voucher.buyer_identifier_voucher =
									_voucher.buyer_identifier_voucher;
								voucher.body_voucher = _voucher.body_voucher;
								voucher.internal_status_voucher =
									_voucher.internal_status_voucher;
								voucher.global_status_voucher = _voucher.global_status_voucher;
								voucher.action_pdf_voucher = _voucher.action_pdf_voucher;
								voucher.action_email_voucher = _voucher.action_email_voucher;
								voucher.action_alfresco_voucher =
									_voucher.action_alfresco_voucher;
								voucher.messages_voucher = _voucher.messages_voucher;
								voucher.deleted_voucher = _voucher.deleted_voucher;

								const finalSequence: string = getSecuencialByAccessKey(
									voucher.access_key_voucher!
								);
								const fullYear: string = getFullYearByAccessKey(
									voucher.access_key_voucher!
								);
								const month: string = getMothByAccessKey(
									voucher.access_key_voucher!
								);
								/**
								 * Obtenemos la fecha actual FullDate
								 */
								const todayDate: FullDate = getFullDate(currentDateEC);
								/**
								 * Armamos los paths del comprobante
								 */
								const base_path_vocher_exclude_root: string = `/file_store/electronic_voucher/${
									taxpayer.id_taxpayer
								}/${
									institution.id_institution
								}/${institution.type_environment!}/${voucher.type_voucher!}/${fullYear}/${month}/${
									voucher.access_key_voucher
								}`;

								const base_path_vocher: string = `.${base_path_vocher_exclude_root}`;

								voucher.body_voucher = sequence.body_voucher!;
								/**
								 * completeIndividualVoucherProcess
								 */
								await this.completeIndividualVoucherProcess(
									voucher,
									sequence,
									finalSequence,
									todayDate,
									voucher.access_key_voucher!,
									base_path_vocher,
									base_path_vocher_exclude_root,
									_typeServices
								).then(async (voucher: Voucher) => {
									/**
									 * Actualizamos el comprobante
									 */
									await this.update(voucher)
										.then((_voucher: Voucher) => {
											resolve(_voucher);
										})
										.catch((error: any) => {
											reject(error);
										});
								});
							})
							.catch((error: any) => {
								reject(error);
							});
					} else {
						reject({
							..._businessMessages[4],
							description: _businessMessages[4].description.replace(
								'businessMessages',
								'No se encontraron comprobantes registrados con los parámetros ingresados'
							),
						});
					}
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}
	/**
	 *  completeIndividualVoucherProcess
	 * @param voucher
	 * @param sequence
	 * @param finalSequence
	 * @param todayDate
	 * @param access_key_voucher
	 * @param base_path_vocher
	 * @param base_path_vocher_exclude_root
	 * @param typeServices
	 * @returns
	 */
	completeIndividualVoucherProcess = (
		voucher: Voucher,
		sequence: Sequence,
		finalSequence: string,
		todayDate: FullDate,
		access_key_voucher: string,
		base_path_vocher: string,
		base_path_vocher_exclude_root: string,
		typeServices: SERVICE[]
	): Promise<Voucher> => {
		return new Promise<Voucher>(async (resolve, reject) => {
			let messages_voucher: string[] = [];
			/**
			 * Obtener las variables necesarias para el proceso individual del comprobante
			 */
			const institution: Institution = sequence.institution;
			const setting: SettingCompany =
				sequence.institution.taxpayer.user.company.setting;
			/**
			 * Si la fecha de autorización es null o '', verificamos su estado en el SRI
			 */
			if (
				voucher.authorization_date_voucher == null ||
				voucher.authorization_date_voucher == ''
			) {
				/**
				 * Obtener la url de consulta al SRI dependiendo del ambiente y servicio del SRI
				 */
				const ServiceAutorizacionComprobantesOffline: SERVICE =
					_typeServices.find(
						(service: any) =>
							service.environment == institution.type_environment &&
							service.type_service ==
								TYPE_SERVICE_ENUM.AutorizacionComprobantesOffline
					)!;
				/**
				 *  Consultamos el servicio autorizacionComprobante
				 */
				await this.autorizacionComprobanteSRI(
					ServiceAutorizacionComprobantesOffline.url,
					access_key_voucher
				)
					.then(
						async (
							_responseAutorizacionComprobante: ResponseAutorizacionComprobante
						) => {
							if (
								_responseAutorizacionComprobante
									.RespuestaAutorizacionComprobante.autorizaciones == null
							) {
								/**
								 * Comprobante NO autorizado
								 */
								console.log('MessageAPI: voucher not authorized');
								/**
								 * Obtenemos el comprobante que vamos a enviar el SRI
								 */
								const sendingXML: string = fs.readFileSync(
									`${base_path_vocher}/${access_key_voucher}.xml`,
									'utf8'
								);
								/**
								 * Trasformar el XML a Base64 (Es necesario enviarlo de esta manera ya que el SRI lo pide así)
								 */
								const signedXMLBase64: string =
									Buffer.from(sendingXML).toString('base64');
								/**
								 * Obtener la url de envió al SRI dependiendo del ambiente y servicio del SRI
								 */
								const ServiceRecepcionComprobantesOffline: SERVICE =
									typeServices.find(
										(service: any) =>
											service.environment == institution.type_environment &&
											service.type_service ==
												TYPE_SERVICE_ENUM.RecepcionComprobantesOffline
									)!;
								/**
								 * Enviar Comprobante
								 */
								console.log('MessageAPI: sending voucher to the SRI');

								let respuestaRecepcionComprobante!: RespuestaRecepcionComprobante;
								await validarComprobante(
									ServiceRecepcionComprobantesOffline.url,
									signedXMLBase64
								)
									.then(
										(
											_responseRecepcionComprobante: ResponseRecepcionComprobante
										) => {
											respuestaRecepcionComprobante =
												_responseRecepcionComprobante.RespuestaRecepcionComprobante;
										}
									)
									.catch((error: string) => {
										reject(error);
										return;
									});
								/**
								 * Obtenemos la configuración de la empresa
								 */
								const wait_autorization: number =
									setting.wait_autorization! * 1000;
								/**
								 * RECIBIDA o DEVUELTA
								 */
								if (respuestaRecepcionComprobante != undefined) {
									if (respuestaRecepcionComprobante.estado == 'RECIBIDA') {
										/**
										 * Consultar el estado del comprobante (El setTimeoutPromise es porque el SRI envía el recibido pero tarda un poco en procesar el comprobante)
										 */
										console.log(
											`MessageAPI: waiting ${wait_autorization} milliseconds for the SRI to authorize the voucher`
										);
										setTimeoutPromise(wait_autorization).then(async () => {
											console.log(`MessageAPI: we started`);
											/**
											 * Obtener la url de consulta al SRI dependiendo del ambiente y servicio del SRI
											 */
											const ServiceAutorizacionComprobantesOffline: SERVICE =
												_typeServices.find(
													(service: any) =>
														service.environment ==
															institution.type_environment &&
														service.type_service ==
															TYPE_SERVICE_ENUM.AutorizacionComprobantesOffline
												)!;
											/**
											 *  Consultamos el servicio autorizacionComprobante
											 */
											await this.autorizacionComprobanteSRI(
												ServiceAutorizacionComprobantesOffline.url,
												access_key_voucher
											)
												.then(
													async (
														_responseAutorizacionComprobante: ResponseAutorizacionComprobante
													) => {
														/**
														 * Ejecutar Acciones si el comprobante está Autorizado
														 */
														if (
															_responseAutorizacionComprobante
																.RespuestaAutorizacionComprobante.autorizaciones
																.autorizacion.estado == 'AUTORIZADO'
														) {
															/**
															 * Establecer el estado de acuerdo, a su estado interno anterior, para no cambiar el estado a los comprobantes que se encuentren anulados
															 */
															voucher.internal_status_voucher =
																voucher.internal_status_voucher === 'pending'
																	? 'authorized'
																	: voucher.internal_status_voucher;
															voucher.global_status_voucher = 'authorized';
															/**
															 * Obtenemos la fecha de autorización del comprobante
															 */
															const authorizationDate: Date =
																_responseAutorizacionComprobante
																	.RespuestaAutorizacionComprobante
																	.autorizaciones.autorizacion
																	.fechaAutorizacion;

															if (authorizationDate) {
																const stringDateAuthorization: string =
																	parseDateToString(
																		new Date(authorizationDate)
																	);
																/**
																 * Set authorization_date_voucher
																 */
																voucher.authorization_date_voucher =
																	stringDateAuthorization;

																const dateStringWithTimeZone: string =
																	parseDateToStringWithTimeZone(
																		new Date(authorizationDate)
																	);

																const dateReplace: FullDate = getFullDate(
																	voucher.emission_date_voucher!
																);

																console.log(
																	'dateReplace 1: ' +
																		JSON.stringify(dateReplace)
																);

																this.completeProcessFunctional(
																	voucher,
																	sequence,
																	finalSequence,
																	dateReplace,
																	access_key_voucher,
																	base_path_vocher,
																	base_path_vocher_exclude_root,
																	dateStringWithTimeZone
																).then((voucher: Voucher) => {
																	resolve(voucher);
																});
															} else {
																/**
																 * Fecha invalida
																 */
																messages_voucher.push(
																	JSON.stringify({
																		..._businessMessages[3],
																		description:
																			_businessMessages[3].description.replace(
																				'businessMessages',
																				'La fecha de autorización no es valida'
																			),
																	})
																);
																voucher.messages_voucher = JSON.stringify({
																	messages_voucher,
																});
																resolve(voucher);
															}
														} else {
															/**
															 * Comprobante no autorizado
															 */
															messages_voucher.push(
																JSON.stringify({
																	..._businessMessages[3],
																	description:
																		_businessMessages[3].description.replace(
																			'businessMessages',
																			`El comprobante no se encuentra autorizado, consulte la clave de acceso ${access_key_voucher}`
																		),
																})
															);
															voucher.messages_voucher = JSON.stringify({
																messages_voucher,
															});
															resolve(voucher);
														}
													}
												)
												.catch((error: string) => {
													messages_voucher.push(error);
													voucher.messages_voucher = JSON.stringify({
														messages_voucher,
													});
													resolve(voucher);
												});
										});
									} else if (
										respuestaRecepcionComprobante.estado == 'DEVUELTA'
									) {
										messages_voucher.push(
											JSON.stringify(
												respuestaRecepcionComprobante.comprobantes.comprobante
													.mensajes
											)
										);
										voucher.messages_voucher = JSON.stringify({
											messages_voucher,
										});

										resolve(voucher);
									} else {
										/**
										 * Fecha invalida
										 */
										messages_voucher.push(
											JSON.stringify({
												..._businessMessages[3],
												description: _businessMessages[3].description.replace(
													'businessMessages',
													'El SRI no recibió el comprobante (ESTADO DESCONOCIDO), compruebe la información'
												),
											})
										);
										voucher.messages_voucher = JSON.stringify({
											messages_voucher,
										});
										resolve(voucher);
									}
								} else {
									/**
									 * Fecha invalida
									 */
									messages_voucher.push(
										JSON.stringify({
											..._businessMessages[3],
											description: _businessMessages[3].description.replace(
												'businessMessages',
												'No se recibio la respuestaRecepcionComprobante'
											),
										})
									);
									voucher.messages_voucher = JSON.stringify({
										messages_voucher,
									});
									resolve(voucher);
								}
							} else if (
								_responseAutorizacionComprobante
									.RespuestaAutorizacionComprobante.autorizaciones.autorizacion
									.estado == 'AUTORIZADO'
							) {
								/**
								 * Comprobante autorizado
								 */
								console.log('MessageAPI: voucher authorized');
								/**
								 * Establecer el estado de acuerdo, a su estado interno anterior, para no cambiar el estado a los comprobantes que se encuentren anulados
								 */
								voucher.internal_status_voucher =
									voucher.internal_status_voucher === 'pending'
										? 'authorized'
										: voucher.internal_status_voucher;
								voucher.global_status_voucher = 'authorized';
								/**
								 * Obtenemos la fecha de autorización del comprobante
								 */
								const authorizationDate: Date =
									_responseAutorizacionComprobante
										.RespuestaAutorizacionComprobante.autorizaciones
										.autorizacion.fechaAutorizacion;

								if (authorizationDate) {
									const stringDateAuthorization: string = parseDateToString(
										new Date(authorizationDate)
									);
									/**
									 * Set authorization_date_voucher
									 */
									voucher.authorization_date_voucher = stringDateAuthorization;

									const dateStringWithTimeZone: string =
										parseDateToStringWithTimeZone(new Date(authorizationDate));

									const dateReplace: FullDate = getFullDate(
										voucher.emission_date_voucher!
									);

									console.log('dateReplace 2: ' + JSON.stringify(dateReplace));

									this.completeProcessFunctional(
										voucher,
										sequence,
										finalSequence,
										dateReplace,
										access_key_voucher,
										base_path_vocher,
										base_path_vocher_exclude_root,
										dateStringWithTimeZone
									).then((voucher: Voucher) => {
										resolve(voucher);
									});
								} else {
									/**
									 * Fecha invalida
									 */
									messages_voucher.push(
										JSON.stringify({
											..._businessMessages[3],
											description: _businessMessages[3].description.replace(
												'businessMessages',
												'La fecha de autorización no es valida'
											),
										})
									);
									voucher.messages_voucher = JSON.stringify({
										messages_voucher,
									});
									resolve(voucher);
								}
							} else {
								messages_voucher.push(
									JSON.stringify({
										..._businessMessages[3],
										description: _businessMessages[3].description.replace(
											'businessMessages',
											`El comprobante no se encuentra autorizado, consulte la clave de acceso ${access_key_voucher}`
										),
									})
								);
								voucher.messages_voucher = JSON.stringify({
									messages_voucher,
								});
								resolve(voucher);
							}
						}
					)
					.catch((error: string) => {
						messages_voucher.push(error);
						voucher.messages_voucher = JSON.stringify({
							messages_voucher,
						});
						resolve(voucher);
					});
			} else {
				console.log('MessageAPI: voucher with authorization_date_voucher');
				/**
				 * Comprobante con la authorization_date_voucher
				 */
				voucher.internal_status_voucher =
					voucher.internal_status_voucher === 'pending'
						? 'authorized'
						: voucher.internal_status_voucher;
				voucher.global_status_voucher = 'authorized';

				const authorizationDate: any = voucher.authorization_date_voucher;
				const stringDateAuthorization: string = parseDateToString(
					new Date(authorizationDate)
				);
				/**
				 * Set authorization_date_voucher
				 */
				voucher.authorization_date_voucher = stringDateAuthorization;
				const dateStringWithTimeZone: string = parseDateToStringWithTimeZone(
					new Date(authorizationDate)
				);

				const dateReplace: FullDate = getFullDate(
					voucher.emission_date_voucher!
				);

				console.log('dateReplace 3: ' + JSON.stringify(dateReplace));

				await this.completeProcessFunctional(
					voucher,
					sequence,
					finalSequence,
					dateReplace,
					access_key_voucher,
					base_path_vocher,
					base_path_vocher_exclude_root,
					dateStringWithTimeZone
				).then((voucher: Voucher) => {
					resolve(voucher);
				});
			}
		});
	};
	/**
	 * completeProcessFunctional
	 * @param voucher
	 * @param sequence
	 * @param finalSequence
	 * @param todayDate
	 * @param access_key_voucher
	 * @param base_path_vocher
	 * @param base_path_vocher_exclude_root
	 * @param stringDateAuthorization
	 * @returns
	 */
	completeProcessFunctional(
		voucher: Voucher,
		sequence: Sequence,
		finalSequence: string,
		todayDate: FullDate,
		access_key_voucher: string,
		base_path_vocher: string,
		base_path_vocher_exclude_root: string,
		stringDateAuthorization: string
	): Promise<Voucher> {
		return new Promise<Voucher>(async (resolve) => {
			let messages_voucher: string[] = [];

			const save_alfresco: boolean =
				sequence.institution.taxpayer.user.company.setting.save_alfresco!;
			const setting_taxpayer: SettingTaxpayer =
				sequence.institution.taxpayer.setting_taxpayer;
			/**
			 * Generar RIDE dependiendo del tipo de comprobante
			 */
			if (voucher.type_voucher === '01') {
				/**
				 * RIDE
				 */
				/**
				 * Generar el RIDE solo de los comprobantes que no estén anulados
				 */
				if (
					voucher.internal_status_voucher != 'canceled' &&
					!voucher.action_pdf_voucher
				) {
					const _ride = new Ride();

					_ride.voucher = voucher;
					_ride.sequence = sequence;
					_ride.date = todayDate;
					_ride.access_key_voucher = access_key_voucher;
					_ride.stringDateAuthorization = stringDateAuthorization;
					_ride.base_path_vocher = base_path_vocher;

					await _ride
						.generateRideVoucher_01()
						.then(() => {
							/**
							 * set the action_pdf_voucher
							 */
							voucher.action_pdf_voucher = true;
						})
						.catch((error: any) => {
							/**
							 * SAVE Errors
							 */
							messages_voucher.push(error);
						});
				}
			} else if (voucher.type_voucher === '03') {
			} else if (voucher.type_voucher === '04') {
			} else if (voucher.type_voucher === '05') {
			} else if (voucher.type_voucher === '06') {
			} else if (voucher.type_voucher === '07') {
			}
			/**
			 * MAIL
			 */
			const mailing_setting_taxpayer: boolean =
				setting_taxpayer.mailing_setting_taxpayer!;

			if (
				mailing_setting_taxpayer &&
				voucher.internal_status_voucher != 'canceled' &&
				!voucher.action_email_voucher
			) {
				/**
				 * Extraer el correo de la clave "correo" del objeto infoAdicional si es que existe
				 */
				let mail: string = '';
				voucher.body_voucher.infoAdicional!.map(
					(detAdicional: detAdicional, index: number) => {
						if (detAdicional.correo) {
							mail = voucher.body_voucher.infoAdicional![index].correo;
						}
					}
				);
				/**
				 * sendMail
				 */
				await this.sendMail(
					mail,
					voucher.body_voucher,
					voucher.type_voucher!,
					sequence,
					finalSequence,
					todayDate,
					access_key_voucher,
					base_path_vocher,
					base_path_vocher_exclude_root
				)
					.then((response: string) => {
						console.log(response);
						/**
						 * set the workspace
						 */
						voucher.action_email_voucher = true;
					})
					.catch((error: string) => {
						/**
						 * SAVE Errors
						 */
						messages_voucher.push(error);
					});
			}
			/**
			 * ALFRESCO
			 */
			if (save_alfresco && !voucher.action_alfresco_voucher) {
				const file_ext_to_save: '.xml' | '.pdf' = '.xml';
				await this.saveAlfresco(
					voucher,
					sequence,
					todayDate,
					access_key_voucher,
					base_path_vocher,
					file_ext_to_save,
					voucher.global_status_voucher!
				)
					.then((workspace: string) => {
						console.log(`MessageAPI: ${workspace}`);
						/**
						 * set the workspace
						 */
						voucher.action_alfresco_voucher = true;
					})
					.catch((error: string) => {
						/**
						 * SAVE Errors
						 */
						messages_voucher.push(error);
					});
			}
			voucher.messages_voucher = JSON.stringify({
				messages_voucher,
			});
			/**
			 * Return
			 */
			resolve(voucher);
		});
	}
	/**
	 * downloadVoucher
	 * @param voucher
	 * @returns
	 */
	downloadVoucher(voucher: Voucher) {
		return new Promise<Voucher>(async (resolve, reject) => {
			await dml_voucher_download(voucher)
				.then((vouchers: Voucher[]) => {
					/**
					 * Mutate response
					 */
					const _vouchers = this.mutateResponse(vouchers);

					resolve(_vouchers[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}
	/**
	 * ONLY GADMCP
	 */
	/**
	 * bringVouchersOfSQLServer
	 * @param voucher
	 * @returns
	 */
	bringVouchersOfSQLServer(voucher: Voucher) {
		return new Promise<any>(async (resolve, reject) => {
			/**
			 * First check validation
			 */
			const id_institution = voucher.institution.id_institution;

			const institutionToBring: InstitutionSQLServer =
				INSTITUTION_SQLSERVER.find(
					(item: InstitutionSQLServer) => item.id_institution === id_institution
				)!;

			if (institutionToBring) {
				await dml_voucher_bring_of_sqlserver(
					institutionToBring,
					voucher.emission_date_voucher!
				)
					.then(async (rowsSQLServer: VoucherSQLServer[]) => {
						if (rowsSQLServer.length > 0) {
							await this.mutateRowToVoucher(rowsSQLServer, institutionToBring)
								.then((response: any) => {
									resolve(response);
								})
								.catch((error) => {
									reject(error);
								});
						} else {
							reject({
								..._businessMessages[4],
								description: _businessMessages[4].description.replace(
									'businessMessages',
									'No se encontraron comprobantes registrados con los parámetros ingresados'
								),
							});
						}
					})
					.catch((error: any) => {
						reject(error);
					});
			} else {
				reject({
					..._businessMessages[4],
					description: _businessMessages[4].description.replace(
						'businessMessages',
						`No se encontró la institución con el id ${voucher.institution.id_institution}`
					),
				});
			}
		});
	}

	/**
	 * getBodyVoucher
	 * @param voucher
	 * @returns
	 */
	getBodyVoucher(voucher: Voucher) {
		return new Promise<Voucher>(async (resolve, reject) => {
			await this.byAccessKeyVoucherRead(voucher)
				.then(async (_voucher: Voucher) => {
					if (_voucher) {
						let infoAdicional: campoAdicional[] = [];
						/**
						 * deleteKeysValoresExtras
						 */
						await this.deleteKeysValoresExtras(
							_voucher.body_voucher.infoAdicional!
						).then((_infoAdicional: campoAdicional[]) => {
							infoAdicional = _infoAdicional;
						});

						const voucher_: Voucher | any = {
							id_user_: voucher.id_user_,
							access_key_voucher: _voucher.access_key_voucher,
							institution: {
								id_institution: parseInt(
									_voucher.institution.id_institution.toString()
								),
							},
							type_voucher: _voucher.type_voucher,
							body_voucher: {
								..._voucher.body_voucher,
								infoAdicional,
								valoresExtras: _voucher.body_voucher.valoresExtras,
							},
						};
						resolve(voucher_);
					} else {
						reject({
							..._businessMessages[4],
							description: _businessMessages[4].description.replace(
								'businessMessages',
								`No se encontro el comprobante con la clave de acceso ${voucher.access_key_voucher}`
							),
						});
					}
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}
	/**
	 * deleteKeysValoresExtras
	 * Función para eliminar los campos adicionales que son de valores extras
	 * @param infoAdicional
	 * @returns
	 */
	deleteKeysValoresExtras = (infoAdicional: campoAdicional[]) => {
		return new Promise<any>(async (resolve) => {
			infoAdicional.map(
				async (_campoAdicional: campoAdicional, index: number) => {
					let keysObject = Object.keys(_campoAdicional);
					if (
						keysObject[0] === 'tasaProcesamiento' ||
						keysObject[0] === 'interes' ||
						keysObject[0] === 'otros'
					) {
						infoAdicional.splice(index);
					}
				}
			);
			resolve(infoAdicional);
		});
	};
	/**
	 * Eliminar ids de entidades externas y formatear la rowsSQLServer en el esquema correspondiente
	 * @param vouchers
	 * @returns
	 */
	private mutateResponse(vouchers: Voucher[]): Voucher[] {
		let _vouchers: Voucher[] = [];

		vouchers.map((item: any) => {
			let _voucher: Voucher | any = {
				...item,
				type_environment: item.bvv_type_environment,
				type_emission: item.bvv_type_emission,
				institution: {
					id_institution: item.id_institution,
					taxpayer: {
						id_taxpayer: item.id_taxpayer,
					},
					type_environment: item.bvi_type_environment,
					name_institution: item.name_institution,
					description_institution: item.description_institution,
					address_institution: item.address_institution,
					status_institution: item.status_institution,
				},
				/**
				 * Generate structure of second level the entity (is important add the ids of entity)
				 * similar the return of read
				 */
			};
			/**
			 * delete ids of principal object level
			 */
			delete _voucher.id_institution;
			delete _voucher.id_taxpayer;
			delete _voucher.bvv_type_environment;
			delete _voucher.bvv_type_emission;
			delete _voucher.bvi_type_environment;
			delete _voucher.name_institution;
			delete _voucher.description_institution;
			delete _voucher.address_institution;
			delete _voucher.status_institution;
			delete _voucher.status_by_batch_institution;

			_vouchers.push(_voucher);
		});

		return _vouchers;
	}
	/**
	 *  Proceso individual del comprobante
	 * @param voucher
	 * @param sequence
	 * @param finalSequence
	 * @param todayDate
	 * @param access_key_voucher
	 * @param base_path_vocher
	 * @param base_path_vocher_exclude_root
	 * @param typeServices
	 * @returns
	 */
	individualVoucherProcess = (
		voucher: Voucher,
		sequence: Sequence,
		finalSequence: string,
		todayDate: FullDate,
		access_key_voucher: string,
		base_path_vocher: string,
		base_path_vocher_exclude_root: string,
		typeServices: SERVICE[]
	): Promise<boolean> => {
		return new Promise<boolean>(async (resolve, reject) => {
			let messages_voucher: string[] = [];
			/**
			 * Obtener las variables necesarias para el proceso individual del comprobante
			 */
			const institution: Institution = sequence.institution;
			const setting: SettingCompany =
				sequence.institution.taxpayer.user.company.setting;
			const setting_taxpayer: SettingTaxpayer =
				sequence.institution.taxpayer.setting_taxpayer;
			/**
			 * Obtenemos el comprobante que vamos a enviar el SRI
			 */
			const sendingXML: string = fs.readFileSync(
				`${base_path_vocher}/${access_key_voucher}.xml`,
				'utf8'
			);
			/**
			 * Trasformar el XML a Base64 (Es necesario enviarlo de esta manera ya que el SRI lo pide así)
			 */
			const signedXMLBase64: string =
				Buffer.from(sendingXML).toString('base64');
			/**
			 * Obtener la url de envió al SRI dependiendo del ambiente y servicio del SRI
			 */
			const ServiceRecepcionComprobantesOffline: SERVICE = typeServices.find(
				(service: any) =>
					service.environment == institution.type_environment &&
					service.type_service == TYPE_SERVICE_ENUM.RecepcionComprobantesOffline
			)!;
			/**
			 * Enviar Comprobante
			 */
			console.log('MessageAPI: sending voucher to the SRI');

			let respuestaRecepcionComprobante!: RespuestaRecepcionComprobante;
			await validarComprobante(
				ServiceRecepcionComprobantesOffline.url,
				signedXMLBase64
			)
				.then((_responseRecepcionComprobante: ResponseRecepcionComprobante) => {
					respuestaRecepcionComprobante =
						_responseRecepcionComprobante.RespuestaRecepcionComprobante;
				})
				.catch((error: string) => {
					reject(error);
					return;
				});
			/**
			 * Obtenemos la configuración de la empresa
			 */
			const wait_autorization: number = setting.wait_autorization! * 1000;
			const save_alfresco: boolean = setting.save_alfresco!;
			/**
			 * RECIBIDA o DEVUELTA
			 */
			if (respuestaRecepcionComprobante != undefined) {
				if (respuestaRecepcionComprobante.estado == 'RECIBIDA') {
					/**
					 * Consultar el estado del comprobante (El setTimeoutPromise es porque el SRI envía el recibido pero tarda un poco en procesar el comprobante)
					 */
					console.log(
						`MessageAPI: waiting ${wait_autorization} milliseconds for the SRI to authorize the voucher`
					);
					setTimeoutPromise(wait_autorization).then(async () => {
						console.log(`MessageAPI: we started`);
						/**
						 * Obtener la url de consulta al SRI dependiendo del ambiente y servicio del SRI
						 */
						const ServiceAutorizacionComprobantesOffline: SERVICE =
							_typeServices.find(
								(service: any) =>
									service.environment == institution.type_environment &&
									service.type_service ==
										TYPE_SERVICE_ENUM.AutorizacionComprobantesOffline
							)!;
						/**
						 *  Consultamos el servicio autorizacionComprobante
						 */
						await this.autorizacionComprobanteSRI(
							ServiceAutorizacionComprobantesOffline.url,
							access_key_voucher
						)
							.then(
								async (
									_responseAutorizacionComprobante: ResponseAutorizacionComprobante
								) => {
									/**
									 * Ejecutar Acciones si el comprobante está Autorizado
									 */
									if (
										_responseAutorizacionComprobante
											.RespuestaAutorizacionComprobante.autorizaciones
											.autorizacion.estado == 'AUTORIZADO'
									) {
										/**
										 * Establecer el estado de acuerdo, a su estado interno anterior, para no cambiar el estado a los comprobantes que se encuentren anulados
										 */
										voucher.internal_status_voucher =
											voucher.internal_status_voucher === 'pending'
												? 'authorized'
												: voucher.internal_status_voucher;
										voucher.global_status_voucher = 'authorized';
										/**
										 * Obtenemos la fecha de autorización del comprobante
										 */
										const authorizationDate: Date =
											_responseAutorizacionComprobante
												.RespuestaAutorizacionComprobante.autorizaciones
												.autorizacion.fechaAutorizacion;

										if (authorizationDate) {
											const stringDateAuthorization: string = parseDateToString(
												new Date(authorizationDate)
											);
											/**
											 * Set authorization_date_voucher
											 */
											voucher.authorization_date_voucher =
												stringDateAuthorization;
											/**
											 * Comprobamos si el comprobante esta anulado, si es asi no generamos el PDF ni enviamos el correo
											 */
											/**
											 * Generar RIDE dependiendo del tipo de comprobante
											 */
											if (voucher.type_voucher === '01') {
												/**
												 * RIDE
												 */
												/**
												 * Generar el RIDE solo de los comprobantes que no estén anulados
												 */
												if (voucher.internal_status_voucher != 'canceled') {
													const _ride = new Ride();

													_ride.voucher = voucher;
													_ride.sequence = sequence;
													_ride.date = todayDate;
													_ride.access_key_voucher = access_key_voucher;
													_ride.stringDateAuthorization =
														parseDateToStringWithTimeZone(
															new Date(authorizationDate)
														);
													_ride.base_path_vocher = base_path_vocher;

													await _ride
														.generateRideVoucher_01()
														.then(() => {
															/**
															 * set the action_pdf_voucher
															 */
															voucher.action_pdf_voucher = true;
														})
														.catch((error: any) => {
															/**
															 * SAVE Errors
															 */
															messages_voucher.push(
																'generateRideVoucher_01: ' + error
															);
														});
												}
											} else if (voucher.type_voucher === '03') {
											} else if (voucher.type_voucher === '04') {
											} else if (voucher.type_voucher === '05') {
											} else if (voucher.type_voucher === '06') {
											} else if (voucher.type_voucher === '07') {
											}
											/**
											 * Global actions (independientes del tipo de comprobante)
											 */
											/**
											 * MAIL
											 */
											const mailing_setting_taxpayer: boolean =
												setting_taxpayer.mailing_setting_taxpayer!;

											if (
												mailing_setting_taxpayer &&
												voucher.internal_status_voucher != 'canceled'
											) {
												/**
												 * Extraer el correo de la clave "correo" del objeto infoAdicional si es que existe
												 */
												let mail: string = '';
												voucher.body_voucher.infoAdicional!.map(
													(detAdicional: detAdicional, index: number) => {
														if (detAdicional.correo) {
															mail =
																voucher.body_voucher.infoAdicional![index]
																	.correo;
														}
													}
												);
												/**
												 * sendMail
												 */
												await this.sendMail(
													mail,
													voucher.body_voucher,
													voucher.type_voucher!,
													sequence,
													finalSequence,
													todayDate,
													access_key_voucher,
													base_path_vocher,
													base_path_vocher_exclude_root
												)
													.then((response: string) => {
														console.log(response);
														/**
														 * set the workspace
														 */
														voucher.action_email_voucher = true;
													})
													.catch((error: string) => {
														/**
														 * SAVE Errors
														 */
														messages_voucher.push('sendMail: ' + error);
													});
											}
											/**
											 * ALFRESCO
											 */

											if (save_alfresco) {
												const file_ext_to_save: '.xml' | '.pdf' = '.xml';
												await this.saveAlfresco(
													voucher,
													sequence,
													todayDate,
													access_key_voucher,
													base_path_vocher,
													file_ext_to_save,
													voucher.global_status_voucher
												)
													.then((workspace: string) => {
														console.log(`MessageAPI: ${workspace}`);
														/**
														 * set the workspace
														 */
														voucher.action_alfresco_voucher = true;
													})
													.catch((error: string) => {
														console.log(error);
														/**
														 * SAVE Errors
														 */
														messages_voucher.push('saveAlfresco: ' + error);
													});
											}
											voucher.messages_voucher = JSON.stringify({
												messages_voucher,
											});
											resolve(true);
										} else {
											/**
											 * Fecha invalida
											 */
											reject({
												..._businessMessages[3],
												description: _businessMessages[3].description.replace(
													'businessMessages',
													'La fecha de autorización no es valida'
												),
											});
										}
									} else {
										/**
										 * Comprobante no autorizado
										 */
										reject({
											..._businessMessages[3],
											description: _businessMessages[3].description.replace(
												'businessMessages',
												`El comprobante no se encuentra autorizado, consulte la clave de acceso ${access_key_voucher}`
											),
										});
									}
								}
							)
							.catch((error: string) => {
								reject(error);
							});
					});
				} else if (respuestaRecepcionComprobante.estado == 'DEVUELTA') {
					messages_voucher.push(
						JSON.stringify(
							respuestaRecepcionComprobante.comprobantes.comprobante.mensajes
						)
					);
					voucher.messages_voucher = JSON.stringify({
						messages_voucher,
					});
					/**
					 * Update voucher
					 */
					await this.update(voucher)
						.then((_voucher: Voucher) => {
							reject({
								..._businessMessages[3],
								description: _businessMessages[3].description.replace(
									'businessMessages',
									`El SRI no recibió el comprobante (DEVUELTA), revise los mensajes del comprobante ${access_key_voucher}`
								),
							});
						})
						.catch((error: any) => {
							reject(error);
						});
				} else {
					reject({
						..._businessMessages[3],
						description: _businessMessages[3].description.replace(
							'businessMessages',
							'El SRI no recibió el comprobante (ESTADO DESCONOCIDO), compruebe la información'
						),
					});
				}
			} else {
				reject({
					..._businessMessages[3],
					description: _businessMessages[3].description.replace(
						'businessMessages',
						'No se recibio la respuestaRecepcionComprobante'
					),
				});
			}
		});
	};
	/**
	 * sendMail
	 * @param mail
	 * @param body_voucher
	 * @param type_voucher
	 * @param sequence
	 * @param finalSequence
	 * @param todayDate
	 * @param access_key_voucher
	 * @param base_path_vocher
	 * @param base_path_vocher_mail
	 * @returns
	 */
	sendMail(
		mail: string,
		body_voucher: BodyVoucher,
		type_voucher: TYPE_VOUCHER,
		sequence: Sequence,
		finalSequence: string,
		todayDate: FullDate,
		access_key_voucher: string,
		base_path_vocher: string,
		base_path_vocher_mail: string
	) {
		return new Promise<string>(async (resolve, reject) => {
			const setting_taxpayer: SettingTaxpayer =
				sequence.institution.taxpayer.setting_taxpayer;
			/**
			 * Solo si existe un valor en la clave "correo" tratamos de enviar el correo
			 */
			if (mail != '') {
				/**
				 * Comprobamos que sea un correo valido
				 */
				const regExpEmail =
					/^([a-z\d\.-\_\.\-]+)@([a-z\d-]+)\.([a-z){2,8})(\.[a-z]{2,8})?$/;
				if (regExpEmail.test(mail)) {
					/**
					 * Obtenemos el XML del comprobante
					 */
					const sendingXML = fs.readFileSync(
						`${base_path_vocher}/${access_key_voucher}.xml`,
						'utf8'
					);
					/**
					 * Obtenemos la configuración del correo del contribuyente
					 */
					const from_setting_taxpayer: string =
						setting_taxpayer.from_setting_taxpayer!;
					const subject_setting_taxpayer: string =
						setting_taxpayer.subject_setting_taxpayer!;
					const mail_server: MailServer = setting_taxpayer.mail_server;
					let html_setting_taxpayer: string =
						setting_taxpayer.html_setting_taxpayer!;
					/**
					 * Instance MailServer
					 */
					const _mail_server = new MailServer();
					_mail_server.id_mail_server = mail_server.id_mail_server;

					let _SMTPTransport: SMTPTransport | any;

					await _mail_server
						.specificRead()
						.then((_mailServer: MailServer) => {
							if (_mailServer.status_mail_server) {
								_SMTPTransport = {
									host: _mailServer.host_mail_server,
									port: _mailServer.port_mail_server,
									secure: _mailServer.secure_mail_server,
									auth: {
										user: _mailServer.user_mail_server!,
										pass: _mailServer.password_mail_server!,
									},
								};
							} else {
								reject(
									`El servidor de correo ${_mailServer.host_mail_server} se encuentra desactivado`
								);
							}
						})
						.catch((error: string) => {
							reject(error);
						});
					/**
					 * Creamos los anexos que se enviaran en el correo
					 */
					let attachments: Attachments[] = [
						{
							filename: `${access_key_voucher}.xml`,
							content: sendingXML,
						},
					];
					/**
					 * Agregamos el pdf en el caso de que si este generado
					 */
					const path_pdf_file: string = `${path.resolve(
						'./'
					)}${base_path_vocher_mail}/${access_key_voucher}.pdf`;

					if (fs.existsSync(path_pdf_file)) {
						attachments.push({
							filename: `${access_key_voucher}.pdf`,
							path: path_pdf_file,
						});
					}
					/**
					 * Remplazar las etiquetas que estan permitidas en el html escritas por el contribuyente
					 */
					this.replaceTags(
						body_voucher,
						type_voucher!,
						sequence,
						todayDate,
						finalSequence,
						html_setting_taxpayer
					)
						.then(async (html: string) => {
							/**
							 * generateMail
							 */
							let _mail: Mail = generateMail(
								from_setting_taxpayer,
								mail,
								subject_setting_taxpayer,
								html,
								attachments
							);
							/**
							 * sendMail
							 */
							await sendMail(_mail, _SMTPTransport)
								.then((response) => {
									resolve(response);
								})
								.catch((error: string) => {
									reject(error);
								});
						})
						.catch((error: string) => {
							reject(error);
						});
				} else {
					reject('El correo electrónico no es correcto');
				}
			} else {
				reject('No se recibió el correo electrónico');
			}
		});
	}
	/**
	 * saveAlfresco
	 * @param sequence
	 * @param date
	 * @param access_key_voucher
	 * @param base_path_vocher
	 * @returns
	 */
	saveAlfresco(
		voucher: Voucher,
		sequence: Sequence,
		date: FullDate,
		access_key_voucher: string,
		base_path_vocher: string,
		file_ext_to_save: '.xml' | '.pdf',
		global_status_voucher: TYPE_VOUCHER_STATUS
	): Promise<string> {
		return new Promise<string>(async (resolve, reject) => {
			/**
			 * Obtener las variables necesarias
			 */
			const institution: Institution = sequence.institution;
			/**
			 * Instace Alfresco
			 */
			const _alfresco = new Alfresco();

			const base_path_alfresco: string = `cm:${
				institution.taxpayer.id_taxpayer
			}/cm:${
				institution.id_institution
			}/cm:${institution.type_environment!}/cm:${voucher.type_voucher!}/cm:${
				date.fullYear
			}/cm:${date.month}/cm:${access_key_voucher}`;

			_alfresco._model = Models.WSFE;
			_alfresco._type = Types.Factura;
			_alfresco._sitie = Sities.WSFE;
			_alfresco._path_to_save = `${Path.WSFE}/${base_path_alfresco}`;
			/**
			 * Construir el archivo con sus propiedades
			 */
			const file: any = {
				path_server: `${base_path_vocher}/${access_key_voucher}.xml`,
				file_ext: file_ext_to_save,
				access_key_voucher: access_key_voucher,
				type_voucher: voucher.type_voucher,
				internal_status_voucher: global_status_voucher,
				id_institution: sequence.institution.id_institution,
				buyer_identifier_voucher: voucher.body_voucher.identificacionComprador,
				importeTotal: voucher.body_voucher.importeTotal,
				emission_date_voucher: parseDateToString(new Date()),
			};
			/**
			 * Set the file
			 */
			_alfresco.file = file;
			/**
			 * Buscar carpeta solicitud y crear si no existe
			 */
			await _alfresco
				.searchFile(`/${Path.WSFE}`)
				.then(async (documentos: Documento[]) => {
					if (documentos.length == 0) {
						/**
						 * Buscamos el nodo principal
						 */
						await _alfresco
							.searchFile('') // '' es igual al directorio base de documentLibrary
							.then(async (documentos: Documento[]) => {
								console.log(documentos);
								if (documentos.length > 0) {
									const referencia = documentos[0].referencia;
									const nodeIdDocumentLibrary = referencia.slice(
										24,
										referencia.length
									);

									await _alfresco
										.createFolder(
											nodeIdDocumentLibrary,
											`${Path.name}`,
											`${Path.title}`,
											`${Path.description}`
										)
										.catch((error: string) => {
											reject(error);
											return;
										});
								} else {
									reject(
										`No se encontró documentLibrary del sitio ${_alfresco._sitie}`
									);
								}
							})
							.catch((error: string) => {
								reject(error);
								return;
							});
					}
				})
				.catch((error: string) => {
					reject(error);
					return;
				});
			/**
			 * saveFile
			 */
			await _alfresco
				.saveFile()
				.then(async (workspace: string) => {
					if (workspace != undefined) {
						resolve(workspace);
					} else {
						reject('No se recibio el workspace del archivo en Alfresco');
					}
				})
				.catch((error: string) => {
					reject(error);
				});
		});
	}
	/**
	 * replaceTags
	 * @param body_voucher
	 * @param type_voucher
	 * @param sequences
	 * @param todayDate
	 * @param finalSequence
	 * @param html
	 * @returns
	 */
	replaceTags(
		body_voucher: BodyVoucher,
		type_voucher: TYPE_VOUCHER,
		sequences: Sequence,
		todayDate: FullDate,
		finalSequence: string,
		html: string
	): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			try {
				if (html.includes('${razonSocialComprador}')) {
					html = html.replace(
						'${razonSocialComprador}',
						body_voucher.razonSocialComprador
					);
				}
				if (html.includes('${codDoc}')) {
					html = html.replace(
						'${codDoc}',
						this.getTypeVoucherSelect(type_voucher).name_type
					);
				}
				if (html.includes('${estab}')) {
					html = html.replace(
						'${estab}',
						sequences.establishment.value_establishment!
					);
				}
				if (html.includes('${ptoEmi}')) {
					html = html.replace(
						'${ptoEmi}',
						sequences.emission_point.value_emission_point!
					);
				}
				if (html.includes('${secuencial}')) {
					html = html.replace('${secuencial}', finalSequence);
				}
				if (html.includes('${fechaEmision}')) {
					html = html.replace(
						'${fechaEmision}',
						`${todayDate.day}-${todayDate.month}-${todayDate.fullYear} ${todayDate.hours}:${todayDate.minutes}:${todayDate.seconds}`
					);
				}
				if (html.includes('${importeTotal}')) {
					html = html.replace(
						'${importeTotal}',
						body_voucher.importeTotal.toString()
					);
				}
				resolve(html);
			} catch (error: any) {
				reject(error.toString());
			}
		});
	}
	/**
	 * getTypeVoucherSelect
	 */
	getTypeVoucherSelect(type_voucher: TYPE_VOUCHER): TYPE_VOUCHER_ENUM {
		return _typeVoucher.find(
			(_type_voucher: TYPE_VOUCHER_ENUM) =>
				_type_voucher.value_type == type_voucher
		)!;
	}
	/**
	 * ONLY GADMCP
	 */
	/**
	 * Función para transformar la información obtenida a los comprobantes
	 */
	mutateRowToVoucher = (
		rowsSQLServer: VoucherSQLServer[],
		institutionToBring: InstitutionSQLServer
	) => {
		return new Promise(async (resolve) => {
			let responsesBrindVoucher: ResponseBrindVoucher[] = [];
			let successfully: number = 0;
			let withError: number = 0;
			let canceled: number = 0;
			/**
			 * Recorrer la data
			 */
			for (let index: number = 0; index < rowsSQLServer.length; index++) {
				const _rowsSQLServer: VoucherSQLServer = rowsSQLServer[index];

				const voucher: Voucher = this.generateVoucher(
					_rowsSQLServer,
					institutionToBring.id_institution
				);

				let responseBrindVoucher: ResponseBrindVoucher = {
					number_voucher: '',
					message: '',
				};

				await this.recepcionComprobante(voucher, voucher.body_voucher, false)
					.then(() => {
						successfully = successfully + 1;
					})
					.catch((error) => {
						withError = withError + 1;
						responseBrindVoucher = {
							number_voucher: voucher.number_voucher!,
							message: error,
						};
					});

				if (voucher.internal_status_voucher == 'canceled') {
					canceled = canceled + 1;
				}

				if (responseBrindVoucher.number_voucher != '') {
					responsesBrindVoucher =
						responsesBrindVoucher.concat(responseBrindVoucher);
				}
			}
			resolve({
				totalRecords: rowsSQLServer.length,
				successfully: successfully,
				withError: withError,
				canceled: canceled,
				data: responsesBrindVoucher,
			});
		});
	};
	/**
	 * ONLY GADMCP
	 */
	/**
	 * generateVoucher
	 * @param rowsSQLServer
	 * @param id_institution
	 * @returns
	 */
	generateVoucher = (
		rowsSQLServer: VoucherSQLServer,
		id_institution: number
	): Voucher | any => {
		const IVA: number = parseInt(process.env.IVA!);
		const subTotal: number = parseFloat(
			(rowsSQLServer.valorunitario * parseInt(rowsSQLServer.cantidad)).toFixed(
				2
			)
		);
		const ivaTotal: number = parseFloat((subTotal * (IVA / 100)).toFixed(2));
		const total: number = parseFloat((subTotal + ivaTotal).toFixed(2));

		return {
			id_user_: 1,
			instantly: false,
			number_voucher: rowsSQLServer.numerodocumento.toString(),
			institution: {
				id_institution: id_institution,
			},
			type_voucher: '01',
			body_voucher: {
				tipoIdentificacionComprador:
					rowsSQLServer.identificacionComprador == '9999999999999'
						? '07'
						: rowsSQLServer.identificacionComprador.length == 13
						? '04'
						: rowsSQLServer.identificacionComprador.length == 10
						? '05'
						: '06',
				razonSocialComprador: deleteAmpersand(
					rowsSQLServer.razonsocialcomprador
				),
				identificacionComprador: rowsSQLServer.identificacionComprador,
				direccionComprador: deleteAmpersand(rowsSQLServer.direccioncomprador),
				totalSinImpuestos: subTotal,
				totalDescuento: 0,
				totalConImpuestos: [
					rowsSQLServer.iva == 0.0
						? {
								codigo: 2,
								codigoPorcentaje: 0,
								descuentoAdicional: 0,
								baseImponible: subTotal,
								valor: 0,
						  }
						: {
								codigo: 2,
								codigoPorcentaje: 2,
								descuentoAdicional: 0,
								baseImponible: subTotal,
								valor: ivaTotal,
						  },
				],
				propina: 0,
				importeTotal: rowsSQLServer.iva == 0.0 ? subTotal : total,
				pagos: [
					{
						formaPago: '01',
						total: rowsSQLServer.iva == 0.0 ? subTotal : total,
						plazo: 0,
						unidadTiempo: 'dias',
					},
				],
				detalles: [
					{
						codigoPrincipal: rowsSQLServer.numerodocumento.toString(),
						codigoAuxiliar: deleteAmpersand(
							rowsSQLServer.numerodocumento.toString()
						),
						descripcion: deleteAmpersand(rowsSQLServer.detalle.trim()),
						cantidad: parseInt(rowsSQLServer.cantidad),
						precioUnitario: rowsSQLServer.valorunitario,
						descuento: 0,
						precioTotalSinImpuesto: subTotal,
						impuestos: [
							rowsSQLServer.iva == 0.0
								? {
										codigo: 2,
										codigoPorcentaje: 0,
										tarifa: 0,
										baseImponible: subTotal,
										valor: 0,
								  }
								: {
										codigo: 2,
										codigoPorcentaje: 2,
										tarifa: IVA,
										baseImponible: subTotal,
										valor: ivaTotal,
								  },
						],
					},
				],
				infoAdicional: [
					{ correo: rowsSQLServer.correo ? rowsSQLServer.correo : 'S/D' },
					{
						cajero: rowsSQLServer.recaudador ? rowsSQLServer.recaudador : 'S/D',
					},
				],
				valoresExtras: {
					tasaProcesamiento: rowsSQLServer.tasaprocesamiento
						? rowsSQLServer.tasaprocesamiento
						: 0,
					interes: rowsSQLServer.interes ? rowsSQLServer.interes : 0,
					otros: rowsSQLServer.otros ? rowsSQLServer.otros : 0,
				},
			},
			internal_status_voucher: rowsSQLServer.estadointerno
				? 'canceled'
				: 'pending',
		};
	};
}
