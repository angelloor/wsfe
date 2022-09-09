import { MessageAPI } from '../../utils/message/message.type';

/**
 * OCSP_CERTIFICATION_ENTITIES
 */
export enum OCSP_CERTIFICATION_ENTITIES {
	consejoJudicatura = 'CN=ENTIDAD DE CERTIFICACION ICERT-EC,OU=SUBDIRECCION NACIONAL DE SEGURIDAD DE LA INFORMACION DNTICS,O=CONSEJO DE LA JUDICATURA,L=DM QUITO,C=EC',
	bancoCentral = 'CN=AC BANCO CENTRAL DEL ECUADOR,L=QUITO,OU=ENTIDAD DE CERTIFICACION DE INFORMACION-ECIBCE,O=BANCO CENTRAL DEL ECUADOR,C=EC',
	secutiryData = 'CN=AUTORIDAD DE CERTIFICACION SUBCA-1 SECURITY DATA,OU=ENTIDAD DE CERTIFICACION DE INFORMACION,O=SECURITY DATA S.A. 1,C=EC',
	anf = 'CN=ANF High Assurance Ecuador Intermediate CA,OU=ANF Autoridad intermedia  EC,O=ANFAC AUTORIDAD DE CERTIFICACION ECUADOR C.A.,C=EC,serialNumber=1792601215001',
}
/**
 * TYPE_MAIL_SERVER
 */
export type TYPE_MAIL_SERVER = 'office365' | 'gmail';

export interface TYPE_MAIL_SERVER_ENUM {
	name_type: string;
	value_type: TYPE_MAIL_SERVER;
}

export const _typeMailServer: TYPE_MAIL_SERVER_ENUM[] = [
	{
		name_type: 'Microsoft (Office365)',
		value_type: 'office365',
	},
	{
		name_type: 'Google (gmail)',
		value_type: 'gmail',
	},
];
/**
 * TYPE_EMISSION (TABLA 2)
 */
export type TYPE_EMISSION = '1';

export interface TYPE_EMISSION_ENUM {
	name_type: string;
	value_type: TYPE_EMISSION;
}

export const _typeEmission: TYPE_EMISSION_ENUM[] = [
	{
		name_type: 'Normal',
		value_type: '1',
	},
];
/**
 * TYPE_VOUCHER (TABLA 3)
 */
export type TYPE_VOUCHER = '01' | '03' | '04' | '05' | '06' | '07';

export interface TYPE_VOUCHER_ENUM {
	name_type: string;
	value_type: TYPE_VOUCHER;
	enabled: boolean;
}

export const _typeVoucher: TYPE_VOUCHER_ENUM[] = [
	{
		name_type: 'FACTURA',
		value_type: '01',
		enabled: true,
	},
	{
		name_type: 'LIQUIDACIÓN DE COMPRA DE BIENES Y PRESTACIÓN DE SERVICIOS',
		value_type: '03',
		enabled: false,
	},
	{
		name_type: 'NOTA DE CRÉDITO',
		value_type: '04',
		enabled: false,
	},
	{
		name_type: 'NOTA DE DÉBITO',
		value_type: '05',
		enabled: false,
	},
	{
		name_type: 'GUÍA DE REMISIÓN',
		value_type: '06',
		enabled: false,
	},
	{
		name_type: 'COMPROBANTE DE RETENCIÓN',
		value_type: '07',
		enabled: false,
	},
];
/**
 * TYPE_VOUCHER_STATUS (TABLA 3)
 */
export type TYPE_VOUCHER_STATUS =
	| 'pending'
	| 'authorized'
	| 'canceled'
	| 'removed';

export interface TYPE_VOUCHER_STATUS_ENUM {
	name_type: string;
	value_type: TYPE_VOUCHER_STATUS;
}

export const _typeVoucherStatus: TYPE_VOUCHER_STATUS_ENUM[] = [
	{
		name_type: 'Pendiente',
		value_type: 'pending',
	},
	{
		name_type: 'Autorizado',
		value_type: 'authorized',
	},
	{
		name_type: 'Anulado',
		value_type: 'canceled',
	},
	{
		name_type: 'Eliminado',
		value_type: 'removed',
	},
];
/**
 * TYPE_ENVIRONMENT (TABLA 4)
 */
export type TYPE_ENVIRONMENT = '1' | '2';

export interface TYPE_ENVIRONMENT_ENUM {
	name_type: string;
	value_type: TYPE_ENVIRONMENT;
}

export const _typeEnvironment: TYPE_ENVIRONMENT_ENUM[] = [
	{
		name_type: 'Pruebas',
		value_type: '1',
	},
	{
		name_type: 'Producción',
		value_type: '2',
	},
];
/**
 * TYPE_ACCOUNTING_OBLIGED
 */
export type TYPE_ACCOUNTING_OBLIGED = 'SI' | 'NO';

export interface TYPE_ACCOUNTING_OBLIGED_ENUM {
	name_type: string;
	value_type: TYPE_ACCOUNTING_OBLIGED;
}

export const _typeAccountingObliged: TYPE_ACCOUNTING_OBLIGED_ENUM[] = [
	{
		name_type: 'Obligado a llevar contabilidad',
		value_type: 'SI',
	},
	{
		name_type: 'No obligado a llevar contabilidad',
		value_type: 'NO',
	},
];
/**
 * TYPE_SERVICE
 */
export type TYPE_SERVICE =
	| 'RecepcionComprobantesOffline'
	| 'AutorizacionComprobantesOffline';

export interface SERVICE {
	environment: TYPE_ENVIRONMENT;
	type_service: TYPE_SERVICE;
	url: string;
}

export enum TYPE_SERVICE_ENUM {
	RecepcionComprobantesOffline = 'RecepcionComprobantesOffline',
	AutorizacionComprobantesOffline = 'AutorizacionComprobantesOffline',
}

export const _typeServices: SERVICE[] = [
	{
		environment: '1',
		type_service: 'RecepcionComprobantesOffline',
		url: 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
	},
	{
		environment: '1',
		type_service: 'AutorizacionComprobantesOffline',
		url: 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
	},
	{
		environment: '2',
		type_service: 'RecepcionComprobantesOffline',
		url: 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
	},
	{
		environment: '2',
		type_service: 'AutorizacionComprobantesOffline',
		url: 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
	},
];
/**
 * ---------------------------------------------------------------------------------------------
 * ------------------------------------------ VOUCHER ------------------------------------------
 * ---------------------------------------------------------------------------------------------
 */
export interface BodyVoucher {
	/**
	 * <infoTributaria>
	 */
	ambiente: TYPE_ENVIRONMENT;
	tipoEmision: TYPE_EMISSION;
	razonSocial: string; // max length 300
	nombreComercial?: string; // max length 300
	ruc: string; // max length 13
	claveAcceso: string; // max length 49
	codDoc: TYPE_VOUCHER;
	estab: string; // max length 3
	ptoEmi: string; // max length 3
	secuencial: string; // max length 9
	dirMatriz: string; // max length 300
	/**
	 * </infoTributaria>
	 */
	/**
	 * <infoFactura>
	 */
	fechaEmision: string; // dd/mm/aaaa
	dirEstablecimiento?: string; // max length 300
	contribuyenteEspecial?: string; // min length 3 max length 5
	obligadoContabilidad?: TYPE_ACCOUNTING_OBLIGED;
	tipoIdentificacionComprador: TABLA_6;
	guiaRemision?: string; // max length 17
	razonSocialComprador: string; // max length 300
	identificacionComprador: string; // max length 20
	direccionComprador?: string; // max length 300
	totalSinImpuestos: number; // max length 14
	totalDescuento: number; // max length 14
	totalConImpuestos: totalImpuesto[];
	propina: number; // max length 14
	importeTotal: number; // max length 14
	moneda?: string; // max length 15
	pagos: pago[];
	valorRetIva?: number; // max length 14
	valorRetRenta?: number; // max length 14
	/**
	 * </infoFactura>>
	 */
	/**
	 * <detalles>
	 */
	detalles: detalle[];
	/**
	 * </detalles>
	 */
	/**
	 * </retenciones>
	 */
	/**
	 * </retenciones>
	 */
	/**
	 * <infoAdicional>
	 */
	infoAdicional?: campoAdicional[];
	/**
	 * </infoAdicional>
	 */
	valoresExtras?: ValoresExtras;
}

export const _bodyVoucher: BodyVoucher = {
	ambiente: '1',
	tipoEmision: '1',
	razonSocial: '',
	nombreComercial: '',
	ruc: '',
	claveAcceso: '',
	codDoc: '01',
	estab: '',
	ptoEmi: '',
	secuencial: '',
	dirMatriz: '',
	fechaEmision: '',
	dirEstablecimiento: '',
	contribuyenteEspecial: '',
	obligadoContabilidad: 'NO',
	tipoIdentificacionComprador: '04',
	guiaRemision: '',
	razonSocialComprador: '',
	identificacionComprador: '',
	direccionComprador: '',
	totalSinImpuestos: 0,
	totalDescuento: 0,
	totalConImpuestos: [],
	propina: 0,
	importeTotal: 0,
	moneda: '',
	pagos: [],
	valorRetIva: 0,
	valorRetRenta: 0,
	detalles: [],
	infoAdicional: [],
	valoresExtras: {
		tasaProcesamiento: 0,
		interes: 0,
		otros: 0,
	},
};
/**
 * totalImpuesto
 */
export interface totalImpuesto {
	codigo: TABLA_16;
	codigoPorcentaje: TABLA_17 | TABLA_18;
	descuentoAdicional?: number; // max length 14
	baseImponible: number; // max length 14
	valor: number; // max length 14
	enabled?: boolean; // Exclusive for the RIDE (Variable para usar en la generación del RIDE para habilitar los impuestos que si vengan en el body)
}
/**
 * pago
 */
export interface pago {
	formaPago: TABLA_24;
	total: number; // max length 14
	plazo?: number; // max length 14
	unidadTiempo?: string; // max length 10
}
/**
 * detalle
 */
export interface detalle {
	codigoPrincipal: string; // max length 25
	codigoAuxiliar?: string; // max length 25
	descripcion: string; // max length 300
	cantidad: number; // max length 14, hasta 6 decimales
	precioUnitario: number; // max length 14, hasta 6 decimales
	descuento: number; // max length 14
	precioTotalSinImpuesto: number; // max length 14
	detallesAdicionales?: detAdicional[];
	impuestos: impuesto[];
}
/**
 * detAdicional
 */
export interface detAdicional {
	[key: string]: string; // max length 300
}
/**
 * impuesto
 */
export interface impuesto {
	codigo: TABLA_16;
	codigoPorcentaje: TABLA_17 | TABLA_18;
	tarifa: number;
	baseImponible: number; // max length 14
	valor: number; // max length 14
}
/**
 * campoAdicional
 */
export interface campoAdicional {
	[key: string]: string; // max length 300
}
/**
 * TABLA_6
 * Tipo de identificación
 */
export type TABLA_6 = '04' | '05' | '06' | '07' | '08';

export interface TABLA_6_ENUM {
	name_type: string;
	value_type: TABLA_6;
}

export const _tabla6: TABLA_6_ENUM[] = [
	{
		name_type: 'RUC',
		value_type: '04',
	},
	{
		name_type: 'CEDULA',
		value_type: '05',
	},
	{
		name_type: 'PASAPORTE',
		value_type: '06',
	},
	{
		name_type: 'VENTA A CONSUMIDOR FINAL*',
		value_type: '07',
	},
	{
		name_type: 'IDENTIFICACION DEL EXTERIOR*',
		value_type: '08',
	},
];
/**
 * TABLA_16
 * Códigos de los impuestos
 */
export type TABLA_16 = 2 | 3 | 5;

export interface TABLA_16_ENUM {
	name_type: string;
	value_type: TABLA_16;
}

export const _tabla16: TABLA_16_ENUM[] = [
	{
		name_type: 'IVA',
		value_type: 2,
	},
	{
		name_type: 'ICE',
		value_type: 3,
	},
	{
		name_type: 'IRBPNR',
		value_type: 5,
	},
];
/**
 * TABLA_17
 * Códigos de las tarifas de los impuestos
 */
export type TABLA_17 = 0 | 2 | 3 | 6 | 7;

export interface TABLA_17_ENUM {
	name_type: string;
	value_type: TABLA_17;
}

export const _tabla17: TABLA_17_ENUM[] = [
	{
		name_type: '0%',
		value_type: 0,
	},
	{
		name_type: '12%',
		value_type: 2,
	},
	{
		name_type: '14%',
		value_type: 3,
	},
	{
		name_type: 'No Objeto de Impuesto',
		value_type: 6,
	},
	{
		name_type: 'Exento de IVA',
		value_type: 7,
	},
];

export type TABLA_18 =
	| 3011
	| 3021
	| 3023
	| 3031
	| 3041
	| 3073
	| 3075
	| 3077
	| 3078
	| 3079
	| 3080
	| 3081
	| 3092
	| 3610
	| 3620
	| 3630
	| 3640
	| 3660
	| 3093
	| 3101
	| 3053
	| 3054
	| 3111
	| 3043
	| 3033
	| 3671
	| 3684
	| 3686
	| 3688
	| 3691
	| 3692
	| 3695
	| 3696
	| 3698
	| 3682
	| 3681
	| 3680
	| 3533
	| 3541
	| 3542
	| 3543
	| 3544
	| 3581
	| 3582
	| 3710
	| 3720
	| 3730
	| 3740
	| 3871
	| 3873
	| 3874
	| 3875
	| 3876
	| 3877
	| 3878
	| 3601
	| 3552
	| 3553
	| 3602
	| 3545
	| 3532
	| 3771
	| 3685
	| 3687
	| 3689
	| 3690
	| 3693
	| 3694
	| 3697
	| 3699
	| 3683;

export interface TABLA_18_ENUM {
	name_type: string;
	value_type: TABLA_18;
}

export const _tabla18: TABLA_18_ENUM[] = [
	{
		name_type: 'ICE CIGARRILLOS RUBIOS',
		value_type: 3011,
	},
	{
		name_type: 'ICE CIGARRILLOS NEGROS',
		value_type: 3021,
	},
	{
		name_type:
			'ICE PRODUCTOS DEL TABACO Y SUCEDÁNEOS DEL TABACO EXCEPTO CIGARRILLOS',
		value_type: 3023,
	},
	{
		name_type: 'ICE BEBIDAS ALCOHÓLICAS',
		value_type: 3031,
	},
	{
		name_type: 'ICE CERVEZA INDUSTRIAL GRAN ESCALA',
		value_type: 3041,
	},
	{
		name_type: 'ICE CERVEZA INDUSTRIAL MEDIANA ESCALA',
		value_type: 3041,
	},
	{
		name_type: 'ICE CERVEZA INDUSTRIAL PEQUEÑA ESCALA',
		value_type: 3041,
	},
	{
		name_type: 'ICE VEHÍCULOS MOTORIZADOS CUYO PVP SEA HASTA DE 20000 USD',
		value_type: 3073,
	},
	{
		name_type: 'ICE VEHÍCULOS MOTORIZADOS PVP ENTRE 30000 Y 40000',
		value_type: 3075,
	},
	{
		name_type:
			'ICE VEHÍCULOS MOTORIZADOS CUYO PVP SUPERIOR USD 40.000 HASTA 50.000',
		value_type: 3077,
	},
	{
		name_type:
			'ICE VEHÍCULOS MOTORIZADOS CUYO PVP SUPERIOR USD 50.000 HASTA 60.000',
		value_type: 3078,
	},
	{
		name_type:
			'ICE VEHÍCULOS MOTORIZADOS CUYO PVP SUPERIOR USD 60.000 HASTA 70.000',
		value_type: 3079,
	},
	{
		name_type: 'ICE VEHÍCULOS MOTORIZADOS CUYO PVP SUPERIOR USD 70.000',
		value_type: 3080,
	},
	{
		name_type: 'ICE AVIONES, TRICARES, YATES, BARCOS DE RECREO',
		value_type: 3081,
	},
	{
		name_type: 'ICE SERVICIOS DE TELEVISIÓN PREPAGADA',
		value_type: 3092,
	},
	{
		name_type: 'ICE PERFUMES Y AGUAS DE TOCADOR',
		value_type: 3610,
	},
	{
		name_type: 'ICE VIDEOJUEGOS',
		value_type: 3620,
	},
	{
		name_type: 'ICE ARMAS DE FUEGO, ARMAS DEPORTIVAS Y MUNICIONES',
		value_type: 3630,
	},
	{
		name_type: 'ICE FOCOS INCANDESCENTES',
		value_type: 3640,
	},
	{
		name_type: 'ICE CUOTAS MEMBRESÍAS AFILIACIONES ACCIONES',
		value_type: 3660,
	},
	{
		name_type: 'ICE SERVICIOS TELEFONÍA SOCIEDADES',
		value_type: 3093,
	},
	{
		name_type: 'ICE BEBIDAS ENERGIZANTES',
		value_type: 3101,
	},
	{
		name_type: 'ICE BEBIDAS GASEOSAS CON ALTO CONTENIDO DE AZÚCAR',
		value_type: 3053,
	},
	{
		name_type: 'ICE BEBIDAS GASEOSAS CON BAJO CONTENIDO DE AZÚCAR',
		value_type: 3054,
	},
	{
		name_type: 'ICE BEBIDAS NO ALCOHÓLICAS - 0,18 POR 100 GRAMOS DE AZÚCAR',
		value_type: 3111,
	},
	{
		name_type: 'ICE CERVEZA ARTESANAL',
		value_type: 3043,
	},
	{
		name_type: 'ICE ALCOHOL',
		value_type: 3033,
	},
	{
		name_type: 'ICE CALEFONES Y SISTEMAS DE CALENTAMIENTO DE AGUA A GAS SRI',
		value_type: 3671,
	},
	{
		name_type:
			'ICE VEHÍCULOS MOTORIZADOS CAMIONETAS Y DE RESCATE CUYO PVP SEA HASTA DE 30.000 USD',
		value_type: 3684,
	},
	{
		name_type:
			'ICE VEHÍCULOS MOTORIZADOS EXCEPTO CAMIONETAS Y DE RESCATE CUYO PVP SEA SUPERIOR USD 20.000 HASTA DE 30.000',
		value_type: 3686,
	},
	{
		name_type: 'ICE VEHÍCULOS HÍBRIDOS CUYO PVP SEA DE HASTA USD. 35.000',
		value_type: 3688,
	},
	{
		name_type:
			'ICE VEHÍCULOS HÍBRIDOS CUYO PVP SUPERIOR USD. 35.000 HASTA 40.000',
		value_type: 3691,
	},
	{
		name_type:
			'ICE VEHÍCULOS HÍBRIDOS CUYO PVP SUPERIOR USD. 40.000 HASTA 50.000',
		value_type: 3692,
	},
	{
		name_type:
			'ICE VEHÍCULOS HÍBRIDOS CUYO PVP SUPERIOR USD. 50.000 HASTA 60.000',
		value_type: 3695,
	},
	{
		name_type:
			'ICE VEHÍCULOS HÍBRIDOS CUYO PVP SUPERIOR USD. 60.000 HASTA 70.000',
		value_type: 3696,
	},
	{
		name_type: 'ICE VEHÍCULOS HÍBRIDOS CUYO PVP SUPERIOR A USD 70.000',
		value_type: 3698,
	},
	{
		name_type: 'ICE CONSUMIBLES TABACO CALENTADO Y LIQUIDOS CON NICOTINA SRI',
		value_type: 3682,
	},
	{
		name_type: 'ICE SERVICIOS DE TELEFONÍA MÓVIL PERSONAS NATURALES',
		value_type: 3681,
	},
	{
		name_type: 'ICE FUNDAS PLÁSTICAS',
		value_type: 3680,
	},
	{
		name_type: 'ICE IMPORT. BEBIDAS ALCOHÓLICAS',
		value_type: 3533,
	},
	{
		name_type: 'ICE CERVEZA GRAN ESCALA CAE',
		value_type: 3541,
	},
	{
		name_type: 'ICE CERVEZA INDUSTRIAL DE MEDIANA ESCALA CAE',
		value_type: 3541,
	},
	{
		name_type: 'ICE CERVEZA INDUSTRIAL DE PEQUEÑA ESCALA CAE',
		value_type: 3541,
	},
	{
		name_type: 'ICE CIGARRILLOS RUBIOS CAE',
		value_type: 3542,
	},
	{
		name_type: 'ICE CIGARRILLOS NEGROS CAE',
		value_type: 3543,
	},
	{
		name_type:
			'ICE PRODUCTOS DEL TABACO Y SUCEDANEOS DEL TABACO EXCEPTO CIGARRILLOS CAE',
		value_type: 3544,
	},
	{
		name_type: 'ICE AERONAVES CAE',
		value_type: 3581,
	},
	{
		name_type:
			'ICE AVIONES, AVIONETAS Y HELICOPTEROS EXCT. AQUELLOS DESTINADOS AL TRANS. CAE',
		value_type: 3582,
	},
	{
		name_type: 'ICE PERFUMES AGUAS DE TOCADOR CAE',
		value_type: 3710,
	},
	{
		name_type: 'ICE VIDEO JUEGOS CAE',
		value_type: 3720,
	},
	{
		name_type:
			'ICE IMPORTACIONES ARMAS DE FUEGO, ARMAS DEPORTIVAS Y MUNICIONES CAE',
		value_type: 3730,
	},
	{
		name_type: 'ICE FOCOS INCANDECENTES CAE',
		value_type: 3740,
	},
	{
		name_type:
			'ICE-VEHÍCULOS MOTORIZADOS CUYO PVP SEA HASTA DE 20000 USD SENAE',
		value_type: 3871,
	},
	{
		name_type: 'ICE-VEHÍCULOS MOTORIZADOS PVP ENTRE 30000 Y 40000 SENAE',
		value_type: 3873,
	},
	{
		name_type:
			'ICE-VEHÍCULOS MOTORIZADOS CUYO PVP SUPERIOR USD 40.000 HASTA 50.000 SENAE',
		value_type: 3874,
	},
	{
		name_type:
			'ICE-VEHÍCULOS MOTORIZADOS CUYO PVP SUPERIOR USD 50.000 HASTA 60.000 SENAE',
		value_type: 3875,
	},
	{
		name_type:
			'ICE-VEHÍCULOS MOTORIZADOS CUYO PVP SUPERIOR USD 60.000 HASTA 70.000 SENAE',
		value_type: 3876,
	},
	{
		name_type: 'ICE-VEHÍCULOS MOTORIZADOS CUYO PVP SUPERIOR USD 70.000 SENAE',
		value_type: 3877,
	},
	{
		name_type: 'ICE-AVIONES, TRICARES, YATES, BARCOS DE REC SENAE',
		value_type: 3878,
	},
	{
		name_type: 'ICE BEBIDAS ENERGIZANTES SENAE',
		value_type: 3601,
	},
	{
		name_type: 'ICE BEBIDAS GASEOSAS CON ALTO CONTENIDO DE AZUCAR SENAE',
		value_type: 3552,
	},
	{
		name_type: 'ICE BEBIDAS GASEOSAS CON BAJO CONTENIDO DE AZÚCAR SENAE',
		value_type: 3553,
	},
	{
		name_type: 'ICE BEBIDAS NO ALCOHOLICAS SENAE',
		value_type: 3602,
	},
	{
		name_type: 'ICE CERVEZA ARTESANAL SENAE',
		value_type: 3545,
	},
	{
		name_type: 'ICE IMPORT. ALCOHOL SENAE',
		value_type: 3532,
	},
	{
		name_type: 'ICE CALEFONES Y SISTEMAS DE CALENTAMIENTO DE AGUA A GAS SRI',
		value_type: 3671,
	},
	{
		name_type: 'ICE CALEFONES Y SISTEMAS DE CALENTAMIENTO DE AGUA A GAS SENAE',
		value_type: 3771,
	},
	{
		name_type:
			'ICE VEHÍCULOS MOTORIZADOS CAMIONETAS Y DE RESCATE PVP SEA HASTA DE 30.000 USD SENAE',
		value_type: 3685,
	},
	{
		name_type:
			'ICE VEHÍCULOS MOTORIZADOS EXCEPTO CAMIONETAS Y DE RESCATE CUYO PVP SEA SUPERIOR USD 20.000 HASTA DE 30.000 SENAE',
		value_type: 3687,
	},
	{
		name_type: 'ICE VEHÍCULOS HÍBRIDOS CUYO PVP SEA DE HASTA USD. 35.000 SENAE',
		value_type: 3689,
	},
	{
		name_type:
			'ICE VEHÍCULOS HÍBRIDOS CUYO PVP SUPERIOR USD. 35.000 HASTA 40.000 SENAE',
		value_type: 3690,
	},
	{
		name_type:
			'ICE VEHÍCULOS HÍBRIDOS CUYO PVP SUPERIOR USD. 40.000 HASTA 50.000 SENAE',
		value_type: 3693,
	},
	{
		name_type:
			'ICE VEHÍCULOS HÍBRIDOS CUYO PVP SUPERIOR USD. 50.000 HASTA 60.000 SENAE',
		value_type: 3694,
	},
	{
		name_type:
			'ICE VEHÍCULOS HÍBRIDOS CUYO PVP SUPERIOR USD. 60.000 HASTA 70.000 SENAE',
		value_type: 3697,
	},
	{
		name_type: 'ICE VEHÍCULOS HÍBRIDOS CUYO PVP SUPERIOR A USD 70.000 SENAE',
		value_type: 3699,
	},
	{
		name_type: 'ICE CONSUMIBLES TABACO CALENTADO Y LIQUIDOS CON NICOTINA SENAE',
		value_type: 3683,
	},
];

/**
 * TABLA_19
 * Códigos por impuestos asignados para la retención
 */
export type TABLA_19 = 1 | 2 | 6;

export interface TABLA_19_ENUM {
	name_type: string;
	value_type: TABLA_19;
}

export const _tabla19: TABLA_19_ENUM[] = [
	{
		name_type: 'RENTA',
		value_type: 1,
	},
	{
		name_type: 'IVA',
		value_type: 2,
	},
	{
		name_type: 'ISD',
		value_type: 6,
	},
];
/**
 * TABLA_20
 * Códigos por impuesto de acuerdo con el porcentaje de retención
 */
export type TABLA_20 = 9 | 10 | 1 | 11 | 2 | 3 | 7 | 8 | 4580;

export interface TABLA_20_ENUM {
	name_type: string;
	value_type: TABLA_20;
}

export const _tabla20: TABLA_20_ENUM[] = [
	{
		name_type: '10%',
		value_type: 9,
	},
	{
		name_type: '20%',
		value_type: 10,
	},
	{
		name_type: '30%',
		value_type: 1,
	},
	{
		name_type: '50%',
		value_type: 11,
	},
	{
		name_type: '70%',
		value_type: 2,
	},
	{
		name_type: '100%',
		value_type: 3,
	},
	{
		// Retención en cero:
		name_type: '0%',
		value_type: 7,
	},
	{
		// No procede retención:
		name_type: '0%',
		value_type: 8,
	},
	{
		// RETENCIÓN DE ISD:
		name_type: '5%',
		value_type: 4580,
	},
];
/**
 * TABLA_22
 * Códigos de impuestos para los comercializadores y distribuidores de derivados de petróleo
 */
export type TABLA_22 = 4;

export interface TABLA_22_ENUM {
	name_type: string;
	value_type: TABLA_22;
}

export const _tabla22: TABLA_22_ENUM[] = [
	{
		name_type: 'IVA PRESUNTIVO Y RENTA',
		value_type: 4,
	},
];
/**
 * TABLA_23
 * Tarifas de retenciones para la emisión de facturas para los comercializadores y distribuidores de derivados de petróleo
 */
export type TABLA_23 = 3 | 4 | 5 | 6 | 327 | 328;

export interface TABLA_23_ENUM {
	name_type: string;
	value_type: TABLA_23;
}

export const _tabla23: TABLA_23_ENUM[] = [
	/**
	 * Retención IVA
	 */
	{
		name_type: '100%',
		value_type: 3,
	},
	{
		name_type:
			'12% (Retención de IVA presuntivo por Editores a Margen de Comercialización Voceadores)',
		value_type: 4,
	},
	{
		name_type:
			'100% (Retención IVA Venta Periódicos y/o Revistas a Distribuidores) *',
		value_type: 5,
	},
	{
		name_type:
			'100% (Retención Iva Venta de Periódicos y/o Revistas a Voceadores) *',
		value_type: 6,
	},
	/**
	 * Retención RENTA
	 */
	{
		name_type: '0.002 (2 por mil)',
		value_type: 327,
	},
	{
		name_type: '0.003 (3 por mil)',
		value_type: 328,
	},
];
/**
 * TABLA_24
 * Formas de pago
 */
export type TABLA_24 = '01' | '15' | '16' | '17' | '18' | '19' | '20' | '21';

export interface TABLA_24_ENUM {
	name_type: string;
	value_type: TABLA_24;
}

export const _tabla24: TABLA_24_ENUM[] = [
	{
		name_type: 'SIN UTILIZACION DEL SISTEMA FINANCIERO',
		value_type: '01',
	},
	{
		name_type: 'COMPENSACIÓN DE DEUDAS',
		value_type: '15',
	},
	{
		name_type: 'TARJETA DE DÉBITO',
		value_type: '16',
	},
	{
		name_type: 'DINERO ELECTRÓNICO',
		value_type: '17',
	},
	{
		name_type: 'TARJETA PREPAGO',
		value_type: '18',
	},
	{
		name_type: 'TARJETA DE CRÉDITO',
		value_type: '19',
	},
	{
		name_type: 'OTROS CON UTILIZACION DEL SISTEMA FINANCIERO',
		value_type: '20',
	},
	{
		name_type: 'ENDOSO DE TÍTULOS',
		value_type: '21',
	},
];
/**
 * TABLA_26
 * Tipo Proveedor de Reembolso
 */
export type TABLA_26 = '01' | '02';

export interface TABLA_26_ENUM {
	name_type: string;
	value_type: TABLA_26;
}

export const _tabla26: TABLA_26_ENUM[] = [
	{
		name_type: 'PERSONA NATURAL',
		value_type: '01',
	},
	{
		name_type: 'SOCIEDAD',
		value_type: '02',
	},
];
/**
 * TABLA_30
 * Venta de combustibles líquidos derivados de hidrocarburos (CLDH) y biocombustibles
 */
export type TABLA_30 = '0103' | '0101' | '0174' | '0121' | '0104';

export interface TABLA_30_ENUM {
	name_type: string;
	value_type: TABLA_30;
}

export const _tabla30: TABLA_30_ENUM[] = [
	{
		name_type: 'SUPER',
		value_type: '0103',
	},
	{
		name_type: 'EXTRA',
		value_type: '0101',
	},
	{
		name_type: 'EXTRA CON ETANOL',
		value_type: '0174',
	},
	{
		name_type: 'DIESEL PREMIUM',
		value_type: '0121',
	},
	{
		name_type: 'DIESEL 2',
		value_type: '0104',
	},
];
/**
 * SRI Types
 */
export interface ResponseRecepcionComprobante {
	RespuestaRecepcionComprobante: RespuestaRecepcionComprobante;
}

export interface RespuestaRecepcionComprobante {
	estado: EstadosSRI;
	comprobantes: comprobantes;
}

export interface comprobantes {
	comprobante: comprobante;
}

export interface comprobante {
	mensajes: mensajes;
}

export interface mensajes {
	mensaje: mensaje;
}

export interface mensaje {
	identificador: string;
	mensaje: string;
	tipo: string;
}

export type EstadosSRI = 'RECIBIDA' | 'DEVUELTA' | 'AUTORIZADO' | 'RECHAZADO';

export interface ResponseAutorizacionComprobante {
	RespuestaAutorizacionComprobante: RespuestaAutorizacionComprobante;
}

export interface RespuestaAutorizacionComprobante {
	claveAccesoConsultada: string;
	numeroComprobantes: number;
	autorizaciones: Autorizaciones;
}

export interface Autorizaciones {
	autorizacion: Autorizacion;
}

export interface Autorizacion {
	estado: EstadosSRI;
	numeroAutorizacion: string;
	fechaAutorizacion: Date;
	ambiente: string;
	comprobante: string;
	mensajes: any;
}
/**
 * Internal Types
 */
export interface ValoresExtras {
	tasaProcesamiento: number;
	interes: number;
	otros: number;
}

export interface BatchProcess {
	institution: string;
	status: boolean;
}

export interface Group {
	id: number | string;
	name: string;
	html: string;
	subtotal_12?: number;
	subtotal_0: number;
	iva?: number;
	total: number;
	count?: number;
}

export interface GroupDate {
	id: number | string;
	date: string;
	name: string | any;
	html: string;
	subtotal_12?: number;
	subtotal_0: number;
	iva?: number;
	total: number;
	count?: number;
}
/**
 * ONLY GADMCP
 */
export interface InstitutionSQLServer {
	id_institution: number;
	name_institution: NameInstitutionSQLServer;
	table: string;
}

export type NameInstitutionSQLServer = 'municipio' | 'patronato' | '*';
/**
 * ONLY GADMCP
 */
export interface VoucherSQLServer {
	fechaemision: Date;
	numerodocumento: number;
	razonsocialcomprador: string;
	identificacionComprador: string;
	direccioncomprador: string;
	detalle: string;
	cantidad: string;
	valorunitario: number;
	total?: number;
	iva: number;
	correo: string;
	recaudador: string;
	tasaprocesamiento: number;
	interes: number;
	otros: number;
	institution: NameInstitutionSQLServer;
	estadointerno: boolean | null;
}
/**
 * ONLY GADMCP
 */
export interface ResponseBrindVoucher {
	number_voucher: string;
	message: MessageAPI | string;
}
/**
 * ONLY GADMCP
 */
export const INSTITUTION_SQLSERVER: InstitutionSQLServer[] = [
	{
		id_institution: 0,
		name_institution: '*',
		table: '*',
	},
	{
		id_institution: 1,
		name_institution: 'municipio',
		table: 'FACTURACION',
	},
	{
		id_institution: 2,
		name_institution: 'patronato',
		table: 'FACTURACION_PATRONATO',
	},
];
