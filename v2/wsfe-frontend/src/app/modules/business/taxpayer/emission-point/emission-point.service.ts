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
import { emissionPoint, emissionPoints } from './emission-point.data';
import { EmissionPoint } from './emission-point.types';

@Injectable({
  providedIn: 'root',
})
export class EmissionPointService {
  private _url: string;
  private _headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private _emissionPoint: BehaviorSubject<EmissionPoint> = new BehaviorSubject(
    emissionPoint
  );
  private _emissionPoints: BehaviorSubject<EmissionPoint[]> =
    new BehaviorSubject(emissionPoints);

  constructor(private _httpClient: HttpClient) {
    this._url = environment.urlBackend + '/app/business/emission_point';
  }
  /**
   * Getter
   */
  get emissionPoint$(): Observable<EmissionPoint> {
    return this._emissionPoint.asObservable();
  }
  /**
   * Getter for _emissionPoints
   */
  get emissionPoints$(): Observable<EmissionPoint[]> {
    return this._emissionPoints.asObservable();
  }
  /**
   * Create function
   */
  createEmissionPoint(id_user_: string, id_taxpayer: string): Observable<any> {
    return this._emissionPoints.pipe(
      take(1),
      switchMap((emissionPoints) =>
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
              const _emissionPoint: EmissionPoint = response.body;
              /**
               * Update the emissionPoint in the store
               */
              this._emissionPoints.next([_emissionPoint, ...emissionPoints]);

              return of(_emissionPoint);
            })
          )
      )
    );
  }
  /**
   * Read All EmissionPoint
   */
  readAllEmissionPoint(): Observable<EmissionPoint[]> {
    return this._httpClient
      .get<EmissionPoint[]>(this._url + '/read/query-all')
      .pipe(
        tap((emissionPoints: EmissionPoint[]) => {
          this._emissionPoints.next(emissionPoints);
        })
      );
  }
  /**
   * Read EmissionPoint by query
   * @param query
   */
  readEmissionPointByQuery(query: string): Observable<EmissionPoint[]> {
    return this._httpClient
      .get<EmissionPoint[]>(
        this._url + `/read/${query != '' ? query : 'query-all'}`
      )
      .pipe(
        tap((emissionPoints: EmissionPoint[]) => {
          this._emissionPoints.next(emissionPoints);
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
  ): Observable<EmissionPoint[]> {
    return this._httpClient
      .get<EmissionPoint[]>(
        this._url +
          `/byTaxpayerRead/${id_taxpayer}/${query != '' ? query : 'query-all'}`
      )
      .pipe(
        tap((emissionPoints: EmissionPoint[]) => {
          this._emissionPoints.next(emissionPoints);
        })
      );
  }
  /**
   * Read EmissionPoint by id
   * @param idEmissionPoint
   */
  readEmissionPointById(idEmissionPoint: string): Observable<EmissionPoint> {
    return this._httpClient
      .get<EmissionPoint>(this._url + `/specificRead/${idEmissionPoint}`)
      .pipe(
        tap((emissionPoints: EmissionPoint) => {
          return emissionPoints;
        })
      );
  }
  /**
   * Read EmissionPoint by id of local Observable
   */
  readEmissionPointByIdLocal(id: string): Observable<EmissionPoint> {
    return this._emissionPoints.pipe(
      take(1),
      map((emissionPoints) => {
        /**
         * Find
         */
        const emissionPoint =
          emissionPoints.find((item) => item.id_emission_point == id) || null;
        /**
         * Update
         */
        this._emissionPoint.next(emissionPoint!);
        /**
         * Return
         */
        return emissionPoint;
      }),
      switchMap((emissionPoint) => {
        if (!emissionPoint) {
          return throwError(
            () => 'No se encontro el elemento con el id ' + id + '!'
          );
        }
        return of(emissionPoint);
      })
    );
  }
  /**
   * Update emissionPoint
   * @param id_user_ that will be updated
   * @param emissionPoint
   */
  updateEmissionPoint(emissionPoint: EmissionPoint): Observable<any> {
    return this.emissionPoints$.pipe(
      take(1),
      switchMap((emissionPoints) =>
        this._httpClient
          .patch(this._url + '/update', emissionPoint, {
            headers: this._headers,
          })
          .pipe(
            switchMap((response: any) => {
              /**
               * check the response body to match with the type
               */
              const _emissionPoint: EmissionPoint = response.body;
              /**
               * Find the index of the updated emissionPoint
               */
              const index = emissionPoints.findIndex(
                (item) =>
                  item.id_emission_point == emissionPoint.id_emission_point
              );
              /**
               * Update the emissionPoint
               */
              emissionPoints[index] = _emissionPoint;
              /**
               * Update the emissionPoints
               */
              this._emissionPoints.next(emissionPoints);

              /**
               * Update the emissionPoint
               */
              this._emissionPoint.next(_emissionPoint);

              return of(_emissionPoint);
            })
          )
      )
    );
  }
  /**
   * Delete the emissionPoint
   * @param id
   */
  deleteEmissionPoint(
    id_user_: string,
    id_emission_point: string
  ): Observable<any> {
    return this.emissionPoints$.pipe(
      take(1),
      switchMap((emissionPoints) =>
        this._httpClient
          .delete(this._url + `/delete`, {
            params: { id_user_, id_emission_point },
          })
          .pipe(
            switchMap((response: any) => {
              if (response && response.body) {
                /**
                 * Find the index of the updated emissionPoint
                 */
                const index = emissionPoints.findIndex(
                  (item) => item.id_emission_point == id_emission_point
                );
                /**
                 * Delete the object of array
                 */
                emissionPoints.splice(index, 1);
                /**
                 * Update the emissionPoints
                 */
                this._emissionPoints.next(emissionPoints);
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
