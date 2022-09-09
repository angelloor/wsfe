import {
  ActionAngelConfirmation,
  AngelConfirmationService,
} from '@angel/services/confirmation';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppInitialData, MessageAPI } from 'app/core/app/app.type';
import { AuthService } from 'app/core/auth/auth.service';
import { LayoutService } from 'app/layout/layout.service';
import { NotificationService } from 'app/shared/notification/notification.service';
import { fromEvent, merge, Observable, Subject, timer } from 'rxjs';
import {
  filter,
  finalize,
  switchMap,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs/operators';
import { EstablishmentService } from '../establishment.service';
import { Establishment } from '../establishment.types';
import { ModalEstablishmentService } from '../modal-establishment/modal-establishment.service';
import { ModalEstablishmentsService } from './modal-establishments.service';

@Component({
  selector: 'app-modal-establishments',
  templateUrl: './modal-establishments.component.html',
})
export class ModalEstablishmentsComponent implements OnInit {
  id_taxpayer: string = '';
  count: number = 0;
  establishments$!: Observable<Establishment[]>;

  private data!: AppInitialData;
  /**
   * Shortcut
   */
  private keyControl: boolean = false;
  private keyShift: boolean = false;
  private timeToWaitKey: number = 2; //ms
  /**
   * Shortcut
   */
  searchInputControl: FormControl = new FormControl();
  selectedEstablishment!: Establishment;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  /**
   * isOpenModal
   */
  isOpenModal: boolean = false;
  /**
   * isOpenModal
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    private _store: Store<{ global: AppInitialData }>,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: any,
    private _establishmentService: EstablishmentService,
    private _notificationService: NotificationService,
    private _angelConfirmationService: AngelConfirmationService,
    private _layoutService: LayoutService,
    private _authService: AuthService,
    private _modalEstablishmentsService: ModalEstablishmentsService,
    private _modalEstablishmentService: ModalEstablishmentService
  ) {}

  ngOnInit(): void {
    this.id_taxpayer = this._data.id_taxpayer;
    /**
     * checkSession
     */
    this._authService
      .checkSession()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
    /**
     * checkSession
     */
    /**
     * isOpenModal
     */
    this._layoutService.isOpenModal$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((_isOpenModal: boolean) => {
        this.isOpenModal = _isOpenModal;
      });
    /**
     * isOpenModal
     */
    /**
     * Subscribe to user changes of state
     */
    this._store.pipe(takeUntil(this._unsubscribeAll)).subscribe((state) => {
      this.data = state.global;
    });
    /**
     * Get the establishments
     */
    this.establishments$ = this._establishmentService.establishments$;
    /**
     *  Count Subscribe and readAll
     */
    this._establishmentService
      .byTaxpayerRead(this.id_taxpayer, '')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((establishments: Establishment[]) => {
        /**
         * Update the counts
         */
        this.count = establishments.length;
        /**
         * Mark for check
         */
        this._changeDetectorRef.markForCheck();
      });
    /**
     *  Count Subscribe
     */
    this._establishmentService.establishments$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((establishments: Establishment[]) => {
        /**
         * Update the counts
         */
        this.count = establishments.length;
        /**
         * Mark for check
         */
        this._changeDetectorRef.markForCheck();
      });
    /**
     * Subscribe to search input field value changes
     */
    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        switchMap((query) => {
          /**
           * Search
           */
          return this._establishmentService.byTaxpayerRead(
            this.id_taxpayer,
            query.toLowerCase()
          );
        })
      )
      .subscribe();
    /**
     * Shortcuts
     */
    merge(
      fromEvent(this._document, 'keydown').pipe(
        takeUntil(this._unsubscribeAll),
        filter<KeyboardEvent | any>((e) => e.key === 'Control')
      ),
      fromEvent(this._document, 'keydown').pipe(
        takeUntil(this._unsubscribeAll),
        filter<KeyboardEvent | any>((e) => e.key === 'Shift')
      )
    )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((keyUpOrKeyDown) => {
        /**
         * Shortcut create
         */
        if (keyUpOrKeyDown.key == 'Control') {
          this.keyControl = true;

          timer(100, 100)
            .pipe(
              finalize(() => {
                this.keyControl = false;
              }),
              takeWhile(() => this.timeToWaitKey > 0),
              takeUntil(this._unsubscribeAll),
              tap(() => this.timeToWaitKey--)
            )
            .subscribe();
        }
        if (keyUpOrKeyDown.key == 'Shift') {
          this.keyShift = true;

          timer(100, 100)
            .pipe(
              finalize(() => {
                this.keyShift = false;
              }),
              takeWhile(() => this.timeToWaitKey > 0),
              takeUntil(this._unsubscribeAll),
              tap(() => this.timeToWaitKey--)
            )
            .subscribe();
        }

        if (!this.isOpenModal && this.keyControl && this.keyShift) {
          this.createEstablishment();
        }
      });
    /**
     * Shortcuts
     */
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    /**
     * Unsubscribe from all subscriptions
     */
    this._unsubscribeAll.next(0);
    this._unsubscribeAll.complete();
  }

  /** ----------------------------------------------------------------------------------------------------- */
  /** @ Public methods
   /** ----------------------------------------------------------------------------------------------------- */
  /**
   * Create Establecimientos
   */
  createEstablishment(): void {
    this._angelConfirmationService
      .open({
        title: 'Añadir establecimiento',
        message:
          '¿Estás seguro de que deseas añadir una nuevo establecimiento? ¡Esta acción no se puede deshacer!',
      })
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((confirm: ActionAngelConfirmation) => {
        if (confirm === 'confirmed') {
          const id_user_ = this.data.user.id_user;
          /**
           * Create the establecimientos
           */
          this._establishmentService
            .createEstablishment(id_user_, this.id_taxpayer)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
              next: (_establishment: Establishment) => {
                if (_establishment) {
                  this._notificationService.success(
                    'Establecimiento agregado correctamente'
                  );
                  /**
                   * Go to new establecimientos
                   */
                  this.openModalEstablishment(_establishment.id_establishment);
                } else {
                  this._notificationService.error(
                    '¡Error interno!, consulte al administrador.'
                  );
                }
              },
              error: (error: { error: MessageAPI }) => {
                this._notificationService.error(
                  !error.error
                    ? '¡Error interno!, consulte al administrador.'
                    : !error.error.description
                    ? '¡Error interno!, consulte al administrador.'
                    : error.error.description
                );
              },
            });
        }
        this._layoutService.setOpenModal(false);
      });
  }
  /**
   * openModalEstablishment
   */
  openModalEstablishment(id_establishment: string): void {
    this._modalEstablishmentService.openModalEstablishment(id_establishment);
  }
  /**
   * openModalEstablishments
   */
  closeModalEstablishments() {
    this._modalEstablishmentsService.closeModalEstablishments();
  }
  /**
   * Track by function for ngFor loops
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
