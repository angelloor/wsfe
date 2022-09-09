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
import { EmissionPointService } from '../emission-point.service';
import { EmissionPoint } from '../emission-point.types';
import { ModalEmissionPointService } from './modal-emission-point.service';

@Component({
  selector: 'app-modal-emission-point',
  templateUrl: './modal-emission-point.component.html',
  animations: angelAnimations,
})
export class ModalEmissionPointComponent implements OnInit {
  id_emission_point: string = '';
  nameEntity: string = 'Punto de emisión';
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
  emissionPoint!: EmissionPoint;
  emissionPointForm!: FormGroup;
  private emissionPoints!: EmissionPoint[];

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
    private _emissionPointService: EmissionPointService,
    @Inject(DOCUMENT) private _document: any,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _notificationService: NotificationService,
    private _angelConfirmationService: AngelConfirmationService,
    private _layoutService: LayoutService,
    private _modalEmissionPointService: ModalEmissionPointService
  ) {}

  /** ----------------------------------------------------------------------------------------------------- */
  /** @ Lifecycle hooks
	  /** ----------------------------------------------------------------------------------------------------- */

  /**
   * On init
   */
  ngOnInit(): void {
    this.id_emission_point = this._data.id_emission_point;
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
     * Create the emissionPoint form
     */
    this.emissionPointForm = this._formBuilder.group({
      id_emission_point: [''],
      taxpayer: ['', [Validators.required]],
      value_emission_point: [
        '',
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.minLength(3),
          Validators.pattern(/^[0-9]*$/),
          GlobalValidator.cannotContainSpace,
        ],
      ],
      description_emission_point: [
        '',
        [Validators.required, Validators.maxLength(250)],
      ],
    });
    /**
     * Get the emissionPoint
     */
    this._emissionPointService
      .readEmissionPointByIdLocal(this.id_emission_point)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
    /**
     * Get the emissionPoints
     */
    this._emissionPointService.emissionPoints$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((emissionPoints: EmissionPoint[]) => {
        this.emissionPoints = emissionPoints;
        /**
         * Mark for check
         */
        this._changeDetectorRef.markForCheck();
      });
    /**
     * Get the emissionPoint
     */
    this._emissionPointService.emissionPoint$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((emissionPoint: EmissionPoint) => {
        /**
         * Get the emissionPoint
         */
        this.emissionPoint = emissionPoint;
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
    this.emissionPointForm.patchValue(this.emissionPoint);
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
   * Update the emissionPoint
   */
  updateEmissionPoint(): void {
    /**
     * Get the emissionPoint
     */
    const id_user_ = this.data.user.id_user;
    let emissionPoint = this.emissionPointForm.getRawValue();
    /**
     * Delete whitespace (trim() the atributes type string)
     */
    emissionPoint = {
      ...emissionPoint,
      value_emission_point: emissionPoint.value_emission_point.trim(),
      description_emission_point:
        emissionPoint.description_emission_point.trim(),
      id_user_: parseInt(id_user_),
      id_emission_point: parseInt(emissionPoint.id_emission_point),
      taxpayer: {
        id_taxpayer: parseInt(emissionPoint.taxpayer.id_taxpayer),
      },
    };
    /**
     * Update
     */
    this._emissionPointService
      .updateEmissionPoint(emissionPoint)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (_emissionPoint: EmissionPoint) => {
          if (_emissionPoint) {
            this._notificationService.success(
              'Punto de emisión actualizado correctamente'
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
   * Delete the emissionPoint
   */
  deleteEmissionPoint(): void {
    this._angelConfirmationService
      .open({
        title: 'Eliminar punto de emisión',
        message:
          '¿Estás seguro de que deseas eliminar este punto de emisión? ¡Esta acción no se puede deshacer!',
      })
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((confirm: ActionAngelConfirmation) => {
        if (confirm === 'confirmed') {
          /**
           * Get the current emissionPoint's id
           */
          const id_user_ = this.data.user.id_user;
          const id_emission_point = this.emissionPoint.id_emission_point;
          /**
           * Delete the emissionPoint
           */
          this._emissionPointService
            .deleteEmissionPoint(id_user_, id_emission_point)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
              next: (response: boolean) => {
                if (response) {
                  /**
                   * Return if the emissionPoint wasn't deleted...
                   */
                  this._notificationService.success(
                    'Punto de emisión eliminado correctamente'
                  );
                  this.closeModalEmissionPoint();
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
   * closeModalEmissionPoint
   */
  closeModalEmissionPoint() {
    this._modalEmissionPointService.closeModalEmissionPoint();
  }
}
