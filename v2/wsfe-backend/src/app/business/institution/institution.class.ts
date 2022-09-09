import { TYPE_ENVIRONMENT } from '../business.types';
import { Taxpayer } from '../taxpayer/taxpayer.class';
import { _taxpayer } from '../taxpayer/taxpayer.data';
import {
	dml_institution_change_status_by_batch,
	dml_institution_create,
	dml_institution_delete,
	dml_institution_update,
	view_institution,
	view_institution_by_taxpayer_read,
	view_institution_specific_read,
} from './institution.store';

export class Institution {
	/** Attributes */
	public id_user_?: number;
	public id_institution: number;
	public taxpayer: Taxpayer;
	public type_environment?: TYPE_ENVIRONMENT;
	public name_institution?: string;
	public description_institution?: string;
	public address_institution?: string;
	public status_institution?: boolean;
	public status_by_batch_institution?: boolean;
	public deleted_institution?: boolean;
	/** Constructor */
	constructor(
		id_user_: number = 0,
		id_institution: number = 0,
		taxpayer: Taxpayer = _taxpayer,
		type_environment: TYPE_ENVIRONMENT = '1',
		name_institution: string = '',
		description_institution: string = '',
		address_institution: string = '',
		status_institution: boolean = false,
		status_by_batch_institution: boolean = false,
		deleted_institution: boolean = false
	) {
		this.id_user_ = id_user_;
		this.id_institution = id_institution;
		this.taxpayer = taxpayer;
		this.type_environment = type_environment;
		this.name_institution = name_institution;
		this.description_institution = description_institution;
		this.address_institution = address_institution;
		this.status_institution = status_institution;
		this.status_by_batch_institution = status_by_batch_institution;
		this.deleted_institution = deleted_institution;
	}
	/** Setters and Getters */
	set _id_user_(id_user_: number) {
		this.id_user_ = id_user_;
	}
	get _id_user_() {
		return this.id_user_!;
	}

	set _id_institution(id_institution: number) {
		this.id_institution = id_institution;
	}
	get _id_institution() {
		return this.id_institution;
	}

	set _taxpayer(taxpayer: Taxpayer) {
		this.taxpayer = taxpayer;
	}
	get _taxpayer() {
		return this.taxpayer;
	}

	set _type_environment(type_environment: TYPE_ENVIRONMENT) {
		this.type_environment = type_environment;
	}
	get _type_environment() {
		return this.type_environment!;
	}

	set _name_institution(name_institution: string) {
		this.name_institution = name_institution;
	}
	get _name_institution() {
		return this.name_institution!;
	}

	set _description_institution(description_institution: string) {
		this.description_institution = description_institution;
	}
	get _description_institution() {
		return this.description_institution!;
	}

	set _address_institution(address_institution: string) {
		this.address_institution = address_institution;
	}
	get _address_institution() {
		return this.address_institution!;
	}

	set _status_institution(status_institution: boolean) {
		this.status_institution = status_institution;
	}
	get _status_institution() {
		return this.status_institution!;
	}

	set _status_by_batch_institution(status_by_batch_institution: boolean) {
		this.status_institution = status_by_batch_institution;
	}
	get _status_by_batch_institution() {
		return this.status_by_batch_institution!;
	}

	set _deleted_institution(deleted_institution: boolean) {
		this.deleted_institution = deleted_institution;
	}
	get _deleted_institution() {
		return this.deleted_institution!;
	}

	/** Methods */
	create() {
		return new Promise<Institution>(async (resolve, reject) => {
			await dml_institution_create(this)
				.then((institutions: Institution[]) => {
					/**
					 * Mutate response
					 */
					const _institutions = this.mutateResponse(institutions);

					resolve(_institutions[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	read() {
		return new Promise<Institution[]>(async (resolve, reject) => {
			await view_institution(this)
				.then((institutions: Institution[]) => {
					/**
					 * Mutate response
					 */
					const _institutions = this.mutateResponse(institutions);

					resolve(_institutions);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	byTaxpayerRead() {
		return new Promise<Institution[]>(async (resolve, reject) => {
			await view_institution_by_taxpayer_read(this)
				.then((institutions: Institution[]) => {
					/**
					 * Mutate response
					 */
					const _institutions = this.mutateResponse(institutions);

					resolve(_institutions);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	specificRead() {
		return new Promise<Institution>(async (resolve, reject) => {
			await view_institution_specific_read(this)
				.then((institutions: Institution[]) => {
					/**
					 * Mutate response
					 */
					const _institutions = this.mutateResponse(institutions);

					resolve(_institutions[0]);
				})
				.catch((error: string) => {
					reject(error);
				});
		});
	}

	update() {
		return new Promise<Institution>(async (resolve, reject) => {
			await dml_institution_update(this)
				.then((institutions: Institution[]) => {
					/**
					 * Mutate response
					 */
					const _institutions = this.mutateResponse(institutions);

					resolve(_institutions[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}
	/**
	 * changeStatusByBatchInstitution
	 * @param institution
	 * @returns
	 */
	changeStatusByBatchInstitution(institution: Institution) {
		return new Promise<boolean>(async (resolve, reject) => {
			await dml_institution_change_status_by_batch(institution)
				.then((response: boolean) => {
					resolve(response);
				})
				.catch((error: string) => {
					reject(error);
				});
		});
	}

	delete() {
		return new Promise<boolean>(async (resolve, reject) => {
			await dml_institution_delete(this)
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
	 * @param institutions
	 * @returns
	 */
	private mutateResponse(institutions: Institution[]): Institution[] {
		let _institutions: Institution[] = [];

		institutions.map((item: any) => {
			let _institution: Institution | any = {
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
			delete _institution.id_taxpayer;
			delete _institution.id_company;
			delete _institution.id_user;
			delete _institution.type_emission;
			delete _institution.business_name_taxpayer;
			delete _institution.tradename_taxpayer;
			delete _institution.ruc_taxpayer;
			delete _institution.dir_matriz_taxpayer;
			delete _institution.signature_password_taxpayer;
			delete _institution.signature_path_taxpayer;
			delete _institution.status_taxpayer;
			delete _institution.accounting_obliged;

			_institutions.push(_institution);
		});

		return _institutions;
	}
}
