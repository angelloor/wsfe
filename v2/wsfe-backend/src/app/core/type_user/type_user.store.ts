import { clientWSFEPostgreSQL } from '../../../utils/conections';
import { _messages } from '../../../utils/message/message';
import { TypeUser } from './type_user.class';

/**
 * Inners and columns for the resolution of ids
 */
const COLUMNS_RETURN: string = `ctu.id_type_user, ctu.id_company, ctu.id_profile, ctu.name_type_user, ctu.description_type_user, ctu.status_type_user, ctu.deleted_type_user, cvc.name_company, cvc.acronym_company, cvc.address_company, cvc.status_company, cvp.type_profile, cvp.name_profile, cvp.description_profile, cvp.status_profile`;
const INNERS_JOIN: string = ` inner join core.view_company cvc on ctu.id_company = cvc.id_company
inner join core.view_profile cvp on ctu.id_profile = cvp.id_profile`;

export const dml_type_user_create = (type_user: TypeUser) => {
	return new Promise<TypeUser[]>(async (resolve, reject) => {
		const query = `select * from core.dml_type_user_create_modified(${type_user.id_user_})`;

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

export const view_type_user = (type_user: TypeUser) => {
	return new Promise<TypeUser[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from core.view_type_user ctu${INNERS_JOIN}${
			type_user.name_type_user != 'query-all'
				? ` where lower(ctu.name_type_user) LIKE '%${type_user.name_type_user}%'`
				: ``
		} order by ctu.id_type_user desc`;

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

export const view_type_user_specific_read = (type_user: TypeUser) => {
	return new Promise<TypeUser[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from core.view_type_user ctu ${INNERS_JOIN} where ctu.id_type_user = ${type_user.id_type_user}`;

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

export const dml_type_user_update = (type_user: TypeUser) => {
	return new Promise<TypeUser[]>(async (resolve, reject) => {
		const query = `select * from core.dml_type_user_update_modified(${type_user.id_user_},
			${type_user.id_type_user},
			${type_user.company.id_company},
			${type_user.profile.id_profile},
			'${type_user.name_type_user}',
			'${type_user.description_type_user}',
			${type_user.status_type_user},
			${type_user.deleted_type_user})`;

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

export const dml_type_user_delete = (type_user: TypeUser) => {
	return new Promise<boolean>(async (resolve, reject) => {
		const query = `select * from core.dml_type_user_delete(${type_user.id_user_},${type_user.id_type_user}) as result`;

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
