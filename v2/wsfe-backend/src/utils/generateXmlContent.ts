import {
	campoAdicional,
	detAdicional,
	detalle,
	impuesto,
	pago,
	totalImpuesto,
} from '../app/business/business.types';
import {
	validation_detalles,
	validation_infoAdicional,
	validation_pagos,
	validation_totalConImpuestos,
} from '../app/business/voucher/validations/global';
import { deleteAmpersand } from './global';
import { MessageAPI } from './message/message.type';
/**
 * Función para generar el contenido XML de TotalConImpuestos
 */
export const generateTotalConImpuestos = (
	totalConImpuestos: totalImpuesto[]
) => {
	return new Promise<string>(async (resolve, reject) => {
		/**
		 * Validation totalConImpuestos
		 */
		await validation_totalConImpuestos(totalConImpuestos)
			.then(async () => {
				let _totalConImpuestos: string = ``;
				totalConImpuestos.map(async (_totalImpuesto: totalImpuesto) => {
					/**
					 * Generate xml string
					 */
					_totalConImpuestos += `<totalImpuesto>
						<codigo>${_totalImpuesto.codigo}</codigo>
						<codigoPorcentaje>${_totalImpuesto.codigoPorcentaje}</codigoPorcentaje>
						${
							_totalImpuesto.descuentoAdicional
								? `<descuentoAdicional>${_totalImpuesto.descuentoAdicional}</descuentoAdicional>`
								: ``
						}
						<baseImponible>${_totalImpuesto.baseImponible}</baseImponible>
						<valor>${_totalImpuesto.valor}</valor>
					</totalImpuesto>`;
				});
				resolve(_totalConImpuestos);
			})
			.catch((error: MessageAPI) => {
				reject(error);
			});
	});
};
/**
 * Función para generar el contenido XML de pagos
 */
export const generatePagos = (pagos: pago[]) => {
	return new Promise<string>(async (resolve, reject) => {
		/**
		 * Validation pagos
		 */
		await validation_pagos(pagos)
			.then(async () => {
				let _pagos: string = ``;
				pagos.map(async (_pago: pago) => {
					/**
					 * Generate xml string
					 */
					_pagos += `<pago>
							<formaPago>${_pago.formaPago}</formaPago>
							<total>${_pago.total}</total>
							${_pago.plazo ? `<plazo>${_pago.plazo}</plazo>` : ``}
							${
								_pago.unidadTiempo
									? `<unidadTiempo>${_pago.unidadTiempo.trim()}</unidadTiempo>`
									: ``
							}
						</pago>`;
				});
				resolve(_pagos);
			})
			.catch((error: MessageAPI) => {
				reject(error);
			});
	});
};
/**
 * Función para generar el contenido XML de detalle
 */
export const generateDetalle = (detalles: detalle[]) => {
	return new Promise<string>(async (resolve, reject) => {
		/**
		 * Validation detalles
		 */
		await validation_detalles(detalles)
			.then(async () => {
				let _impuestos: string = ``;
				let _detallesAdicionales: string = ``;
				let _detalles: string = ``;

				detalles.map(async (_detalle: detalle) => {
					/**
					 * Generate impuestos
					 */
					_detalle.impuestos.map(async (_impuesto: impuesto) => {
						_impuestos += `<impuesto>
                    <codigo>${_impuesto.codigo}</codigo>
                    <codigoPorcentaje>${_impuesto.codigoPorcentaje}</codigoPorcentaje>
                    <tarifa>${_impuesto.tarifa}</tarifa>
                    <baseImponible>${_impuesto.baseImponible}</baseImponible>
                    <valor>${_impuesto.valor}</valor>
                </impuesto>`;
					});
					/**
					 * Generate detallesAdicionales
					 */
					if (_detalle.detallesAdicionales) {
						_detalle.detallesAdicionales!.map(
							async (_detAdicional: detAdicional) => {
								let keysObject = Object.keys(_detAdicional);
								let valuesObject: any = Object.values(_detAdicional);
								_detallesAdicionales += `<detAdicional nombre="${keysObject[0]}" valor="${valuesObject[0]}"/>`;
							}
						);
					}
					/**
					 * Generate detalles
					 */
					_detalles += `<detalle>
                <codigoPrincipal>${_detalle.codigoPrincipal.trim()}</codigoPrincipal>
                ${
									_detalle.codigoAuxiliar
										? `<codigoAuxiliar>${deleteAmpersand(
												_detalle.codigoAuxiliar.trim()
										  )}</codigoAuxiliar>`
										: ``
								}
                <descripcion>${deleteAmpersand(
									_detalle.descripcion.trim()
								)}</descripcion>
                <cantidad>${_detalle.cantidad}</cantidad>
                <precioUnitario>${_detalle.precioUnitario}</precioUnitario>
                <descuento>${_detalle.descuento}</descuento>
                <precioTotalSinImpuesto>${
									_detalle.precioTotalSinImpuesto
								}</precioTotalSinImpuesto>
                ${
									_detalle.detallesAdicionales &&
									_detalle.detallesAdicionales.length != 0
										? `<detallesAdicionales>
                    ${_detallesAdicionales}
                </detallesAdicionales>`
										: ``
								}
                <impuestos>
                    ${_impuestos}
                </impuestos>
		    </detalle>`;
					_impuestos = '';
				});
				resolve(_detalles);
			})
			.catch((error: MessageAPI) => {
				reject(error);
			});
	});
};
/**
 * Función para generar el contenido XML de InfoAdicional
 */
export const generateInfoAdicional = (infoAdicional: campoAdicional[]) => {
	return new Promise<string>(async (resolve, reject) => {
		/**
		 * Validation infoAdicional
		 */
		await validation_infoAdicional(infoAdicional)
			.then(async () => {
				let _infoAdicional: string = ``;
				infoAdicional.map(async (_campoAdicional: campoAdicional) => {
					let keysObject = Object.keys(_campoAdicional);
					let valuesObject: any = Object.values(_campoAdicional);
					/**
					 * Generate xml string
					 */
					_infoAdicional += `<campoAdicional nombre="${keysObject[0]}">${
						valuesObject[0].trim() === '' ? 'S/D' : valuesObject[0].trim()
					}</campoAdicional>`;
				});
				resolve(_infoAdicional);
			})
			.catch((error: MessageAPI) => {
				reject(error);
			});
	});
};
