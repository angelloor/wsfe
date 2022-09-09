import { Taxpayer } from '../taxpayer/taxpayer.class';
import { _taxpayer } from '../taxpayer/taxpayer.data';
import {
	dml_establishment_create,
	dml_establishment_delete,
	dml_establishment_update,
	view_establishment,
	view_establishment_by_taxpayer_read,
	view_establishment_specific_read,
} from './establishment.store';

export class Establishment {
	/** Attributes */
	public id_user_?: number;
	public id_establishment: number;
	public taxpayer: Taxpayer;
	public value_establishment?: string;
	public description_establishment?: string;
	public deleted_establishment?: boolean;
	/** Constructor */
	constructor(
		id_user_: number = 0,
		id_establishment: number = 0,
		taxpayer: Taxpayer = _taxpayer,
		value_establishment: string = '',
		description_establishment: string = '',
		deleted_establishment: boolean = false
	) {
		this.id_user_ = id_user_;
		this.id_establishment = id_establishment;
		this.taxpayer = taxpayer;
		this.value_establishment = value_establishment;
		this.description_establishment = description_establishment;
		this.deleted_establishment = deleted_establishment;
	}
	/** Setters and Getters */
	set _id_user_(id_user_: number) {
		this.id_user_ = id_user_;
	}
	get _id_user_() {
		return this.id_user_!;
	}

	set _id_establishment(id_establishment: number) {
		this.id_establishment = id_establishment;
	}
	get _id_establishment() {
		return this.id_establishment;
	}

	set _taxpayer(taxpayer: Taxpayer) {
		this.taxpayer = taxpayer;
	}
	get _taxpayer() {
		return this.taxpayer;
	}

	set _value_establishment(value_establishment: string) {
		this.value_establishment = value_establishment;
	}
	get _value_establishment() {
		return this.value_establishment!;
	}

	set _description_establishment(description_establishment: string) {
		this.description_establishment = description_establishment;
	}
	get _description_establishment() {
		return this.description_establishment!;
	}

	set _deleted_establishment(deleted_establishment: boolean) {
		this.deleted_establishment = deleted_establishment;
	}
	get _deleted_establishment() {
		return this.deleted_establishment!;
	}

	/** Methods */
	create() {
		return new Promise<Establishment>(async (resolve, reject) => {
			await dml_establishment_create(this)
				.then((establishments: Establishment[]) => {
					/**
					 * Mutate response
					 */
					const _establishments = this.mutateResponse(establishments);

					resolve(_establishments[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	read() {
		return new Promise<Establishment[]>(async (resolve, reject) => {
			await view_establishment(this)
				.then((establishments: Establishment[]) => {
					/**
					 * Mutate response
					 */
					const _establishments = this.mutateResponse(establishments);

					resolve(_establishments);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	byTaxpayerRead() {
		return new Promise<Establishment[]>(async (resolve, reject) => {
			await view_establishment_by_taxpayer_read(this)
				.then((establishments: Establishment[]) => {
					/**
					 * Mutate response
					 */
					const _establishments = this.mutateResponse(establishments);

					resolve(_establishments);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	specificRead() {
		return new Promise<Establishment>(async (resolve, reject) => {
			await view_establishment_specific_read(this)
				.then((establishments: Establishment[]) => {
					/**
					 * Mutate response
					 */
					const _establishments = this.mutateResponse(establishments);

					resolve(_establishments[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	update() {
		return new Promise<Establishment>(async (resolve, reject) => {
			await dml_establishment_update(this)
				.then((establishments: Establishment[]) => {
					/**
					 * Mutate response
					 */
					const _establishments = this.mutateResponse(establishments);

					resolve(_establishments[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	delete() {
		return new Promise<boolean>(async (resolve, reject) => {
			await dml_establishment_delete(this)
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
	 * @param establishments
	 * @returns
	 */
	private mutateResponse(establishments: Establishment[]): Establishment[] {
		let _establishments: Establishment[] = [];

		establishments.map((item: any) => {
			let _establishment: Establishment | any = {
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
			delete _establishment.id_taxpayer;
			delete _establishment.id_company;
			delete _establishment.id_user;
			delete _establishment.type_emission;
			delete _establishment.business_name_taxpayer;
			delete _establishment.tradename_taxpayer;
			delete _establishment.ruc_taxpayer;
			delete _establishment.dir_matriz_taxpayer;
			delete _establishment.signature_password_taxpayer;
			delete _establishment.signature_path_taxpayer;
			delete _establishment.status_taxpayer;
			delete _establishment.accounting_obliged;

			_establishments.push(_establishment);
		});

		return _establishments;
	}
}
