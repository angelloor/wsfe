import {
	TYPE_EMISSION,
	TYPE_ENVIRONMENT,
	TYPE_VOUCHER,
} from '../app/business/business.types';
import { FullDate } from './date';
/**
 * Función para generar la clave de acceso de 49 dígitos
 */
export const generateAccessKey = (
	todayDate: FullDate,
	type_voucher: TYPE_VOUCHER,
	ruc_taxpayer: string,
	type_environment: TYPE_ENVIRONMENT,
	serie: string,
	finalSequence: string,
	number_code_sequence: string,
	type_emission: TYPE_EMISSION
): string => {
	const previousAccessKey = `${todayDate.day}${todayDate.month}${todayDate.fullYear}${type_voucher}${ruc_taxpayer}${type_environment}${serie}${finalSequence}${number_code_sequence}${type_emission}`;
	return `${previousAccessKey}${generateCheckDigit(previousAccessKey)}`;
};
/**
 * Función para generar el digito Verificador mediante el algoritmo modulo 11
 */
export const generateCheckDigit = (previousAccessKey: string): number => {
	const numString: string = previousAccessKey.toString();
	const numLenght: number = numString.length;
	const multiplier: number[] = [2, 3, 4, 5, 6, 7];
	let totalAmount: number = 0;
	let positionMultiplier: number = 0;

	for (let i = numLenght; i > 0; i--) {
		let num: string = numString.charAt(i - 1);
		totalAmount += parseInt(num) * multiplier[positionMultiplier];
		positionMultiplier += 1;
		if (positionMultiplier == 6) {
			positionMultiplier = 0;
		}
	}
	const mod: number = totalAmount % 11;
	let checkDigit: number = 11 - mod;

	if (checkDigit == 10) {
		checkDigit = 1;
	}
	if (checkDigit == 11) {
		checkDigit = 0;
	}
	return checkDigit;
};
/**
 * Obtener el coddoc ingresando la clave de acceso
 */
export const getCodDocByAccessKey = (accessKey: string): TYPE_VOUCHER | any => {
	return accessKey.slice(8, 10);
};
/**
 * Obtener el secuencial ingresando la clave de acceso
 */
export const getSecuencialByAccessKey = (accessKey: string): string => {
	return accessKey.slice(30, 39);
};
/**
 * Obtener el ambiente ingresando la clave de acceso
 */
export const getEnvironmentByAccessKey = (accessKey: string): string => {
	return accessKey.slice(23, 24);
};
/**
 * Obtener el año ingresando la clave de acceso
 */
export const getFullYearByAccessKey = (accessKey: string): string => {
	return accessKey.slice(4, 8);
};
/**
 * Obtener el año ingresando la clave de acceso
 */
export const getMothByAccessKey = (accessKey: string): string => {
	return accessKey.slice(2, 4);
};
