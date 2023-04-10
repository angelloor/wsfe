import { clientWSFEPostgreSQL } from '../../../utils/conections';
import { _messages } from '../../../utils/message/message';
import { Taxpayer } from './taxpayer.class';

/**
 * Inners and columns for the resolution of ids
 */
const COLUMNS_RETURN: string = `bvt.id_taxpayer, bvt.id_company, bvt.id_user, bvt.id_setting_taxpayer, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged, bvt.status_by_batch_taxpayer, bvt.deleted_taxpayer, cvc.id_setting, cvc.name_company, cvc.acronym_company, cvc.address_company, cvc.status_company, cvu.id_person, cvu.id_type_user, cvu.name_user, cvu.password_user, cvu.avatar_user, cvu.status_user, cvp.id_academic, cvp.id_job, cvp.dni_person, cvp.name_person, cvp.last_name_person, cvp.address_person, cvp.phone_person, cva.title_academic, cva.abbreviation_academic, cva.nivel_academic, cvj.name_job, cvj.address_job, cvj.phone_job, cvj.position_job, cvtu.id_profile, cvtu.name_type_user, cvtu.description_type_user, cvtu.status_type_user, bvst.id_mail_server, bvst.mailing_setting_taxpayer, bvst.from_setting_taxpayer, bvst.subject_setting_taxpayer, bvst.html_setting_taxpayer, bvst.download_note_setting_taxpayer, bvst.logo_path_setting_taxpayer`;
const INNERS_JOIN: string = ` inner join core.view_company cvc on bvt.id_company = cvc.id_company
inner join core.view_user cvu on bvt.id_user = cvu.id_user
inner join core.view_person cvp on cvu.id_person = cvp.id_person
inner join core.view_academic cva on cvp.id_academic = cva.id_academic
inner join core.view_job cvj on cvp.id_job = cvj.id_job
inner join core.view_type_user cvtu on cvu.id_type_user = cvtu.id_type_user
inner join business.view_setting_taxpayer bvst on bvt.id_setting_taxpayer = bvst.id_setting_taxpayer`;

export const dml_taxpayer_create = (taxpayer: Taxpayer) => {
	return new Promise<Taxpayer[]>(async (resolve, reject) => {
		const query = `select * from business.dml_taxpayer_create_modified(${taxpayer.id_user_})`;

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

export const view_taxpayer = (taxpayer: Taxpayer) => {
	return new Promise<Taxpayer[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from business.  bvt${INNERS_JOIN}${
			taxpayer.business_name_taxpayer != 'query-all'
				? ` where lower(bvt.business_name_taxpayer) LIKE '%${taxpayer.business_name_taxpayer}%'`
				: ``
		} order by bvt.id_taxpayer desc`;

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

export const view_taxpayer_specific_read = (taxpayer: Taxpayer) => {
	return new Promise<Taxpayer[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from business.view_taxpayer bvt ${INNERS_JOIN} where bvt.id_taxpayer = ${taxpayer.id_taxpayer}`;

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

export const dml_taxpayer_update = (taxpayer: Taxpayer) => {
	return new Promise<Taxpayer[]>(async (resolve, reject) => {
		const query = `select * from business.dml_taxpayer_update_modified(${taxpayer.id_user_},
			${taxpayer.id_taxpayer},
			${taxpayer.company.id_company},
			${taxpayer.user.id_user},
			${taxpayer.setting_taxpayer.id_setting_taxpayer},
			'${taxpayer.type_emission}',
			'${taxpayer.business_name_taxpayer}',
			'${taxpayer.tradename_taxpayer}',
			'${taxpayer.ruc_taxpayer}',
			'${taxpayer.dir_matriz_taxpayer}',
			'${taxpayer.signature_password_taxpayer}',
			'${taxpayer.signature_path_taxpayer}',
			${taxpayer.status_taxpayer},
			'${taxpayer.accounting_obliged}',
			${taxpayer.status_by_batch_taxpayer},
			${taxpayer.deleted_taxpayer},
			${taxpayer.user.person.id_person},
			'${taxpayer.user.type_user.id_type_user}',
			'${taxpayer.user.name_user}',
			'${taxpayer.user.password_user}',
			'${taxpayer.user.avatar_user}',
			${taxpayer.user.status_user},
			${taxpayer.user.person.academic.id_academic},
			${taxpayer.user.person.job.id_job},
			'${taxpayer.user.person.dni_person}',
			'${taxpayer.user.person.name_person}',
			'${taxpayer.user.person.last_name_person}',
			'${taxpayer.user.person.address_person}',
			'${taxpayer.user.person.phone_person}',
			'${taxpayer.user.person.academic.title_academic}',
			'${taxpayer.user.person.academic.abbreviation_academic}',
			'${taxpayer.user.person.academic.nivel_academic}',
			'${taxpayer.user.person.job.name_job}',
			'${taxpayer.user.person.job.address_job}',
			'${taxpayer.user.person.job.phone_job}',
			'${taxpayer.user.person.job.position_job}')`;

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

export const dml_taxpayer_change_status_by_batch = (taxpayer: Taxpayer) => {
	return new Promise<Taxpayer | any>(async (resolve, reject) => {
		const query = `select * from business.dml_taxpayer_change_status_by_batch(${taxpayer.id_user_},${taxpayer.id_taxpayer},${taxpayer.status_by_batch_taxpayer}) as result`;

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

export const dml_taxpayer_delete = (taxpayer: Taxpayer) => {
	return new Promise<Taxpayer | any>(async (resolve, reject) => {
		const query = `select * from business.dml_taxpayer_delete_modified(${taxpayer.id_user_},${taxpayer.id_taxpayer}) as result`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows[0]);
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

export const dml_taxpayer_upload_signature = (
	taxpayer: Taxpayer,
	new_path: string
) => {
	return new Promise<any>(async (resolve, reject) => {
		const query = `select * from business.dml_taxpayer_upload_signature(${taxpayer.id_user_},${taxpayer.id_taxpayer},'${new_path}') as result`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows[0]);
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

export const dml_taxpayer_remove_signature = (taxpayer: Taxpayer) => {
	return new Promise<any>(async (resolve, reject) => {
		const query = `select * from business.dml_taxpayer_remove_signature(${taxpayer.id_user_},${taxpayer.id_taxpayer}) as result`;

		// console.log(query);

		try {
			const response = await clientWSFEPostgreSQL.query(query);
			resolve(response.rows[0]);
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
