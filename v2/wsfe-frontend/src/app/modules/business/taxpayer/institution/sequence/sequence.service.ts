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
import { sequence, sequences } from './sequence.data';
import { Sequence } from './sequence.types';

@Injectable({
  providedIn: 'root',
})
export class SequenceService {
  private _url: string;
  private _headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private _sequence: BehaviorSubject<Sequence> = new BehaviorSubject(sequence);
  private _sequences: BehaviorSubject<Sequence[]> = new BehaviorSubject(
    sequences
  );

  constructor(private _httpClient: HttpClient) {
    this._url = environment.urlBackend + '/app/business/sequence';
  }
  /**
   * Getter
   */
  get sequence$(): Observable<Sequence> {
    return this._sequence.asObservable();
  }
  /**
   * Getter for _sequences
   */
  get sequences$(): Observable<Sequence[]> {
    return this._sequences.asObservable();
  }
  /**
   * Create function
   */
  createSequence(id_user_: string, id_institution: string): Observable<any> {
    return this._sequences.pipe(
      take(1),
      switchMap((sequences) =>
        this._httpClient
          .post(
            this._url + '/create',
            {
              id_user_: parseInt(id_user_),
              institution: {
                id_institution: parseInt(id_institution),
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
              const _sequence: Sequence = response.body;
              /**
               * Update the sequence in the store
               */
              this._sequences.next([_sequence, ...sequences]);

              return of(_sequence);
            })
          )
      )
    );
  }
  /**
   * Read All Sequence
   */
  readAllSequence(): Observable<Sequence[]> {
    return this._httpClient.get<Sequence[]>(this._url + '/read/query-all').pipe(
      tap((sequences: Sequence[]) => {
        this._sequences.next(sequences);
      })
    );
  }
  /**
   * Read Sequence by query
   * @param query
   */
  readSequenceByQuery(query: string): Observable<Sequence[]> {
    return this._httpClient
      .get<Sequence[]>(this._url + `/read/${query != '' ? query : 'query-all'}`)
      .pipe(
        tap((sequences: Sequence[]) => {
          this._sequences.next(sequences);
        })
      );
  }
  /**
   * byInstitutionRead
   * @param query
   */
  byInstitutionRead(
    id_institution: string,
    query: string
  ): Observable<Sequence[]> {
    return this._httpClient
      .get<Sequence[]>(
        this._url +
          `/byInstitutionRead/${id_institution}/${
            query != '' ? query : 'query-all'
          }`
      )
      .pipe(
        tap((sequences: Sequence[]) => {
          this._sequences.next(sequences);
        })
      );
  }
  /**
   * Read Sequence by id
   * @param idSequence
   */
  readSequenceById(idSequence: string): Observable<Sequence> {
    return this._httpClient
      .get<Sequence>(this._url + `/specificRead/${idSequence}`)
      .pipe(
        tap((sequences: Sequence) => {
          return sequences;
        })
      );
  }
  /**
   * Read Sequence by id of local Observable
   */
  readSequenceByIdLocal(id: string): Observable<Sequence> {
    return this._sequences.pipe(
      take(1),
      map((sequences) => {
        /**
         * Find
         */
        const sequence =
          sequences.find((item) => item.id_sequence == id) || null;
        /**
         * Update
         */
        this._sequence.next(sequence!);
        /**
         * Return
         */
        return sequence;
      }),
      switchMap((sequence) => {
        if (!sequence) {
          return throwError(
            () => 'No se encontro el elemento con el id ' + id + '!'
          );
        }
        return of(sequence);
      })
    );
  }
  /**
   * Update sequence
   * @param id_user_ that will be updated
   * @param sequence
   */
  updateSequence(sequence: Sequence): Observable<any> {
    return this.sequences$.pipe(
      take(1),
      switchMap((sequences) =>
        this._httpClient
          .patch(this._url + '/update', sequence, {
            headers: this._headers,
          })
          .pipe(
            switchMap((response: any) => {
              /**
               * check the response body to match with the type
               */
              const _sequence: Sequence = response.body;
              /**
               * Find the index of the updated sequence
               */
              const index = sequences.findIndex(
                (item) => item.id_sequence == sequence.id_sequence
              );
              /**
               * Update the sequence
               */
              sequences[index] = _sequence;
              /**
               * Update the sequences
               */
              this._sequences.next(sequences);

              /**
               * Update the sequence
               */
              this._sequence.next(_sequence);

              return of(_sequence);
            })
          )
      )
    );
  }
  /**
   * Delete the sequence
   * @param id
   */
  deleteSequence(id_user_: string, id_sequence: string): Observable<any> {
    return this.sequences$.pipe(
      take(1),
      switchMap((sequences) =>
        this._httpClient
          .delete(this._url + `/delete`, {
            params: { id_user_, id_sequence },
          })
          .pipe(
            switchMap((response: any) => {
              if (response && response.body) {
                /**
                 * Find the index of the updated sequence
                 */
                const index = sequences.findIndex(
                  (item) => item.id_sequence == id_sequence
                );
                /**
                 * Delete the object of array
                 */
                sequences.splice(index, 1);
                /**
                 * Update the sequences
                 */
                this._sequences.next(sequences);
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
