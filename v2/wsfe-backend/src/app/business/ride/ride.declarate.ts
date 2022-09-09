import { Canvas, createCanvas, PNGStream } from 'canvas';
import fs, { WriteStream } from 'fs';
import JsBarcode from 'jsbarcode';
import path from 'path';
import { getSecuencialByAccessKey } from '../../../utils/accessKey';
import { FullDate } from '../../../utils/date';
import { generateImage2B64 } from '../../../utils/global';
import {
	BodyVoucher,
	detAdicional,
	detalle,
	TABLA_17,
	TABLA_18,
	totalImpuesto,
	ValoresExtras,
} from '../business.types';
import { Institution } from '../institution/institution.class';
import { Sequence } from '../sequence/sequence.class';
import { Taxpayer } from '../taxpayer/taxpayer.class';
import { Voucher } from '../voucher/voucher.class';
/**
 *  Función para generar el RIDE de acuerdo a la información ingresada
 * @param voucher
 * @param sequence
 * @param date
 * @param access_key_voucher
 * @param stringDate
 * @returns
 */
export const declarateRideVoucher_01 = (
	voucher: Voucher,
	sequence: Sequence,
	date: FullDate,
	access_key_voucher: string,
	stringDate: string
): Promise<string> => {
	return new Promise<string>(async (resolve, reject) => {
		const institution: Institution = sequence.institution;
		const taxpayer: Taxpayer = sequence.institution.taxpayer;
		const body_voucher: BodyVoucher = voucher.body_voucher;
		const finalSequence: string = getSecuencialByAccessKey(access_key_voucher);

		let b64Logo: string;
		/**
		 * Generar el código de barras para la factura
		 */
		await generateBARCODE_RIDE(access_key_voucher).catch((error) => {
			reject(error);
			return;
		});
		/**
		 * Generar Base64 de las imágenes que irán en el PDF
		 */
		const logo_path_setting_taxpayer: string =
			sequence.institution.taxpayer.setting_taxpayer
				.logo_path_setting_taxpayer!;
		const logo_path: string = `./file_store/logo/${logo_path_setting_taxpayer}`;
		if (fs.existsSync(logo_path)) {
			b64Logo = await generateImage2B64(
				`./file_store/logo/${logo_path_setting_taxpayer}`
			);
		} else {
			b64Logo = await generateImage2B64(`./file_store/logo/default.png`);
		}

		const b64BarCode: string = await generateImage2B64(
			`${path.resolve('./')}/${access_key_voucher}.png`
		);
		/**
		 * Impuestos
		 */
		const { IVA, ICE, IRBPNR } = checkImpuestos(body_voucher.totalConImpuestos);

		const detalles: detalle[] = body_voucher.detalles;
		const { htmlDetalles, totalSinImpuesto } = generateDetalles(detalles);

		let _IVA: string = '';
		let _SUBTOTAL_12: string = '';
		let _SUBTOTAL_0: string = '';
		let _TOTAL_DESCUENTO: number = body_voucher.totalDescuento;
		let _IMPORTE_TOTAL: number = body_voucher.importeTotal;
		/**
		 * Impuesto IVA
		 */
		if (IVA) {
			_IVA = GET_IVA(totalSinImpuesto, IVA.codigoPorcentaje);
			_SUBTOTAL_12 = GET_SUBTOTAL_12(totalSinImpuesto, IVA.codigoPorcentaje);
			_SUBTOTAL_0 = GET_SUBTOTAL_0(totalSinImpuesto, IVA.codigoPorcentaje);
		}
		/**
		 * Impuesto ICE
		 */
		/**
		 * Impuesto IRBPNR
		 */
		/**
		 * Impuestos
		 */
		/**
		 * infoAdicional
		 */
		const infoAdicional: detAdicional[] = body_voucher.infoAdicional!;
		const htmlInfoAdicional: string = generateInfoAdicional(infoAdicional);
		/**
		 * valoresExtras
		 */

		const valoresExtras: ValoresExtras = body_voucher.valoresExtras!;

		let tasaProcesamiento: number = 0;
		let interes: number = 0;
		let otros: number = 0;

		if (valoresExtras) {
			tasaProcesamiento = detalles.length * valoresExtras.tasaProcesamiento;
			interes = valoresExtras.interes;
			otros = valoresExtras.otros;
		}

		const business_name_taxpayer = taxpayer.business_name_taxpayer;
		const ruc_taxpayer = taxpayer.ruc_taxpayer;
		const download_note_setting_taxpayer =
			taxpayer.setting_taxpayer.download_note_setting_taxpayer;
		/**
		 * TOTAL_TO_PAY
		 */
		const TOTAL_TO_PAY = (
			_IMPORTE_TOTAL +
			detalles.length * tasaProcesamiento +
			valoresExtras.interes +
			valoresExtras.otros
		).toFixed(2);
		/**
		 * Resolve HTML
		 */
		resolve(`<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            ${STYLES_01}
        </head>
        <body>
            <div class="factura">
                <div class="header">
                    <div class="infoNegocio">
                        <div class="logo">
                            <img src="data:image/png;base64, ${b64Logo}" alt="logo">
                        </div>
                        <div class="info">
                            <h3>${taxpayer.business_name_taxpayer}</h3>
                            <div class="dirMatriz">
                                <h4 class="titleInfo">DIRECCIÓN MATRIZ:</h4>
                                <p>${taxpayer.dir_matriz_taxpayer}</p>
                            </div>
                            <div class="obligadoContabilidad">
                                <h4 class="titleInfo">OBLIGADO A LLEVAR CONTABILIDAD:</h4>
                                <p>${taxpayer.accounting_obliged}</p>
                            </div>
                        </div>
                    </div>
                    <div class="infoFactura">
                        <div class="ruc">
                            <p class="titleInfo">R.U.C.:</p>
                            <p>${taxpayer.ruc_taxpayer}</p>
                        </div>
                        <div class="facturaInfo">
                            <h1>FACTURA N°</h1>
                            <p>${sequence.establishment.value_establishment}-${
			sequence.emission_point.value_emission_point
		}-${finalSequence}</p>
                        </div>
                        <div class="numeroAutorizacion">
                            <h1>NÚMERO DE AUTORIZACIÓN</h1>
                            <p>${access_key_voucher}</p>
                        </div>
                        <div class="fechaAutorizacion">
                            <h1>FECHA Y HORA DE AUTORIZACIÓN</h1>
                            <p>${stringDate}</p>
                        </div>
                        <div class="ambiente">
                            <p class="titleInfo">AMBIENTE:</p>
                            <p>${
															institution.type_environment == '1'
																? 'PRUEBAS'
																: 'PRODUCCIÓN'
														}</p>
                        </div>
                        <div class="emision">
                            <p class="titleInfo">EMISIÓN:</p>
                            <p>${
															taxpayer.type_emission == '1' ? 'NORMAL' : ''
														}</p>
                        </div>
                        <div class="access_key_voucher">
                            <h1>CLAVE DE ACCESO</h1>
                            <p>${access_key_voucher}</p>
                            <div class="containerBarCode">
                                <img src="data:image/png;base64, ${b64BarCode}" alt="codigo de barras">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="detailsClient">
                    <div class="row">
                        <div class="razonSocialComprador">
                            <p class="resetMaringP"><strong>Razón Social/ Nombres Y Apellidos: </strong> ${
															body_voucher.razonSocialComprador
														}</p>
                        </div>
                        <div class="identificacionComprador">
                            <p class="resetMaringP"><strong>Identificación: </strong>${
															body_voucher.identificacionComprador
														}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="fechaEmision">
                            <p class="resetMaringP"><strong>Fecha de Emisión: </strong>${
															date.day
														}/${date.month}/${date.fullYear}</p>
                        </div>
                        <div class="guiaRemision">
                            <p class="resetMaringP"><strong>Guia de Remisión: </strong>${
															body_voucher.guiaRemision
																? body_voucher.guiaRemision
																: ''
														}</p>
                        </div>
                    </div>
                </div>
                <div class="details">
                    <table>
                        <thead>
                            <tr>
                                <th class="codigo">Código</th>
                                <th class="cantidad">Cantidad</th>
                                <th class="descripcion">Descripción</th>
                                <th class="precioUnitario">Precio Unitario</th>
                                <th class="Descuento">Descuento</th>
                                <th class="precioTotal">Precio Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${htmlDetalles}
                        </tbody>
                    </table>
                    <div class="secondSectionDetails">
                        <div class="informacionAdicional">
                            <h1>Información Adicional</h1>
                            <table>
                                <tbody>
                                    ${htmlInfoAdicional}
                                </tbody>
                            </table>
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <th class="firsColunm">SUBTOTAL 12%</th>
                                    <th>${_SUBTOTAL_12}</th>
                                </tr>
                                <tr>
                                    <th class="firsColunm">SUBTOTAL 0%</th>
                                    <th>${_SUBTOTAL_0}</th>
                                </tr>
                                <tr>
                                    <th class="firsColunm">TOTAL Descuento</th>
                                    <th>${_TOTAL_DESCUENTO.toFixed(2)}</th>
                                </tr>
                                <tr>
                                    <th class="firsColunm">IVA 12%</th>
                                    <th>${_IVA}</th>
                                </tr>
                                <tr>
                                    <th class="firsColunm">Valor de la Factura</th>
                                    <th>${_IMPORTE_TOTAL}</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                ${
									valoresExtras
										? `
                    <div class="valoresExtras">
                    <h1>${business_name_taxpayer}</h1>
                    <p>${ruc_taxpayer}</p>
                    <div class="linea"></div>
                    <p>VALORES EXTRAS</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Procesamiento</th>
                                <th>${tasaProcesamiento.toFixed(2)}</th>
                                <th>Interes</th>
                                <th>${interes.toFixed(2)}</th>
                                <th>Otros</th>
                                <th>${otros.toFixed(2)}</th>
                                <th class="totalSinImpuesto">TOTAL A PAGAR: ${TOTAL_TO_PAY}</th>
                            </tr>
                        </thead>
                    </table>
                </div>`
										: ``
								}
                <div class="nota" style="${
									valoresExtras ? '' : 'padding-top: 50px;'
								}">
                    <p style="font-weight: bold;">Esta factura puede rectificarse y darse de baja</p>
                    <p style="color: #0F172A">${download_note_setting_taxpayer}</p>
                </div>
            </div>
        </body>
        </html>
        `);
	});
};
/**
 * Función para generar el HTML del detalle
 * @param detalles
 * @returns
 */
const generateDetalles = (detalles: detalle[]): returnGenerateDetalles => {
	let htmlDetalles: string = '';
	let totalSinImpuesto: number = 0;

	if (detalles.length > 0) {
		detalles.map((_detalle: detalle) => {
			htmlDetalles += `<tr>
                <th>${_detalle.codigoPrincipal.trim()}</th>
                <th>${_detalle.cantidad}</th>
                <th>${_detalle.descripcion.trim()}</th>
                <th>${_detalle.precioUnitario.toFixed(2)}</th>
                <th>${_detalle.descuento.toFixed(2)}</th>
                <th>${_detalle.precioTotalSinImpuesto.toFixed(2)}</th>
            </tr>
            `;
			totalSinImpuesto += _detalle.precioTotalSinImpuesto;
		});
	}

	return { htmlDetalles, totalSinImpuesto };
};
/**
 * Función para generar el HTML de la información adicional
 * @param infoAdicional
 * @returns
 */
const generateInfoAdicional = (infoAdicional: detAdicional[]): string => {
	let htmlInfoAdicional: string = '';

	if (infoAdicional.length > 0) {
		infoAdicional.map((_detAdicional: detAdicional) => {
			let keysObject = Object.keys(_detAdicional);
			let valuesObject = Object.values(_detAdicional);
			htmlInfoAdicional += `<tr>
                <th>${keysObject}</th>
                <th class="padding-left">${valuesObject}</th>
            </tr>
            `;
		});
	}

	return htmlInfoAdicional;
};
/**
 * Función para generar el código de barras de acuerdo con la clave de acceso
 * @param access_key_voucher
 * @returns
 */
const generateBARCODE_RIDE = (access_key_voucher: string): Promise<boolean> => {
	return new Promise<boolean>((resolve, reject) => {
		try {
			const canvas: Canvas = createCanvas(100, 100);
			JsBarcode(canvas, access_key_voucher, {
				displayValue: false,
			});

			const writeStream: WriteStream = fs.createWriteStream(
				path.resolve('./') + `/${access_key_voucher}.png`
			);
			const pngStream: PNGStream = canvas.createPNGStream();
			pngStream.pipe(writeStream);
			writeStream.on('finish', () => resolve(true));
		} catch (error: any) {
			reject(error.toString());
		}
	});
};
/**
 * Types
 */
export interface returnGenerateDetalles {
	htmlDetalles: string;
	totalSinImpuesto: number;
}
/**
 * checkImpuestos
 * @param totalConImpuestos
 */
const checkImpuestos = (
	totalConImpuestos: totalImpuesto[]
): { IVA: totalImpuesto; ICE: totalImpuesto; IRBPNR: totalImpuesto } => {
	let IVA!: totalImpuesto;
	let ICE!: totalImpuesto;
	let IRBPNR!: totalImpuesto;
	totalConImpuestos.map((_totalImpuesto: totalImpuesto, index: number) => {
		if (_totalImpuesto.codigo == 2) {
			IVA = {
				..._totalImpuesto,
				enabled: true,
			};
		} else if (_totalImpuesto.codigo == 3) {
			ICE = {
				..._totalImpuesto,
				enabled: true,
			};
		} else if (_totalImpuesto.codigo == 5) {
			IRBPNR = {
				..._totalImpuesto,
				enabled: true,
			};
		}
		if (totalConImpuestos.length === index + 1) {
			return { IVA, ICE, IRBPNR };
		}
	});

	return { IVA, ICE, IRBPNR };
};
/**
 * GET_IVA
 * @param totalSinImpuesto
 * @param codigoPorcentaje
 * @returns
 */
const GET_IVA = (
	totalSinImpuesto: number,
	codigoPorcentaje: TABLA_17 | TABLA_18
): string => {
	const porcentajeIva2: number = 12;
	const porcentajeIva3: number = 14;
	return codigoPorcentaje === 2
		? `${(totalSinImpuesto * (porcentajeIva2 / 100)).toFixed(2)}`
		: codigoPorcentaje === 3
		? `${(totalSinImpuesto * (porcentajeIva3 / 100)).toFixed(2)}`
		: '0.00';
};
/**
 * GET_SUBTOTAL_12
 * @param totalSinImpuesto
 * @param codigoPorcentaje
 * @returns
 */
const GET_SUBTOTAL_12 = (
	totalSinImpuesto: number,
	codigoPorcentaje: TABLA_17 | TABLA_18
): string => {
	return codigoPorcentaje == 0 ? `0.00` : `${totalSinImpuesto.toFixed(2)}`;
};
/**
 * GET_SUBTOTAL_0
 * @param totalSinImpuesto
 * @param codigoPorcentaje
 * @returns
 */
const GET_SUBTOTAL_0 = (
	totalSinImpuesto: number,
	codigoPorcentaje: TABLA_17 | TABLA_18
): string => {
	return codigoPorcentaje == 0 ? `${totalSinImpuesto.toFixed(2)}` : `0.00`;
};
/**
 * STYLES_01
 */
const STYLES_01: string = `<style>
body {
    display: flex;
    align-items: center;
    background-color: gray;
    justify-content: center;
    font-family: Arial, Helvetica, sans-serif;
}
.factura {
    width: 930px;
    height: auto;
    background-color: white;
    padding: 30px;
    padding-top: 20px;
}
.factura>.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.factura>.header>.infoNegocio {
    width: 46.5%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}
.factura>.header>.infoNegocio>.logo {
    height: 60%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.factura>.header>.infoNegocio>.logo>img {
    width: 80%;
}
.factura>.header>.infoNegocio>.info {
    height: 40%;
    border: solid 1px black;
    border-radius: 15px;
    padding: 10px
}
.factura>.header>.infoNegocio>.info>h3 {
    text-align: center;
    font-size: 14px;
    margin: 5px 0px;
    font-weight: 600;
}
.factura>.header>.infoNegocio>.info>.dirMatriz {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: 400;
}
.factura>.header>.infoNegocio>.info>.dirMatriz>h4 {
    margin: 15px 0px;
}
.factura>.header>.infoNegocio>.info>.dirMatriz>p {
    margin: 15px 0px;
}
.factura>.header>.infoNegocio>.info>.obligadoContabilidad {
    display: flex;
    align-items: center;
    font-size: 12px;
}
.factura>.header>.infoNegocio>.info>.obligadoContabilidad>h4 {
    margin: 15px 0px;
}
.factura>.header>.infoNegocio>.info>.obligadoContabilidad>p {
    margin: 15px 0px;
}
.factura>.header>.infoFactura {
    width: 46.5%;
    border: solid 1px black;
    border-radius: 15px;
    padding: 20px;
}
.titleInfo {
    padding-right: 5px;
}
.factura>.header>.infoFactura>.ruc {
    display: flex;
    flex-direction: row;
    font-size: 14;
}
.factura>.header>.infoFactura>.ruc>p {
    margin: 5px 0px;
    font-size: 14px;
}
.factura>.header>.infoFactura>.facturaInfo {
    display: flex;
    flex-direction: column;
    margin: 5px 0px;
}
.factura>.header>.infoFactura>.facturaInfo>h1 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
}
.factura>.header>.infoFactura>.facturaInfo>p {
    margin: 5px 0px;
    font-size: 14;
}
.factura>.header>.infoFactura>.numeroAutorizacion {
    display: flex;
    flex-direction: column;
    margin: 5px 0px;
}
.factura>.header>.infoFactura>.numeroAutorizacion>h1 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    text-align: center;
}
.factura>.header>.infoFactura>.numeroAutorizacion>p {
    margin: 5px 0px;
    font-size: 12.5px;
    text-align: center;
}
.factura>.header>.infoFactura>.fechaAutorizacion {
    display: flex;
    flex-direction: row;
    margin: 5px 0px;
    align-items: center;
    justify-content: space-between;
}
.factura>.header>.infoFactura>.fechaAutorizacion>h1 {
    width: 40%;
    margin: 0;
    font-size: 14px;
    font-weight: 400;
}
.factura>.header>.infoFactura>.fechaAutorizacion>p {
    font-size: 14px;
    font-weight: 400;
}
.factura>.header>.infoFactura>.ambiente {
    display: flex;
    flex-direction: row;
}
.factura>.header>.infoFactura>.ambiente>p {
    margin: 5px 0px;
    font-size: 14px;
}
.factura>.header>.infoFactura>.emision {
    display: flex;
    flex-direction: row;
}
.factura>.header>.infoFactura>.emision>p {
    margin: 5px 0px;
    font-size: 14px;
}
.factura>.header>.infoFactura>.access_key_voucher {
    display: flex;
    flex-direction: column;
}
.factura>.header>.infoFactura>.access_key_voucher>h1 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    text-align: center;
}
.factura>.header>.infoFactura>.access_key_voucher>p {
    margin: 5px 0px;
    text-align: center;
    font-size: 12.5px;
}
.factura>.header>.infoFactura>.access_key_voucher>.containerBarCode>img {
    width: 100%;
}
.factura>.detailsClient {
    width: calc(100% - 30px);
    border: solid 1px black;
    border-radius: 15px;
    margin: 10px 0px;
    padding: 15px;
}
.factura>.detailsClient>.row {
    display: flex;
}
.factura>.detailsClient>.row>.razonSocialComprador {
    width: 70%;
}
.factura>.detailsClient>.row>.razonSocialComprador>p {
    font-size: 12px;
}
.factura>.detailsClient>.row>.identificacionComprador {
    width: 30%;
}
.factura>.detailsClient>.row>.identificacionComprador>p {
    font-size: 12px;
}
.factura>.detailsClient>.row>.fechaEmision {
    width: 70%;
}
.factura>.detailsClient>.row>.fechaEmision>p {
    font-size: 12px;
}
.factura>.detailsClient>.row>.guiaRemision {
    width: 30%;
}
.factura>.detailsClient>.row>.guiaRemision>p {
    font-size: 12px;
}
.resetMaringP {
    margin: 5px;
}
.factura>.details>table {
    border-collapse: collapse;
    width: 100%;
}
.factura>.details>table>thead>tr>th {
    font-size: 12px;
    padding: 10px 0px;
    text-align: center;
    border: solid 1px black;
}
.factura>.details>table>thead>tr>.codigo {
    width: 10%;
}
.factura>.details>table>thead>tr>.cantidad {
    width: 10%;
}
.factura>.details>table>thead>tr>.descripcion {
    width: 40%;
}
.factura>.details>table>thead>tr>.precioUnitario {
    width: 15%;
}
.factura>.details>table>thead>tr>.Descuento {
    width: 10%;
}
.factura>.details>table>thead>tr>.precioTotal {
    width: 15%;
}
.factura>.details>table>tbody>tr>th {
    padding: 10px 5px;
    font-size: 12px;
    font-weight: 300;
    border: solid 1px black;
}
.factura>.details>.secondSectionDetails {
    display: flex;
    margin: 10px 0px;
}
.factura>.details>.secondSectionDetails>.informacionAdicional {
    width: 55.5%;
    height: 10%;
    border: solid 1px black;
    margin-right: 10px;
    padding: 15px;
}
.factura>.details>.secondSectionDetails>.informacionAdicional>h1 {
    font-size: 14px;
    font-weight: 700;
}
.factura>.details>.secondSectionDetails>.informacionAdicional>table>tbody>tr>th {
    font-size: 12px;
    font-weight: 300;
    text-align: left;
}
.factura>.details>.secondSectionDetails>table {
    width: 40%;
    border-collapse: collapse;
}
.factura>.details>.secondSectionDetails>table>tbody>tr>th {
    border: solid 1px black;
    padding: 10px 0px;
    font-size: 12px;
    font-weight: 300;
}
.factura>.details>.secondSectionDetails>table>tbody>tr>.firsColunm {
    width: 62.5%;
    font-weight: 700;
}
.padding-left {
    padding-left: 10px;
}
.factura>.valoresExtras {
    width: calc(100% - 10px);
    border: solid 1px black;
    border-radius: 15px;
    padding: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.factura>.valoresExtras>h1 {
    font-size: 14px;
    text-align: center;
    font-weight: 300;
    margin: 5px;
}
.factura>.valoresExtras>p {
    font-size: 12px;
    text-align: center;
    font-weight: 700;
    margin: 5px;
}
.factura>.valoresExtras>.linea {
    width: 90%;
    height: 0px;
    border: solid 2px black;
    margin: 5px;
}
.factura>.valoresExtras>table {
    width: 90%;
    margin: 5px;
}
.factura>.valoresExtras>table>thead>tr>th {
    text-align: left;
    padding: 10px 0px;
    font-size: 12px
}
.factura>.valoresExtras>table>thead>tr>.totalSinImpuesto {
    text-align: center;
    border: solid 1px black;
}
.factura>.nota {
    width: 100%;
}
.factura>.nota>p {
    text-align: center;
    font-size: 12px;
}
</style>`;
