import {
	ResponseAutorizacionComprobante,
	ResponseRecepcionComprobante,
} from '../app/business/business.types';

var soap = require('soap');
/**
 * Función para consumir el servicio SOAP validarComprobante del SRI
 */
export const validarComprobante = (
	url: string,
	xmlByte: string
): Promise<ResponseRecepcionComprobante> => {
	return new Promise<ResponseRecepcionComprobante>((resolve, reject) => {
		var args = { xml: xmlByte };
		soap.createClient(url, (err: any, client: any) => {
			try {
				client.validarComprobante(
					args,
					(
						err: any,
						_responseRecepcionComprobante: ResponseRecepcionComprobante
					) => {
						resolve(_responseRecepcionComprobante);
					}
				);
			} catch (error: any) {
				reject(error.toString());
			}
		});
	});
};
/**
 * Función para consumir el servicio SOAP autorizacionComprobante del SRI
 */
export const autorizacionComprobante = (
	url: string,
	claveAcceso: string
): Promise<ResponseAutorizacionComprobante> => {
	return new Promise<ResponseAutorizacionComprobante>((resolve, reject) => {
		var args = { claveAccesoComprobante: claveAcceso };
		soap.createClient(url, (err: any, client: any) => {
			try {
				client.autorizacionComprobante(
					args,
					(
						err: any,
						_responseAutorizacionComprobante: ResponseAutorizacionComprobante
					) => {
						resolve(_responseAutorizacionComprobante);
					}
				);
			} catch (error: any) {
				reject(error.toString());
			}
		});
	});
};
