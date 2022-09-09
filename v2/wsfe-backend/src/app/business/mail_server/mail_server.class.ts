import { Taxpayer } from '../taxpayer/taxpayer.class';
import { _taxpayer } from '../taxpayer/taxpayer.data';
import {
	dml_mail_server_create,
	dml_mail_server_delete,
	dml_mail_server_update,
	view_mail_server,
	view_mail_server_by_taxpayer_read,
	view_mail_server_specific_read,
} from './mail_server.store';

export class MailServer {
	/** Attributes */
	public id_user_?: number;
	public id_mail_server: number;
	public taxpayer: Taxpayer;
	public type_mail_server?: string;
	public host_mail_server?: string;
	public port_mail_server?: number;
	public secure_mail_server?: boolean;
	public user_mail_server?: string;
	public password_mail_server?: string;
	public status_mail_server?: boolean;
	/** Constructor */
	constructor(
		id_user_: number = 0,
		id_mail_server: number = 0,
		taxpayer: Taxpayer = _taxpayer,
		type_mail_server: string = '',
		host_mail_server: string = '',
		port_mail_server: number = 0,
		secure_mail_server: boolean = false,
		user_mail_server: string = '',
		password_mail_server: string = '',
		status_mail_server: boolean = false
	) {
		this.id_user_ = id_user_;
		this.id_mail_server = id_mail_server;
		this.taxpayer = taxpayer;
		this.type_mail_server = type_mail_server;
		this.host_mail_server = host_mail_server;
		this.port_mail_server = port_mail_server;
		this.secure_mail_server = secure_mail_server;
		this.user_mail_server = user_mail_server;
		this.password_mail_server = password_mail_server;
		this.status_mail_server = status_mail_server;
	}
	/** Setters and Getters */
	set _id_user_(id_user_: number) {
		this.id_user_ = id_user_;
	}
	get _id_user_() {
		return this.id_user_!;
	}

	set _id_mail_server(id_mail_server: number) {
		this.id_mail_server = id_mail_server;
	}
	get _id_mail_server() {
		return this.id_mail_server;
	}

	set _taxpayer(taxpayer: Taxpayer) {
		this.taxpayer = taxpayer;
	}
	get _taxpayer() {
		return this.taxpayer;
	}

	set _type_mail_server(type_mail_server: string) {
		this.type_mail_server = type_mail_server;
	}
	get _type_mail_server() {
		return this.type_mail_server!;
	}

	set _host_mail_server(host_mail_server: string) {
		this.host_mail_server = host_mail_server;
	}
	get _host_mail_server() {
		return this.host_mail_server!;
	}

	set _port_mail_server(port_mail_server: number) {
		this.port_mail_server = port_mail_server;
	}
	get _port_mail_server() {
		return this.port_mail_server!;
	}

	set _secure_mail_server(secure_mail_server: boolean) {
		this.secure_mail_server = secure_mail_server;
	}
	get _secure_mail_server() {
		return this.secure_mail_server!;
	}

	set _user_mail_server(user_mail_server: string) {
		this.user_mail_server = user_mail_server;
	}
	get _user_mail_server() {
		return this.user_mail_server!;
	}

	set _password_mail_server(password_mail_server: string) {
		this.password_mail_server = password_mail_server;
	}
	get _password_mail_server() {
		return this.password_mail_server!;
	}

	set _status_mail_server(status_mail_server: boolean) {
		this.status_mail_server = status_mail_server;
	}
	get _status_mail_server() {
		return this.status_mail_server!;
	}

	/** Methods */
	create() {
		return new Promise<MailServer>(async (resolve, reject) => {
			await dml_mail_server_create(this)
				.then((mailServers: MailServer[]) => {
					/**
					 * Mutate response
					 */
					const _mailServers = this.mutateResponse(mailServers);

					resolve(_mailServers[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	read() {
		return new Promise<MailServer[]>(async (resolve, reject) => {
			await view_mail_server(this)
				.then((mailServers: MailServer[]) => {
					/**
					 * Mutate response
					 */
					const _mailServers = this.mutateResponse(mailServers);

					resolve(_mailServers);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	byTaxpayerRead() {
		return new Promise<MailServer[]>(async (resolve, reject) => {
			await view_mail_server_by_taxpayer_read(this)
				.then((mailServers: MailServer[]) => {
					/**
					 * Mutate response
					 */
					const _mailServers = this.mutateResponse(mailServers);

					resolve(_mailServers);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	specificRead() {
		return new Promise<MailServer>(async (resolve, reject) => {
			await view_mail_server_specific_read(this)
				.then((mailServers: MailServer[]) => {
					/**
					 * Mutate response
					 */
					const _mailServers = this.mutateResponse(mailServers);

					resolve(_mailServers[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	update() {
		return new Promise<MailServer>(async (resolve, reject) => {
			await dml_mail_server_update(this)
				.then((mailServers: MailServer[]) => {
					/**
					 * Mutate response
					 */
					const _mailServers = this.mutateResponse(mailServers);

					resolve(_mailServers[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	delete() {
		return new Promise<boolean>(async (resolve, reject) => {
			await dml_mail_server_delete(this)
				.then((response: boolean) => {
					resolve(response);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	/**
	 * Eliminar ids de entidades externas y formatear la informacion en el esquema correspondiente
	 * @param mailServers
	 * @returns
	 */
	private mutateResponse(mailServers: MailServer[]): MailServer[] {
		let _mailServers: MailServer[] = [];

		mailServers.map((item: any) => {
			let _mailServer: MailServer | any = {
				...item,
				taxpayer: {
					id_taxpayer: item.id_taxpayer,
					company: {
						id_company: item.id_company,
					},
					user: {
						id_user: item.id_user,
					},
					type_emission: item.type_emission,
					business_name_taxpayer: item.business_name_taxpayer,
					tradename_taxpayer: item.tradename_taxpayer,
					ruc_taxpayer: item.ruc_taxpayer,
					dir_matriz_taxpayer: item.dir_matriz_taxpayer,
					signature_password_taxpayer: item.signature_password_taxpayer,
					signature_path_taxpayer: item.signature_path_taxpayer,
					status_taxpayer: item.status_taxpayer,
					accounting_obliged: item.accounting_obliged,
				},
				/**
				 * Generate structure of second level the entity (is important add the ids of entity)
				 * similar the return of read
				 */
			};
			/**
			 * delete ids of principal object level
			 */
			delete _mailServer.id_taxpayer;
			delete _mailServer.id_company;
			delete _mailServer.id_user;
			delete _mailServer.type_emission;
			delete _mailServer.business_name_taxpayer;
			delete _mailServer.tradename_taxpayer;
			delete _mailServer.ruc_taxpayer;
			delete _mailServer.dir_matriz_taxpayer;
			delete _mailServer.signature_password_taxpayer;
			delete _mailServer.signature_path_taxpayer;
			delete _mailServer.status_taxpayer;
			delete _mailServer.accounting_obliged;

			_mailServers.push(_mailServer);
		});

		return _mailServers;
	}
}
