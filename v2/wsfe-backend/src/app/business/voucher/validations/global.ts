import { _messages } from '../../../../utils/message/message';
import { MessageAPI } from '../../../../utils/message/message.type';
import {
	campoAdicional,
	detAdicional,
	detalle,
	impuesto,
	pago,
	TABLA_16,
	TABLA_17,
	TABLA_18,
	TABLA_24,
	TABLA_6,
	totalImpuesto,
	TYPE_ACCOUNTING_OBLIGED,
	TYPE_EMISSION,
	TYPE_ENVIRONMENT,
	TYPE_VOUCHER,
	ValoresExtras,
} from '../../business.types';
import { attributeValidate } from '../voucher.controller';
/**
 * error_message
 * @param name_attribute
 * @returns
 */
const error_message = (
	name_attribute: string,
	type_validation: 'EXISTENCE' | 'TYPE' | 'LENGTH'
): MessageAPI => {
	return {
		..._messages[11],
		description: _messages[11].description
			.replace('name_attribute', name_attribute)
			.replace('type_validation', type_validation),
	};
};
/**
 * validation_valoresExtras
 * @param valoresExtras
 * @returns
 */
export const validation_valoresExtras = (
	valoresExtras: ValoresExtras
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Logic attribute
		 */
		if (!valoresExtras) {
			reject(error_message('valoresExtras', 'EXISTENCE'));
		} else if (Object.keys(valoresExtras).length == 0) {
			reject(error_message('valoresExtras', 'EXISTENCE'));
		} else if (
			!(
				(valoresExtras.tasaProcesamiento ||
					valoresExtras.tasaProcesamiento == 0) &&
				typeof valoresExtras.tasaProcesamiento === 'number'
			)
		) {
			reject(error_message('tasaProcesamiento', 'TYPE'));
		} else if (
			!(
				(valoresExtras.interes || valoresExtras.otros == 0) &&
				typeof valoresExtras.interes === 'number'
			)
		) {
			reject(error_message('interes', 'TYPE'));
		} else if (
			!(
				(valoresExtras.otros || valoresExtras.otros == 0) &&
				typeof valoresExtras.otros === 'number'
			)
		) {
			reject(error_message('otros', 'TYPE'));
		} else {
			resolve(true);
		}
	});
};
/**
 * validation_ambiente
 * @param ambiente
 * @returns
 */
export const validation_ambiente = (
	ambiente: TYPE_ENVIRONMENT
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Logic attribute
		 */
		if (!ambiente) {
			reject(error_message('ambiente', 'EXISTENCE'));
		} else if (!(ambiente == '1' || ambiente == '2')) {
			reject(error_message('ambiente', 'TYPE'));
		} else {
			/**
			 * Basic validation
			 */
			await attributeValidate('ambiente', ambiente, 'string', 1)
				.then((response: boolean) => {
					resolve(response);
				})
				.catch((err: MessageAPI) => {
					reject(err);
				});
		}
	});
};
/**
 * validation_tipoEmision
 * @param tipoEmision
 * @returns
 */
export const validation_tipoEmision = (
	tipoEmision: TYPE_EMISSION
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Logic attribute
		 */
		if (!tipoEmision) {
			reject(error_message('tipoEmision', 'EXISTENCE'));
		} else if (!(tipoEmision == '1')) {
			reject(error_message('tipoEmision', 'TYPE'));
		} else {
			/**
			 * Basic validation
			 */
			await attributeValidate('tipoEmision', tipoEmision, 'string', 1)
				.then((response: boolean) => {
					resolve(response);
				})
				.catch((err: MessageAPI) => {
					reject(err);
				});
		}
	});
};
/**
 * validation_razonSocial
 * @param razonSocial
 * @returns
 */
export const validation_razonSocial = (
	razonSocial: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('razonSocial', razonSocial, 'string', 300)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_nombreComercial
 * @param nombreComercial
 * @returns
 */
export const validation_nombreComercial = (
	nombreComercial: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('nombreComercial', nombreComercial, 'string', 300)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_ruc
 * @param ruc
 * @returns
 */
export const validation_ruc = (ruc: string): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('ruc', ruc, 'string', 13)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_claveAcceso
 * @param claveAcceso
 * @returns
 */
export const validation_claveAcceso = (
	claveAcceso: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('claveAcceso', claveAcceso, 'string', 49)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_codDoc
 * @param codDoc
 * @returns
 */
export const validation_codDoc = (codDoc: TYPE_VOUCHER): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Logic attribute
		 */
		if (!codDoc) {
			reject(error_message('codDoc', 'EXISTENCE'));
		} else if (
			!(
				codDoc == '01' ||
				codDoc == '03' ||
				codDoc == '04' ||
				codDoc == '05' ||
				codDoc == '06' ||
				codDoc == '07'
			)
		) {
			reject(error_message('codDoc', 'TYPE'));
		} else {
			/**
			 * Basic validation
			 */
			await attributeValidate('codDoc', codDoc, 'string', 2)
				.then((response: boolean) => {
					resolve(response);
				})
				.catch((err: MessageAPI) => {
					reject(err);
				});
		}
	});
};
/**
 * validation_estab
 * @param estab
 * @returns
 */
export const validation_estab = (estab: string): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('estab', estab, 'string', 3)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_ptoEmi
 * @param ptoEmi
 * @returns
 */
export const validation_ptoEmi = (ptoEmi: string): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('ptoEmi', ptoEmi, 'string', 3)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_secuencial
 * @param secuencial
 * @returns
 */
export const validation_secuencial = (secuencial: string): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('secuencial', secuencial, 'string', 9)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_dirMatriz
 * @param dirMatriz
 * @returns
 */
export const validation_dirMatriz = (dirMatriz: string): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('dirMatriz', dirMatriz, 'string', 300)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_fechaEmision
 * @param fechaEmision
 * @returns
 */
export const validation_fechaEmision = (
	fechaEmision: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('fechaEmision', fechaEmision, 'string', 10)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_dirEstablecimiento
 * @param dirEstablecimiento
 * @returns
 */
export const validation_dirEstablecimiento = (
	dirEstablecimiento: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate(
			'dirEstablecimiento',
			dirEstablecimiento,
			'string',
			300
		)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_contribuyenteEspecial
 * @param contribuyenteEspecial
 * @returns
 */
export const validation_contribuyenteEspecial = (
	contribuyenteEspecial: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Logic attribute
		 */
		if (!contribuyenteEspecial) {
			reject(error_message('contribuyenteEspecial', 'EXISTENCE'));
		} else if (
			!(contribuyenteEspecial.length >= 3 && contribuyenteEspecial.length <= 5)
		) {
			reject(error_message('contribuyenteEspecial', 'LENGTH'));
		} else {
			/**
			 * Basic validation
			 */
			await attributeValidate(
				'contribuyenteEspecial',
				contribuyenteEspecial,
				'string',
				5
			)
				.then((response: boolean) => {
					resolve(response);
				})
				.catch((err: MessageAPI) => {
					reject(err);
				});
		}
	});
};
/**
 * validation_obligadoContabilidad
 * @param obligadoContabilidad
 * @returns
 */
export const validation_obligadoContabilidad = (
	obligadoContabilidad: TYPE_ACCOUNTING_OBLIGED
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Logic attribute
		 */
		if (!obligadoContabilidad) {
			reject(error_message('obligadoContabilidad', 'EXISTENCE'));
		} else if (
			!(obligadoContabilidad == 'SI' || obligadoContabilidad == 'NO')
		) {
			reject(error_message('obligadoContabilidad', 'TYPE'));
		} else {
			/**
			 * Basic validation
			 */
			await attributeValidate(
				'obligadoContabilidad',
				obligadoContabilidad,
				'string',
				300
			)
				.then((response: boolean) => {
					resolve(response);
				})
				.catch((err: MessageAPI) => {
					reject(err);
				});
		}
	});
};
/**
 * validation_tipoIdentificacionComprador
 * @param tipoIdentificacionComprador
 * @returns
 */
export const validation_tipoIdentificacionComprador = (
	tipoIdentificacionComprador: TABLA_6
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Logic attribute
		 */
		if (!tipoIdentificacionComprador) {
			reject(error_message('tipoIdentificacionComprador', 'EXISTENCE'));
		} else if (!is_TABLA_6(tipoIdentificacionComprador)) {
			reject(error_message('tipoIdentificacionComprador', 'TYPE'));
		} else {
			resolve(true);
		}
	});
};
/**
 * validation_guiaRemision
 * @param guiaRemision
 * @returns
 */
export const validation_guiaRemision = (
	guiaRemision: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('guiaRemision', guiaRemision, 'string', 17)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_razonSocialComprador
 * @param razonSocialComprador
 * @returns
 */
export const validation_razonSocialComprador = (
	razonSocialComprador: string,
	tipoIdentificacionComprador: TABLA_6
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Logic attribute
		 */
		if (!razonSocialComprador) {
			reject(error_message('razonSocialComprador', 'EXISTENCE'));
		} else if (
			tipoIdentificacionComprador == '07' &&
			!(razonSocialComprador == 'CONSUMIDOR FINAL')
		) {
			reject(error_message('razonSocialComprador', 'TYPE'));
		} else {
			/**
			 * Basic validation
			 */
			await attributeValidate(
				'razonSocialComprador',
				razonSocialComprador,
				'string',
				300
			)
				.then((response: boolean) => {
					resolve(response);
				})
				.catch((err: MessageAPI) => {
					reject(err);
				});
		}
	});
};
/**
 * validation_identificacionComprador
 * @param identificacionComprador
 * @returns
 */
export const validation_identificacionComprador = (
	identificacionComprador: string,
	tipoIdentificacionComprador: TABLA_6
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Logic attribute
		 */
		if (!identificacionComprador) {
			reject(error_message('identificacionComprador', 'EXISTENCE'));
		} else if (
			tipoIdentificacionComprador == '04' &&
			identificacionComprador.length != 13
		) {
			reject(error_message('identificacionComprador', 'TYPE'));
		} else if (
			tipoIdentificacionComprador == '05' &&
			identificacionComprador.length != 10
		) {
			reject(error_message('identificacionComprador', 'TYPE'));
		} else if (
			tipoIdentificacionComprador == '07' &&
			identificacionComprador != '9999999999999'
		) {
			reject(error_message('identificacionComprador', 'TYPE'));
		} else {
			/**
			 * Basic validation
			 */
			await attributeValidate(
				'identificacionComprador',
				identificacionComprador,
				'string',
				20
			)
				.then((response: boolean) => {
					resolve(response);
				})
				.catch((err: MessageAPI) => {
					reject(err);
				});
		}
	});
};
/**
 * validation_direccionComprador
 * @param direccionComprador
 * @returns
 */
export const validation_direccionComprador = (
	direccionComprador: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate(
			'direccionComprador',
			direccionComprador,
			'string',
			300
		)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_totalSinImpuestos
 * @param totalSinImpuestos
 * @returns
 */
export const validation_totalSinImpuestos = (
	totalSinImpuestos: number
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate(
			'totalSinImpuestos',
			totalSinImpuestos,
			'number',
			14
		)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_totalDescuento
 * @param totalDescuento
 * @returns
 */
export const validation_totalDescuento = (
	totalDescuento: number
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('totalDescuento', totalDescuento, 'number', 14)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_totalConImpuestos
 * @param totalConImpuestos
 * @returns
 */
export const validation_totalConImpuestos = (
	totalConImpuestos: totalImpuesto[]
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		let validationStatus: boolean = false;
		/**
		 * Logic attribute
		 */
		if (!totalConImpuestos) {
			reject(error_message('totalConImpuestos', 'EXISTENCE'));
		} else if (totalConImpuestos.length == 0) {
			reject(error_message('totalConImpuestos', 'LENGTH'));
		} else {
			/**
			 * Iterrar el totalConImpuestos
			 */
			totalConImpuestos.map(
				async (_totalImpuesto: totalImpuesto, index: number) => {
					/**
					 * Validation codigo
					 */
					await validation_codigo(
						_totalImpuesto.codigo,
						'totalConImpuestos'
					).catch((error: MessageAPI) => {
						validationStatus = true;
						reject(error);
					});
					/**
					 * Validation codigoPorcentaje
					 */
					await validation_codigoPorcentaje(
						_totalImpuesto.codigoPorcentaje,
						_totalImpuesto.codigo,
						'totalConImpuestos'
					).catch((error: MessageAPI) => {
						validationStatus = true;
						reject(error);
					});
					/**
					 * Validation baseImponible
					 */
					await validation_baseImponible(
						_totalImpuesto.baseImponible,
						'totalConImpuestos'
					).catch((error: MessageAPI) => {
						validationStatus = true;
						reject(error);
					});
					/**
					 * Validation valor
					 */
					await validation_valor(
						_totalImpuesto.valor,
						'totalConImpuestos'
					).catch((error: MessageAPI) => {
						validationStatus = true;
						reject(error);
					});
					/**
					 * Validation descuentoAdicional
					 */
					if (
						_totalImpuesto.descuentoAdicional ||
						_totalImpuesto.descuentoAdicional == 0
					) {
						await validation_descuentoAdicional(
							_totalImpuesto.descuentoAdicional!,
							_totalImpuesto.codigo
						).catch((error: MessageAPI) => {
							validationStatus = true;
							reject(error);
						});
					}
					/**
					 * Return if an error has occurred
					 */
					if (validationStatus) {
						return;
					} else if (totalConImpuestos.length == index + 1) {
						resolve(true);
					}
				}
			);
		}
	});
};
/**
 * -------------------------------------- impuesto --------------------------------------
 */
/**
 * validation_codigo
 * @param codigo
 * @param origin
 * @returns
 */
export const validation_codigo = (
	codigo: TABLA_16,
	origin: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Logic attribute
		 */
		if (!codigo) {
			reject(error_message(`${origin}.codigo`, 'EXISTENCE'));
		} else if (!is_TABLA_16(codigo)) {
			reject(error_message(`${origin}.codigo`, 'TYPE'));
		} else {
			/**
			 * Basic validation
			 */
			await attributeValidate(`${origin}.codigo`, codigo, 'number', 1)
				.then((response: boolean) => {
					resolve(response);
				})
				.catch((err: MessageAPI) => {
					reject(err);
				});
		}
	});
};
/**
 * validation_codigoPorcentaje
 * @param codigoPorcentaje
 * @param origin
 * @returns
 */
export const validation_codigoPorcentaje = (
	codigoPorcentaje: TABLA_17 | TABLA_18,
	codigo: TABLA_16,
	origin: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Logic attribute
		 */
		if (!(codigoPorcentaje || codigoPorcentaje == 0)) {
			reject(error_message(`${origin}.codigoPorcentaje`, 'EXISTENCE'));
		} else if (codigo == 2 && !is_TABLA_17(codigoPorcentaje)) {
			reject(error_message(`${origin}.codigoPorcentaje`, 'TYPE'));
		} else if (codigo == 3 && !is_TABLA_18(codigoPorcentaje)) {
			reject(error_message(`${origin}.codigoPorcentaje`, 'TYPE'));
		} else {
			/**
			 * Basic validation
			 */
			await attributeValidate(
				`${origin}.codigoPorcentaje`,
				codigoPorcentaje,
				'number',
				4
			)
				.then((response: boolean) => {
					resolve(response);
				})
				.catch((err: MessageAPI) => {
					reject(err);
				});
		}
	});
};
/**
 * validation_descuentoAdicional
 * @param descuentoAdicional
 * @returns
 */
export const validation_descuentoAdicional = (
	descuentoAdicional: number,
	codigo: TABLA_16
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Logic attribute
		 */
		if (!(descuentoAdicional || descuentoAdicional == 0)) {
			reject(error_message('descuentoAdicional', 'EXISTENCE'));
		} else if (codigo != 2) {
			reject(error_message('descuentoAdicional', 'TYPE'));
		} else {
			/**
			 * Basic validation
			 */
			await attributeValidate(
				'descuentoAdicional',
				descuentoAdicional,
				'number',
				14
			)
				.then((response: boolean) => {
					resolve(response);
				})
				.catch((err: MessageAPI) => {
					reject(err);
				});
		}
	});
};
/**
 * validation_baseImponible
 * @param baseImponible
 * @param origin
 * @returns
 */
export const validation_baseImponible = (
	baseImponible: number,
	origin: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate(
			`${origin}.baseImponible`,
			baseImponible,
			'number',
			14
		)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_valor
 * @param valor
 * @param origin
 * @returns
 */
export const validation_valor = (
	valor: number,
	origin: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate(`${origin}.valor`, valor, 'number', 14)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_tarifa
 * @param tarifa
 * @returns
 */
export const validation_tarifa = (tarifa: number): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('tarifa', tarifa, 'number', 14)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_propina
 * @param propina
 * @returns
 */
export const validation_propina = (propina: number): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('propina', propina, 'number', 14)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_importeTotal
 * @param importeTotal
 * @returns
 */
export const validation_importeTotal = (
	importeTotal: number
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('importeTotal', importeTotal, 'number', 14)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_moneda
 * @param moneda
 * @returns
 */
export const validation_moneda = (moneda: string): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('moneda', moneda, 'string', 15)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_pagos
 * @param pagos
 * @returns
 */
export const validation_pagos = (pagos: pago[]): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		let validationStatus: boolean = false;
		/**
		 * Logic attribute
		 */
		if (!pagos) {
			reject(error_message('pagos', 'EXISTENCE'));
		} else if (pagos.length == 0) {
			reject(error_message('pagos', 'LENGTH'));
		} else {
			/**
			 * Iterrar el pagos
			 */
			pagos.map(async (_pago: pago, index: number) => {
				/**
				 * Validation formaPago
				 */
				await validation_formaPago(_pago.formaPago).catch(
					(error: MessageAPI) => {
						validationStatus = true;
						reject(error);
					}
				);
				/**
				 * Validation total
				 */
				await validation_total(_pago.total).catch((error: MessageAPI) => {
					validationStatus = true;
					reject(error);
				});
				/**
				 * Validation plazo
				 */
				if (_pago.plazo) {
					await validation_plazo(_pago.plazo).catch((error: MessageAPI) => {
						validationStatus = true;
						reject(error);
					});
				}
				/**
				 * Validation unidadTiempo
				 */
				if (_pago.unidadTiempo) {
					await validation_unidadTiempo(_pago.unidadTiempo).catch(
						(error: MessageAPI) => {
							validationStatus = true;
							reject(error);
						}
					);
				}
				/**
				 * Return if an error has occurred
				 */
				if (validationStatus) {
					return;
				} else if (pagos.length == index + 1) {
					resolve(true);
				}
			});
		}
	});
};
/**
 * validation_formaPago
 * @param formaPago
 * @returns
 */
export const validation_formaPago = (formaPago: TABLA_24): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Logic attribute
		 */
		if (!formaPago) {
			reject(error_message('formaPago', 'EXISTENCE'));
		} else if (!is_TABLA_24(formaPago)) {
			reject(error_message('formaPago', 'TYPE'));
		} else {
			/**
			 * Basic validation
			 */
			await attributeValidate('formaPago', formaPago, 'string', 2)
				.then((response: boolean) => {
					resolve(response);
				})
				.catch((err: MessageAPI) => {
					reject(err);
				});
		}
	});
};
/**
 * validation_total
 * @param total
 * @returns
 */
export const validation_total = (total: number): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('total', total, 'number', 14)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_plazo
 * @param plazo
 * @returns
 */
export const validation_plazo = (plazo: number): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('plazo', plazo, 'number', 14)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_unidadTiempo
 * @param unidadTiempo
 * @returns
 */
export const validation_unidadTiempo = (
	unidadTiempo: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('unidadTiempo', unidadTiempo, 'string', 10)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_valorRetIva
 * @param valorRetIva
 * @returns
 */
export const validation_valorRetIva = (
	valorRetIva: number
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('valorRetIva', valorRetIva, 'number', 14)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_valorRetRenta
 * @param valorRetRenta
 * @returns
 */
export const validation_valorRetRenta = (
	valorRetRenta: number
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate('valorRetRenta', valorRetRenta, 'number', 14)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_detalles
 * @param detalles
 * @returns
 */
export const validation_detalles = (detalles: detalle[]): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		let validationStatus: boolean = false;
		/**
		 * Logic attribute
		 */
		if (!detalles) {
			reject(error_message('detalles', 'EXISTENCE'));
		} else if (detalles.length == 0) {
			reject(error_message('detalles', 'LENGTH'));
		} else {
			/**
			 * Iterrar el detalles
			 */
			detalles.map(async (_detalle: detalle, index: number) => {
				/**
				 * Validation impuestos
				 */
				_detalle.impuestos.map(async (_impuesto: impuesto) => {
					/**
					 * Validation codigo
					 */
					await validation_codigo(_impuesto.codigo, 'impuestos').catch(
						(error: MessageAPI) => {
							validationStatus = true;
							reject(error);
						}
					);
					/**
					 * Validation codigoPorcentaje
					 */
					await validation_codigoPorcentaje(
						_impuesto.codigoPorcentaje,
						_impuesto.codigo,
						'impuestos'
					).catch((error: MessageAPI) => {
						validationStatus = true;
						reject(error);
					});
					/**
					 * Validation tarifa
					 */
					await validation_tarifa(_impuesto.tarifa).catch(
						(error: MessageAPI) => {
							validationStatus = true;
							reject(error);
						}
					);
					/**
					 * Validation baseImponible
					 */
					await validation_baseImponible(
						_impuesto.baseImponible,
						'impuestos'
					).catch((error: MessageAPI) => {
						validationStatus = true;
						reject(error);
					});
					/**
					 * Validation valor
					 */
					await validation_valor(_impuesto.valor, 'impuestos').catch(
						(error: MessageAPI) => {
							validationStatus = true;
							reject(error);
						}
					);
					/**
					 * Return if an error has occurred
					 */
					if (validationStatus) {
						return;
					}
				});
				/**
				 * Return if an error has occurred
				 */
				if (validationStatus) {
					return;
				}
				/**
				 * generate detallesAdicionales
				 */
				if (_detalle.detallesAdicionales) {
					_detalle.detallesAdicionales.map(
						async (_detAdicional: detAdicional) => {
							let valuesObject: any = Object.values(_detAdicional);
							/**
							 * Basic validation
							 */
							await attributeValidate(
								'valor',
								valuesObject[0],
								'string',
								300
							).catch((error: MessageAPI) => {
								validationStatus = true;
								reject(error);
							});
						}
					);
				}
				/**
				 * Return if an error has occurred
				 */
				if (validationStatus) {
					return;
				}
				const origin: string = 'detalles';
				/**
				 * Validation codigoPrincipal
				 */
				await validation_codigoPrincipal(
					_detalle.codigoPrincipal,
					origin
				).catch((error: MessageAPI) => {
					validationStatus = true;
					reject(error);
				});
				/**
				 * Validation codigoAuxiliar
				 */
				if (_detalle.codigoAuxiliar) {
					await validation_codigoAuxiliar(
						_detalle.codigoAuxiliar,
						origin
					).catch((error: MessageAPI) => {
						validationStatus = true;
						reject(error);
					});
				}
				/**
				 * Validation descripcion
				 */
				await validation_descripcion(_detalle.descripcion, origin).catch(
					(error: MessageAPI) => {
						validationStatus = true;
						reject(error);
					}
				);
				/**
				 * Validation cantidad
				 */
				await validation_cantidad(_detalle.cantidad, origin).catch(
					(error: MessageAPI) => {
						validationStatus = true;
						reject(error);
					}
				);
				/**
				 * Validation precioUnitario
				 */
				await validation_precioUnitario(_detalle.precioUnitario, origin).catch(
					(error: MessageAPI) => {
						validationStatus = true;
						reject(error);
					}
				);
				/**
				 * Validation descuento
				 */
				await validation_descuento(_detalle.descuento, origin).catch(
					(error: MessageAPI) => {
						validationStatus = true;
						reject(error);
					}
				);
				/**
				 * Validation precioTotalSinImpuesto
				 */
				await validation_precioTotalSinImpuesto(
					_detalle.precioTotalSinImpuesto,
					origin
				).catch((error: MessageAPI) => {
					validationStatus = true;
					reject(error);
				});
				/**
				 * Return if an error has occurred
				 */
				if (validationStatus) {
					return;
				} else if (detalles.length == index + 1) {
					resolve(true);
				}
			});
		}
	});
};
/**
 * validation_codigoPrincipal
 * @param codigoPrincipal
 * @param origin
 * @returns
 */
export const validation_codigoPrincipal = (
	codigoPrincipal: string,
	origin: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate(
			`${origin}.codigoPrincipal`,
			codigoPrincipal,
			'string',
			25
		)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_codigoAuxiliar
 * @param codigoAuxiliar
 * @param origin
 * @returns
 */
export const validation_codigoAuxiliar = (
	codigoAuxiliar: string,
	origin: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate(
			`${origin}.codigoAuxiliar`,
			codigoAuxiliar,
			'string',
			25
		)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_descripcion
 * @param descripcion
 * @param origin
 * @returns
 */
export const validation_descripcion = (
	descripcion: string,
	origin: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate(`${origin}.descripcion`, descripcion, 'string', 300)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_cantidad
 * @param cantidad
 * @param origin
 * @returns
 */
export const validation_cantidad = (
	cantidad: number,
	origin: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate(`${origin}.cantidad`, cantidad, 'number', 14)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_precioUnitario
 * @param precioUnitario
 * @param origin
 * @returns
 */
export const validation_precioUnitario = (
	precioUnitario: number,
	origin: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate(
			`${origin}.precioUnitario`,
			precioUnitario,
			'number',
			14
		)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_descuento
 * @param descuento
 * @param origin
 * @returns
 */
export const validation_descuento = (
	descuento: number,
	origin: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate(`${origin}.descuento`, descuento, 'number', 14)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_precioTotalSinImpuesto
 * @param precioTotalSinImpuesto
 * @param origin
 * @returns
 */
export const validation_precioTotalSinImpuesto = (
	precioTotalSinImpuesto: number,
	origin: string
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Basic validation
		 */
		await attributeValidate(
			`${origin}.precioTotalSinImpuesto`,
			precioTotalSinImpuesto,
			'number',
			14
		)
			.then((response: boolean) => {
				resolve(response);
			})
			.catch((err: MessageAPI) => {
				reject(err);
			});
	});
};
/**
 * validation_infoAdicional
 * @param infoAdicional
 * @returns
 */
export const validation_infoAdicional = (
	infoAdicional: campoAdicional[]
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		let validationStatus: boolean = false;
		/**
		 * Logic attribute
		 */
		if (!infoAdicional) {
			reject(error_message('infoAdicional', 'EXISTENCE'));
		} else if (infoAdicional.length == 0) {
			reject(error_message('infoAdicional', 'LENGTH'));
		} else {
			/**
			 * Iterrar el infoAdicional
			 */
			infoAdicional.map(
				async (_campoAdicional: campoAdicional, index: number) => {
					let valuesObject: any = Object.values(_campoAdicional);
					/**
					 * Basic validation
					 */
					await attributeValidate(
						'infoAdicional.valor',
						valuesObject[0],
						'string',
						300
					).catch((err: MessageAPI) => {
						validationStatus = true;
						reject(err);
					});
					/**
					 * Return if an error has occurred
					 */
					if (validationStatus) {
						return;
					} else if (infoAdicional.length == index + 1) {
						resolve(true);
					}
				}
			);
		}
	});
};
/**
 * Is functions
 */

const is_TABLA_6 = (tipoIdentificacionComprador: TABLA_6): boolean => {
	return (
		tipoIdentificacionComprador === '04' ||
		tipoIdentificacionComprador === '05' ||
		tipoIdentificacionComprador === '06' ||
		tipoIdentificacionComprador === '07' ||
		tipoIdentificacionComprador === '08'
	);
};

const is_TABLA_16 = (codigo: TABLA_16): boolean => {
	return codigo === 2 || codigo === 3 || codigo === 5;
};

const is_TABLA_17 = (codigoPorcentaje: TABLA_17 | TABLA_18): boolean => {
	return (
		codigoPorcentaje === 0 ||
		codigoPorcentaje === 2 ||
		codigoPorcentaje === 3 ||
		codigoPorcentaje === 6 ||
		codigoPorcentaje === 7
	);
};

const is_TABLA_18 = (codigoPorcentaje: TABLA_18 | TABLA_17): boolean => {
	return (
		codigoPorcentaje === 3011 ||
		codigoPorcentaje === 3021 ||
		codigoPorcentaje === 3023 ||
		codigoPorcentaje === 3031 ||
		codigoPorcentaje === 3041 ||
		codigoPorcentaje === 3073 ||
		codigoPorcentaje === 3075 ||
		codigoPorcentaje === 3077 ||
		codigoPorcentaje === 3078 ||
		codigoPorcentaje === 3079 ||
		codigoPorcentaje === 3080 ||
		codigoPorcentaje === 3081 ||
		codigoPorcentaje === 3092 ||
		codigoPorcentaje === 3610 ||
		codigoPorcentaje === 3620 ||
		codigoPorcentaje === 3630 ||
		codigoPorcentaje === 3640 ||
		codigoPorcentaje === 3660 ||
		codigoPorcentaje === 3093 ||
		codigoPorcentaje === 3101 ||
		codigoPorcentaje === 3053 ||
		codigoPorcentaje === 3054 ||
		codigoPorcentaje === 3111 ||
		codigoPorcentaje === 3043 ||
		codigoPorcentaje === 3033 ||
		codigoPorcentaje === 3671 ||
		codigoPorcentaje === 3684 ||
		codigoPorcentaje === 3686 ||
		codigoPorcentaje === 3688 ||
		codigoPorcentaje === 3691 ||
		codigoPorcentaje === 3692 ||
		codigoPorcentaje === 3695 ||
		codigoPorcentaje === 3696 ||
		codigoPorcentaje === 3698 ||
		codigoPorcentaje === 3682 ||
		codigoPorcentaje === 3681 ||
		codigoPorcentaje === 3680 ||
		codigoPorcentaje === 3533 ||
		codigoPorcentaje === 3541 ||
		codigoPorcentaje === 3542 ||
		codigoPorcentaje === 3543 ||
		codigoPorcentaje === 3544 ||
		codigoPorcentaje === 3581 ||
		codigoPorcentaje === 3582 ||
		codigoPorcentaje === 3710 ||
		codigoPorcentaje === 3720 ||
		codigoPorcentaje === 3730 ||
		codigoPorcentaje === 3740 ||
		codigoPorcentaje === 3871 ||
		codigoPorcentaje === 3873 ||
		codigoPorcentaje === 3874 ||
		codigoPorcentaje === 3875 ||
		codigoPorcentaje === 3876 ||
		codigoPorcentaje === 3877 ||
		codigoPorcentaje === 3878 ||
		codigoPorcentaje === 3601 ||
		codigoPorcentaje === 3552 ||
		codigoPorcentaje === 3553 ||
		codigoPorcentaje === 3602 ||
		codigoPorcentaje === 3545 ||
		codigoPorcentaje === 3532 ||
		codigoPorcentaje === 3771 ||
		codigoPorcentaje === 3685 ||
		codigoPorcentaje === 3687 ||
		codigoPorcentaje === 3689 ||
		codigoPorcentaje === 3690 ||
		codigoPorcentaje === 3693 ||
		codigoPorcentaje === 3694 ||
		codigoPorcentaje === 3697 ||
		codigoPorcentaje === 3699 ||
		codigoPorcentaje === 3683
	);
};

const is_TABLA_24 = (formaPago: TABLA_24): boolean => {
	return (
		formaPago === '01' ||
		formaPago === '15' ||
		formaPago === '16' ||
		formaPago === '17' ||
		formaPago === '18' ||
		formaPago === '19' ||
		formaPago === '20' ||
		formaPago === '21'
	);
};
