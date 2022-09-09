import fs from 'fs';
import { generateRandomNumber } from '../../../utils/global';
import { Company } from '../../core/company/company.class';
import { _company } from '../../core/company/company.data';
import { User } from '../../core/user/user.class';
import { _user } from '../../core/user/user.data';
import { TYPE_ACCOUNTING_OBLIGED, TYPE_EMISSION } from '../business.types';
import { SettingTaxpayer } from '../setting_taxpayer/setting_taxpayer.class';
import { _settingTaxpayer } from '../setting_taxpayer/setting_taxpayer.data';
import {
	dml_taxpayer_change_status_by_batch,
	dml_taxpayer_create,
	dml_taxpayer_delete,
	dml_taxpayer_remove_signature,
	dml_taxpayer_update,
	dml_taxpayer_upload_signature,
	view_taxpayer,
	view_taxpayer_specific_read,
} from './taxpayer.store';

export class Taxpayer {
	/** Attributes */
	public id_user_?: number;
	public id_taxpayer: number;
	public company: Company;
	public user: User;
	public setting_taxpayer: SettingTaxpayer;
	public type_emission?: TYPE_EMISSION;
	public business_name_taxpayer?: string;
	public tradename_taxpayer?: string;
	public ruc_taxpayer?: string;
	public dir_matriz_taxpayer?: string;
	public signature_password_taxpayer?: string;
	public signature_path_taxpayer?: string;
	public status_taxpayer?: boolean;
	public accounting_obliged?: TYPE_ACCOUNTING_OBLIGED;
	public status_by_batch_taxpayer?: boolean;
	public deleted_taxpayer?: boolean;
	public signature_path_base: string;
	/** Constructor */
	constructor(
		id_user_: number = 0,
		id_taxpayer: number = 0,
		company: Company = _company,
		user: User = _user,
		setting_taxpayer: SettingTaxpayer = _settingTaxpayer,
		type_emission: TYPE_EMISSION = '1',
		business_name_taxpayer: string = '',
		tradename_taxpayer: string = '',
		ruc_taxpayer: string = '',
		dir_matriz_taxpayer: string = '',
		signature_password_taxpayer: string = '',
		signature_path_taxpayer: string = '',
		status_taxpayer: boolean = false,
		accounting_obliged: TYPE_ACCOUNTING_OBLIGED = 'NO',
		status_by_batch_taxpayer: boolean = false,
		deleted_taxpayer: boolean = false
	) {
		this.id_user_ = id_user_;
		this.id_taxpayer = id_taxpayer;
		this.company = company;
		this.user = user;
		this.setting_taxpayer = setting_taxpayer;
		this.type_emission = type_emission;
		this.business_name_taxpayer = business_name_taxpayer;
		this.tradename_taxpayer = tradename_taxpayer;
		this.ruc_taxpayer = ruc_taxpayer;
		this.dir_matriz_taxpayer = dir_matriz_taxpayer;
		this.signature_password_taxpayer = signature_password_taxpayer;
		this.signature_path_taxpayer = signature_path_taxpayer;
		this.status_taxpayer = status_taxpayer;
		this.accounting_obliged = accounting_obliged;
		this.status_by_batch_taxpayer = status_by_batch_taxpayer;
		this.deleted_taxpayer = deleted_taxpayer;
		this.signature_path_base = './file_store/signature';
	}
	/** Setters and Getters */
	set _id_user_(id_user_: number) {
		this.id_user_ = id_user_;
	}
	get _id_user_() {
		return this.id_user_!;
	}

	set _id_taxpayer(id_taxpayer: number) {
		this.id_taxpayer = id_taxpayer;
	}
	get _id_taxpayer() {
		return this.id_taxpayer;
	}

	set _company(company: Company) {
		this.company = company;
	}
	get _company() {
		return this.company;
	}

	set _user(user: User) {
		this.user = user;
	}
	get _user() {
		return this.user;
	}

	set _setting_taxpayer(setting_taxpayer: SettingTaxpayer) {
		this.setting_taxpayer = setting_taxpayer;
	}
	get _setting_taxpayer() {
		return this.setting_taxpayer;
	}

	set _type_emission(type_emission: TYPE_EMISSION) {
		this.type_emission = type_emission;
	}
	get _type_emission() {
		return this.type_emission!;
	}

	set _business_name_taxpayer(business_name_taxpayer: string) {
		this.business_name_taxpayer = business_name_taxpayer;
	}
	get _business_name_taxpayer() {
		return this.business_name_taxpayer!;
	}

	set _tradename_taxpayer(tradename_taxpayer: string) {
		this.tradename_taxpayer = tradename_taxpayer;
	}
	get _tradename_taxpayer() {
		return this.tradename_taxpayer!;
	}

	set _ruc_taxpayer(ruc_taxpayer: string) {
		this.ruc_taxpayer = ruc_taxpayer;
	}
	get _ruc_taxpayer() {
		return this.ruc_taxpayer!;
	}

	set _dir_matriz_taxpayer(dir_matriz_taxpayer: string) {
		this.dir_matriz_taxpayer = dir_matriz_taxpayer;
	}
	get _dir_matriz_taxpayer() {
		return this.dir_matriz_taxpayer!;
	}

	set _signature_password_taxpayer(signature_password_taxpayer: string) {
		this.signature_password_taxpayer = signature_password_taxpayer;
	}
	get _signature_password_taxpayer() {
		return this.signature_password_taxpayer!;
	}

	set _signature_path_taxpayer(signature_path_taxpayer: string) {
		this.signature_path_taxpayer = signature_path_taxpayer;
	}
	get _signature_path_taxpayer() {
		return this.signature_path_taxpayer!;
	}

	set _status_taxpayer(status_taxpayer: boolean) {
		this.status_taxpayer = status_taxpayer;
	}
	get _status_taxpayer() {
		return this.status_taxpayer!;
	}

	set _accounting_obliged(accounting_obliged: TYPE_ACCOUNTING_OBLIGED) {
		this.accounting_obliged = accounting_obliged;
	}
	get _accounting_obliged() {
		return this.accounting_obliged!;
	}

	set _status_by_batch_taxpayer(status_by_batch_taxpayer: boolean) {
		this.status_by_batch_taxpayer = status_by_batch_taxpayer;
	}
	get _status_by_batch_taxpayer() {
		return this.status_by_batch_taxpayer!;
	}

	set _deleted_taxpayer(deleted_taxpayer: boolean) {
		this.deleted_taxpayer = deleted_taxpayer;
	}
	get _deleted_taxpayer() {
		return this.deleted_taxpayer!;
	}

	/** Methods */
	create() {
		return new Promise<Taxpayer>(async (resolve, reject) => {
			await dml_taxpayer_create(this)
				.then((taxpayers: Taxpayer[]) => {
					/**
					 * Mutate response
					 */
					const _taxpayers = this.mutateResponse(taxpayers);

					resolve(_taxpayers[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	read() {
		return new Promise<Taxpayer[]>(async (resolve, reject) => {
			await view_taxpayer(this)
				.then((taxpayers: Taxpayer[]) => {
					/**
					 * Mutate response
					 */
					const _taxpayers = this.mutateResponse(taxpayers);

					resolve(_taxpayers);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	specificRead() {
		return new Promise<Taxpayer>(async (resolve, reject) => {
			await view_taxpayer_specific_read(this)
				.then((taxpayers: Taxpayer[]) => {
					/**
					 * Mutate response
					 */
					const _taxpayers = this.mutateResponse(taxpayers);

					resolve(_taxpayers[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	update() {
		return new Promise<Taxpayer>(async (resolve, reject) => {
			await dml_taxpayer_update(this)
				.then((taxpayers: Taxpayer[]) => {
					/**
					 * Mutate response
					 */
					const _taxpayers = this.mutateResponse(taxpayers);

					resolve(_taxpayers[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}
	/**
	 * changeStatusByBatchTaxpayer
	 * @param taxpayer
	 * @returns
	 */
	changeStatusByBatchTaxpayer(taxpayer: Taxpayer) {
		return new Promise<boolean>(async (resolve, reject) => {
			await dml_taxpayer_change_status_by_batch(taxpayer)
				.then((response: boolean) => {
					resolve(response);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	delete() {
		return new Promise<boolean>(async (resolve, reject) => {
			await dml_taxpayer_delete(this)
				.then((taxpayer: Taxpayer | any) => {
					const _user = new User();
					_user.deleteAvatar(_user.avatar_path_base, taxpayer.avatar_user);

					this.deleteSignature(
						this.signature_path_base,
						taxpayer.signature_path_taxpayer!
					);

					const _setting_taxpayer = new SettingTaxpayer();
					_setting_taxpayer.deleteLogo(
						_setting_taxpayer.logo_path_base,
						taxpayer.logo_path_setting_taxpayer
					);

					resolve(true);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	uploadSignature() {
		return new Promise<any>(async (resolve, reject) => {
			const initialPath = `./signature.p12`;
			if (fs.existsSync(initialPath)) {
				const ramdomNumber: number = generateRandomNumber(6);
				const newPathSignature = `signature-${this.id_taxpayer}-${ramdomNumber}.p12`;

				await dml_taxpayer_upload_signature(this, newPathSignature)
					.then((response: any) => {
						const pathBaseFileStore = `./file_store`;

						if (response.old_path != '') {
							this.deleteSignature(this.signature_path_base, response.old_path);
						}

						if (!fs.existsSync(pathBaseFileStore)) {
							fs.mkdir(pathBaseFileStore, (error) => {
								if (error) {
									reject(`Ocurrió un error al crear la carpeta file_store`);
								}
							});
						}

						if (!fs.existsSync(this.signature_path_base)) {
							fs.mkdir(this.signature_path_base, (error) => {
								if (error) {
									reject(`Ocurrió un error al crear la carpeta signature`);
								}
							});
						}

						fs.rename(
							`./signature.p12`,
							`${this.signature_path_base}/${newPathSignature}`,
							(err) => {
								if (err) {
									reject(err);
								} else {
									resolve(response);
								}
							}
						);
					})
					.catch((error: any) => {
						reject(error);
					});
			} else {
				reject(false);
			}
		});
	}

	removeSignature() {
		return new Promise<any>(async (resolve, reject) => {
			await dml_taxpayer_remove_signature(this)
				.then((response: any) => {
					this.deleteSignature(this.signature_path_base, response.current_path);
					resolve(response);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	deleteSignature = (signature_path_base: string, old_path: string) => {
		if (old_path) {
			const path = `${signature_path_base}/${old_path}`;
			if (fs.existsSync(path)) {
				fs.unlinkSync(path);
			}
		}
	};

	/**
	 * Eliminar ids de entidades externas y formatear la informacion en el esquema correspondiente
	 * @param taxpayers
	 * @returns
	 */
	private mutateResponse(taxpayers: Taxpayer[]): Taxpayer[] {
		let _taxpayers: Taxpayer[] = [];

		taxpayers.map((item: any) => {
			let _taxpayer: Taxpayer | any = {
				id_taxpayer: item.id_taxpayer,
				company: {
					id_company: item.id_company,
					setting: {
						id_setting: item.id_setting,
					},
					name_company: item.name_company,
					acronym_company: item.acronym_company,
					address_company: item.address_company,
					status_company: item.status_company,
				},
				user: {
					id_user: item.id_user,
					person: {
						id_person: item.id_person,
						academic: {
							id_academic: item.id_academic,
							title_academic: item.title_academic,
							abbreviation_academic: item.abbreviation_academic,
							nivel_academic: item.nivel_academic,
						},
						job: {
							id_job: item.id_job,
							name_job: item.name_job,
							address_job: item.address_job,
							phone_job: item.phone_job,
							position_job: item.position_job,
						},
						dni_person: item.dni_person,
						name_person: item.name_person,
						last_name_person: item.last_name_person,
						address_person: item.address_person,
						phone_person: item.phone_person,
					},
					type_user: {
						id_type_user: item.id_type_user,
						profile: {
							id_profile: item.id_profile,
						},
						name_type_user: item.name_type_user,
						description_type_user: item.description_type_user,
						status_type_user: item.status_type_user,
					},

					name_user: item.name_user,
					password_user: item.password_user,
					avatar_user: item.avatar_user,
					status_user: item.status_user,
				},
				setting_taxpayer: {
					id_setting_taxpayer: item.id_setting_taxpayer,
					mail_server: {
						id_mail_server: item.id_mail_server,
					},
					mailing_setting_taxpayer: item.mailing_setting_taxpayer,
					from_setting_taxpayer: item.from_setting_taxpayer,
					subject_setting_taxpayer: item.subject_setting_taxpayer,
					html_setting_taxpayer: item.html_setting_taxpayer,
					download_note_setting_taxpayer: item.download_note_setting_taxpayer,
					logo_path_setting_taxpayer: item.logo_path_setting_taxpayer,
				},
				...item,
				/**
				 * Generate structure of second level the entity (is important add the ids of entity)
				 * similar the return of read
				 */
			};
			/**
			 * delete ids of principal object level
			 */
			delete _taxpayer.id_company;
			delete _taxpayer.id_setting;
			delete _taxpayer.name_company;
			delete _taxpayer.acronym_company;
			delete _taxpayer.address_company;
			delete _taxpayer.status_company;

			delete _taxpayer.id_user;
			delete _taxpayer.id_person;
			delete _taxpayer.id_academic;
			delete _taxpayer.id_job;
			delete _taxpayer.dni_person;
			delete _taxpayer.name_person;
			delete _taxpayer.last_name_person;
			delete _taxpayer.address_person;
			delete _taxpayer.phone_person;
			delete _taxpayer.title_academic;
			delete _taxpayer.abbreviation_academic;
			delete _taxpayer.nivel_academic;
			delete _taxpayer.name_job;
			delete _taxpayer.address_job;
			delete _taxpayer.phone_job;
			delete _taxpayer.position_job;
			delete _taxpayer.id_type_user;
			delete _taxpayer.id_profile;
			delete _taxpayer.name_type_user;
			delete _taxpayer.description_type_user;
			delete _taxpayer.status_type_user;
			delete _taxpayer.name_user;
			delete _taxpayer.password_user;
			delete _taxpayer.avatar_user;
			delete _taxpayer.status_user;

			delete _taxpayer.id_setting_taxpayer;
			delete _taxpayer.id_mail_server;
			delete _taxpayer.mailing_setting_taxpayer;
			delete _taxpayer.from_setting_taxpayer;
			delete _taxpayer.subject_setting_taxpayer;
			delete _taxpayer.html_setting_taxpayer;
			delete _taxpayer.download_note_setting_taxpayer;
			delete _taxpayer.logo_path_setting_taxpayer;

			_taxpayers.push(_taxpayer);
		});

		return _taxpayers;
	}
}
