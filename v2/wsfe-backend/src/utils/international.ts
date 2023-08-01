/**
 * Interface Country
 */
export interface ICountry {
    name: string;
    abbreviation: ABBREVIATION_TYPE;
    timeZone: TIMEZONE_TYPE;
    UTCReference: UTC_REFERENCE_TYPE;
    currency: CURRENCY_TYPE;
    language: LANGUAGE_TYPE;
    minimumWage: number;
}
/**
 * Abbreviation Countries
 */
export type ABBREVIATION_TYPE = 'EC' | 'ARG' | 'USA';
/**
 * Timezone
 */
export type TIMEZONE_TYPE = 'America/Guayaquil' | 'America/Argentina/Buenos_Aires';

/**
 * UTC Reference
 */
export type UTC_REFERENCE_TYPE =
    | '-12'
    | '-11'
    | '-10'
    | '-9'
    | '-8'
    | '-7'
    | '-6'
    | '-5'
    | '-4'
    | '-3'
    | '-2'
    | '-1'
    | '0'
    | '+1'
    | '+2'
    | '+3'
    | '+4'
    | '+5'
    | '+6'
    | '+7'
    | '+8'
    | '+9'
    | '+10'
    | '+11'
    | '+12';
/**
 * Currencies to the countries
 */
export type CURRENCY_TYPE = 'USD' | 'ARS';
/**
 * Languages to the countries
 */
export type LANGUAGE_TYPE = 'EN' | 'ES';
/**
 * Countries to the application
 */
export const countries: ICountry[] = [
    {
        name: 'Ecuador',
        abbreviation: 'EC',
        timeZone: 'America/Guayaquil',
        UTCReference: '-5',
        currency: 'USD',
        language: 'ES',
        minimumWage: 400,
    },
    {
        name: 'Argentina',
        abbreviation: 'ARG',
        timeZone: 'America/Argentina/Buenos_Aires',
        UTCReference: '-3',
        currency: 'ARS',
        language: 'ES',
        minimumWage: 112500,
    },
];
