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
import { mailServer, mailServers } from './mail-server.data';
import { MailServer } from './mail-server.types';

@Injectable({
  providedIn: 'root',
})
export class MailServerService {
  private _url: string;
  private _headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private _mailServer: BehaviorSubject<MailServer> = new BehaviorSubject(
    mailServer
  );
  private _mailServers: BehaviorSubject<MailServer[]> = new BehaviorSubject(
    mailServers
  );

  constructor(private _httpClient: HttpClient) {
    this._url = environment.urlBackend + '/app/business/mail_server';
  }
  /**
   * Getter
   */
  get mailServer$(): Observable<MailServer> {
    return this._mailServer.asObservable();
  }
  /**
   * Getter for _mailServers
   */
  get mailServers$(): Observable<MailServer[]> {
    return this._mailServers.asObservable();
  }
  /**
   * Create function
   */
  createMailServer(id_user_: string, id_taxpayer: string): Observable<any> {
    return this._mailServers.pipe(
      take(1),
      switchMap((mailServers) =>
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
              const _mailServer: MailServer = response.body;
              /**
               * Update the mailServer in the store
               */
              this._mailServers.next([_mailServer, ...mailServers]);

              return of(_mailServer);
            })
          )
      )
    );
  }
  /**
   * Read All MailServer
   */
  readAllMailServer(): Observable<MailServer[]> {
    return this._httpClient
      .get<MailServer[]>(this._url + '/read/query-all')
      .pipe(
        tap((mailServers: MailServer[]) => {
          this._mailServers.next(mailServers);
        })
      );
  }
  /**
   * Read MailServer by query
   * @param query
   */
  readMailServerByQuery(query: string): Observable<MailServer[]> {
    return this._httpClient
      .get<MailServer[]>(
        this._url + `/read/${query != '' ? query : 'query-all'}`
      )
      .pipe(
        tap((mailServers: MailServer[]) => {
          this._mailServers.next(mailServers);
        })
      );
  }
  /**
   * byTaxpayerRead
   * @param id_taxpayer
   * @param query
   */
  byTaxpayerRead(id_taxpayer: string, query: string): Observable<MailServer[]> {
    return this._httpClient
      .get<MailServer[]>(
        this._url +
          `/byTaxpayerRead/${id_taxpayer}/${query != '' ? query : 'query-all'}`
      )
      .pipe(
        tap((mailServers: MailServer[]) => {
          this._mailServers.next(mailServers);
        })
      );
  }
  /**
   * Read MailServer by id
   * @param idMailServer
   */
  readMailServerById(idMailServer: string): Observable<MailServer> {
    return this._httpClient
      .get<MailServer>(this._url + `/specificRead/${idMailServer}`)
      .pipe(
        tap((mailServers: MailServer) => {
          return mailServers;
        })
      );
  }
  /**
   * Read MailServer by id of local Observable
   */
  readMailServerByIdLocal(id: string): Observable<MailServer> {
    return this._mailServers.pipe(
      take(1),
      map((mailServers) => {
        /**
         * Find
         */
        const mailServer =
          mailServers.find((item) => item.id_mail_server == id) || null;
        /**
         * Update
         */
        this._mailServer.next(mailServer!);
        /**
         * Return
         */
        return mailServer;
      }),
      switchMap((mailServer) => {
        if (!mailServer) {
          return throwError(
            () => 'No se encontro el elemento con el id ' + id + '!'
          );
        }
        return of(mailServer);
      })
    );
  }
  /**
   * Update mailServer
   * @param id_user_ that will be updated
   * @param mailServer
   */
  updateMailServer(mailServer: MailServer): Observable<any> {
    return this.mailServers$.pipe(
      take(1),
      switchMap((mailServers) =>
        this._httpClient
          .patch(this._url + '/update', mailServer, {
            headers: this._headers,
          })
          .pipe(
            switchMap((response: any) => {
              /**
               * check the response body to match with the type
               */
              const _mailServer: MailServer = response.body;
              /**
               * Find the index of the updated mailServer
               */
              const index = mailServers.findIndex(
                (item) => item.id_mail_server == mailServer.id_mail_server
              );
              /**
               * Update the mailServer
               */
              mailServers[index] = _mailServer;
              /**
               * Update the mailServers
               */
              this._mailServers.next(mailServers);

              /**
               * Update the mailServer
               */
              this._mailServer.next(_mailServer);

              return of(_mailServer);
            })
          )
      )
    );
  }
  /**
   * Delete the mailServer
   * @param id_user_
   * @param id_mail_server
   */
  deleteMailServer(id_user_: string, id_mail_server: string): Observable<any> {
    return this.mailServers$.pipe(
      take(1),
      switchMap((mailServers) =>
        this._httpClient
          .delete(this._url + `/delete`, {
            params: { id_user_, id_mail_server },
          })
          .pipe(
            switchMap((response: any) => {
              if (response && response.body) {
                /**
                 * Find the index of the updated mailServer
                 */
                const index = mailServers.findIndex(
                  (item) => item.id_mail_server == id_mail_server
                );
                /**
                 * Delete the object of array
                 */
                mailServers.splice(index, 1);
                /**
                 * Update the mailServers
                 */
                this._mailServers.next(mailServers);
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
