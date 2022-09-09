export interface DataLogin {
	ticket: string;
}

export enum Sities {
	WSFE = 'wsfe',
}

export enum Models {
	WSFE = 'wsfe',
}

export enum Types {
	Factura = 'Factura',
}

export enum Path {
	WSFE = 'cm:CE',
	name = 'CE',
	title = 'CE',
	description = 'Carpeta para los comprobantes electrónicos',
}

export class Voucher {
	public access_key_voucher: string;
	public type_voucher: string;
	public internal_status_voucher: string;
	public id_institution: string;
	public buyer_identifier_voucher: string;
	public totalConImpuestos: string;
	public emission_date_voucher: string;

	constructor(
		access_key_voucher: string = '',
		type_voucher: string = '',
		internal_status_voucher: string = '',
		id_institution: string = '',
		buyer_identifier_voucher: string = '',
		totalConImpuestos: string = '',
		emission_date_voucher: string = ''
	) {
		this.access_key_voucher = access_key_voucher;
		this.type_voucher = type_voucher;
		this.internal_status_voucher = internal_status_voucher;
		this.id_institution = id_institution;
		this.buyer_identifier_voucher = buyer_identifier_voucher;
		this.totalConImpuestos = totalConImpuestos;
		this.emission_date_voucher = emission_date_voucher;
	}
	/** Setters and Getters */
	set _access_key_voucher(access_key_voucher: string) {
		this.access_key_voucher = access_key_voucher;
	}
	get _access_key_voucher() {
		return this.access_key_voucher;
	}

	set _type_voucher(type_voucher: string) {
		this.type_voucher = type_voucher;
	}
	get _type_voucher() {
		return this.type_voucher;
	}

	set _internal_status_voucher(internal_status_voucher: string) {
		this.internal_status_voucher = internal_status_voucher;
	}
	get _internal_status_voucher() {
		return this.internal_status_voucher;
	}

	set _emission_date_voucher(emission_date_voucher: string) {
		this.emission_date_voucher = emission_date_voucher;
	}
	get _emission_date_voucher() {
		return this.emission_date_voucher;
	}

	set _id_institution(id_institution: string) {
		this.id_institution = id_institution;
	}
	get _id_institution() {
		return this.id_institution;
	}

	set _buyer_identifier_voucher(buyer_identifier_voucher: string) {
		this.buyer_identifier_voucher = buyer_identifier_voucher;
	}
	get _buyer_identifier_voucher() {
		return this.buyer_identifier_voucher;
	}

	set _totalConImpuestos(totalConImpuestos: string) {
		this.totalConImpuestos = totalConImpuestos;
	}
	get _totalConImpuestos() {
		return this.totalConImpuestos;
	}
}

export interface Documento {
	nombre: string;
	accesoDescarga: string;
	tipo: string;
	referencia: string;
	xPathLocationPadre: string;
	xPathLocation: string;
	propiedades: Propiedades;
}

interface Propiedades {
	'cm:title': string;
	'cm:creator': Autor;
	'cm:modifier': Autor;
	'cm:created': DateRegister;
	'cm:name': string;
	'sys:store-protocol': string;
	'sys:node-dbid': string;
	'sys:store-identifier': string;
	'sys:locale': string;
	'cm:modified': DateRegister;
	'cm:description': string;
	'sys:node-uuid': string;
}

interface Autor {
	firstName: string;
	lastName: string;
	displayName: string;
	userName: string;
}

interface DateRegister {
	iso8601: string;
	value: string;
}
