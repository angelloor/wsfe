import { MessageAPI } from '../../../../utils/message/message.type';
import { BodyVoucher } from '../../business.types';
import {
	validation_direccionComprador,
	validation_guiaRemision,
	validation_identificacionComprador,
	validation_importeTotal,
	validation_moneda,
	validation_propina,
	validation_razonSocialComprador,
	validation_tipoIdentificacionComprador,
	validation_totalDescuento,
	validation_totalSinImpuestos,
	validation_valoresExtras,
	validation_valorRetIva,
	validation_valorRetRenta,
} from './global';

export const validationVoucher_01 = (
	body_voucher: BodyVoucher
): Promise<boolean> => {
	return new Promise<boolean>(async (resolve, reject) => {
		/**
		 * Validation tipoIdentificacionComprador
		 */
		await validation_tipoIdentificacionComprador(
			body_voucher.tipoIdentificacionComprador
		).catch((error: MessageAPI) => {
			reject(error);
		});
		/**
		 * Validation guiaRemision
		 */
		if (body_voucher.guiaRemision) {
			await validation_guiaRemision(body_voucher.guiaRemision).catch(
				(error: MessageAPI) => {
					reject(error);
				}
			);
		}
		/**
		 * Validation razonSocialComprador
		 */
		await validation_razonSocialComprador(
			body_voucher.razonSocialComprador,
			body_voucher.tipoIdentificacionComprador
		).catch((error: MessageAPI) => {
			reject(error);
		});
		/**
		 * Validation identificacionComprador
		 */
		await validation_identificacionComprador(
			body_voucher.identificacionComprador,
			body_voucher.tipoIdentificacionComprador
		).catch((error: MessageAPI) => {
			reject(error);
		});
		/**
		 * Validation direccionComprador
		 */
		if (body_voucher.direccionComprador) {
			await validation_direccionComprador(
				body_voucher.direccionComprador
			).catch((error: MessageAPI) => {
				reject(error);
			});
		}
		/**
		 * Validation totalSinImpuestos
		 */
		await validation_totalSinImpuestos(body_voucher.totalSinImpuestos).catch(
			(error: MessageAPI) => {
				reject(error);
			}
		);
		/**
		 * Validation totalDescuento
		 */
		await validation_totalDescuento(body_voucher.totalDescuento).catch(
			(error: MessageAPI) => {
				reject(error);
			}
		);
		/**
		 * Validation propina
		 */
		await validation_propina(body_voucher.propina).catch(
			(error: MessageAPI) => {
				reject(error);
			}
		);
		/**
		 * Validation importeTotal
		 */
		await validation_importeTotal(body_voucher.importeTotal).catch(
			(error: MessageAPI) => {
				reject(error);
			}
		);
		/**
		 * Validation moneda
		 */
		if (body_voucher.moneda) {
			await validation_moneda(body_voucher.moneda).catch(
				(error: MessageAPI) => {
					reject(error);
				}
			);
		}
		/**
		 * Validation valorRetIva
		 */
		if (body_voucher.valorRetIva) {
			await validation_valorRetIva(body_voucher.valorRetIva).catch(
				(error: MessageAPI) => {
					reject(error);
				}
			);
		}
		if (body_voucher.valorRetRenta) {
			/**
			 * Validation valorRetRenta
			 */
			await validation_valorRetRenta(body_voucher.valorRetRenta).catch(
				(error: MessageAPI) => {
					reject(error);
				}
			);
		}
		/**
		 * Validation valoresExtras
		 */
		if (body_voucher.valoresExtras) {
			await validation_valoresExtras(body_voucher.valoresExtras).catch(
				(error: MessageAPI) => {
					reject(error);
				}
			);
		}
		resolve(true);
	});
};
