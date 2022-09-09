import { createCanvas } from 'canvas';
import dotenv from 'dotenv';
import fs from 'fs';
import JsBarcode from 'jsbarcode';
import path from 'path';
import puppeteer, { Browser, Page } from 'puppeteer';
import { FullDate } from '../../../utils/date';
import { Sequence } from '../sequence/sequence.class';
import { Voucher } from '../voucher/voucher.class';
import { declarateRideVoucher_01 } from './ride.declarate';

dotenv.config({
	path: path.join(path.resolve('./env'), process.env.NODE_ENV + '.env'),
});

export class Ride {
	/** Attributes */
	public voucher!: Voucher;
	public sequence!: Sequence;
	public date!: FullDate;
	public access_key_voucher!: string;
	public stringDateAuthorization!: string;
	public base_path_vocher!: string;

	/** Constructor */
	constructor() {}

	/** Setters and Getters */
	set _voucher(voucher: Voucher) {
		this.voucher = voucher;
	}
	get _voucher() {
		return this.voucher;
	}

	set _sequences(sequence: Sequence) {
		this.sequence = sequence;
	}
	get _sequences() {
		return this.sequence;
	}

	set _date(date: FullDate) {
		this.date = date;
	}
	get _date() {
		return this.date;
	}

	set _access_key_voucher(access_key_voucher: string) {
		this.access_key_voucher = access_key_voucher;
	}
	get _access_key_voucher() {
		return this.access_key_voucher;
	}

	set _stringDateAuthorization(stringDateAuthorization: string) {
		this.stringDateAuthorization = stringDateAuthorization;
	}
	get _stringDateAuthorization() {
		return this.stringDateAuthorization;
	}

	set _base_path_vocher(base_path_vocher: string) {
		this.base_path_vocher = base_path_vocher;
	}
	get _base_path_vocher() {
		return this.base_path_vocher;
	}
	/**
	 * Función para generar el RIDE de acuerdo a la información ingresada
	 * @returns
	 */
	generateRideVoucher_01 = (): Promise<boolean> => {
		return new Promise<boolean>(async (resolve, reject) => {
			try {
				/**
				 * Generate stringHTML
				 */
				let html: string = '';
				await declarateRideVoucher_01(
					this.voucher,
					this.sequence,
					this.date,
					this.access_key_voucher,
					this.stringDateAuthorization
				)
					.then((_html: string) => {
						html = _html;
					})
					.catch((error: any) => {
						reject(error);
						return;
					});
				/**
				 * Generate HTML
				 */
				await this.generateHTML_RIDE(this.access_key_voucher, html).catch(
					(error: any) => {
						reject(error);
						return;
					}
				);
				/**
				 * Generate PDF
				 */
				const landscape: boolean = false;

				await this.generatePDF_RIDE(
					this.base_path_vocher,
					this.access_key_voucher,
					landscape
				).catch((error: any) => {
					reject(error);
					return;
				});
				/**
				 * clearDirectoryRIDE
				 */
				await this.clearDirectoryRIDE(this.access_key_voucher).catch(
					(error: any) => {
						reject(error);
					}
				);
				console.log(`MessageAPI: pdf created`);
				resolve(true);
			} catch (error) {
				console.log(error);
			}
		});
	};
	/**
	 * Función para generar el código de barras de acuerdo con la clave de acceso
	 * @param access_key_voucher
	 * @returns
	 */
	generateBARCODE_RIDE = (access_key_voucher: string): Promise<boolean> => {
		return new Promise<boolean>((resolve, reject) => {
			try {
				const canvas = createCanvas(100, 100);
				JsBarcode(canvas, access_key_voucher, {
					displayValue: false,
				});

				const out = fs.createWriteStream(
					path.resolve('./') + `/${access_key_voucher}.png`
				);
				const stream = canvas.createPNGStream();
				stream.pipe(out);
				out.on('finish', () => resolve(true));
			} catch (error: any) {
				reject(error);
			}
		});
	};
	/**
	 * Función para generar el HTML
	 * @param access_key_voucher
	 * @param html
	 * @returns
	 */
	generateHTML_RIDE = (
		access_key_voucher: string,
		html: string
	): Promise<boolean> => {
		return new Promise<boolean>((resolve, reject) => {
			try {
				fs.writeFileSync(
					`${path.resolve('./')}/${access_key_voucher}.html`,
					html
				);
				resolve(true);
			} catch (error: any) {
				reject(error.toString());
			}
		});
	};
	/**
	 * Función para generar el PDF
	 * @param base_path_vocher
	 * @param access_key_voucher
	 * @param landscape
	 * @returns
	 */
	generatePDF_RIDE = (
		base_path_vocher: string,
		access_key_voucher: string,
		landscape: boolean
	): Promise<boolean> => {
		return new Promise<boolean>(async (resolve, reject) => {
			try {
				const urlBase: string =
					'file://' + path.resolve('./').replace(/\\/g, '/');

				console.log('MessageAPI: creating browser');

				const browser: Browser = await puppeteer.launch({
					ignoreDefaultArgs: ['--disable-extensions'],
					headless: true,
					args: ['--no-sandbox', '--disable-dev-shm-usage'],
					timeout: process.env.TIMEOUT_LAUNCH_BROWSER_PUPPETEER
						? parseInt(process.env.TIMEOUT_LAUNCH_BROWSER_PUPPETEER)
						: 0,
				});
				console.log('MessageAPI: browser created');

				const page: Page = await browser.newPage();

				await page.goto(`${urlBase}/${access_key_voucher}.html`, {
					waitUntil: 'networkidle0',
				});

				const pdf: Buffer = await page.pdf({
					format: 'a4',
					landscape: landscape,
				});

				await browser.close();

				if (fs.existsSync(base_path_vocher)) {
					fs.writeFileSync(
						`${base_path_vocher}/${access_key_voucher}.pdf`,
						pdf
					);
					resolve(true);
				} else {
					reject(
						`MessageAPI: No se encontro la capeta base ${base_path_vocher}`
					);
				}
			} catch (error: any) {
				reject(error.toString());
			}
		});
	};
	/**
	 * Función para limpiar el directorio de trabajo del RIDE
	 * @param access_key_voucher
	 * @returns
	 */
	clearDirectoryRIDE = (access_key_voucher: string): Promise<string> => {
		return new Promise<string>((resolve, reject) => {
			try {
				fs.unlinkSync(`${path.resolve('./')}/${access_key_voucher}.png`);
				fs.unlinkSync(`${path.resolve('./')}/${access_key_voucher}.html`);
				resolve('MessageAPI: Directory cleaned');
			} catch (error: any) {
				reject(error.toString());
			}
		});
	};
}
