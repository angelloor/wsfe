import { Taxpayer } from '../taxpayer/taxpayer.class';
import { _taxpayer } from '../taxpayer/taxpayer.data';
import {
	dml_emission_point_create,
	dml_emission_point_delete,
	dml_emission_point_update,
	view_emission_point,
	view_emission_point_by_taxpayer_read,
	view_emission_point_specific_read,
} from './emission_point.store';

export class EmissionPoint {
	/** Attributes */
	public id_user_?: number;
	public id_emission_point: number;
	public taxpayer: Taxpayer;
	public value_emission_point?: string;
	public description_emission_point?: string;
	public deleted_emission_point?: boolean;
	/** Constructor */
	constructor(
		id_user_: number = 0,
		id_emission_point: number = 0,
		taxpayer: Taxpayer = _taxpayer,
		value_emission_point: string = '',
		description_emission_point: string = '',
		deleted_emission_point: boolean = false
	) {
		this.id_user_ = id_user_;
		this.id_emission_point = id_emission_point;
		this.taxpayer = taxpayer;
		this.value_emission_point = value_emission_point;
		this.description_emission_point = description_emission_point;
		this.deleted_emission_point = deleted_emission_point;
	}
	/** Setters and Getters */
	set _id_user_(id_user_: number) {
		this.id_user_ = id_user_;
	}
	get _id_user_() {
		return this.id_user_!;
	}

	set _id_emission_point(id_emission_point: number) {
		this.id_emission_point = id_emission_point;
	}
	get _id_emission_point() {
		return this.id_emission_point;
	}

	set _taxpayer(taxpayer: Taxpayer) {
		this.taxpayer = taxpayer;
	}
	get _taxpayer() {
		return this.taxpayer;
	}

	set _value_emission_point(value_emission_point: string) {
		this.value_emission_point = value_emission_point;
	}
	get _value_emission_point() {
		return this.value_emission_point!;
	}

	set _description_emission_point(description_emission_point: string) {
		this.description_emission_point = description_emission_point;
	}
	get _description_emission_point() {
		return this.description_emission_point!;
	}

	set _deleted_emission_point(deleted_emission_point: boolean) {
		this.deleted_emission_point = deleted_emission_point;
	}
	get _deleted_emission_point() {
		return this.deleted_emission_point!;
	}

	/** Methods */
	create() {
		return new Promise<EmissionPoint>(async (resolve, reject) => {
			await dml_emission_point_create(this)
				.then((emissionPoints: EmissionPoint[]) => {
					/**
					 * Mutate response
					 */
					const _emissionPoints = this.mutateResponse(emissionPoints);

					resolve(_emissionPoints[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	read() {
		return new Promise<EmissionPoint[]>(async (resolve, reject) => {
			await view_emission_point(this)
				.then((emissionPoints: EmissionPoint[]) => {
					/**
					 * Mutate response
					 */
					const _emissionPoints = this.mutateResponse(emissionPoints);

					resolve(_emissionPoints);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	byTaxpayerRead() {
		return new Promise<EmissionPoint[]>(async (resolve, reject) => {
			await view_emission_point_by_taxpayer_read(this)
				.then((emissionPoints: EmissionPoint[]) => {
					/**
					 * Mutate response
					 */
					const _emissionPoints = this.mutateResponse(emissionPoints);

					resolve(_emissionPoints);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	specificRead() {
		return new Promise<EmissionPoint>(async (resolve, reject) => {
			await view_emission_point_specific_read(this)
				.then((emissionPoints: EmissionPoint[]) => {
					/**
					 * Mutate response
					 */
					const _emissionPoints = this.mutateResponse(emissionPoints);

					resolve(_emissionPoints[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	update() {
		return new Promise<EmissionPoint>(async (resolve, reject) => {
			await dml_emission_point_update(this)
				.then((emissionPoints: EmissionPoint[]) => {
					/**
					 * Mutate response
					 */
					const _emissionPoints = this.mutateResponse(emissionPoints);

					resolve(_emissionPoints[0]);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	}

	delete() {
		return new Promise<boolean>(async (resolve, reject) => {
			await dml_emission_point_delete(this)
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
	 * @param emissionPoints
	 * @returns
	 */
	private mutateResponse(emissionPoints: EmissionPoint[]): EmissionPoint[] {
		let _emissionPoints: EmissionPoint[] = [];

		emissionPoints.map((item: any) => {
			let _emissionPoint: EmissionPoint | any = {
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
			delete _emissionPoint.id_taxpayer;
			delete _emissionPoint.id_company;
			delete _emissionPoint.id_user;
			delete _emissionPoint.type_emission;
			delete _emissionPoint.business_name_taxpayer;
			delete _emissionPoint.tradename_taxpayer;
			delete _emissionPoint.ruc_taxpayer;
			delete _emissionPoint.dir_matriz_taxpayer;
			delete _emissionPoint.signature_password_taxpayer;
			delete _emissionPoint.signature_path_taxpayer;
			delete _emissionPoint.status_taxpayer;
			delete _emissionPoint.accounting_obliged;

			_emissionPoints.push(_emissionPoint);
		});

		return _emissionPoints;
	}
}
