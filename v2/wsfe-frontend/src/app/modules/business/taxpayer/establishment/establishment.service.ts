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
import { establishment, establishments } from './establishment.data';
import { Establishment } from './establishment.types';

@Injectable({
  providedIn: 'root',
})
export class EstablishmentService {
  private _url: string;
  private _headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private _establishment: BehaviorSubject<Establishment> = new BehaviorSubject(
    establishment
  );
  private _establishments: BehaviorSubject<Establishment[]> =
    new BehaviorSubject(establishments);

  constructor(private _httpClient: HttpClient) {
    this._url = environment.urlBackend + '/app/business/establishment';
  }
  /**
   * Getter
   */
  get establishment$(): Observable<Establishment> {
    return this._establishment.asObservable();
  }
  /**
   * Getter for _establishments
   */
  get establishments$(): Observable<Establishment[]> {
    return this._establishments.asObservable();
  }
  /**
   * Create function
   */
  createEstablishment(id_user_: string, id_taxpayer: string): Observable<any> {
    return this._establishments.pipe(
      take(1),
      switchMap((establishments) =>
        this._httpClient
          .post(
            this._url + '/create',
            {
              id_user_: parseInt(id_user_),
              taxpayer: {
                id_taxpayer: parseInt(id_taxpayer),
              },
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
              const _establishment: Establishment = response.body;
              /**
               * Update the establishment in the store
               */
              this._establishments.next([_establishment, ...establishments]);

              return of(_establishment);
            })
          )
      )
    );
  }
  /**
   * Read All Establishment
   */
  readAllEstablishment(): Observable<Establishment[]> {
    return this._httpClient
      .get<Establishment[]>(this._url + '/read/query-all')
      .pipe(
        tap((establishments: Establishment[]) => {
          this._establishments.next(establishments);
        })
      );
  }
  /**
   * Read Establishment by query
   * @param query
   */
  readEstablishmentByQuery(query: string): Observable<Establishment[]> {
    return this._httpClient
      .get<Establishment[]>(
        this._url + `/read/${query != '' ? query : 'query-all'}`
      )
      .pipe(
        tap((establishments: Establishment[]) => {
          this._establishments.next(establishments);
        })
      );
  }
  /**
   * byTaxpayerRead
   * @param id_taxpayer
   * @param query
   */
  byTaxpayerRead(
    id_taxpayer: string,
    query: string
  ): Observable<Establishment[]> {
    return this._httpClient
      .get<Establishment[]>(
        this._url +
          `/byTaxpayerRead/${id_taxpayer}/${query != '' ? query : 'query-all'}`
      )
      .pipe(
        tap((establishments: Establishment[]) => {
          this._establishments.next(establishments);
        })
      );
  }
  /**
   * Read Establishment by id
   * @param idEstablishment
   */
  readEstablishmentById(idEstablishment: string): Observable<Establishment> {
    return this._httpClient
      .get<Establishment>(this._url + `/specificRead/${idEstablishment}`)
      .pipe(
        tap((establishments: Establishment) => {
          return establishments;
        })
      );
  }
  /**
   * Read Establishment by id of local Observable
   */
  readEstablishmentByIdLocal(id: string): Observable<Establishment> {
    return this._establishments.pipe(
      take(1),
      map((establishments) => {
        /**
         * Find
         */
        const establishment =
          establishments.find((item) => item.id_establishment == id) || null;
        /**
         * Update
         */
        this._establishment.next(establishment!);
        /**
         * Return
         */
        return establishment;
      }),
      switchMap((establishment) => {
        if (!establishment) {
          return throwError(
            () => 'No se encontro el elemento con el id ' + id + '!'
          );
        }
        return of(establishment);
      })
    );
  }
  /**
   * Update establishment
   * @param id_user_ that will be updated
   * @param establishment
   */
  updateEstablishment(establishment: Establishment): Observable<any> {
    return this.establishments$.pipe(
      take(1),
      switchMap((establishments) =>
        this._httpClient
          .patch(this._url + '/update', establishment, {
            headers: this._headers,
          })
          .pipe(
            switchMap((response: any) => {
              /**
               * check the response body to match with the type
               */
              const _establishment: Establishment = response.body;
              /**
               * Find the index of the updated establishment
               */
              const index = establishments.findIndex(
                (item) =>
                  item.id_establishment == establishment.id_establishment
              );
              /**
               * Update the establishment
               */
              establishments[index] = _establishment;
              /**
               * Update the establishments
               */
              this._establishments.next(establishments);

              /**
               * Update the establishment
               */
              this._establishment.next(_establishment);

              return of(_establishment);
            })
          )
      )
    );
  }
  /**
   * Delete the establishment
   * @param id
   */
  deleteEstablishment(
    id_user_: string,
    id_establishment: string
  ): Observable<any> {
    return this.establishments$.pipe(
      take(1),
      switchMap((establishments) =>
        this._httpClient
          .delete(this._url + `/delete`, {
            params: { id_user_, id_establishment },
          })
          .pipe(
            switchMap((response: any) => {
              if (response && response.body) {
                /**
                 * Find the index of the updated establishment
                 */
                const index = establishments.findIndex(
                  (item) => item.id_establishment == id_establishment
                );
                /**
                 * Delete the object of array
                 */
                establishments.splice(index, 1);
                /**
                 * Update the establishments
                 */
                this._establishments.next(establishments);
                return of(response.body);
              } else {
                return of(false);
              }
            })
          )
      )
    );
  }
}
