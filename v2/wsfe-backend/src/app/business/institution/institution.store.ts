import { clientWSFEPostgreSQL } from '../../../utils/conections';
import { _messages } from '../../../utils/message/message';
import { Institution } from './institution.class';

/**
 * Inners and columns for the resolution of ids
 */
const COLUMNS_RETURN: string = `setval('business.serial_institution_'||bvi.id_institution||'', (select nextval('business.serial_institution_'||bvi.id_institution||'')-1)) as value_sequence, bvi.id_institution, bvi.id_taxpayer, bvi.type_environment, bvi.name_institution, bvi.description_institution, bvi.address_institution, bvi.status_institution, bvi.status_by_batch_institution, bvi.deleted_institution, bvt.id_company, bvt.id_user, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged`;
const INNERS_JOIN: string = ` inner join business.view_taxpayer bvt on bvi.id_taxpayer = bvt.id_taxpayer`;

export const dml_institution_create = (institution: Institution) => {
	return new Promise<Institution[]>(async (resolve, reject) => {
		const query = `select * from business.dml_institution_create_modified(${institution.id_user_}, ${institution.taxpayer.id_taxpayer})`;

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

export const view_institution = (institution: Institution) => {
	return new Promise<Institution[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from business.view_institution bvi${INNERS_JOIN}${
			institution.name_institution != 'query-all'
				? ` where lower(bvi.name_institution) LIKE '%${institution.name_institution}%'`
				: ``
		} order by bvi.id_institution desc`;

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

export const view_institution_by_taxpayer_read = (institution: Institution) => {
	return new Promise<Institution[]>(async (resolve, reject) => {
		const id_taxpayer: any = !institution.taxpayer.id_taxpayer
			? institution.taxpayer
			: institution.taxpayer.id_taxpayer;

		const query = `select ${COLUMNS_RETURN} from business.view_institution bvi${INNERS_JOIN}${
			institution.name_institution != 'query-all'
				? ` where lower(bvi.name_institution) LIKE '%${institution.name_institution}%' and bvi.id_taxpayer = ${id_taxpayer}`
				: ` where bvi.id_taxpayer = ${institution.taxpayer}`
		} order by bvi.id_institution desc`;

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

export const view_institution_specific_read = (institution: Institution) => {
	return new Promise<Institution[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from business.view_institution bvi ${INNERS_JOIN} where bvi.id_institution = ${institution.id_institution}`;

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

export const dml_institution_update = (institution: Institution) => {
	return new Promise<Institution[]>(async (resolve, reject) => {
		const query = `select * from business.dml_institution_update_modified(${institution.id_user_},
			${institution.id_institution},
			${institution.taxpayer.id_taxpayer},
			'${institution.type_environment}',
			'${institution.name_institution}',
			'${institution.description_institution}',
			'${institution.address_institution}',
			${institution.status_institution},
			${institution.status_by_batch_institution},
			${institution.deleted_institution})`;

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

export const dml_institution_change_status_by_batch = (
	institution: Institution
) => {
	return new Promise<boolean>(async (resolve, reject) => {
		const query = `select * from business.dml_institution_change_status_by_batch(${institution.id_user_},${institution.id_institution}, ${institution.status_by_batch_institution}) as result`;

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

export const dml_institution_delete = (institution: Institution) => {
	return new Promise<boolean>(async (resolve, reject) => {
		const query = `select * from business.dml_institution_delete_modified(${institution.id_user_},${institution.id_institution}) as result`;

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
