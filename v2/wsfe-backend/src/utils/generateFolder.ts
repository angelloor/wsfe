import fs from 'fs';
import { TYPE_ENVIRONMENT, TYPE_VOUCHER } from '../app/business/business.types';
import { FullDate } from './date';
/**
 * Función para generar las carpetas en el servidor según el año, mes actual y clave de acceso
 */
export const generateFolder = (
	id_taxpayer: number,
	id_institution: number,
	type_environment: TYPE_ENVIRONMENT,
	type_voucher: TYPE_VOUCHER,
	date: FullDate,
	access_key_voucher: string
): void => {
	/**
	 * Generate folder file_store
	 */
	if (!fs.existsSync('./file_store')) {
		fs.mkdirSync('./file_store');
	}
	/**
	 * Generate folder electronic_voucher
	 */
	if (!fs.existsSync('./file_store/electronic_voucher')) {
		fs.mkdirSync('./file_store/electronic_voucher');
	}
	/**
	 * Generate folder taxpayer
	 */
	if (!fs.existsSync(`./file_store/electronic_voucher/${id_taxpayer}`)) {
		fs.mkdirSync(`./file_store/electronic_voucher/${id_taxpayer}`);
	}
	/**
	 * Generate folder institution
	 */
	if (
		!fs.existsSync(
			`./file_store/electronic_voucher/${id_taxpayer}/${id_institution}`
		)
	) {
		fs.mkdirSync(
			`./file_store/electronic_voucher/${id_taxpayer}/${id_institution}`
		);
	}
	/**
	 * Generate folder type_environment
	 */
	if (
		!fs.existsSync(
			`./file_store/electronic_voucher/${id_taxpayer}/${id_institution}/${type_environment}`
		)
	) {
		fs.mkdirSync(
			`./file_store/electronic_voucher/${id_taxpayer}/${id_institution}/${type_environment}`
		);
	}
	/**
	 * Generate folder type_voucher
	 */
	if (
		!fs.existsSync(
			`./file_store/electronic_voucher/${id_taxpayer}/${id_institution}/${type_environment}/${type_voucher}`
		)
	) {
		fs.mkdirSync(
			`./file_store/electronic_voucher/${id_taxpayer}/${id_institution}/${type_environment}/${type_voucher}`
		);
	}
	/**
	 * Generate folder fullYear
	 */
	if (
		!fs.existsSync(
			`./file_store/electronic_voucher/${id_taxpayer}/${id_institution}/${type_environment}/${type_voucher}/${date.fullYear}`
		)
	) {
		fs.mkdirSync(
			`./file_store/electronic_voucher/${id_taxpayer}/${id_institution}/${type_environment}/${type_voucher}/${date.fullYear}`
		);
	}
	/**
	 * Generate folder month
	 */
	if (
		!fs.existsSync(
			`./file_store/electronic_voucher/${id_taxpayer}/${id_institution}/${type_environment}/${type_voucher}/${date.fullYear}/${date.month}`
		)
	) {
		fs.mkdirSync(
			`./file_store/electronic_voucher/${id_taxpayer}/${id_institution}/${type_environment}/${type_voucher}/${date.fullYear}/${date.month}`
		);
	}
	/**
	 * Generate folder access_key_voucher
	 */
	if (
		!fs.existsSync(
			`./file_store/electronic_voucher/${id_taxpayer}/${id_institution}/${type_environment}/${type_voucher}/${date.fullYear}/${date.month}/${access_key_voucher}`
		)
	) {
		fs.mkdirSync(
			`./file_store/electronic_voucher/${id_taxpayer}/${id_institution}/${type_environment}/${type_voucher}/${date.fullYear}/${date.month}/${access_key_voucher}`
		);
	}
};
