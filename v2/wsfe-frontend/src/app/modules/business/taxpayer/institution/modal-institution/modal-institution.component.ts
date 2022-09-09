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
  TYPE_ENVIRONMENT_ENUM,
  _typeEnvironment,
} from 'app/modules/business/business.types';
import { NotificationService } from 'app/shared/notification/notification.service';
import { GlobalValidator } from 'app/shared/validator/global.validator';
import { filter, fromEvent, merge, Subject, takeUntil } from 'rxjs';
import { InstitutionService } from '../institution.service';
import { Institution } from '../institution.types';
import { ModalSequencesService } from '../sequence/modal-sequences/modal-sequences.service';
import { ModalInstitutionService } from './modal-institution.service';

@Component({
  selector: 'app-modal-institution',
  templateUrl: './modal-institution.component.html',
  animations: angelAnimations,
})
export class ModalInstitutionComponent implements OnInit {
  _dialogRef: any;
  id_institution: string = '';

  nameEntity: string = 'Institución';
  private data!: AppInitialData;

  editMode: boolean = false;
  /**
   * Type Enum
   */
  typeEnvironment: TYPE_ENVIRONMENT_ENUM[] = _typeEnvironment;

  typeSelect!: TYPE_ENVIRONMENT_ENUM;
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
  institution!: Institution;
  institutionForm!: FormGroup;
  private institutions!: Institution[];

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
    private _institutionService: InstitutionService,
    @Inject(DOCUMENT) private _document: any,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _notificationService: NotificationService,
    private _angelConfirmationService: AngelConfirmationService,
    private _layoutService: LayoutService,
    private _modalInstitutionService: ModalInstitutionService,
    private _modalSequencesService: ModalSequencesService
  ) {}

  /** ----------------------------------------------------------------------------------------------------- */
  /** @ Lifecycle hooks
	  /** ----------------------------------------------------------------------------------------------------- */

  /**
   * On init
   */
  ngOnInit(): void {
    this.id_institution = this._data.id_institution;
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
     * Create the institution form
     */
    this.institutionForm = this._formBuilder.group({
      id_institution: [''],
      taxpayer: ['', [Validators.required]],
      type_environment: ['', [Validators.required]],
      name_institution: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          GlobalValidator.cannotContainSpace,
        ],
      ],
      description_institution: [
        '',
        [Validators.required, Validators.maxLength(250)],
      ],
      address_institution: [
        '',
        [Validators.required, Validators.maxLength(300)],
      ],
      status_institution: ['', [Validators.required]],
      status_by_batch_institution: ['', [Validators.required]],
      deleted_institution: ['', [Validators.required]],
      value_sequence: [{ value: '', disabled: true }],
    });
    /**
     * Get the institution
     */
    this._institutionService
      .readInstitutionByIdLocal(this.id_institution)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
    /**
     * Get the institutions
     */
    this._institutionService.institutions$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((institutions: Institution[]) => {
        this.institutions = institutions;
        /**
         * Mark for check
         */
        this._changeDetectorRef.markForCheck();
      });
    /**
     * Get the institution
     */
    this._institutionService.institution$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((institution: Institution) => {
        /**
         * Get the institution
         */
        this.institution = institution;
        /**
         * Type Enum
         */
        this.typeSelect = this.typeEnvironment.find(
          (environment) =>
            environment.value_type == this.institution.type_environment
        )!;
        /**
         * Type Enum
         */

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
    this.institutionForm.patchValue(this.institution);
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
  changeStatusByBatchInstitution(): void {
    const institution = this.institutionForm.getRawValue();
    const id_user_ = this.data.user.id_user;
    const id_institution = institution.id_institution;
    const status_by_batch_institution = institution.status_by_batch_institution;

    this._institutionService
      .changeStatusByBatchInstitution(
        id_user_,
        id_institution,
        status_by_batch_institution
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._notificationService.success('Estado cambiado correctamente');
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
   * Update the institution
   */
  updateInstitution(): void {
    /**
     * Get the institution
     */
    const id_user_ = this.data.user.id_user;
    let institution = this.institutionForm.getRawValue();
    /**
     * Delete whitespace (trim() the atributes type string)
     */
    institution = {
      ...institution,
      name_institution: institution.name_institution.trim(),
      description_institution: institution.description_institution.trim(),
      address_institution: institution.address_institution.trim(),
      id_user_: parseInt(id_user_),
      id_institution: parseInt(institution.id_institution),
      taxpayer: {
        id_taxpayer: parseInt(institution.taxpayer.id_taxpayer),
      },
    };
    /**
     * Update
     */
    this._institutionService
      .updateInstitution(institution)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (_institution: Institution) => {
          if (_institution) {
            this._notificationService.success(
              'Institución actualizada correctamente'
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
   * Delete the institution
   */
  deleteInstitution(): void {
    this._angelConfirmationService
      .open({
        title: 'Eliminar institución',
        message:
          '¿Estás seguro de que deseas eliminar esta institución? ¡Esta acción no se puede deshacer!',
      })
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((confirm: ActionAngelConfirmation) => {
        if (confirm === 'confirmed') {
          const id_user_ = this.data.user.id_user;
          const id_institution = this.institution.id_institution;
          /**
           * Delete the institution
           */
          this._institutionService
            .deleteInstitution(id_user_, id_institution)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
              next: (response: boolean) => {
                if (response) {
                  /**
                   * Return if the institution wasn't deleted...
                   */
                  this._notificationService.success(
                    'Institución eliminada correctamente'
                  );
                  this.closeModalInstitution();
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
   * closeModalInstitution
   */
  closeModalInstitution(): void {
    this._modalInstitutionService.closeModalInstitution();
  }
  /**
   * openModalSequences
   */
  openModalSequences(): void {
    this._modalSequencesService.openModalSequences(
      this.institution.id_institution
    );
  }
}
