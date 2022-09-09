import {
	dml_company_create,
	dml_company_delete,
	dml_company_update,
	view_company,
	view_company_specific_read,
} from './company.store';
import { Setting } from './setting/setting.class';
import { _setting } from './setting/setting.data';

export class Company {
	/** Attributes */
	public id_user_?: number;
	public id_company: number;
	public setting: Setting;
	public name_company?: string;
	public acronym_company?: string;
	public address_company?: string;
	public status_company?: boolean;
	public deleted_company?: boolean;
	/** Constructor */
	constructor(
		id_user_: number = 0,
		id_company: number = 0,
		setting: Setting = _setting,
		name_company: string = '',
		acronym_company: string = '',
		address_company: string = '',
		status_company: boolean = false,
		deleted_company: boolean = false
	) {
		this.id_user_ = id_user_;
		this.id_company = id_company;
		this.setting = setting;
		this.name_company = name_company;
		this.acronym_company = acronym_company;
		this.address_company = address_company;
		this.status_company = status_company;
		this.deleted_company = deleted_company;
	}
	/** Setters and Getters */
	set _id_user_(id_user_: number) {
		this.id_user_ = id_user_;
	}
	get _id_user_() {
		return this.id_user_!;
	}

	set _id_company(id_company: number) {
		this.id_company = id_company;
	}
	get _id_company() {
		return this.id_company;
	}

	set _setting(setting: Setting) {
		this.setting = setting;
	}
	get _setting() {
		return this.setting;
	}

	set _name_company(name_company: string) {
		this.name_company = name_company;
	}
	get _name_company() {
		return this.name_company!;
	}

	set _acronym_company(acronym_company: string) {
		this.acronym_company = acronym_company;
	}
	get _acronym_company() {
		return this.acronym_company!;
	}

	set _address_company(address_company: string) {
		this.address_company = address_company;
	}
	get _address_company() {
		return this.address_company!;
	}

	set _status_company(status_company: boolean) {
		this.status_company = status_company;
	}
	get _status_company() {
		return this.status_company!;
	}

	set _deleted_company(deleted_company: boolean) {
		this.deleted_company = deleted_company;
	}
	get _deleted_company() {
		return this.deleted_company!;
	}

	/** Methods */
	create() {
		return new Promise<Company>(async (resolve, reject) => {
			await dml_company_create(this)
				.then((companys: Company[]) => {
					/**
					 * Mutate response
					 */
					const _companys = this.mutateResponse(companys);

					resolve(_companys[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	read() {
		return new Promise<Company[]>(async (resolve, reject) => {
			await view_company(this)
				.then((companys: Company[]) => {
					/**
					 * Mutate response
					 */
					const _companys = this.mutateResponse(companys);

					resolve(_companys);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	specificRead() {
		return new Promise<Company>(async (resolve, reject) => {
			await view_company_specific_read(this)
				.then((companys: Company[]) => {
					/**
					 * Mutate response
					 */
					const _companys = this.mutateResponse(companys);

					resolve(_companys[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	update() {
		return new Promise<Company>(async (resolve, reject) => {
			await dml_company_update(this)
				.then((companys: Company[]) => {
					/**
					 * Mutate response
					 */
					const _companys = this.mutateResponse(companys);

					resolve(_companys[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	delete() {
		return new Promise<boolean>(async (resolve, reject) => {
			await dml_company_delete(this)
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
	 * @param companys
	 * @returns
	 */
	private mutateResponse(companys: Company[]): Company[] {
		let _companys: Company[] = [];

		companys.map((item: any) => {
			let _company: Company | any = {
				...item,
				setting: {
					id_setting: item.id_setting,
					expiration_token: item.expiration_token,
					expiration_verification_code: item.expiration_verification_code,
					inactivity_time: item.inactivity_time,
					session_limit: item.session_limit,
					save_alfresco: item.save_alfresco,
					wait_autorization: item.wait_autorization,
					batch_shipping: item.batch_shipping,
					max_generation_pdf: item.max_generation_pdf,
					wait_generation_pdf: item.wait_generation_pdf,
				},
				/**
				 * Generate structure of second level the entity (is important add the ids of entity)
				 * similar the return of read
				 */
			};
			/**
			 * delete ids of principal object level
			 */
			delete _company.id_setting;
			delete _company.expiration_token;
			delete _company.expiration_verification_code;
			delete _company.inactivity_time;
			delete _company.session_limit;
			delete _company.save_alfresco;
			delete _company.wait_autorization;
			delete _company.batch_shipping;
			delete _company.max_generation_pdf;
			delete _company.wait_generation_pdf;

			_companys.push(_company);
		});

		return _companys;
	}
}
