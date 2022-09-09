import { clientWSFEPostgreSQL } from '../../../utils/conections';
import { _messages } from '../../../utils/message/message';
import { SettingTaxpayer } from './setting_taxpayer.class';

/**
 * Inners and columns for the resolution of ids
 */
const COLUMNS_RETURN: string = `bvst.id_setting_taxpayer, bvst.id_mail_server, bvst.mailing_setting_taxpayer, bvst.from_setting_taxpayer, bvst.subject_setting_taxpayer, bvst.html_setting_taxpayer, bvst.download_note_setting_taxpayer, bvst.logo_path_setting_taxpayer`;
const INNERS_JOIN: string = ` `;

export const view_setting_taxpayer = (setting_taxpayer: SettingTaxpayer) => {
	return new Promise<SettingTaxpayer[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from business.view_setting_taxpayer bvst${INNERS_JOIN}${
			setting_taxpayer.html_setting_taxpayer != 'query-all'
				? ` where lower(bvst.html_setting_taxpayer) LIKE '%${setting_taxpayer.html_setting_taxpayer}%'`
				: ``
		} order by bvst.id_setting_taxpayer desc`;

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

export const view_setting_taxpayer_specific_read = (
	setting_taxpayer: SettingTaxpayer
) => {
	return new Promise<SettingTaxpayer[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN} from business.view_setting_taxpayer bvst ${INNERS_JOIN} where bvst.id_setting_taxpayer = ${setting_taxpayer.id_setting_taxpayer}`;

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

export const dml_setting_taxpayer_update = (
	setting_taxpayer: SettingTaxpayer
) => {
	return new Promise<SettingTaxpayer[]>(async (resolve, reject) => {
		const query = `select * from business.dml_setting_taxpayer_update_modified(${setting_taxpayer.id_user_},
			${setting_taxpayer.id_setting_taxpayer},
			${setting_taxpayer.mail_server.id_mail_server},
			${setting_taxpayer.mailing_setting_taxpayer},
			'${setting_taxpayer.from_setting_taxpayer}',
			'${setting_taxpayer.subject_setting_taxpayer}',
			'${setting_taxpayer.html_setting_taxpayer}',
			'${setting_taxpayer.download_note_setting_taxpayer}',
			'${setting_taxpayer.logo_path_setting_taxpayer}')`;

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

export const dml_setting_taxpayer_upload_logo = (
	setting_taxpayer: SettingTaxpayer,
	new_path: string
) => {
	return new Promise<any>(async (resolve, reject) => {
		const query = `select * from business.dml_setting_taxpayer_upload_logo(${setting_taxpayer.id_user_},${setting_taxpayer.id_setting_taxpayer},'${new_path}') as result`;

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

export const dml_setting_taxpayer_remove_logo = (
	setting_taxpayer: SettingTaxpayer
) => {
	return new Promise<any>(async (resolve, reject) => {
		const query = `select * from business.dml_setting_taxpayer_remove_logo(${setting_taxpayer.id_user_},${setting_taxpayer.id_setting_taxpayer}) as result`;

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
