import moment, { default as momentTz } from 'moment-timezone';
import { ICountry, TIMEZONE_TYPE, countries } from './international';

export interface FullDate {
	fullYear: number;
	month: string;
	day: string;
	hours: string;
	minutes: string;
	seconds: string;
}

/**
 * Define the default country
 */
const countryAbbreviationDefault = 'EC';

export const defaultCountry: ICountry | any = countries.find(
	(country: ICountry) => country.abbreviation == countryAbbreviationDefault
);

export const currentDateEC = moment().tz(defaultCountry?.timeZone).format();

/**
 * addCeroNumber
 * @param number
 * @returns string
 */
export const addCeroNumber = (number: number): string => {
	return number <= 9 ? `0${number}` : `${number}`;
};

/**
 * Obtenemos la hora en formato UTC (0)
 * @param clientDate fecha del cliente
 * @param clientTimeZone timezone del cliente
 * @returns Fecha en formato UTC
 */
export const getUTCDate = (
	clientDate: string,
	clientTimeZone: TIMEZONE_TYPE
): string => {
	return momentTz.tz(clientDate, clientTimeZone).utc().format();
};

console.log(moment(new Date()).format());

/**
 * Obtenemos la fecha en formato local de acuerdo a su timezone
 * @param clientUTCDate fecha UTC del cliente
 * @param clientTimeZone timezone del cliente
 * @returns Fecha en formato local de acuerdo a su timezone
 */
export const getLocalDate = (
	clientUTCDate: string,
	clientTimeZone: TIMEZONE_TYPE
): string => {
	return momentTz.tz(clientUTCDate, clientTimeZone).format();
};

/**
 * USE
 */

// Fecha simulada de los clientes en su formato local y su timezone
// const currentDateEC = moment().tz(defaultCountry?.timeZone).format();
// console.log('Hora Ecuador: ' + currentDateEC);

// Fecha para guardar en la base de datos
// const UTCDate = getUTCDate(currentDateEC, defaultCountry?.timeZone);
// console.log('Hora UTC: ' + UTCDate);

// Fecha a mostrar en la aplicación dependiente del cliente / Pais
// const localDate = getLocalDate(UTCDate, defaultCountry?.timeZone);
// console.log('Hora Ecuador: ' + localDate);
