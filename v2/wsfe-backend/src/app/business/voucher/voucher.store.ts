import {
	clientWSFEPostgreSQL,
	clientWSFESQLServer,
} from '../../../utils/conections';
import { FullDate, getFullDate } from '../../../utils/date';
import { _messages } from '../../../utils/message/message';
import { InstitutionSQLServer, VoucherSQLServer } from '../business.types';
import { Sequence } from '../sequence/sequence.class';
import { Voucher } from './voucher.class';
/**
 * Inners and columns for the resolution of ids
 */
const COLUMNS_RETURN: string = `bvv.id_voucher, bvv.id_institution, bvv.type_environment as bvv_type_environment, bvv.type_emission as bvv_type_emission, bvv.type_voucher, bvv.number_voucher, bvv.access_key_voucher, bvv.emission_date_voucher, bvv.authorization_date_voucher, bvv.buyer_identifier_voucher, bvv.body_voucher, bvv.internal_status_voucher, bvv.global_status_voucher, bvv.action_pdf_voucher, bvv.action_email_voucher, bvv.action_alfresco_voucher, bvv.messages_voucher, bvv.deleted_voucher, bvi.id_taxpayer, bvi.type_environment as bvi_type_environment, bvi.name_institution, bvi.description_institution, bvi.address_institution, bvi.status_institution`;
const INNERS_JOIN: string = ` inner join business.view_institution bvi on bvv.id_institution = bvi.id_institution`;

export const dml_voucher_reception = (voucher: Voucher, isToSolve: boolean) => {
	return new Promise<Sequence[]>(async (resolve, reject) => {
		const query = `select * from business.dml_voucher_reception(${
			voucher.id_user_
		},
			${voucher.institution.id_institution}, '${voucher.type_voucher}', ${
			voucher.access_key_voucher == '' ||
			voucher.access_key_voucher == undefined
				? null
				: `'${voucher.access_key_voucher}'`
		}, ${isToSolve})`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};

export const dml_voucher_create = (voucher: Voucher) => {
	return new Promise<Voucher[]>(async (resolve, reject) => {
		const query = `select * from business.dml_voucher_create_modified(${
			voucher.id_user_
		},
			${voucher.institution.id_institution},
			'${voucher.type_voucher}',
			${
				voucher.number_voucher == '' || voucher.number_voucher == undefined
					? null
					: `'${voucher.number_voucher}'`
			},
			'${voucher.access_key_voucher}',
			'${voucher.buyer_identifier_voucher}',
			'${JSON.stringify(voucher.body_voucher)}',
			'${voucher.internal_status_voucher}',
			'${voucher.global_status_voucher}')`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};

export const view_voucher = (voucher: Voucher) => {
	return new Promise<Voucher[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from business.view_voucher bvv${INNERS_JOIN}${
			voucher.access_key_voucher != 'query-all'
				? ` where (lower(bvv.access_key_voucher) LIKE '%${voucher.access_key_voucher}%' or lower(bvv.number_voucher) LIKE '%${voucher.access_key_voucher}%') and bvv.type_environment = '${voucher.type_environment}'`
				: ` where bvv.type_environment = '${voucher.type_environment}'`
		} order by bvv.id_voucher desc`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};

export const view_voucher_specific_read = (voucher: Voucher) => {
	return new Promise<Voucher[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from business.view_voucher bvv${INNERS_JOIN} 
			where bvv.id_voucher = ${voucher.id_voucher}`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};

export const view_voucher_by_institution_read = (voucher: Voucher) => {
	return new Promise<Voucher[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from business.view_voucher bvv${INNERS_JOIN} 
			where bvv.id_institution = ${
				typeof voucher.institution === 'object'
					? voucher.institution.id_institution
					: voucher.institution
			} and bvv.type_environment = '${voucher.type_environment}'`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};

export const view_voucher_by_access_key_voucher_read = (voucher: Voucher) => {
	return new Promise<Voucher[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from business.view_voucher bvv${INNERS_JOIN} 
			where bvv.access_key_voucher = '${voucher.access_key_voucher}'`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};

export const view_voucher_by_buyer_identifier_voucher_read = (
	voucher: Voucher
) => {
	return new Promise<Voucher[]>(async (resolve, reject) => {
		const queryWithPagination: boolean =
			voucher.page_number != '*' && voucher.amount! != '*' ? true : false;

		let offset: number = 0;

		if (queryWithPagination) {
			offset =
				parseInt(voucher.page_number!)! == 1
					? 0
					: (parseInt(voucher.page_number!) - 1) * parseInt(voucher.amount!);
		}

		const query = `select ${COLUMNS_RETURN} from business.view_voucher bvv${INNERS_JOIN} 
			where bvv.buyer_identifier_voucher = '${voucher.buyer_identifier_voucher}' 
			and bvv.type_environment = '${voucher.type_environment}' 
			order by bvv.id_voucher ${voucher.order_by} ${
			queryWithPagination ? `limit ${voucher.amount} offset ${offset}` : ''
		}`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};

export const view_voucher_by_buyer_identifier_voucher_and_search_by_parameter_read =
	(voucher: Voucher) => {
		return new Promise<Voucher[]>(async (resolve, reject) => {
			const query = `select ${COLUMNS_RETURN} from business.view_voucher bvv${INNERS_JOIN}${
				voucher.access_key_voucher != 'query-all'
					? ` where (lower(bvv.access_key_voucher) LIKE '%${voucher.access_key_voucher}%' or lower(bvv.number_voucher) LIKE '%${voucher.access_key_voucher}%') and bvv.type_environment = '${voucher.type_environment}' and bvv.buyer_identifier_voucher = '${voucher.buyer_identifier_voucher}'`
					: ` where bvv.type_environment = '${voucher.type_environment}' and bvv.buyer_identifier_voucher = '${voucher.buyer_identifier_voucher}'`
			} order by bvv.id_voucher desc`;

			// console.log(query);

			try {
				const response = await clientWSFEPostgreSQL.query(query);
				resolve(response.rows);
			} catch (error: any) {
				if (error.detail == '_database') {
					reject({
						..._messages[3],
						description: error.toString().slice(7),
					});
				} else {
					reject(error.toString());
				}
			}
		});
	};

export const view_voucher_by_buyer_identifier_and_emission_year_voucher_read = (
	voucher: Voucher
) => {
	return new Promise<Voucher[]>(async (resolve, reject) => {
		const fullDate: FullDate = getFullDate(voucher.emission_date_voucher!);

		const queryWithPagination: boolean =
			voucher.page_number != '*' && voucher.amount! != '*' ? true : false;

		let offset: number = 0;

		if (queryWithPagination) {
			offset =
				parseInt(voucher.page_number!)! == 1
					? 0
					: (parseInt(voucher.page_number!) - 1) * parseInt(voucher.amount!);
		}

		const query = `select ${COLUMNS_RETURN} from business.view_voucher bvv${INNERS_JOIN} 
			where bvv.buyer_identifier_voucher = '${voucher.buyer_identifier_voucher}' 
			and bvv.type_environment = '${voucher.type_environment}' 
			and extract(year from bvv.emission_date_voucher::timestamp) = '${
				fullDate.fullYear
			}' 
			order by bvv.id_voucher ${voucher.order_by} ${
			queryWithPagination ? `limit ${voucher.amount} offset ${offset}` : ''
		}`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};

export const view_voucher_by_buyer_identifier_and_range_emission_date_voucher_read =
	(voucher: Voucher) => {
		return new Promise<Voucher[]>(async (resolve, reject) => {
			const fullDateStart: FullDate = getFullDate(
				voucher.emission_date_voucher!
			);
			const fullDateEnd: FullDate = getFullDate(
				voucher.authorization_date_voucher!
			);

			const query = `select ${COLUMNS_RETURN} from business.view_voucher bvv${INNERS_JOIN} 
			where bvv.buyer_identifier_voucher = '${voucher.buyer_identifier_voucher}' 
			and bvv.type_environment = '${voucher.type_environment}' 
			and bvv.emission_date_voucher > '${fullDateStart.fullYear}-${fullDateStart.month}-${fullDateStart.day} 00:00:00'
			and bvv.emission_date_voucher < '${fullDateEnd.fullYear}-${fullDateEnd.month}-${fullDateEnd.day} 23:59:59'
			order by bvv.id_voucher asc`;

			// console.log(query);

			try {
				const response = await clientWSFEPostgreSQL.query(query);
				resolve(response.rows);
			} catch (error: any) {
				if (error.detail == '_database') {
					reject({
						..._messages[3],
						description: error.toString().slice(7),
					});
				} else {
					reject(error.toString());
				}
			}
		});
	};

export const view_voucher_by_range_emission_date_voucher_read = (
	voucher: Voucher
) => {
	return new Promise<Voucher[]>(async (resolve, reject) => {
		const fullDateStart: FullDate = getFullDate(voucher.emission_date_voucher!);
		const fullDateEnd: FullDate = getFullDate(
			voucher.authorization_date_voucher!
		);
		const internal_status_voucher: string = voucher.internal_status_voucher!;
		const id_institution: string | any = !voucher.institution.id_institution
			? voucher.institution
			: voucher.institution.id_institution;

		const query = `select ${COLUMNS_RETURN} from business.view_voucher bvv${INNERS_JOIN} 
			where bvv.type_environment = '${voucher.type_environment}'
			${
				id_institution != '*'
					? `and bvv.id_institution = '${id_institution}'`
					: ``
			}and bvv.emission_date_voucher > '${fullDateStart.fullYear}-${
			fullDateStart.month
		}-${fullDateStart.day} 00:00:00'
			and bvv.emission_date_voucher < '${fullDateEnd.fullYear}-${fullDateEnd.month}-${
			fullDateEnd.day
		} 23:59:59'
			${
				internal_status_voucher != '*'
					? `and bvv.internal_status_voucher = '${internal_status_voucher}'`
					: ``
			} order by bvv.id_voucher asc`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};

export const dml_voucher_update = (voucher: Voucher) => {
	return new Promise<Voucher[]>(async (resolve, reject) => {
		const query = `select * from business.dml_voucher_update_modified(${
			voucher.id_user_
		},
			${voucher.id_voucher},
			${voucher.institution.id_institution},
			'${voucher.type_environment}',
			'${voucher.type_emission}',
			'${voucher.type_voucher}',
			'${voucher.number_voucher}',
			'${voucher.access_key_voucher}',
			'${voucher.emission_date_voucher}',
			${
				voucher.authorization_date_voucher == '' ||
				voucher.authorization_date_voucher == null
					? null
					: `'${voucher.authorization_date_voucher}'`
			},
			'${voucher.buyer_identifier_voucher}',
			'${JSON.stringify(voucher.body_voucher)}',
			'${voucher.internal_status_voucher}',
			'${voucher.global_status_voucher}',
			${voucher.action_pdf_voucher},
			${voucher.action_email_voucher},
			${voucher.action_alfresco_voucher},
			'${JSON.stringify(voucher.messages_voucher)}',
			${voucher.deleted_voucher})`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};

export const dml_voucher_delete = (voucher: Voucher) => {
	return new Promise<boolean>(async (resolve, reject) => {
		const query = `select * from business.dml_voucher_delete_modified(${voucher.id_user_},${voucher.id_voucher}) as result`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows[0].result);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};
/**
 * Global store
 */
export const dml_voucher_validation = (voucher: Voucher) => {
	return new Promise<Voucher[]>(async (resolve, reject) => {
		const query = `select * from business.dml_voucher_validation(${voucher.id_user_},
			${voucher.institution.id_institution}, '${voucher.access_key_voucher}', '${voucher.type_voucher}')`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};

export const dml_voucher_cancel = (voucher: Voucher) => {
	return new Promise<Voucher[]>(async (resolve, reject) => {
		const query = `select * from business.dml_voucher_cancel(${voucher.id_user_},${voucher.institution.id_institution},'${voucher.access_key_voucher}')`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};

export const dml_voucher_reverse_cancel = (voucher: Voucher) => {
	return new Promise<Voucher[]>(async (resolve, reject) => {
		const query = `select * from business.dml_voucher_reverse_cancel(${voucher.id_user_},${voucher.institution.id_institution},'${voucher.access_key_voucher}')`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};

export const dml_voucher_reception_instantly = (voucher: Voucher) => {
	return new Promise<Sequence[]>(async (resolve, reject) => {
		const query = `select * from business.dml_voucher_reception_instantly(${voucher.id_user_},${voucher.institution.id_institution},'${voucher.access_key_voucher}','${voucher.type_voucher}')`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};

export const dml_voucher_by_batch_by_institution = (voucher: Voucher) => {
	return new Promise<Sequence[]>(async (resolve, reject) => {
		const query = `select * from business.dml_voucher_by_batch_by_institution(${voucher.id_user_},${voucher.institution.id_institution},'${voucher.type_voucher}','${voucher.emission_date_voucher}')`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};

export const dml_voucher_by_batch_by_taxpayer = (voucher: Voucher) => {
	return new Promise<Sequence[]>(async (resolve, reject) => {
		const query = `select * from business.dml_voucher_by_batch_by_taxpayer(${voucher.id_user_},${voucher.institution.taxpayer.id_taxpayer},'${voucher.type_voucher}','${voucher.emission_date_voucher}')`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};

export const dml_voucher_complete_process = (voucher: Voucher) => {
	return new Promise<Sequence[]>(async (resolve, reject) => {
		const query = `select * from business.dml_voucher_complete_process(${voucher.id_user_},${voucher.institution.id_institution},'${voucher.access_key_voucher}','${voucher.type_voucher}')`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};

export const dml_voucher_download = (voucher: Voucher) => {
	return new Promise<Voucher[]>(async (resolve, reject) => {
		const query = `select * from business.dml_voucher_download(${voucher.institution.id_institution}, '${voucher.access_key_voucher}')`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};

export const auth_sign_in_with_buyer_identifier_voucher = (
	voucher: Voucher
) => {
	return new Promise<Sequence[]>(async (resolve, reject) => {
		const query = `select * from business.auth_sign_in_with_buyer_identifier_voucher('${voucher.buyer_identifier_voucher}')`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows);
		} catch (error: any) {
			if (error.detail == '_database') {
				reject({
					..._messages[3],
					description: error.toString().slice(7),
				});
			} else if (error.detail == '_database_auth') {
				reject({
					..._messages[4],
					description: error.toString().slice(7),
				});
			} else {
				reject(error.toString());
			}
		}
	});
};
/**
 * ONLY GADMCP
 */
export const dml_voucher_bring_of_sqlserver = (
	institutionToBring: InstitutionSQLServer,
	emission_date_voucher: string
): Promise<VoucherSQLServer[]> => {
	return new Promise<VoucherSQLServer[]>(async (resolve, reject) => {
		const query = `SELECT f.fecha_emision as fechaemision, f.id_factura as numerodocumento, f.nombres as razonsocialcomprador, f.cedruc as identificacionComprador, f.direccion as direccioncomprador,
		f.detalle as detalle, ${
			institutionToBring.table == 'FACTURACION'
				? ` '1' as cantidad`
				: `f.cantidad as cantidad`
		}, ${
			institutionToBring.table == 'FACTURACION'
				? `f.subtotal as valorunitario`
				: `f.valor_unitario as valorunitario`
		}, f.iva,
		f.correo, f.usuario as recaudador, f.procesamiento as tasaprocesamiento, f.interes, f.otros, f.anulada as estadointerno FROM dbo.${
			institutionToBring.table
		} f
		WHERE f.fecha_emision > cast('${emission_date_voucher} 00:00:00 +00:00' as datetimeoffset) and f.fecha_emision < cast('${emission_date_voucher} 23:59:59 +00:00' as datetimeoffset);`;

		// console.log(query);

		try {
			const result = await clientWSFESQLServer.query(query);
			resolve(result.recordset);
		} catch (error: any) {
			reject(error.toString());
		}
	});
};
/**
 * ONLY GADMCP
 */
export const view_voucher_of_sqlserver_read = (
	institutionToBring: InstitutionSQLServer,
	voucher: Voucher
): Promise<VoucherSQLServer[]> => {
	return new Promise<VoucherSQLServer[]>(async (resolve, reject) => {
		const fullDateStart: FullDate = getFullDate(voucher.emission_date_voucher!);

		const fullDateEnd: FullDate = getFullDate(
			voucher.authorization_date_voucher!
		);

		const internal_status_voucher: string = voucher.internal_status_voucher!;

		let query: string = '';

		const returnQuery = (
			name_institution: 'municipio' | 'patronato' | '*',
			fullDateStart: FullDate,
			fullDateEnd: FullDate,
			internal_status_voucher: string
		): string => {
			const queryFunction = `SELECT f.id_factura as numerodocumento, f.fecha_emision as fechaemision, f.nombres as razonsocialcomprador, f.detalle as detalle,
			${
				name_institution === 'municipio'
					? '(1*f.subtotal) as total,'
					: '(f.cantidad*f.valor_unitario) as total,'
			} f.iva, f.anulada as estadointerno, '${name_institution}' as institution FROM ${
				name_institution === 'municipio'
					? 'dbo.FACTURACION'
					: 'dbo.FACTURACION_PATRONATO'
			} f 
			WHERE f.fecha_emision > cast('${fullDateStart.fullYear}-${
				fullDateStart.month
			}-${fullDateStart.day} 00:00:00 +00:00' as datetimeoffset) 
			and f.fecha_emision < cast('${fullDateEnd.fullYear}-${fullDateEnd.month}-${
				fullDateEnd.day
			} 23:59:59 +00:00' as datetimeoffset)
			${
				internal_status_voucher != '*'
					? `${
							internal_status_voucher == 'canceled'
								? `and f.anulada = 'true'`
								: `and f.anulada IS NULL `
					  }`
					: ``
			}`;
			return queryFunction;
		};

		if (institutionToBring.name_institution === '*') {
			query =
				returnQuery(
					'municipio',
					fullDateStart,
					fullDateEnd,
					internal_status_voucher
				) +
				'UNION ' +
				returnQuery(
					'patronato',
					fullDateStart,
					fullDateEnd,
					internal_status_voucher
				);
		} else {
			query = returnQuery(
				institutionToBring.name_institution,
				fullDateStart,
				fullDateEnd,
				internal_status_voucher
			);
		}

		// console.log(query);

		try {
			const result = await clientWSFESQLServer.query(query);
			resolve(result.recordset);
		} catch (error: any) {
			reject(error.toString());
		}
	});
};
/**
 * ONLY GADMCP
 */
export const view_voucher_of_sqlserver_by_parameter_read = (
	voucher: Voucher
): Promise<VoucherSQLServer[]> => {
	return new Promise<VoucherSQLServer[]>(async (resolve, reject) => {
		let query: string = '';
		const parameter: string = voucher.number_voucher!;

		const returnQuery = (
			name_institution: 'municipio' | 'patronato' | '*',
			parameter: string
		): string => {
			const queryFunction = `SELECT f.id_factura as numerodocumento, f.fecha_emision as fechaemision, f.nombres as razonsocialcomprador, f.detalle as detalle,
			${
				name_institution === 'municipio'
					? '(1*f.subtotal) as total,'
					: '(f.cantidad*f.valor_unitario) as total,'
			} f.iva, f.anulada as estadointerno, '${name_institution}' as institution FROM ${
				name_institution === 'municipio'
					? 'dbo.FACTURACION'
					: 'dbo.FACTURACION_PATRONATO'
			} f ${
				parameter != 'query-all'
					? `where f.id_factura LIKE '%${parameter}%'`
					: ''
			}`;
			return queryFunction;
		};

		query =
			'SET ROWCOUNT 100 ' +
			returnQuery('municipio', parameter) +
			'UNION ' +
			returnQuery('patronato', parameter) +
			'order by numerodocumento desc';

		// console.log(query);

		try {
			const result = await clientWSFESQLServer.query(query);
			resolve(result.recordset);
		} catch (error: any) {
			reject(error.toString());
		}
	});
};
