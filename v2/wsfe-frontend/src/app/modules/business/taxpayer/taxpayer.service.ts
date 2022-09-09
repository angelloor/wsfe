import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppInitialData, MessageAPI } from 'app/core/app/app.type';
import { User } from 'app/modules/core/user/user.types';
import { updateAvatar } from 'app/store/global/global.actions';
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
import { taxpayer, taxpayers } from './taxpayer.data';
import { Taxpayer } from './taxpayer.types';

@Injectable({
  providedIn: 'root',
})
export class TaxpayerService {
  private _url: string;
  private _urlUser: string;
  private _headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private _taxpayer: BehaviorSubject<Taxpayer> = new BehaviorSubject(taxpayer);
  private _taxpayers: BehaviorSubject<Taxpayer[]> = new BehaviorSubject(
    taxpayers
  );

  constructor(
    private _httpClient: HttpClient,
    private _store: Store<{ global: AppInitialData }>
  ) {
    this._url = environment.urlBackend + '/app/business/taxpayer';
    this._urlUser = environment.urlBackend + '/app/core/user';
  }
  /**
   * Getter
   */
  get taxpayer$(): Observable<Taxpayer> {
    return this._taxpayer.asObservable();
  }
  /**
   * Getter for _taxpayers
   */
  get taxpayers$(): Observable<Taxpayer[]> {
    return this._taxpayers.asObservable();
  }
  /**
   * Create function
   */
  createTaxpayer(id_user_: string): Observable<any> {
    return this._taxpayers.pipe(
      take(1),
      switchMap((taxpayers) =>
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
              const _taxpayer: Taxpayer = response.body;
              /**
               * Update the taxpayer in the store
               */
              this._taxpayers.next([_taxpayer, ...taxpayers]);

              return of(_taxpayer);
            })
          )
      )
    );
  }
  /**
   * Read All Taxpayer
   */
  readAllTaxpayer(): Observable<Taxpayer[]> {
    return this._httpClient.get<Taxpayer[]>(this._url + '/read/query-all').pipe(
      tap((taxpayers: Taxpayer[]) => {
        this._taxpayers.next(taxpayers);
      })
    );
  }
  /**
   * Read Taxpayer by query
   * @param query
   */
  readTaxpayerByQuery(query: string): Observable<Taxpayer[]> {
    return this._httpClient
      .get<Taxpayer[]>(this._url + `/read/${query != '' ? query : 'query-all'}`)
      .pipe(
        tap((taxpayers: Taxpayer[]) => {
          this._taxpayers.next(taxpayers);
        })
      );
  }
  /**
   * Read Taxpayer by id
   * @param idTaxpayer
   */
  readTaxpayerById(idTaxpayer: string): Observable<Taxpayer> {
    return this._httpClient
      .get<Taxpayer>(this._url + `/specificRead/${idTaxpayer}`)
      .pipe(
        tap((taxpayers: Taxpayer) => {
          return taxpayers;
        })
      );
  }
  /**
   * Read Taxpayer by id of local Observable
   */
  readTaxpayerByIdLocal(id: string): Observable<Taxpayer> {
    return this._taxpayers.pipe(
      take(1),
      map((taxpayers) => {
        /**
         * Find
         */
        const taxpayer =
          taxpayers.find((item) => item.id_taxpayer == id) || null;
        /**
         * Update
         */
        this._taxpayer.next(taxpayer!);
        /**
         * Return
         */
        return taxpayer;
      }),
      switchMap((taxpayer) => {
        if (!taxpayer) {
          return throwError(
            () => 'No se encontro el elemento con el id ' + id + '!'
          );
        }
        return of(taxpayer);
      })
    );
  }
  /**
   * changeStatusByBatchTaxpayer
   */
  changeStatusByBatchTaxpayer(
    id_user_: string,
    id_taxpayer: string,
    status_by_batch_taxpayer: boolean
  ): Observable<any> {
    return this._httpClient
      .post(
        this._url + '/changeStatusByBatchTaxpayer',
        {
          id_user_: parseInt(id_user_),
          id_taxpayer: parseInt(id_taxpayer),
          status_by_batch_taxpayer,
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
   * Update taxpayer
   * @param id_user_ that will be updated
   * @param taxpayer
   */
  updateTaxpayer(taxpayer: Taxpayer): Observable<any> {
    return this.taxpayers$.pipe(
      take(1),
      switchMap((taxpayers) =>
        this._httpClient
          .patch(this._url + '/update', taxpayer, {
            headers: this._headers,
          })
          .pipe(
            switchMap((response: any) => {
              /**
               * check the response body to match with the type
               */
              const _taxpayer: Taxpayer = response.body;
              /**
               * Find the index of the updated taxpayer
               */
              const index = taxpayers.findIndex(
                (item) => item.id_taxpayer == taxpayer.id_taxpayer
              );
              /**
               * Update the taxpayer
               */
              taxpayers[index] = _taxpayer;
              /**
               * Update the taxpayers
               */
              this._taxpayers.next(taxpayers);

              /**
               * Update the taxpayer
               */
              this._taxpayer.next(_taxpayer);

              return of(_taxpayer);
            })
          )
      )
    );
  }
  /**
   * Delete the taxpayer
   * @param id
   */
  deleteTaxpayer(id_user_: string, id_taxpayer: string): Observable<any> {
    return this.taxpayers$.pipe(
      take(1),
      switchMap((taxpayers) =>
        this._httpClient
          .delete(this._url + `/delete`, {
            params: { id_user_, id_taxpayer },
          })
          .pipe(
            switchMap((response: any) => {
              if (response && response.body) {
                /**
                 * Find the index of the updated taxpayer
                 */
                const index = taxpayers.findIndex(
                  (item) => item.id_taxpayer == id_taxpayer
                );
                /**
                 * Delete the object of array
                 */
                taxpayers.splice(index, 1);
                /**
                 * Update the taxpayers
                 */
                this._taxpayers.next(taxpayers);
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
   * uploadAvatarFromTaxpayer
   */
  uploadAvatarFromTaxpayer(
    user: User,
    avatar: File,
    UserLoggedIn: User
  ): Observable<boolean> {
    var formData = new FormData();

    formData.append('avatar', avatar);
    formData.append('id_user', user.id_user);

    return this.taxpayers$.pipe(
      take(1),
      switchMap((taxpayers) =>
        this._httpClient.post(this._urlUser + '/uploadAvatar', formData).pipe(
          switchMap((response: any) => {
            const avatar_user: string = response.body.new_path;

            const index = taxpayers.findIndex(
              (item) => item.user.id_user === user.id_user
            );

            taxpayers[index] = {
              ...taxpayers[index],
              user: {
                ...taxpayers[index].user,
                avatar_user,
              },
            };

            this._taxpayers.next(taxpayers);
            this._taxpayer.next({
              ...taxpayers[index],
              user: {
                ...taxpayers[index].user,
                avatar_user,
              },
            });

            if (user.id_user == UserLoggedIn.id_user) {
              // Update the avatar in the store
              this._store.dispatch(
                updateAvatar({
                  ...taxpayers[index].user,
                  avatar_user,
                })
              );
            }

            return of(true);
          })
        )
      )
    );
  }
  /**
   * removeAvatarFromTaxpayer
   */
  removeAvatarFromTaxpayer(
    user: User,
    UserLoggedIn: User
  ): Observable<boolean> {
    return this.taxpayers$.pipe(
      take(1),
      switchMap((taxpayers) =>
        this._httpClient
          .post(this._urlUser + '/removeAvatar', { id_user: user.id_user })
          .pipe(
            switchMap(() => {
              const index = taxpayers.findIndex(
                (item) => item.user.id_user === user.id_user
              );

              taxpayers[index] = {
                ...taxpayers[index],
                user: {
                  ...taxpayers[index].user,
                  avatar_user: 'default.svg',
                },
              };

              this._taxpayers.next(taxpayers);
              this._taxpayer.next({
                ...taxpayers[index],
                user: {
                  ...taxpayers[index].user,
                  avatar_user: 'default.svg',
                },
              });

              if (user.id_user == UserLoggedIn.id_user) {
                // Update the avatar in the store
                this._store.dispatch(
                  updateAvatar({
                    ...taxpayers[index].user,
                    avatar_user: 'default.svg',
                  })
                );
              }

              return of(true);
            })
          )
      )
    );
  }
  /**
   * uploadSignature
   */
  uploadSignature(
    signature: File,
    id_user_: string,
    id_taxpayer: string
  ): Observable<boolean> {
    var formData = new FormData();

    formData.append('signature', signature);
    formData.append('id_user_', id_user_);
    formData.append('id_taxpayer', id_taxpayer);

    return this.taxpayers$.pipe(
      take(1),
      switchMap((taxpayers) =>
        this._httpClient.post(this._url + '/uploadSignature', formData).pipe(
          switchMap((response: any) => {
            const path_signature: string = response.body.new_path;

            const index = taxpayers.findIndex(
              (item) => item.id_taxpayer === id_taxpayer
            );

            taxpayers[index] = {
              ...taxpayers[index],
              signature_path_taxpayer: path_signature,
            };

            this._taxpayers.next(taxpayers);
            this._taxpayer.next({
              ...taxpayers[index],
              signature_path_taxpayer: path_signature,
            });

            return of(true);
          })
        )
      )
    );
  }
  /**
   * removeSignature
   */
  removeSignature(id_user_: string, id_taxpayer: string): Observable<boolean> {
    return this.taxpayers$.pipe(
      take(1),
      switchMap((taxpayers) =>
        this._httpClient
          .post(this._url + '/removeSignature', { id_user_, id_taxpayer })
          .pipe(
            switchMap(() => {
              const index = taxpayers.findIndex(
                (item) => item.id_taxpayer === id_taxpayer
              );

              taxpayers[index] = {
                ...taxpayers[index],
                signature_path_taxpayer: '',
              };

              this._taxpayers.next(taxpayers);
              this._taxpayer.next({
                ...taxpayers[index],
                signature_path_taxpayer: '',
              });

              return of(true);
            })
          )
      )
    );
  }
  /**
   * downloadSignature
   * @param id_user_
   * @param signature_path_taxpayer
   * @returns
   */
  downloadSignature(id_user_: string, signature_path_taxpayer: string): any {
    return this._httpClient
      .post(
        this._url + `/downloadSignature`,
        { id_user_, signature_path_taxpayer },
        {
          responseType: 'blob',
          headers: new HttpHeaders().append('Content-Type', 'application/json'),
        }
      )
      .pipe(map((data) => data));
  }
}
