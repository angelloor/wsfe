import { clientWSFEPostgreSQL } from '../../../utils/conections';
import { _messages } from '../../../utils/message/message';
import { Establishment } from './establishment.class';

/**
 * Inners and columns for the resolution of ids
 */
const COLUMNS_RETURN: string = `bve.id_establishment, bve.id_taxpayer, bve.value_establishment, bve.description_establishment, bve.deleted_establishment, bvt.id_company, bvt.id_user, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged`;
const INNERS_JOIN: string = ` inner join business.view_taxpayer bvt on bve.id_taxpayer = bvt.id_taxpayer`;

export const dml_establishment_create = (establishment: Establishment) => {
	return new Promise<Establishment[]>(async (resolve, reject) => {
		const query = `select * from business.dml_establishment_create_modified(${establishment.id_user_}, ${establishment.taxpayer.id_taxpayer})`;

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

export const view_establishment = (establishment: Establishment) => {
	return new Promise<Establishment[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from business.view_establishment bve${INNERS_JOIN}${
			establishment.value_establishment != 'query-all'
				? ` where lower(bve.value_establishment) LIKE '%${establishment.value_establishment}%'`
				: ``
		} order by bve.id_establishment desc`;

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

export const view_establishment_by_taxpayer_read = (
	establishment: Establishment
) => {
	return new Promise<Establishment[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from business.view_establishment bve${INNERS_JOIN}${
			establishment.value_establishment != 'query-all'
				? ` where lower(bve.value_establishment) LIKE '%${establishment.value_establishment}%' and bve.id_taxpayer = ${establishment.taxpayer}`
				: ` where bve.id_taxpayer = ${establishment.taxpayer}`
		} order by bve.id_establishment desc`;

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

export const view_establishment_specific_read = (
	establishment: Establishment
) => {
	return new Promise<Establishment[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from business.view_establishment bve ${INNERS_JOIN} where bve.id_establishment = ${establishment.id_establishment}`;

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

export const dml_establishment_update = (establishment: Establishment) => {
	return new Promise<Establishment[]>(async (resolve, reject) => {
		const query = `select * from business.dml_establishment_update_modified(${establishment.id_user_},
			${establishment.id_establishment},
			${establishment.taxpayer.id_taxpayer},
			'${establishment.value_establishment}',
			'${establishment.description_establishment}',
			${establishment.deleted_establishment})`;

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

export const dml_establishment_delete = (establishment: Establishment) => {
	return new Promise<boolean>(async (resolve, reject) => {
		const query = `select * from business.dml_establishment_delete(${establishment.id_user_},${establishment.id_establishment}) as result`;

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
