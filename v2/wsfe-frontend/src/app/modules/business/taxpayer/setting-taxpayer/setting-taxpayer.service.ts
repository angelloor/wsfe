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
import { settingTaxpayer, settingTaxpayers } from './setting-taxpayer.data';
import { SettingTaxpayer } from './setting-taxpayer.types';

@Injectable({
  providedIn: 'root',
})
export class SettingTaxpayerService {
  private _url: string;
  private _headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private _settingTaxpayer: BehaviorSubject<SettingTaxpayer> =
    new BehaviorSubject(settingTaxpayer);
  private _settingTaxpayers: BehaviorSubject<SettingTaxpayer[]> =
    new BehaviorSubject(settingTaxpayers);

  constructor(private _httpClient: HttpClient) {
    this._url = environment.urlBackend + '/app/business/setting_taxpayer';
  }
  /**
   * Getter
   */
  get settingTaxpayer$(): Observable<SettingTaxpayer> {
    return this._settingTaxpayer.asObservable();
  }
  /**
   * Getter for _settingTaxpayers
   */
  get settingTaxpayers$(): Observable<SettingTaxpayer[]> {
    return this._settingTaxpayers.asObservable();
  }
  /**
   * Create function
   */
  createSettingTaxpayer(id_user_: string): Observable<any> {
    return this._settingTaxpayers.pipe(
      take(1),
      switchMap((settingTaxpayers) =>
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
              const _settingTaxpayer: SettingTaxpayer = response.body;
              /**
               * Update the settingTaxpayer in the store
               */
              this._settingTaxpayers.next([
                _settingTaxpayer,
                ...settingTaxpayers,
              ]);

              return of(_settingTaxpayer);
            })
          )
      )
    );
  }
  /**
   * Read All SettingTaxpayer
   */
  readAllSettingTaxpayer(): Observable<SettingTaxpayer[]> {
    return this._httpClient
      .get<SettingTaxpayer[]>(this._url + '/read/query-all')
      .pipe(
        tap((settingTaxpayers: SettingTaxpayer[]) => {
          this._settingTaxpayers.next(settingTaxpayers);
        })
      );
  }
  /**
   * Read SettingTaxpayer by query
   * @param query
   */
  readSettingTaxpayerByQuery(query: string): Observable<SettingTaxpayer[]> {
    return this._httpClient
      .get<SettingTaxpayer[]>(
        this._url + `/read/${query != '' ? query : 'query-all'}`
      )
      .pipe(
        tap((settingTaxpayers: SettingTaxpayer[]) => {
          this._settingTaxpayers.next(settingTaxpayers);
        })
      );
  }
  /**
   * Read SettingTaxpayer by id
   * @param idSettingTaxpayer
   */
  readSettingTaxpayerById(
    idSettingTaxpayer: string
  ): Observable<SettingTaxpayer> {
    return this._httpClient
      .get<SettingTaxpayer>(this._url + `/specificRead/${idSettingTaxpayer}`)
      .pipe(
        tap((settingTaxpayers: SettingTaxpayer) => {
          this._settingTaxpayer.next(settingTaxpayers);
          return settingTaxpayers;
        })
      );
  }
  /**
   * Read SettingTaxpayer by id of local Observable
   */
  readSettingTaxpayerByIdLocal(id: string): Observable<SettingTaxpayer> {
    return this._settingTaxpayers.pipe(
      take(1),
      map((settingTaxpayers) => {
        /**
         * Find
         */
        const settingTaxpayer =
          settingTaxpayers.find((item) => item.id_setting_taxpayer == id) ||
          null;
        /**
         * Update
         */
        this._settingTaxpayer.next(settingTaxpayer!);
        /**
         * Return
         */
        return settingTaxpayer;
      }),
      switchMap((settingTaxpayer) => {
        if (!settingTaxpayer) {
          return throwError(
            () => 'No se encontro el elemento con el id ' + id + '!'
          );
        }
        return of(settingTaxpayer);
      })
    );
  }
  /**
   * Update settingTaxpayer
   * @param id_user_ that will be updated
   * @param settingTaxpayer
   */
  updateSettingTaxpayer(settingTaxpayer: SettingTaxpayer): Observable<any> {
    return this.settingTaxpayers$.pipe(
      take(1),
      switchMap((settingTaxpayers) =>
        this._httpClient
          .patch(this._url + '/update', settingTaxpayer, {
            headers: this._headers,
          })
          .pipe(
            switchMap((response: any) => {
              /**
               * check the response body to match with the type
               */
              const _settingTaxpayer: SettingTaxpayer = response.body;
              /**
               * Find the index of the updated settingTaxpayer
               */
              const index = settingTaxpayers.findIndex(
                (item) =>
                  item.id_setting_taxpayer ==
                  settingTaxpayer.id_setting_taxpayer
              );
              /**
               * Update the settingTaxpayer
               */
              settingTaxpayers[index] = _settingTaxpayer;
              /**
               * Update the settingTaxpayers
               */
              this._settingTaxpayers.next(settingTaxpayers);

              /**
               * Update the settingTaxpayer
               */
              this._settingTaxpayer.next(_settingTaxpayer);

              return of(_settingTaxpayer);
            })
          )
      )
    );
  }
  /**
   * Delete the settingTaxpayer
   * @param id
   */
  deleteSettingTaxpayer(
    id_user_: string,
    id_setting_taxpayer: string
  ): Observable<any> {
    return this.settingTaxpayers$.pipe(
      take(1),
      switchMap((settingTaxpayers) =>
        this._httpClient
          .delete(this._url + `/delete`, {
            params: { id_user_, id_setting_taxpayer },
          })
          .pipe(
            switchMap((response: any) => {
              if (response && response.body) {
                /**
                 * Find the index of the updated settingTaxpayer
                 */
                const index = settingTaxpayers.findIndex(
                  (item) => item.id_setting_taxpayer == id_setting_taxpayer
                );
                /**
                 * Delete the object of array
                 */
                settingTaxpayers.splice(index, 1);
                /**
                 * Update the settingTaxpayers
                 */
                this._settingTaxpayers.next(settingTaxpayers);
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
   * uploadLogo
   */
  uploadLogo(
    logo: File,
    id_user_: string,
    id_setting_taxpayer: string
  ): Observable<boolean> {
    var formData = new FormData();

    formData.append('logo', logo);
    formData.append('id_user_', id_user_);
    formData.append('id_setting_taxpayer', id_setting_taxpayer);

    return this.settingTaxpayer$.pipe(
      take(1),
      switchMap((settingTaxpayer) =>
        this._httpClient.post(this._url + '/uploadLogo', formData).pipe(
          switchMap((response: any) => {
            const path_logo: string = response.body.new_path;

            this._settingTaxpayer.next({
              ...settingTaxpayer,
              logo_path_setting_taxpayer: path_logo,
            });

            return of(true);
          })
        )
      )
    );
  }
  /**
   * removeLogo
   */
  removeLogo(
    id_user_: string,
    id_setting_taxpayer: string
  ): Observable<boolean> {
    return this.settingTaxpayer$.pipe(
      take(1),
      switchMap((settingTaxpayer) =>
        this._httpClient
          .post(this._url + '/removeLogo', { id_user_, id_setting_taxpayer })
          .pipe(
            switchMap(() => {
              this._settingTaxpayer.next({
                ...settingTaxpayer,
                logo_path_setting_taxpayer: 'default.png',
              });

              return of(true);
            })
          )
      )
    );
  }
  /**
   * downloadLogo
   * @param id_user_
   * @param logo_path_setting_taxpayer
   * @returns
   */
  downloadLogo(id_user_: string, logo_path_setting_taxpayer: string): any {
    return this._httpClient
      .post(
        this._url + `/downloadLogo`,
        { id_user_, logo_path_setting_taxpayer },
        {
          responseType: 'blob',
          headers: new HttpHeaders().append('Content-Type', 'application/json'),
        }
      )
      .pipe(map((data) => data));
  }
}
