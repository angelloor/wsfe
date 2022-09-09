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
import { EmissionPointService } from '../emission-point.service';
import { EmissionPoint } from '../emission-point.types';
import { ModalEmissionPointService } from '../modal-emission-point/modal-emission-point.service';
import { ModalEmissionPointsService } from './modal-emission-points.service';

@Component({
  selector: 'app-modal-emission-points',
  templateUrl: './modal-emission-points.component.html',
})
export class ModalEmissionPointsComponent implements OnInit {
  id_taxpayer: string = '';
  count: number = 0;
  emissionPoints$!: Observable<EmissionPoint[]>;

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
  selectedEmissionPoint!: EmissionPoint;

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
    private _emissionPointService: EmissionPointService,
    private _notificationService: NotificationService,
    private _angelConfirmationService: AngelConfirmationService,
    private _layoutService: LayoutService,
    private _authService: AuthService,
    private _modalEmissionPointsService: ModalEmissionPointsService,
    private _modalEmissionPointService: ModalEmissionPointService
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
     * Get the emissionPoints
     */
    this.emissionPoints$ = this._emissionPointService.emissionPoints$;
    /**
     *  Count Subscribe and readAll
     */
    this._emissionPointService
      .byTaxpayerRead(this.id_taxpayer, '')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((emissionPoints: EmissionPoint[]) => {
        /**
         * Update the counts
         */
        this.count = emissionPoints.length;
        /**
         * Mark for check
         */
        this._changeDetectorRef.markForCheck();
      });
    /**
     *  Count Subscribe
     */
    this._emissionPointService.emissionPoints$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((emissionPoints: EmissionPoint[]) => {
        /**
         * Update the counts
         */
        this.count = emissionPoints.length;
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
          return this._emissionPointService.byTaxpayerRead(
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
          this.createEmissionPoint();
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
   * Create Punto de emisión
   */
  createEmissionPoint(): void {
    this._angelConfirmationService
      .open({
        title: 'Añadir punto de emisión',
        message:
          '¿Estás seguro de que deseas añadir un nuevo punto de emisión? ¡Esta acción no se puede deshacer!',
      })
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((confirm: ActionAngelConfirmation) => {
        if (confirm === 'confirmed') {
          const id_user_ = this.data.user.id_user;
          /**
           * Create the punto de emisión
           */
          this._emissionPointService
            .createEmissionPoint(id_user_, this.id_taxpayer)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
              next: (_emissionPoint: EmissionPoint) => {
                if (_emissionPoint) {
                  this._notificationService.success(
                    'Punto de emisión agregado correctamente'
                  );
                  /**
                   * Go to new punto de emisión
                   */
                  // this.goToEntity(_emissionPoint.id_emission_point);
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
   * closeModalEmissionPoints
   */
  closeModalEmissionPoints(): void {
    this._modalEmissionPointsService.closeModalEmissionPoints();
  }
  /**
   * openModalEmissionPoint
   */
  openModalEmissionPoint(id_emission_point: string): void {
    this._modalEmissionPointService.openModalEmissionPoint(id_emission_point);
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
