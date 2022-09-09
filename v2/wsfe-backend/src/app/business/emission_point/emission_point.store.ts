import { clientWSFEPostgreSQL } from '../../../utils/conections';
import { _messages } from '../../../utils/message/message';
import { EmissionPoint } from './emission_point.class';

/**
 * Inners and columns for the resolution of ids
 */
const COLUMNS_RETURN: string = `bvep.id_emission_point, bvep.id_taxpayer, bvep.value_emission_point, bvep.description_emission_point, bvep.deleted_emission_point, bvt.id_company, bvt.id_user, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged`;
const INNERS_JOIN: string = ` inner join business.view_taxpayer bvt on bvep.id_taxpayer = bvt.id_taxpayer`;

export const dml_emission_point_create = (emission_point: EmissionPoint) => {
	return new Promise<EmissionPoint[]>(async (resolve, reject) => {
		const query = `select * from business.dml_emission_point_create_modified(${emission_point.id_user_}, ${emission_point.taxpayer.id_taxpayer})`;

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

export const view_emission_point = (emission_point: EmissionPoint) => {
	return new Promise<EmissionPoint[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from business.view_emission_point bvep${INNERS_JOIN}${
			emission_point.value_emission_point != 'query-all'
				? ` where lower(bvep.value_emission_point) LIKE '%${emission_point.value_emission_point}%'`
				: ``
		} order by bvep.id_emission_point desc`;

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

export const view_emission_point_by_taxpayer_read = (
	emission_point: EmissionPoint
) => {
	return new Promise<EmissionPoint[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from business.view_emission_point bvep${INNERS_JOIN}${
			emission_point.value_emission_point != 'query-all'
				? ` where lower(bvep.value_emission_point) LIKE '%${emission_point.value_emission_point}%' and bvep.id_taxpayer = ${emission_point.taxpayer}`
				: ` where bvep.id_taxpayer = ${emission_point.taxpayer}`
		} order by bvep.id_emission_point desc`;

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

export const view_emission_point_specific_read = (
	emission_point: EmissionPoint
) => {
	return new Promise<EmissionPoint[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from business.view_emission_point bvep ${INNERS_JOIN} where bvep.id_emission_point = ${emission_point.id_emission_point}`;

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

export const dml_emission_point_update = (emission_point: EmissionPoint) => {
	return new Promise<EmissionPoint[]>(async (resolve, reject) => {
		const query = `select * from business.dml_emission_point_update_modified(${emission_point.id_user_},
			${emission_point.id_emission_point},
			${emission_point.taxpayer.id_taxpayer},
			'${emission_point.value_emission_point}',
			'${emission_point.description_emission_point}',
			${emission_point.deleted_emission_point})`;

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

export const dml_emission_point_delete = (emission_point: EmissionPoint) => {
	return new Promise<boolean>(async (resolve, reject) => {
		const query = `select * from business.dml_emission_point_delete(${emission_point.id_user_},${emission_point.id_emission_point}) as result`;

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
