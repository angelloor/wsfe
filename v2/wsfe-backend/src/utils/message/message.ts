import { Messages } from './message.type';

export const _messages: Messages = {
	1: {
		id: true,
		code: '01-001',
		status: 200,
		component: 'success',
		description: 'Transaction Ok!',
	},
	2: {
		id: false,
		code: '02-002',
		status: 500,
		component: 'unknown',
		description: 'Excepción desconocida: ExCePcIoN',
	},
	3: {
		id: false,
		code: '03-003',
		status: 400,
		component: 'database',
		description: 'Database MessageAPI',
	},
	4: {
		id: false,
		code: '04-004',
		status: 400,
		component: 'auth',
		description: 'No Autorizado!',
	},
	5: {
		id: false,
		code: '04-005',
		status: 400,
		component: 'auth',
		description: 'No se ha recibido el token',
	},
	6: {
		id: false,
		code: '05-006',
		status: 400,
		component: 'validations',
		description: 'No se ha recibido el _nombreCampo',
	},
	7: {
		id: false,
		code: '05-007',
		status: 400,
		component: 'validations',
		description:
			'El tipo de dato de _nombreCampo es incorrecto, se esperaba _tipoEsperado',
	},
	8: {
		id: false,
		code: '05-008',
		status: 400,
		component: 'validations',
		description:
			'La longitud de _nombreCampo no puede ser mayor a _caracteresEsperados caracteres',
	},
	9: {
		id: false,
		code: '05-009',
		status: 400,
		component: 'validations',
		description:
			'El formato de la contraseña no cumple con su formato establecido (_formatoEstablecido)',
	},
	10: {
		id: false,
		code: '06-010',
		status: 400,
		component: 'report',
		description: 'No se encontraron datos para generar el reporte',
	},
	11: {
		id: false,
		code: '005-011',
		status: 400,
		component: 'validations',
		description:
			'El objecto name_attribute no paso la validación del comprobante (type_validation)',
	},
	12: {
		id: false,
		code: '005-015',
		status: 400,
		component: 'validations',
		description:
			'La fecha ingresada value_date no paso la validación checkDateString()',
	},
};

export const _businessMessages: Messages = {
	1: {
		id: false,
		code: '07-012',
		status: 400,
		component: 'business',
		description:
			'El comprobante no se encuentra habilitado por el administrador',
	},
	2: {
		id: false,
		code: '07-013',
		status: 400,
		component: 'business',
		description: 'Ocurrió un problema con el proceso -> (businessMessages)',
	},
	3: {
		id: false,
		code: '07-014',
		status: 400,
		component: 'business',
		description:
			'Ocurrió un problema con la autorización -> (businessMessages)',
	},
	4: {
		id: false,
		code: '07-015',
		status: 400,
		component: 'business',
		description: 'Ocurrió un problema con la consulta -> (businessMessages)',
	},
};
