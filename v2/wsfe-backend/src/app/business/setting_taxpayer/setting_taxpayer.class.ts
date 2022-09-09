import fs from 'fs';
import { generateRandomNumber } from '../../../utils/global';
import { MailServer } from '../mail_server/mail_server.class';
import { _mailServer } from '../mail_server/mail_server.data';
import { Taxpayer } from '../taxpayer/taxpayer.class';
import { _taxpayer } from '../taxpayer/taxpayer.data';
import {
	dml_setting_taxpayer_remove_logo,
	dml_setting_taxpayer_update,
	dml_setting_taxpayer_upload_logo,
	view_setting_taxpayer,
	view_setting_taxpayer_specific_read,
} from './setting_taxpayer.store';

export class SettingTaxpayer {
	/** Attributes */
	public id_user_?: number;
	public id_setting_taxpayer: number;
	public taxpayer: Taxpayer;
	public mail_server: MailServer;
	public mailing_setting_taxpayer?: boolean;
	public from_setting_taxpayer?: string;
	public subject_setting_taxpayer?: string;
	public html_setting_taxpayer?: string;
	public download_note_setting_taxpayer?: string;
	public logo_path_setting_taxpayer?: string;
	public logo_path_base: string;

	/** Constructor */
	constructor(
		id_user_: number = 0,
		id_setting_taxpayer: number = 0,
		taxpayer: Taxpayer = _taxpayer,
		mail_server: MailServer = _mailServer,
		mailing_setting_taxpayer: boolean = false,
		from_setting_taxpayer: string = '',
		subject_setting_taxpayer: string = '',
		html_setting_taxpayer: string = '',
		download_note_setting_taxpayer: string = '',
		logo_path_setting_taxpayer: string = ''
	) {
		this.id_user_ = id_user_;
		this.id_setting_taxpayer = id_setting_taxpayer;
		this.taxpayer = taxpayer;
		this.mail_server = mail_server;
		this.mailing_setting_taxpayer = mailing_setting_taxpayer;
		this.from_setting_taxpayer = from_setting_taxpayer;
		this.subject_setting_taxpayer = subject_setting_taxpayer;
		this.html_setting_taxpayer = html_setting_taxpayer;
		this.download_note_setting_taxpayer = download_note_setting_taxpayer;
		this.logo_path_setting_taxpayer = logo_path_setting_taxpayer;
		this.logo_path_base = './file_store/logo';
	}
	/** Setters and Getters */
	set _id_user_(id_user_: number) {
		this.id_user_ = id_user_;
	}
	get _id_user_() {
		return this.id_user_!;
	}

	set _id_setting_taxpayer(id_setting_taxpayer: number) {
		this.id_setting_taxpayer = id_setting_taxpayer;
	}
	get _id_setting_taxpayer() {
		return this.id_setting_taxpayer;
	}

	set _taxpayer(taxpayer: Taxpayer) {
		this.taxpayer = taxpayer;
	}
	get _taxpayer() {
		return this.taxpayer;
	}

	set _mail_server(mail_server: MailServer) {
		this.mail_server = mail_server;
	}
	get _mail_server() {
		return this.mail_server;
	}

	set _mailing_setting_taxpayer(mailing_setting_taxpayer: boolean) {
		this.mailing_setting_taxpayer = mailing_setting_taxpayer;
	}
	get _mailing_setting_taxpayer() {
		return this.mailing_setting_taxpayer!;
	}

	set _from_setting_taxpayer(from_setting_taxpayer: string) {
		this.from_setting_taxpayer = from_setting_taxpayer;
	}
	get _from_setting_taxpayer() {
		return this.from_setting_taxpayer!;
	}

	set _subject_setting_taxpayer(subject_setting_taxpayer: string) {
		this.subject_setting_taxpayer = subject_setting_taxpayer;
	}
	get _subject_setting_taxpayer() {
		return this.subject_setting_taxpayer!;
	}

	set _html_setting_taxpayer(html_setting_taxpayer: string) {
		this.html_setting_taxpayer = html_setting_taxpayer;
	}
	get _html_setting_taxpayer() {
		return this.html_setting_taxpayer!;
	}

	set _download_note_setting_taxpayer(download_note_setting_taxpayer: string) {
		this.download_note_setting_taxpayer = download_note_setting_taxpayer;
	}
	get _download_note_setting_taxpayer() {
		return this.download_note_setting_taxpayer!;
	}

	set _logo_path_setting_taxpayer(logo_path_setting_taxpayer: string) {
		this.logo_path_setting_taxpayer = logo_path_setting_taxpayer;
	}
	get _logo_path_setting_taxpayer() {
		return this.logo_path_setting_taxpayer!;
	}

	/** Methods */

	read() {
		return new Promise<SettingTaxpayer[]>(async (resolve, reject) => {
			await view_setting_taxpayer(this)
				.then((settingTaxpayers: SettingTaxpayer[]) => {
					/**
					 * Mutate response
					 */
					const _settingTaxpayers = this.mutateResponse(settingTaxpayers);

					resolve(_settingTaxpayers);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	specificRead() {
		return new Promise<SettingTaxpayer>(async (resolve, reject) => {
			await view_setting_taxpayer_specific_read(this)
				.then((settingTaxpayers: SettingTaxpayer[]) => {
					/**
					 * Mutate response
					 */
					const _settingTaxpayers = this.mutateResponse(settingTaxpayers);

					resolve(_settingTaxpayers[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	update() {
		return new Promise<SettingTaxpayer>(async (resolve, reject) => {
			await dml_setting_taxpayer_update(this)
				.then((settingTaxpayers: SettingTaxpayer[]) => {
					/**
					 * Mutate response
					 */
					const _settingTaxpayers = this.mutateResponse(settingTaxpayers);

					resolve(_settingTaxpayers[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	uploadLogo() {
		return new Promise<any>(async (resolve, reject) => {
			const initialPath = `./logo.png`;
			if (fs.existsSync(initialPath)) {
				const ramdomNumber: number = generateRandomNumber(6);
				const newPathLogo = `logo-${this.id_setting_taxpayer}-${ramdomNumber}.png`;

				await dml_setting_taxpayer_upload_logo(this, newPathLogo)
					.then((response: any) => {
						const pathBaseFileStore = `./file_store`;

						if (response.old_path != '') {
							this.deleteLogo(this.logo_path_base, response.old_path);
						}

						if (!fs.existsSync(pathBaseFileStore)) {
							fs.mkdir(pathBaseFileStore, (error) => {
								if (error) {
									reject(`Ocurrió un error al crear la carpeta file_store`);
								}
							});
						}

						if (!fs.existsSync(this.logo_path_base)) {
							fs.mkdir(this.logo_path_base, (error) => {
								if (error) {
									reject(`Ocurrió un error al crear la carpeta logo`);
								}
							});
						}

						fs.rename(
							`./logo.png`,
							`${this.logo_path_base}/${newPathLogo}`,
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

	removeLogo() {
		return new Promise<any>(async (resolve, reject) => {
			await dml_setting_taxpayer_remove_logo(this)
				.then((response: any) => {
					this.deleteLogo(this.logo_path_base, response.current_path);
					resolve(response);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	deleteLogo = (logo_path_base: string, old_path: string) => {
		if (old_path && old_path != 'default.png') {
			const path = `${logo_path_base}/${old_path}`;
			if (fs.existsSync(path)) {
				fs.unlinkSync(path);
			}
		}
	};

	/**
	 * Eliminar ids de entidades externas y formatear la informacion en el esquema correspondiente
	 * @param settingTaxpayers
	 * @returns
	 */
	private mutateResponse(
		settingTaxpayers: SettingTaxpayer[]
	): SettingTaxpayer[] {
		let _settingTaxpayers: SettingTaxpayer[] = [];

		settingTaxpayers.map((item: any) => {
			let _settingTaxpayer: SettingTaxpayer | any = {
				...item,
				mail_server: {
					id_mail_server: item.id_mail_server,
					type_mail_server: item.type_mail_server,
					host_mail_server: item.host_mail_server,
					port_mail_server: item.port_mail_server,
					secure_mail_server: item.secure_mail_server,
					user_mail_server: item.user_mail_server,
					password_mail_server: item.password_mail_server,
				},
				/**
				 * Generate structure of second level the entity (is important add the ids of entity)
				 * similar the return of read
				 */
			};
			/**
			 * delete ids of principal object level
			 */
			delete _settingTaxpayer.id_mail_server;
			delete _settingTaxpayer.type_mail_server;
			delete _settingTaxpayer.host_mail_server;
			delete _settingTaxpayer.port_mail_server;
			delete _settingTaxpayer.secure_mail_server;
			delete _settingTaxpayer.user_mail_server;
			delete _settingTaxpayer.password_mail_server;

			_settingTaxpayers.push(_settingTaxpayer);
		});

		return _settingTaxpayers;
	}
}
