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
import {
  TYPE_ENVIRONMENT,
  TYPE_ENVIRONMENT_ENUM,
  TYPE_VOUCHER,
  TYPE_VOUCHER_ENUM,
  _typeEnvironment,
  _typeVoucher,
} from 'app/modules/business/business.types';
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
import { ModalSequenceService } from '../modal-sequence/modal-sequence.service';
import { SequenceService } from '../sequence.service';
import { Sequence } from '../sequence.types';
import { ModalSequencesService } from './modal-sequences.service';

@Component({
  selector: 'app-modal-sequences',
  templateUrl: './modal-sequences.component.html',
})
export class ModalSequencesComponent implements OnInit {
  id_institution: string = '';
  count: number = 0;
  sequences$!: Observable<Sequence[]>;

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
  selectedSequence!: Sequence;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  /**
   * Type Enum
   */
  typeEnvironment: TYPE_ENVIRONMENT_ENUM[] = _typeEnvironment;
  typeSelectEnvironment!: TYPE_ENVIRONMENT_ENUM;

  typeVoucher: TYPE_VOUCHER_ENUM[] = _typeVoucher;
  typeSelectVoucher!: TYPE_VOUCHER_ENUM;
  /**
   * Type Enum
   */
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
    private _sequenceService: SequenceService,
    private _notificationService: NotificationService,
    private _angelConfirmationService: AngelConfirmationService,
    private _layoutService: LayoutService,
    private _authService: AuthService,
    private _modalSequencesService: ModalSequencesService,
    private _modalSequenceService: ModalSequenceService
  ) {}

  ngOnInit(): void {
    this.id_institution = this._data.id_institution;
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
     * Get the sequences
     */
    this.sequences$ = this._sequenceService.sequences$;
    /**
     *  Count Subscribe and readAll
     */
    this._sequenceService
      .byInstitutionRead(this.id_institution, '')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((sequences: Sequence[]) => {
        /**
         * Update the counts
         */
        this.count = sequences.length;
        /**
         * Mark for check
         */
        this._changeDetectorRef.markForCheck();
      });
    /**
     *  Count Subscribe
     */
    this._sequenceService.sequences$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((sequences: Sequence[]) => {
        /**
         * Update the counts
         */
        this.count = sequences.length;
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
          return this._sequenceService.byInstitutionRead(
            this.id_institution,
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
          this.createSequence();
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
   * Create Secuencia
   */
  createSequence(): void {
    this._angelConfirmationService
      .open({
        title: 'Añadir secuencia',
        message:
          '¿Estás seguro de que deseas añadir una nueva secuencia? ¡Esta acción no se puede deshacer!',
      })
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((confirm: ActionAngelConfirmation) => {
        if (confirm === 'confirmed') {
          const id_user_ = this.data.user.id_user;
          /**
           * Create the secuencia
           */
          this._sequenceService
            .createSequence(id_user_, this.id_institution)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
              next: (_sequence: Sequence) => {
                if (_sequence) {
                  this._notificationService.success(
                    'Secuencia agregada correctamente'
                  );
                  /**
                   * Go to new secuencia
                   */
                  this.openModalSequence(_sequence.id_sequence);
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
   * closeModalSequences
   */
  closeModalSequences() {
    this._modalSequencesService.closeModalSequences();
  }
  /**
   * openModalSequence
   */
  openModalSequence(id_sequence: string) {
    this._modalSequenceService.openModalSequence(id_sequence);
  }
  /**
   * getTypeSelectEnvironment
   */
  getTypeSelectEnvironment(
    type_environment: TYPE_ENVIRONMENT
  ): TYPE_ENVIRONMENT_ENUM {
    return this.typeEnvironment.find(
      (environment) => environment.value_type == type_environment
    )!;
  }
  /**
   * getTypeSelectEnvironment
   */
  getTypeSelectVoucher(type_voucher: TYPE_VOUCHER): TYPE_VOUCHER_ENUM {
    return this.typeVoucher.find(
      (voucher) => voucher.value_type == type_voucher
    )!;
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
