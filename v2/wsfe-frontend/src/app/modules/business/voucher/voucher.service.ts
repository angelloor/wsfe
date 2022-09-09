import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import {
  TYPE_ENVIRONMENT,
  voucherSQLServer,
  VoucherSQLServer,
  vouchersSQLServer,
} from '../business.types';
import { voucher, vouchers } from './voucher.data';
import { Voucher } from './voucher.types';

@Injectable({
  providedIn: 'root',
})
export class VoucherService {
  private _url: string;
  private _headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private _voucher: BehaviorSubject<Voucher> = new BehaviorSubject(voucher);
  private _vouchers: BehaviorSubject<Voucher[]> = new BehaviorSubject(vouchers);

  private _voucherSQLServer: BehaviorSubject<VoucherSQLServer> =
    new BehaviorSubject(voucherSQLServer);
  private _vouchersSQLServer: BehaviorSubject<VoucherSQLServer[]> =
    new BehaviorSubject(vouchersSQLServer);

  constructor(private _httpClient: HttpClient) {
    this._url = environment.urlBackend + '/app/business/voucher';
  }
  /**
   * Getter
   */
  get voucher$(): Observable<Voucher> {
    return this._voucher.asObservable();
  }
  /**
   * Getter for _vouchers
   */
  get vouchers$(): Observable<Voucher[]> {
    return this._vouchers.asObservable();
  }
  /**
   * Getter
   */
  get voucherSQLServer$(): Observable<VoucherSQLServer> {
    return this._voucherSQLServer.asObservable();
  }
  /**
   * Getter for _vouchers
   */
  get vouchersSQLServer$(): Observable<VoucherSQLServer[]> {
    return this._vouchersSQLServer.asObservable();
  }
  /**
   * Create function
   */
  createVoucher(id_user_: string): Observable<any> {
    return this._vouchers.pipe(
      take(1),
      switchMap((vouchers) =>
        this._httpClient
          .post(
            this._url + '/create',
            {
              id_user_: parseInt(id_user_),
            },
            {
              headers: this._headers,
            }
          )
          .pipe(
            switchMap((response: any) => {
              /**
               * check the response body to match with the type
               */
              const _voucher: Voucher = response.body;
              /**
               * Update the voucher in the store
               */
              this._vouchers.next([_voucher, ...vouchers]);

              return of(_voucher);
            })
          )
      )
    );
  }
  /**
   * Read All Voucher
   */
  readAllVoucher(environment: TYPE_ENVIRONMENT): Observable<Voucher[]> {
    return this._httpClient
      .get<Voucher[]>(this._url + `/read/${environment}/query-all`)
      .pipe(
        tap((vouchers: Voucher[]) => {
          this._vouchers.next(vouchers);
        })
      );
  }
  /**
   * Read Voucher by query
   * @param query
   */
  readVoucherByQuery(
    environment: TYPE_ENVIRONMENT,
    query: string
  ): Observable<Voucher[]> {
    return this._httpClient
      .get<Voucher[]>(
        this._url + `/read/${environment}/${query != '' ? query : 'query-all'}`
      )
      .pipe(
        tap((vouchers: Voucher[]) => {
          this._vouchers.next(vouchers);
        })
      );
  }
  /**
   * Read Voucher by id
   * @param idVoucher
   */
  readVoucherById(idVoucher: string): Observable<Voucher> {
    return this._httpClient
      .get<Voucher>(this._url + `/specificRead/${idVoucher}`)
      .pipe(
        tap((vouchers: Voucher) => {
          return vouchers;
        })
      );
  }
  /**
   * Read Voucher by id of local Observable
   */
  readVoucherByIdLocal(id: string): Observable<Voucher> {
    return this._vouchers.pipe(
      take(1),
      map((vouchers) => {
        /**
         * Find
         */
        const voucher = vouchers.find((item) => item.id_voucher == id) || null;
        /**
         * Update
         */
        this._voucher.next(voucher!);
        /**
         * Return
         */
        return voucher;
      }),
      switchMap((voucher) => {
        if (!voucher) {
          return throwError(
            () => 'No se encontro el elemento con el id ' + id + '!'
          );
        }
        return of(voucher);
      })
    );
  }
  /**
   * byInstitutionRead
   * @param environment
   * @param id_institution
   */
  byInstitutionRead(
    environment: TYPE_ENVIRONMENT,
    id_institution: string
  ): Observable<Voucher[]> {
    return this._httpClient
      .get<Voucher[]>(
        this._url + `/byInstitutionRead/${environment}/${id_institution}`
      )
      .pipe(
        tap((vouchers: Voucher[]) => {
          this._vouchers.next(vouchers);
        })
      );
  }
  /**
   * byAccessKeyVoucherRead
   * @param access_key_voucher
   */
  byAccessKeyVoucherRead(access_key_voucher: string): Observable<Voucher[]> {
    return this._httpClient
      .get<Voucher[]>(
        this._url + `/byAccessKeyVoucherRead/${access_key_voucher}`
      )
      .pipe(
        tap((vouchers: Voucher[]) => {
          this._vouchers.next(vouchers);
        })
      );
  }
  /**
   * byBuyerIdentifierVoucherRead
   * @param environment
   * @param buyer_identifier_voucher
   * @param page_number
   * @param amount
   * @param order_by
   */
  byBuyerIdentifierVoucherRead(
    environment: TYPE_ENVIRONMENT,
    buyer_identifier_voucher: string,
    page_number: string,
    amount: string,
    order_by: 'asc' | 'desc'
  ): Observable<Voucher[]> {
    return this._httpClient
      .get<Voucher[]>(
        this._url +
          `/byBuyerIdentifierVoucherRead/${environment}/${buyer_identifier_voucher}/${page_number}/${amount}/${order_by}`
      )
      .pipe(
        tap((vouchers: Voucher[]) => {
          this._vouchers.next(vouchers);
        })
      );
  }
  /**
   * byBuyerIdentifierVoucherAndSearchByParameterRead
   * @param query
   */
  byBuyerIdentifierVoucherAndSearchByParameterRead(
    environment: TYPE_ENVIRONMENT,
    buyer_identifier_voucher: string,
    query: string
  ): Observable<Voucher[]> {
    return this._httpClient
      .get<Voucher[]>(
        this._url +
          `/byBuyerIdentifierVoucherAndSearchByParameterRead/${environment}/${buyer_identifier_voucher}/${
            query != '' ? query : 'query-all'
          }`
      )
      .pipe(
        tap((vouchers: Voucher[]) => {
          this._vouchers.next(vouchers);
        })
      );
  }
  /**
   * byBuyerIdentifierAndEmissionYearVoucherRead
   * @param environment
   * @param buyer_identifier_voucher
   * @param emission_date_voucher
   * @param page_number
   * @param amount
   * @param order_by
   */
  byBuyerIdentifierAndEmissionYearVoucherRead(
    environment: TYPE_ENVIRONMENT,
    buyer_identifier_voucher: string,
    emission_date_voucher: string,
    page_number: string,
    amount: string,
    order_by: string
  ): Observable<Voucher[]> {
    return this._httpClient
      .get<Voucher[]>(
        this._url +
          `/byBuyerIdentifierAndEmissionYearVoucherRead/${environment}/${buyer_identifier_voucher}/${emission_date_voucher}/${page_number}/${amount}/${order_by}`
      )
      .pipe(
        tap((vouchers: Voucher[]) => {
          this._vouchers.next(vouchers);
        })
      );
  }
  /**
   * byBuyerIdentifierAndRangeEmissionDateVoucherRead
   * @param environment
   * @param buyer_identifier_voucher
   * @param emission_date_voucher
   * @param authorization_date_voucher
   */
  byBuyerIdentifierAndRangeEmissionDateVoucherRead(
    environment: TYPE_ENVIRONMENT,
    buyer_identifier_voucher: string,
    emission_date_voucher: string,
    authorization_date_voucher: string
  ): Observable<Voucher[]> {
    return this._httpClient
      .get<Voucher[]>(
        this._url +
          `/byBuyerIdentifierAndRangeEmissionDateVoucherRead/${environment}/${buyer_identifier_voucher}/${emission_date_voucher}/${authorization_date_voucher}`
      )
      .pipe(
        tap((vouchers: Voucher[]) => {
          this._vouchers.next(vouchers);
        })
      );
  }
  /**
   * downloadVoucher
   * @param id_institution
   * @param access_key_voucher
   * @param type_file_voucher
   */
  downloadVoucher(
    id_institution: string,
    access_key_voucher: string,
    type_file_voucher: string
  ): Observable<Blob> {
    return this._httpClient
      .post(
        this._url + `/downloadVoucher`,
        {
          institution: {
            id_institution,
          },
          access_key_voucher,
          type_file_voucher,
        },
        {
          responseType: 'blob',
          headers: new HttpHeaders().append('Content-Type', 'application/json'),
        }
      )
      .pipe(map((voucherBlob: Blob) => voucherBlob));
  }
  /**
   * downloadVoucherArrayBuffer
   * @param id_institution
   * @param access_key_voucher
   * @param type_file_voucher
   */
  downloadVoucherArrayBuffer(
    id_institution: string,
    access_key_voucher: string,
    type_file_voucher: string
  ): Observable<ArrayBuffer> {
    return this._httpClient
      .post(
        this._url + `/downloadVoucher`,
        {
          institution: {
            id_institution,
          },
          access_key_voucher,
          type_file_voucher,
        },
        {
          responseType: 'arraybuffer',
          headers: new HttpHeaders().append('Content-Type', 'application/json'),
        }
      )
      .pipe(map((voucherArrayBuffer: ArrayBuffer) => voucherArrayBuffer));
  }
  /**
   * vouchersOfSQLServerRead
   * @param id_institution
   * @param emission_date_voucher
   * @param authorization_date_voucher
   * @param internal_status_voucher
   */
  vouchersOfSQLServerRead(
    id_institution: string,
    emission_date_voucher: string,
    authorization_date_voucher: string,
    internal_status_voucher: string
  ): Observable<VoucherSQLServer[]> {
    return this._httpClient
      .get<VoucherSQLServer[]>(
        this._url +
          `/vouchersOfSQLServerRead/${id_institution}/${emission_date_voucher}/${authorization_date_voucher}/${internal_status_voucher}`
      )
      .pipe(
        tap((voucherSQLServer: VoucherSQLServer[]) => {
          this._vouchersSQLServer.next(voucherSQLServer);
        })
      );
  }
  /**
   * vouchersOfSQLServerByParameterRead
   * @param number_voucher
   */
  vouchersOfSQLServerByParameterRead(
    number_voucher: string
  ): Observable<VoucherSQLServer[]> {
    return this._httpClient
      .get<VoucherSQLServer[]>(
        this._url + `/vouchersOfSQLServerByParameterRead/${number_voucher}`
      )
      .pipe(
        tap((voucherSQLServer: VoucherSQLServer[]) => {
          this._vouchersSQLServer.next(voucherSQLServer);
        })
      );
  }
  /**
   * byRangeEmissionDateVoucherRead
   * @param environment
   * @param id_institution
   * @param emission_date_voucher
   * @param authorization_date_voucher
   * @param internal_status_voucher
   */
  byRangeEmissionDateVoucherRead(
    environment: TYPE_ENVIRONMENT,
    id_institution: string,
    emission_date_voucher: string,
    authorization_date_voucher: string,
    internal_status_voucher: string
  ): Observable<Voucher[]> {
    return this._httpClient
      .get<Voucher[]>(
        this._url +
          `/byRangeEmissionDateVoucherRead/${environment}/${id_institution}/${emission_date_voucher}/${authorization_date_voucher}/${internal_status_voucher}`
      )
      .pipe(
        tap((vouchers: Voucher[]) => {
          this._vouchers.next(vouchers);
        })
      );
  }

  /**
   * Update voucher
   * @param id_user_ that will be updated
   * @param voucher
   */
  updateVoucher(voucher: Voucher): Observable<any> {
    return this.vouchers$.pipe(
      take(1),
      switchMap((vouchers) =>
        this._httpClient
          .patch(this._url + '/update', voucher, {
            headers: this._headers,
          })
          .pipe(
            switchMap((response: any) => {
              /**
               * check the response body to match with the type
               */
              const _voucher: Voucher = response.body;
              /**
               * Find the index of the updated voucher
               */
              const index = vouchers.findIndex(
                (item) => item.id_voucher == voucher.id_voucher
              );
              /**
               * Update the voucher
               */
              vouchers[index] = _voucher;
              /**
               * Update the vouchers
               */
              this._vouchers.next(vouchers);

              /**
               * Update the voucher
               */
              this._voucher.next(_voucher);

              return of(_voucher);
            })
          )
      )
    );
  }
  /**
   * Delete the voucher
   * @param id
   */
  deleteVoucher(id_user_: string, id_voucher: string): Observable<any> {
    return this.vouchers$.pipe(
      take(1),
      switchMap((vouchers) =>
        this._httpClient
          .delete(this._url + `/delete`, {
            params: { id_user_, id_voucher },
          })
          .pipe(
            switchMap((response: any) => {
              if (response && response.body) {
                /**
                 * Find the index of the updated voucher
                 */
                const index = vouchers.findIndex(
                  (item) => item.id_voucher == id_voucher
                );
                /**
                 * Delete the object of array
                 */
                vouchers.splice(index, 1);
                /**
                 * Update the vouchers
                 */
                this._vouchers.next(vouchers);
                return of(response.body);
              } else {
                return of(false);
              }
            })
          )
      )
    );
  }
  /**
   * reportByRangeEmissionDateVoucher
   * @param environment
   * @param id_institution
   * @param emission_date_voucher
   * @param authorization_date_voucher
   * @param internal_status_voucher
   * @returns
   */
  reportByRangeEmissionDateVoucher(
    environment: TYPE_ENVIRONMENT,
    id_institution: string,
    emission_date_voucher: string,
    authorization_date_voucher: string,
    internal_status_voucher: string
  ): Observable<any> {
    return this._httpClient
      .post(
        this._url + `/reportByRangeEmissionDateVoucher`,
        {
          id_user_: 1,
          type_environment: environment,
          institution: {
            id_institution,
          },
          emission_date_voucher,
          authorization_date_voucher,
          internal_status_voucher,
        },
        {
          responseType: 'blob',
          observe: 'response',
          headers: new HttpHeaders().append('Content-Type', 'application/json'),
        }
      )
      .pipe(map((response: any) => response));
  }
  /**
   * reportVouchersOfSQLServer
   * @param id_institution
   * @param emission_date_voucher
   * @param authorization_date_voucher
   * @param internal_status_voucher
   * @returns
   */
  reportVouchersOfSQLServer(
    id_institution: string,
    emission_date_voucher: string,
    authorization_date_voucher: string,
    internal_status_voucher: string
  ): Observable<any> {
    return this._httpClient
      .post(
        this._url + `/reportVouchersOfSQLServer`,
        {
          id_user_: 1,
          institution: {
            id_institution,
          },
          emission_date_voucher,
          authorization_date_voucher,
          internal_status_voucher,
        },
        {
          responseType: 'blob',
          observe: 'response',
          headers: new HttpHeaders().append('Content-Type', 'application/json'),
        }
      )
      .pipe(map((response: any) => response));
  }
  /**
   * reportResumeVouchersOfSQLServer
   * @param id_institution
   * @param emission_date_voucher
   * @param authorization_date_voucher
   * @param internal_status_voucher
   * @returns
   */
  reportResumeVouchersOfSQLServer(
    id_institution: string,
    emission_date_voucher: string,
    authorization_date_voucher: string,
    internal_status_voucher: string
  ): Observable<any> {
    return this._httpClient
      .post(
        this._url + `/reportResumeVouchersOfSQLServer`,
        {
          id_user_: 1,
          institution: {
            id_institution,
          },
          emission_date_voucher,
          authorization_date_voucher,
          internal_status_voucher,
        },
        {
          responseType: 'blob',
          observe: 'response',
          headers: new HttpHeaders().append('Content-Type', 'application/json'),
        }
      )
      .pipe(map((response: any) => response));
  }
}
