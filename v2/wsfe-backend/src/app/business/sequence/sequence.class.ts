import { BodyVoucher, TYPE_ENVIRONMENT, TYPE_VOUCHER } from '../business.types';
import { EmissionPoint } from '../emission_point/emission_point.class';
import { _emissionPoint } from '../emission_point/emission_point.data';
import { Establishment } from '../establishment/establishment.class';
import { _establishment } from '../establishment/establishment.data';
import { Institution } from '../institution/institution.class';
import { _institution } from '../institution/institution.data';
import {
	dml_sequence_create,
	dml_sequence_delete,
	dml_sequence_update,
	view_sequence,
	view_sequence_by_institution_read,
	view_sequence_specific_read,
} from './sequence.store';

export class Sequence {
	/** Attributes */
	public id_user_?: number;
	public id_sequence: number;
	public institution: Institution;
	public establishment: Establishment;
	public emission_point: EmissionPoint;
	public type_environment?: TYPE_ENVIRONMENT;
	public type_voucher?: TYPE_VOUCHER;
	public number_code_sequence?: string;
	public status_sequence?: boolean;
	public deleted_sequence?: boolean;
	/**
	 * Extras Attributes
	 */
	public sequence?: number;
	public id_voucher?: number;
	public number_voucher?: string;
	public access_key_voucher?: string;
	public emission_date_voucher?: string;
	public body_voucher?: BodyVoucher;
	/** Constructor */
	constructor(
		id_user_: number = 0,
		id_sequence: number = 0,
		institution: Institution = _institution,
		establishment: Establishment = _establishment,
		emission_point: EmissionPoint = _emissionPoint,
		type_environment: TYPE_ENVIRONMENT = '1',
		type_voucher: TYPE_VOUCHER = '01',
		number_code_sequence: string = '',
		status_sequence: boolean = false,
		deleted_sequence: boolean = false
	) {
		this.id_user_ = id_user_;
		this.id_sequence = id_sequence;
		this.institution = institution;
		this.establishment = establishment;
		this.emission_point = emission_point;
		this.type_environment = type_environment;
		this.type_voucher = type_voucher;
		this.number_code_sequence = number_code_sequence;
		this.status_sequence = status_sequence;
		this.deleted_sequence = deleted_sequence;
	}
	/** Setters and Getters */
	set _id_user_(id_user_: number) {
		this.id_user_ = id_user_;
	}
	get _id_user_() {
		return this.id_user_!;
	}

	set _id_sequence(id_sequence: number) {
		this.id_sequence = id_sequence;
	}
	get _id_sequence() {
		return this.id_sequence;
	}

	set _institution(institution: Institution) {
		this.institution = institution;
	}
	get _institution() {
		return this.institution;
	}

	set _establishment(establishment: Establishment) {
		this.establishment = establishment;
	}
	get _establishment() {
		return this.establishment;
	}

	set _emission_point(emission_point: EmissionPoint) {
		this.emission_point = emission_point;
	}
	get _emission_point() {
		return this.emission_point;
	}

	set _type_environment(type_environment: TYPE_ENVIRONMENT) {
		this.type_environment = type_environment;
	}
	get _type_environment() {
		return this.type_environment!;
	}

	set _type_voucher(type_voucher: TYPE_VOUCHER) {
		this.type_voucher = type_voucher;
	}
	get _type_voucher() {
		return this.type_voucher!;
	}

	set _number_code_sequence(number_code_sequence: string) {
		this.number_code_sequence = number_code_sequence;
	}
	get _number_code_sequence() {
		return this.number_code_sequence!;
	}

	set _status_sequence(status_sequence: boolean) {
		this.status_sequence = status_sequence;
	}
	get _status_sequence() {
		return this.status_sequence!;
	}

	set _deleted_secuencial(deleted_sequence: boolean) {
		this.deleted_sequence = deleted_sequence;
	}
	get _deleted_secuencial() {
		return this.deleted_sequence!;
	}

	/** Methods */
	create() {
		return new Promise<Sequence>(async (resolve, reject) => {
			await dml_sequence_create(this)
				.then((sequences: Sequence[]) => {
					/**
					 * Mutate response
					 */
					const _sequences = this.mutateResponse(sequences);

					resolve(_sequences[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	read() {
		return new Promise<Sequence[]>(async (resolve, reject) => {
			await view_sequence(this)
				.then((sequences: Sequence[]) => {
					/**
					 * Mutate response
					 */
					const _sequences = this.mutateResponse(sequences);

					resolve(_sequences);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	byInstitutionRead() {
		return new Promise<Sequence[]>(async (resolve, reject) => {
			await view_sequence_by_institution_read(this)
				.then((sequences: Sequence[]) => {
					/**
					 * Mutate response
					 */
					const _sequences = this.mutateResponse(sequences);

					resolve(_sequences);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	specificRead() {
		return new Promise<Sequence>(async (resolve, reject) => {
			await view_sequence_specific_read(this)
				.then((sequences: Sequence[]) => {
					/**
					 * Mutate response
					 */
					const _sequences = this.mutateResponse(sequences);

					resolve(_sequences[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	update() {
		return new Promise<Sequence>(async (resolve, reject) => {
			await dml_sequence_update(this)
				.then((sequences: Sequence[]) => {
					/**
					 * Mutate response
					 */
					const _sequences = this.mutateResponse(sequences);

					resolve(_sequences[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	delete() {
		return new Promise<boolean>(async (resolve, reject) => {
			await dml_sequence_delete(this)
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
	 * @param sequences
	 * @returns
	 */
	public mutateResponse(sequences: Sequence[]): Sequence[] {
		let _sequences: Sequence[] = [];

		sequences.map((item: any) => {
			let _sequence: Sequence | any = {
				...item,
				type_environment: item.bvs_type_environment,
				type_voucher: item.bvs_type_voucher,
				institution: {
					id_institution: item.id_institution,
					taxpayer: {
						id_taxpayer: item.id_taxpayer,
						user: {
							id_user: item.id_user,
							company: {
								id_company: item.id_company,
								setting: {
									save_alfresco: item.save_alfresco,
									wait_autorization: item.wait_autorization,
									batch_shipping: item.batch_shipping,
									max_generation_pdf: item.max_generation_pdf,
									wait_generation_pdf: item.wait_generation_pdf,
									expiration_token: item.expiration_token,
									inactivity_time: item.inactivity_time,
								},
							},
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
							download_note_setting_taxpayer:
								item.download_note_setting_taxpayer,
							logo_path_setting_taxpayer: item.logo_path_setting_taxpayer,
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
					type_environment: item.bvi_type_environment,
					name_institution: item.name_institution,
					description_institution: item.description_institution,
					address_institution: item.address_institution,
					status_institution: item.status_institution,
				},
				establishment: {
					id_establishment: item.id_establishment,
					value_establishment: item.value_establishment,
					description_establishment: item.description_establishment,
				},
				emission_point: {
					id_emission_point: item.id_emission_point,
					value_emission_point: item.value_emission_point,
					description_emission_point: item.description_emission_point,
				},
				/**
				 * Generate structure of second level the entity (is important add the ids of entity)
				 * similar the return of read
				 */
			};
			/**
			 * delete ids of principal object level
			 */
			delete _sequence.bvs_type_environment;
			delete _sequence.bvs_type_voucher;
			delete _sequence.id_institution;
			delete _sequence.id_taxpayer;
			delete _sequence.bvi_type_environment;
			delete _sequence.name_institution;
			delete _sequence.description_institution;
			delete _sequence.address_institution;
			delete _sequence.status_institution;
			delete _sequence.id_establishment;
			delete _sequence.value_establishment;
			delete _sequence.description_establishment;
			delete _sequence.id_emission_point;
			delete _sequence.value_emission_point;
			delete _sequence.description_emission_point;

			delete _sequence.id_company;
			delete _sequence.save_alfresco;
			delete _sequence.wait_autorization;

			delete _sequence.id_user;
			delete _sequence.id_setting_taxpayer;
			delete _sequence.id_mail_server;
			delete _sequence.mailing_setting_taxpayer;
			delete _sequence.from_setting_taxpayer;
			delete _sequence.subject_setting_taxpayer;
			delete _sequence.html_setting_taxpayer;
			delete _sequence.download_note_setting_taxpayer;
			delete _sequence.logo_path_setting_taxpayer;
			delete _sequence.type_emission;
			delete _sequence.business_name_taxpayer;
			delete _sequence.tradename_taxpayer;
			delete _sequence.ruc_taxpayer;
			delete _sequence.dir_matriz_taxpayer;
			delete _sequence.signature_password_taxpayer;
			delete _sequence.signature_path_taxpayer;
			delete _sequence.status_taxpayer;
			delete _sequence.accounting_obliged;

			_sequences.push(_sequence);
		});

		return _sequences;
	}
}
