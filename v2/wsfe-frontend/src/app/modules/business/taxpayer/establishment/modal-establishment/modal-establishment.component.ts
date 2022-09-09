import { angelAnimations } from '@angel/animations';
import { AngelAlertType } from '@angel/components/alert';
import {
  ActionAngelConfirmation,
  AngelConfirmationService,
} from '@angel/services/confirmation';
import { OverlayRef } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppInitialData, MessageAPI } from 'app/core/app/app.type';
import { LayoutService } from 'app/layout/layout.service';
import { NotificationService } from 'app/shared/notification/notification.service';
import { GlobalValidator } from 'app/shared/validator/global.validator';
import { filter, fromEvent, merge, Subject, takeUntil } from 'rxjs';
import { EstablishmentService } from '../establishment.service';
import { Establishment } from '../establishment.types';
import { ModalEstablishmentService } from './modal-establishment.service';

@Component({
  selector: 'app-modal-establishment',
  templateUrl: './modal-establishment.component.html',
  animations: angelAnimations,
})
export class ModalEstablishmentComponent implements OnInit {
  id_establishment: string = '';
  nameEntity: string = 'Establecimiento';
  private data!: AppInitialData;

  editMode: boolean = false;
  /**
   * Alert
   */
  alert: { type: AngelAlertType; message: string } = {
    type: 'error',
    message: '',
  };
  showAlert: boolean = false;
  /**
   * Alert
   */
  establishment!: Establishment;
  establishmentForm!: FormGroup;
  private establishments!: Establishment[];

  private _tagsPanelOverlayRef!: OverlayRef;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  /**
   * isOpenModal
   */
  isOpenModal: boolean = false;
  /**
   * isOpenModal
   */
  /**
   * Constructor
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    private _store: Store<{ global: AppInitialData }>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _establishmentService: EstablishmentService,
    @Inject(DOCUMENT) private _document: any,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _notificationService: NotificationService,
    private _angelConfirmationService: AngelConfirmationService,
    private _layoutService: LayoutService,
    private _modalEstablishmentService: ModalEstablishmentService
  ) {}

  /** ----------------------------------------------------------------------------------------------------- */
  /** @ Lifecycle hooks
	  /** ----------------------------------------------------------------------------------------------------- */

  /**
   * On init
   */
  ngOnInit(): void {
    this.id_establishment = this._data.id_establishment;
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
     * Create the establishment form
     */
    this.establishmentForm = this._formBuilder.group({
      id_establishment: [''],
      taxpayer: ['', [Validators.required]],
      value_establishment: [
        '',
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.minLength(3),
          Validators.pattern(/^[0-9]*$/),
          GlobalValidator.cannotContainSpace,
        ],
      ],
      description_establishment: [
        '',
        [Validators.required, Validators.maxLength(250)],
      ],
    });
    /**
     * Get the establishment
     */
    this._establishmentService
      .readEstablishmentByIdLocal(this.id_establishment)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
    /**
     * Get the establishments
     */
    this._establishmentService.establishments$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((establishments: Establishment[]) => {
        this.establishments = establishments;
        /**
         * Mark for check
         */
        this._changeDetectorRef.markForCheck();
      });
    /**
     * Get the establishment
     */
    this._establishmentService.establishment$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((establishment: Establishment) => {
        /**
         * Get the establishment
         */
        this.establishment = establishment;
        /**
         * Patch values to the form
         */
        this.patchForm();
        /**
         * Toggle the edit mode off
         */
        this.toggleEditMode(false);
        /**
         * Mark for check
         */
        this._changeDetectorRef.markForCheck();
      });
    /**
     * Shortcuts
     */
    merge(
      fromEvent(this._document, 'keydown').pipe(
        takeUntil(this._unsubscribeAll),
        filter<KeyboardEvent | any>((e) => e.key === 'Escape')
      )
    )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((keyUpOrKeyDown) => {
        /**
         * Shortcut Escape
         */
        if (!this.isOpenModal && keyUpOrKeyDown.key == 'Escape') {
          /**
           * Navigate parentUrl
           */
          const parentUrl = this._router.url.split('/').slice(0, -1).join('/');
          this._router.navigate([parentUrl]);
        }
      });
    /**
     * Shortcuts
     */
  }
  /**
   * Pacth the form with the information of the database
   */
  patchForm(): void {
    this.establishmentForm.patchValue(this.establishment);
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
    /**
     * Dispose the overlays if they are still on the DOM
     */
    if (this._tagsPanelOverlayRef) {
      this._tagsPanelOverlayRef.dispose();
    }
  }

  /** ----------------------------------------------------------------------------------------------------- */
  /** @ Public methods
	  /** ----------------------------------------------------------------------------------------------------- */
  /**
   * Toggle edit mode
   * @param editMode
   */
  toggleEditMode(editMode: boolean | null = null): void {
    this.patchForm();

    if (editMode === null) {
      this.editMode = !this.editMode;
    } else {
      this.editMode = editMode;
    }
    /**
     * Mark for check
     */
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Update the establishment
   */
  updateEstablishment(): void {
    /**
     * Get the establishment
     */
    const id_user_ = this.data.user.id_user;
    let establishment = this.establishmentForm.getRawValue();
    /**
     * Delete whitespace (trim() the atributes type string)
     */
    establishment = {
      ...establishment,
      value_establishment: establishment.value_establishment.trim(),
      description_establishment: establishment.description_establishment.trim(),
      id_user_: parseInt(id_user_),
      id_establishment: parseInt(establishment.id_establishment),
      taxpayer: {
        id_taxpayer: parseInt(establishment.taxpayer.id_taxpayer),
      },
    };
    /**
     * Update
     */
    this._establishmentService
      .updateEstablishment(establishment)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (_establishment: Establishment) => {
          if (_establishment) {
            this._notificationService.success(
              'Establecimiento actualizado correctamente'
            );
            /**
             * Toggle the edit mode off
             */
            this.toggleEditMode(false);
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
  /**
   * Delete the establishment
   */
  deleteEstablishment(): void {
    this._angelConfirmationService
      .open({
        title: 'Eliminar establecimiento',
        message:
          '¿Estás seguro de que deseas eliminar este establecimiento? ¡Esta acción no se puede deshacer!',
      })
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((confirm: ActionAngelConfirmation) => {
        if (confirm === 'confirmed') {
          /**
           * Get the current establishment's id
           */
          const id_user_ = this.data.user.id_user;
          const id_establishment = this.establishment.id_establishment;
          /**
           * Delete the establishment
           */
          this._establishmentService
            .deleteEstablishment(id_user_, id_establishment)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
              next: (response: boolean) => {
                if (response) {
                  /**
                   * Return if the establishment wasn't deleted...
                   */
                  this._notificationService.success(
                    'Establecimiento eliminado correctamente'
                  );
                  this.closeModalEstablishment();
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
          /**
           * Mark for check
           */
          this._changeDetectorRef.markForCheck();
        }
        this._layoutService.setOpenModal(false);
      });
  }
  /**
   * closeModalEstablishment
   */
  closeModalEstablishment() {
    this._modalEstablishmentService.closeModalEstablishment();
  }
}
