// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlBackend: 'http://172.18.2.3:3000',
  // urlBackend: 'https://facturacion.puyo.gob.ec',
  passwordEncrypt: 'eNcRyP$WSFE$2022',
  /**
   * Only GADMCP
   */
  launchingDate: '20/11/2021',
  oldSite: 'https://facturacion-anterior.puyo.gob.ec/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
