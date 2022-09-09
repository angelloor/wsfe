import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageAPI } from 'app/core/app/app.type';
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
import { institution, institutions } from './institution.data';
import { Institution } from './institution.types';

@Injectable({
  providedIn: 'root',
})
export class InstitutionService {
  private _url: string;
  private _headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private _institution: BehaviorSubject<Institution> = new BehaviorSubject(
    institution
  );
  private _institutions: BehaviorSubject<Institution[]> = new BehaviorSubject(
    institutions
  );

  constructor(private _httpClient: HttpClient) {
    this._url = environment.urlBackend + '/app/business/institution';
  }
  /**
   * Getter
   */
  get institution$(): Observable<Institution> {
    return this._institution.asObservable();
  }
  /**
   * Getter for _institutions
   */
  get institutions$(): Observable<Institution[]> {
    return this._institutions.asObservable();
  }
  /**
   * Create function
   */
  createInstitution(id_user_: string, id_taxpayer: string): Observable<any> {
    return this._institutions.pipe(
      take(1),
      switchMap((institutions) =>
        this._httpClient
          .post(
            this._url + '/create',
            {
              id_user_: parseInt(id_user_),
              taxpayer: {
                id_taxpayer: id_taxpayer,
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
              const _institution: Institution = response.body;
              /**
               * Update the institution in the store
               */
              this._institutions.next([_institution, ...institutions]);

              return of(_institution);
            })
          )
      )
    );
  }
  /**
   * Read All Institution
   */
  readAllInstitution(): Observable<Institution[]> {
    return this._httpClient
      .get<Institution[]>(this._url + '/read/query-all')
      .pipe(
        tap((institutions: Institution[]) => {
          this._institutions.next(institutions);
        })
      );
  }
  /**
   * Read Institution by query
   * @param query
   */
  readInstitutionByQuery(query: string): Observable<Institution[]> {
    return this._httpClient
      .get<Institution[]>(
        this._url + `/read/${query != '' ? query : 'query-all'}`
      )
      .pipe(
        tap((institutions: Institution[]) => {
          this._institutions.next(institutions);
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
  ): Observable<Institution[]> {
    return this._httpClient
      .get<Institution[]>(
        this._url +
          `/byTaxpayerRead/${id_taxpayer}/${query != '' ? query : 'query-all'}`
      )
      .pipe(
        tap((institutions: Institution[]) => {
          this._institutions.next(institutions);
        })
      );
  }
  /**
   * Read Institution by id
   * @param idInstitution
   */
  readInstitutionById(idInstitution: string): Observable<Institution> {
    return this._httpClient
      .get<Institution>(this._url + `/specificRead/${idInstitution}`)
      .pipe(
        tap((institutions: Institution) => {
          return institutions;
        })
      );
  }
  /**
   * Read Institution by id of local Observable
   */
  readInstitutionByIdLocal(id: string): Observable<Institution> {
    return this._institutions.pipe(
      take(1),
      map((institutions) => {
        /**
         * Find
         */
        const institution =
          institutions.find((item) => item.id_institution == id) || null;
        /**
         * Update
         */
        this._institution.next(institution!);
        /**
         * Return
         */
        return institution;
      }),
      switchMap((institution) => {
        if (!institution) {
          return throwError(
            () => 'No se encontro el elemento con el id ' + id + '!'
          );
        }
        return of(institution);
      })
    );
  }
  /**
   * changeStatusByBatchInstitution
   */
  changeStatusByBatchInstitution(
    id_user_: string,
    id_institution: string,
    status_by_batch_institution: boolean
  ): Observable<any> {
    return this._httpClient
      .post(
        this._url + '/changeStatusByBatchInstitution',
        {
          id_user_: parseInt(id_user_),
          id_institution: parseInt(id_institution),
          status_by_batch_institution,
        },
        {
          headers: this._headers,
        }
      )
      .pipe(
        switchMap((response: MessageAPI | any) => {
          return of(response.body);
        })
      );
  }
  /**
   * Update institution
   * @param id_user_ that will be updated
   * @param institution
   */
  updateInstitution(institution: Institution): Observable<any> {
    return this.institutions$.pipe(
      take(1),
      switchMap((institutions) =>
        this._httpClient
          .patch(this._url + '/update', institution, {
            headers: this._headers,
          })
          .pipe(
            switchMap((response: any) => {
              /**
               * check the response body to match with the type
               */
              const _institution: Institution = response.body;
              /**
               * Find the index of the updated institution
               */
              const index = institutions.findIndex(
                (item) => item.id_institution == institution.id_institution
              );
              /**
               * Update the institution
               */
              institutions[index] = _institution;
              /**
               * Update the institutions
               */
              this._institutions.next(institutions);

              /**
               * Update the institution
               */
              this._institution.next(_institution);

              return of(_institution);
            })
          )
      )
    );
  }
  /**
   * Delete the institution
   * @param id
   */
  deleteInstitution(id_user_: string, id_institution: string): Observable<any> {
    return this.institutions$.pipe(
      take(1),
      switchMap((institutions) =>
        this._httpClient
          .delete(this._url + `/delete`, {
            params: { id_user_, id_institution },
          })
          .pipe(
            switchMap((response: any) => {
              if (response && response.body) {
                /**
                 * Find the index of the updated institution
                 */
                const index = institutions.findIndex(
                  (item) => item.id_institution == id_institution
                );
                /**
                 * Delete the object of array
                 */
                institutions.splice(index, 1);
                /**
                 * Update the institutions
                 */
                this._institutions.next(institutions);
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
