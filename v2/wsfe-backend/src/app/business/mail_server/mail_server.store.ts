import { clientWSFEPostgreSQL } from '../../../utils/conections';
import { _messages } from '../../../utils/message/message';
import { MailServer } from './mail_server.class';

/**
 * Inners and columns for the resolution of ids
 */
const COLUMNS_RETURN: string = `bvms.id_mail_server, bvms.id_taxpayer, bvms.type_mail_server, bvms.host_mail_server, bvms.port_mail_server, bvms.secure_mail_server, bvms.user_mail_server, bvms.status_mail_server, bvt.id_company, bvt.id_user, bvt.type_emission, bvt.business_name_taxpayer, bvt.tradename_taxpayer, bvt.ruc_taxpayer, bvt.dir_matriz_taxpayer, bvt.signature_password_taxpayer, bvt.signature_path_taxpayer, bvt.status_taxpayer, bvt.accounting_obliged`;
const INNERS_JOIN: string = ` inner join business.view_taxpayer bvt on bvms.id_taxpayer = bvt.id_taxpayer`;

export const dml_mail_server_create = (mail_server: MailServer) => {
	return new Promise<MailServer[]>(async (resolve, reject) => {
		const query = `select * from business.dml_mail_server_create_modified(${mail_server.id_user_}, ${mail_server.taxpayer.id_taxpayer})`;

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

export const view_mail_server = (mail_server: MailServer) => {
	return new Promise<MailServer[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN}, bvms.password_mail_server from business.view_mail_server bvms${INNERS_JOIN}${
			mail_server.host_mail_server != 'query-all'
				? ` where lower(bvms.host_mail_server) LIKE '%${mail_server.host_mail_server}%'`
				: ``
		} order by bvms.id_mail_server desc`;

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

export const view_mail_server_by_taxpayer_read = (mail_server: MailServer) => {
	return new Promise<MailServer[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN}, bvms.password_mail_server from business.view_mail_server bvms${INNERS_JOIN}${
			mail_server.host_mail_server != 'query-all'
				? ` where lower(bvms.host_mail_server) LIKE '%${mail_server.host_mail_server}%' and bvms.id_taxpayer = ${mail_server.taxpayer}`
				: ` where bvms.id_taxpayer = ${mail_server.taxpayer}`
		} order by bvms.id_mail_server desc`;

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

export const view_mail_server_specific_read = (mail_server: MailServer) => {
	return new Promise<MailServer[]>(async (resolve, reject) => {
		const query = `select ${COLUMNS_RETURN}, (select * from core.security_cap_aes_decrypt(bvms.password_mail_server))::character varying as password_mail_server from business.view_mail_server bvms ${INNERS_JOIN} where bvms.id_mail_server = ${mail_server.id_mail_server}`;

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

export const dml_mail_server_update = (mail_server: MailServer) => {
	return new Promise<MailServer[]>(async (resolve, reject) => {
		const query = `select * from business.dml_mail_server_update_modified(${mail_server.id_user_},
			${mail_server.id_mail_server},
			${mail_server.taxpayer.id_taxpayer},
			'${mail_server.type_mail_server}',
			'${mail_server.host_mail_server}',
			${mail_server.port_mail_server},
			${mail_server.secure_mail_server},
			'${mail_server.user_mail_server}',
			'${mail_server.password_mail_server}',
			${mail_server.status_mail_server})`;

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

export const dml_mail_server_delete = (mail_server: MailServer) => {
	return new Promise<boolean>(async (resolve, reject) => {
		const query = `select * from business.dml_mail_server_delete(${mail_server.id_user_},${mail_server.id_mail_server}) as result`;

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
