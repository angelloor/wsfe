import { clientWSFEPostgreSQL } from '../../../utils/conections';
import { _messages } from '../../../utils/message/message';
import { Sequence } from './sequence.class';

/**
 * Inners and columns for the resolution of ids
 */
const COLUMNS_RETURN: string = `setval('business.serial_sequence_'||bvs.id_sequence||'', (select nextval('business.serial_sequence_'||bvs.id_sequence||'')-1)) as value_sequence, bvs.id_sequence, bvs.id_institution, bvs.id_establishment, bvs.id_emission_point, bvs.type_environment as bvs_type_environment, bvs.type_voucher as bvs_type_voucher, bvs.number_code_sequence, bvs.status_sequence, bvs.deleted_sequence, bvi.id_taxpayer, bvi.type_environment as bvi_type_environment, bvi.name_institution, bvi.description_institution, bvi.address_institution, bvi.status_institution, bve.value_establishment, bve.description_establishment, bvep.value_emission_point, bvep.description_emission_point`;
const INNERS_JOIN: string = ` inner join business.view_institution bvi on bvs.id_institution = bvi.id_institution
inner join business.view_establishment bve on bvs.id_establishment = bve.id_establishment
inner join business.view_emission_point bvep on bvs.id_emission_point = bvep.id_emission_point`;

export const dml_sequence_create = (sequence: Sequence) => {
	return new Promise<Sequence[]>(async (resolve, reject) => {
		const query = `select * from business.dml_sequence_create_modified(${sequence.id_user_}, ${sequence.institution.id_institution})`;

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

export const view_sequence = (sequence: Sequence) => {
	return new Promise<Sequence[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from business.view_sequence bvs${INNERS_JOIN}${
			sequence.type_voucher!.toString() != 'query-all'
				? ` where lower(bvs.type_voucher::character varying) LIKE '%${sequence.type_voucher}%'`
				: ``
		} order by bvs.id_sequence desc`;

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

export const view_sequence_by_institution_read = (sequence: Sequence) => {
	return new Promise<Sequence[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from business.view_sequence bvs${INNERS_JOIN}${
			sequence.type_voucher!.toString() != 'query-all'
				? ` where lower(bvs.type_voucher::character varying) LIKE '%${sequence.type_voucher}%' and bvs.id_institution = ${sequence.institution}`
				: ` where bvs.id_institution = ${sequence.institution}`
		} order by bvs.id_sequence desc`;

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

export const view_sequence_specific_read = (sequence: Sequence) => {
	return new Promise<Sequence[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from business.view_sequence bvs ${INNERS_JOIN} where bvs.id_sequence = ${sequence.id_sequence}`;

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

export const dml_sequence_update = (sequence: Sequence) => {
	return new Promise<Sequence[]>(async (resolve, reject) => {
		const query = `select * from business.dml_sequence_update_modified(${sequence.id_user_},
			${sequence.id_sequence},
			${sequence.institution.id_institution},
			${sequence.establishment.id_establishment},
			${sequence.emission_point.id_emission_point},
			'${sequence.type_environment}',
			'${sequence.type_voucher}',
			'${sequence.number_code_sequence}',
			${sequence.status_sequence},
			${sequence.deleted_sequence})`;

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

export const dml_sequence_delete = (sequence: Sequence) => {
	return new Promise<boolean>(async (resolve, reject) => {
		const query = `select * from business.dml_sequence_delete_modified(${sequence.id_user_},${sequence.id_sequence}) as result`;

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
