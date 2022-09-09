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
import {
  TYPE_ENVIRONMENT,
  TYPE_ENVIRONMENT_ENUM,
  TYPE_VOUCHER,
  TYPE_VOUCHER_ENUM,
  _typeEnvironment,
  _typeVoucher,
} from 'app/modules/business/business.types';
import { NotificationService } from 'app/shared/notification/notification.service';
import { GlobalValidator } from 'app/shared/validator/global.validator';
import { filter, fromEvent, merge, Subject, takeUntil } from 'rxjs';
import { emissionPoint } from '../../../emission-point/emission-point.data';
import { EmissionPointService } from '../../../emission-point/emission-point.service';
import { EmissionPoint } from '../../../emission-point/emission-point.types';
import { establishment } from '../../../establishment/establishment.data';
import { EstablishmentService } from '../../../establishment/establishment.service';
import { Establishment } from '../../../establishment/establishment.types';
import { SequenceService } from '../sequence.service';
import { Sequence } from '../sequence.types';
import { ModalSequenceService } from './modal-sequence.service';

@Component({
  selector: 'app-modal-sequence',
  templateUrl: './modal-sequence.component.html',
  animations: angelAnimations,
})
export class ModalSequenceComponent implements OnInit {
  id_sequence: string = '';

  categoriesEstablishment: Establishment[] = [];
  selectedEstablishment: Establishment = establishment;

  categoriesEmissionPoint: EmissionPoint[] = [];
  selectedEmissionPoint: EmissionPoint = emissionPoint;

  nameEntity: string = 'Secuencia';
  private data!: AppInitialData;

  editMode: boolean = false;

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
  sequence!: Sequence;
  sequenceForm!: FormGroup;
  private sequences!: Sequence[];

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
    private _sequenceService: SequenceService,
    @Inject(DOCUMENT) private _document: any,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _notificationService: NotificationService,
    private _angelConfirmationService: AngelConfirmationService,
    private _layoutService: LayoutService,
    private _establishmentService: EstablishmentService,
    private _emissionPointService: EmissionPointService,
    private _modalSequenceService: ModalSequenceService
  ) {}

  /** ----------------------------------------------------------------------------------------------------- */
  /** @ Lifecycle hooks
	  /** ----------------------------------------------------------------------------------------------------- */

  /**
   * On init
   */
  ngOnInit(): void {
    this.id_sequence = this._data.id_sequence;

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
     * Create the sequence form
     */
    this.sequenceForm = this._formBuilder.group({
      id_sequence: [''],
      institution: ['', [Validators.required]],
      id_establishment: ['', [Validators.required]],
      id_emission_point: ['', [Validators.required]],
      type_environment: ['', [Validators.required]],
      type_voucher: ['', [Validators.required]],
      number_code_sequence: [
        '',
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.minLength(8),
          Validators.pattern(/^[0-9]*$/),
          GlobalValidator.cannotContainSpace,
        ],
      ],
      status_sequence: ['', [Validators.required]],
      deleted_sequence: ['', [Validators.required]],
      value_sequence: [{ value: '', disabled: true }],
    });
    /**
     * Get the institution
     */
    this._sequenceService
      .readSequenceByIdLocal(this.id_sequence)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
    /**
     * Get the sequences
     */
    this._sequenceService.sequences$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((sequences: Sequence[]) => {
        this.sequences = sequences;
        /**
         * Mark for check
         */
        this._changeDetectorRef.markForCheck();
      });
    /**
     * Get the sequence
     */
    this._sequenceService.sequence$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((sequence: Sequence) => {
        /**
         * Get the sequence
         */
        this.sequence = sequence;

        /**
         * Type Enum
         */
        this.typeSelectEnvironment = this.typeEnvironment.find(
          (environment) =>
            environment.value_type == this.sequence.type_environment
        )!;
        this.typeSelectVoucher = this.typeVoucher.find(
          (voucher) => voucher.value_type == this.sequence.type_voucher
        )!;
        /**
         * Type Enum
         */

        // Establishment
        this._establishmentService
          .readAllEstablishment()
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((establishments: Establishment[]) => {
            this.categoriesEstablishment = establishments;

            this.selectedEstablishment = this.categoriesEstablishment.find(
              (item) =>
                item.id_establishment ==
                this.sequence.establishment.id_establishment.toString()
            )!;
          });

        // EmissionPoint
        this._emissionPointService
          .readAllEmissionPoint()
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((emission_points: EmissionPoint[]) => {
            this.categoriesEmissionPoint = emission_points;

            this.selectedEmissionPoint = this.categoriesEmissionPoint.find(
              (item) =>
                item.id_emission_point ==
                this.sequence.emission_point.id_emission_point.toString()
            )!;
          });

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
    this.sequenceForm.patchValue({
      ...this.sequence,
      id_establishment: this.sequence.establishment.id_establishment,
      id_emission_point: this.sequence.emission_point.id_emission_point,
    });
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
   * Update the sequence
   */
  updateSequence(): void {
    /**
     * Get the sequence
     */
    const id_user_ = this.data.user.id_user;
    let sequence = this.sequenceForm.getRawValue();
    /**
     * Delete whitespace (trim() the atributes type string)
     */
    sequence = {
      ...sequence,
      number_code_sequence: sequence.number_code_sequence.trim(),
      id_user_: parseInt(id_user_),
      id_sequence: parseInt(sequence.id_sequence),
      institution: {
        id_institution: parseInt(sequence.institution.id_institution),
      },
      establishment: {
        id_establishment: parseInt(sequence.id_establishment),
      },
      emission_point: {
        id_emission_point: parseInt(sequence.id_emission_point),
      },
    };
    /**
     * Update
     */
    this._sequenceService
      .updateSequence(sequence)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (_sequence: Sequence) => {
          if (_sequence) {
            this._notificationService.success(
              'Secuencia actualizada correctamente'
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
   * Delete the sequence
   */
  deleteSequence(): void {
    this._angelConfirmationService
      .open({
        title: 'Eliminar secuencia',
        message:
          '¿Estás seguro de que deseas eliminar esta secuencia? ¡Esta acción no se puede deshacer!',
      })
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((confirm: ActionAngelConfirmation) => {
        if (confirm === 'confirmed') {
          /**
           * Get the current sequence's id
           */
          const id_user_ = this.data.user.id_user;
          const id_sequence = this.sequence.id_sequence;
          /**
           * Delete the sequence
           */
          this._sequenceService
            .deleteSequence(id_user_, id_sequence)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
              next: (response: boolean) => {
                if (response) {
                  /**
                   * Return if the sequence wasn't deleted...
                   */
                  this._notificationService.success(
                    'Secuencia eliminada correctamente'
                  );
                  this.closeModalSequence();
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
   * closeModalSequence
   */
  closeModalSequence() {
    this._modalSequenceService.closeModalSequence();
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
}
