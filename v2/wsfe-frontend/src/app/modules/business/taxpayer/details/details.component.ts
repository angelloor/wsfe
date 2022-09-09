import { angelAnimations } from '@angel/animations';
import { AngelAlertType } from '@angel/components/alert';
import {
  ActionAngelConfirmation,
  AngelConfirmationService,
} from '@angel/services/confirmation';
import { OverlayRef } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppInitialData, MessageAPI } from 'app/core/app/app.type';
import { LayoutService } from 'app/layout/layout.service';
import { company } from 'app/modules/core/company/company.data';
import { CompanyService } from 'app/modules/core/company/company.service';
import { Company } from 'app/modules/core/company/company.types';
import { TYPE_PROFILE } from 'app/modules/core/profile/profile.types';
import { typeUser } from 'app/modules/core/type-user/type-user.data';
import { TypeUserService } from 'app/modules/core/type-user/type-user.service';
import { TypeUser } from 'app/modules/core/type-user/type-user.types';
import { user } from 'app/modules/core/user/user.data';
import { User } from 'app/modules/core/user/user.types';
import { validation } from 'app/modules/core/validation/validation.data';
import { ValidationService } from 'app/modules/core/validation/validation.service';
import { Validation } from 'app/modules/core/validation/validation.types';
import { NotificationService } from 'app/shared/notification/notification.service';
import { SecurityCap } from 'app/utils/SecurityCap';
import { environment } from 'environments/environment';
import saveAs from 'file-saver';
import { FileInput } from 'ngx-material-file-input';
import { filter, fromEvent, merge, Subject, takeUntil } from 'rxjs';
import {
  TYPE_ACCOUNTING_OBLIGED_ENUM,
  TYPE_EMISSION_ENUM,
  _typeAccountingObliged,
  _typeEmission,
} from '../../business.types';
import { ModalEmissionPointsService } from '../emission-point/modal-emission-points/modal-emission-points.service';
import { ModalEstablishmentsService } from '../establishment/modal-establishments/modal-establishments.service';
import { ModalInstitutionsService } from '../institution/modal-institutions/modal-institutions.service';
import { TaxpayerListComponent } from '../list/list.component';
import { ModalSettingTaxpayerService } from '../setting-taxpayer/modal-setting-taxpayer/modal-setting-taxpayer.service';
import { TaxpayerService } from '../taxpayer.service';
import { Taxpayer } from '../taxpayer.types';

@Component({
  selector: 'taxpayer-details',
  templateUrl: './details.component.html',
  animations: angelAnimations,
})
export class TaxpayerDetailsComponent implements OnInit {
  _urlPathAvatar: string = environment.urlBackend + '/resource/img/avatar/';

  @ViewChild('avatarFileInput') private _avatarFileInput!: ElementRef;

  /**
   * TYPE_PROFILE
   */
  type_profile: TYPE_PROFILE = 'commonProfile';

  categoriesCompany: Company[] = [];
  selectedCompany: Company = company;

  categoriesUser: User[] = [];
  selectedUser: User = user;

  categoriesTypeUser: TypeUser[] = [];
  selectedTypeUser: TypeUser = typeUser;

  nameEntity: string = 'Contribuyente';
  private data!: AppInitialData;

  editMode: boolean = false;
  userId: string = '';

  /**
   * Type Enum
   */
  typeEmission: TYPE_EMISSION_ENUM[] = _typeEmission;
  typeAccountingObliged: TYPE_ACCOUNTING_OBLIGED_ENUM[] =
    _typeAccountingObliged;

  typeSelectEmission!: TYPE_EMISSION_ENUM;
  typeSelectAccountingObliged!: TYPE_ACCOUNTING_OBLIGED_ENUM;
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
  taxpayer!: Taxpayer;
  taxpayerForm!: FormGroup;
  private taxpayers!: Taxpayer[];

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
   * Validation
   */
  validationPassword: Validation = validation;
  validationDNI: Validation = validation;
  validationPhoneNumber: Validation = validation;
  /**
   * Validation
   */
  isUploadSignature: boolean = false;
  /**
   * Constructor
   */
  constructor(
    private _store: Store<{ global: AppInitialData }>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _taxpayerListComponent: TaxpayerListComponent,
    private _taxpayerService: TaxpayerService,
    @Inject(DOCUMENT) private _document: any,
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _notificationService: NotificationService,
    private _angelConfirmationService: AngelConfirmationService,
    private _layoutService: LayoutService,
    private _companyService: CompanyService,
    private _securityCap: SecurityCap,
    private _typeUserService: TypeUserService,
    private _validationService: ValidationService,
    private _modalInstitutionsService: ModalInstitutionsService,
    private _modalEstablishmentsService: ModalEstablishmentsService,
    private _modalEmissionPointsService: ModalEmissionPointsService,
    private _modalSettingTaxpayerService: ModalSettingTaxpayerService
  ) {}

  /** ----------------------------------------------------------------------------------------------------- */
  /** @ Lifecycle hooks
	  /** ----------------------------------------------------------------------------------------------------- */

  /**
   * On init
   */
  ngOnInit(): void {
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
      this.type_profile = this.data.user.type_user.profile.type_profile;
    });
    /**
     * Open the drawer
     */
    this._taxpayerListComponent.matDrawer.open();
    /**
     * Create the taxpayer form
     */
    this.taxpayerForm = this._formBuilder.group({
      id_taxpayer: [''],
      id_company: ['', [Validators.required]],
      /**
       * User
       */
      id_user: [''],
      id_setting_taxpayer: [''],
      name_user: [
        '',
        [Validators.required, Validators.maxLength(320), Validators.email],
      ],
      password_user: ['', [Validators.required, Validators.maxLength(250)]],
      avatar_user: [''],
      status_user: ['', [Validators.required]],

      id_type_user: ['', [Validators.required]],

      id_person: [''],
      dni_person: ['', [Validators.required, Validators.maxLength(20)]],
      name_person: ['', [Validators.required, Validators.maxLength(150)]],
      last_name_person: ['', [Validators.required, Validators.maxLength(150)]],
      address_person: ['', [Validators.maxLength(150)]],
      phone_person: ['', [Validators.maxLength(13)]],

      id_academic: [''],
      title_academic: ['', [Validators.maxLength(250)]],
      abbreviation_academic: ['', [Validators.maxLength(50)]],
      nivel_academic: ['', [Validators.maxLength(100)]],

      id_job: [''],
      name_job: ['', [Validators.maxLength(200)]],
      address_job: ['', [Validators.maxLength(200)]],
      phone_job: ['', [Validators.maxLength(13)]],
      position_job: ['', [Validators.maxLength(150)]],
      /**
       * User
       */
      type_emission: ['', [Validators.required]],
      business_name_taxpayer: [
        '',
        [Validators.required, Validators.maxLength(300)],
      ],
      tradename_taxpayer: [
        '',
        [Validators.required, Validators.maxLength(300)],
      ],
      ruc_taxpayer: ['', [Validators.required, Validators.maxLength(13)]],
      dir_matriz_taxpayer: [
        '',
        [Validators.required, Validators.maxLength(300)],
      ],
      signature_password_taxpayer: [
        '',
        [Validators.required, Validators.maxLength(250)],
      ],
      signature_path_taxpayer: [
        '',
        [Validators.required, Validators.maxLength(100)],
      ],
      removablefileInitial: [''],
      status_taxpayer: ['', [Validators.required]],
      accounting_obliged: ['', [Validators.required]],
      status_by_batch_taxpayer: ['', [Validators.required]],
    });
    /**
     * Validations
     */
    this._validationService.validationsActive$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((validations: Validation[]) => {
        /**
         * validationPassword
         */
        if (
          !validations.find(
            (validation) => validation.type_validation == 'validationPassword'
          )
        ) {
          this._validationService
            .byTypeValidationRead('validationPassword')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
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
        } else {
          this.validationPassword = validations.find(
            (validation) => validation.type_validation == 'validationPassword'
          )!;
          /**
           * Set Validation Pattern
           */
          if (this.validationPassword.type_validation == 'validationPassword') {
            /**
             * Parse to String RegExp to RegExp
             */
            let validationPasswordRegExp = new RegExp(
              this.validationPassword.pattern_validation
            );
            /**
             * Set Validators
             */
            this.taxpayerForm.controls['password_user'].setValidators([
              Validators.required,
              Validators.maxLength(250),
              Validators.pattern(validationPasswordRegExp),
            ]);
          } else {
            this.taxpayerForm.controls['password_user'].setValidators([
              Validators.required,
              Validators.maxLength(250),
            ]);
          }
        }
        /**
         * validationDNI
         */
        if (
          !validations.find(
            (validation) => validation.type_validation == 'validationDNI'
          )
        ) {
          this._validationService
            .byTypeValidationRead('validationDNI')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
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
        } else {
          this.validationDNI = validations.find(
            (validation) => validation.type_validation == 'validationDNI'
          )!;
          /**
           * Set Validation Pattern
           */
          if (this.validationDNI.type_validation == 'validationDNI') {
            /**
             * Parse to String RegExp to RegExp
             */
            let validationDNIRegExp = new RegExp(
              this.validationDNI.pattern_validation
            );
            /**
             * Set Validators
             */
            this.taxpayerForm.controls['dni_person'].setValidators([
              Validators.required,
              Validators.maxLength(20),
              Validators.pattern(validationDNIRegExp),
            ]);
          } else {
            this.taxpayerForm.controls['dni_person'].setValidators([
              Validators.required,
              Validators.maxLength(20),
            ]);
          }
        }
        /**
         * validationPhoneNumber
         */
        if (
          !validations.find(
            (validation) =>
              validation.type_validation == 'validationPhoneNumber'
          )
        ) {
          this._validationService
            .byTypeValidationRead('validationPhoneNumber')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
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
        } else {
          this.validationPhoneNumber = validations.find(
            (validation) =>
              validation.type_validation == 'validationPhoneNumber'
          )!;
          /**
           * Set Validation Pattern
           */
          if (
            this.validationPhoneNumber.type_validation ==
            'validationPhoneNumber'
          ) {
            /**
             * Parse to String RegExp to RegExp
             */
            let validationPhoneNumberRegExp = new RegExp(
              this.validationPhoneNumber.pattern_validation
            );
            /**
             * Set Validators
             */
            this.taxpayerForm.controls['phone_person'].setValidators([
              Validators.required,
              Validators.maxLength(13),
              Validators.pattern(validationPhoneNumberRegExp),
            ]);
            this.taxpayerForm.controls['phone_job'].setValidators([
              Validators.required,
              Validators.maxLength(13),
              Validators.pattern(validationPhoneNumberRegExp),
            ]);
          } else {
            this.taxpayerForm.controls['phone_person'].setValidators([
              Validators.required,
              Validators.maxLength(13),
            ]);
            this.taxpayerForm.controls['phone_job'].setValidators([
              Validators.required,
              Validators.maxLength(13),
            ]);
          }
        }
      });
    /**
     * Validations
     */
    /**
     * Get the taxpayers
     */
    this._taxpayerService.taxpayers$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((taxpayers: Taxpayer[]) => {
        this.taxpayers = taxpayers;
        /**
         * Mark for check
         */
        this._changeDetectorRef.markForCheck();
      });
    /**
     * Get the taxpayer
     */
    this._taxpayerService.taxpayer$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((taxpayer: Taxpayer) => {
        /**
         * Open the drawer in case it is closed
         */
        this._taxpayerListComponent.matDrawer.open();
        /**
         * Get the taxpayer
         */
        this.taxpayer = taxpayer;
        /**
         * Creamos un objeto file para ponerlo dentro del imput para que no lo puedan remplazar
         */
        if (this.taxpayer.signature_path_taxpayer) {
          const file = new File(
            ['signature'],
            this.taxpayer.signature_path_taxpayer,
            {
              type: 'application/pdf',
            }
          );
          this.taxpayerForm
            .get('removablefileInitial')
            ?.patchValue(new FileInput([file]));
        }
        /**
         * Type Enum
         */
        this.typeSelectEmission = this.typeEmission.find(
          (emission) => emission.value_type == this.taxpayer.type_emission
        )!;
        this.typeSelectAccountingObliged = this.typeAccountingObliged.find(
          (accountingObliged) =>
            accountingObliged.value_type == this.taxpayer.accounting_obliged
        )!;
        /**
         * Type Enum
         */

        // Company
        this._companyService
          .readAllCompany()
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((companys: Company[]) => {
            this.categoriesCompany = companys;

            this.selectedCompany = this.categoriesCompany.find(
              (item) =>
                item.id_company == this.taxpayer.company.id_company.toString()
            )!;
          });

        // TypeUser
        this._typeUserService
          .readAllTypeUser()
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((typeUser: TypeUser[]) => {
            this.categoriesTypeUser = typeUser;

            this.selectedTypeUser = this.categoriesTypeUser.find(
              (item) =>
                item.id_type_user ==
                this.taxpayer.user.type_user.id_type_user.toString()
            )!;
          });

        /**
         * Patch values to the form
         */
        this.patchForm();
        /**
         * Toggle the edit mode off
         */
        if (!this.isUploadSignature) {
          this.toggleEditMode(false);
        }
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
          /**
           * Close Drawer
           */
          this.closeDrawer();
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
    this.taxpayerForm.patchValue({
      ...this.taxpayer,
      password_user: this.aesDecrypt(this.taxpayer.user.password_user),

      id_company: this.taxpayer.company.id_company,
      id_user: this.taxpayer.user.id_user,
      id_setting_taxpayer: this.taxpayer.setting_taxpayer!.id_setting_taxpayer,
      name_user: this.taxpayer.user.name_user,
      signature_password_taxpayer: this.aesDecrypt(
        this.taxpayer.signature_password_taxpayer
      ),
      signature_path_taxpayer: this.taxpayer.signature_path_taxpayer,
      avatar_user: this.taxpayer.user.avatar_user,
      status_user: this.taxpayer.user.status_user,

      id_type_user: this.taxpayer.user.type_user.id_type_user,

      id_person: this.taxpayer.user.person.id_person,
      dni_person: this.taxpayer.user.person.dni_person,
      name_person: this.taxpayer.user.person.name_person,
      last_name_person: this.taxpayer.user.person.last_name_person,
      address_person: this.taxpayer.user.person.address_person,
      phone_person: this.taxpayer.user.person.phone_person,

      id_academic: this.taxpayer.user.person.academic.id_academic,
      title_academic: this.taxpayer.user.person.academic.title_academic,
      abbreviation_academic:
        this.taxpayer.user.person.academic.abbreviation_academic,
      nivel_academic: this.taxpayer.user.person.academic.nivel_academic,
      id_job: this.taxpayer.user.person.job.id_job,
      name_job: this.taxpayer.user.person.job.name_job,
      address_job: this.taxpayer.user.person.job.address_job,
      phone_job: this.taxpayer.user.person.job.phone_job,
      position_job: this.taxpayer.user.person.job.position_job,
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
   * changeStatusByBatchTaxpayer
   */
  changeStatusByBatchTaxpayer(): void {
    const taxpayer = this.taxpayerForm.getRawValue();
    const id_user_ = this.data.user.id_user;
    const id_taxpayer = taxpayer.id_taxpayer;
    const status_by_batch_taxpayer = taxpayer.status_by_batch_taxpayer;

    this._taxpayerService
      .changeStatusByBatchTaxpayer(
        id_user_,
        id_taxpayer,
        status_by_batch_taxpayer
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
   * Close the drawer
   */
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._taxpayerListComponent.matDrawer.close();
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
   * Update the taxpayer
   */
  updateTaxpayer(): void {
    this.isUploadSignature = false;
    /**
     * Get the taxpayer
     */
    const id_user_ = this.data.user.id_user;
    let taxpayer = this.taxpayerForm.getRawValue();
    /**
     *  change the default name
     */
    if (
      taxpayer.business_name_taxpayer.trim() == 'Razón social (Por defecto)' ||
      taxpayer.tradename_taxpayer.trim() == 'Nombre comercial (Por defecto)' ||
      taxpayer.ruc_taxpayer.trim() == '(Por defecto)' ||
      taxpayer.name_user.trim() == 'new_user@wsfe.com' ||
      taxpayer.dni_person.trim() == 'DNI (Por defecto)'
    ) {
      this._notificationService.warn(
        'Cambia los valores por defecto del nuevo contribuyente'
      );
      return;
    }
    /**
     * Delete whitespace (trim() the atributes type string)
     */
    taxpayer = {
      ...taxpayer,
      business_name_taxpayer: taxpayer.business_name_taxpayer.trim(),
      tradename_taxpayer: taxpayer.tradename_taxpayer.trim(),
      ruc_taxpayer: taxpayer.ruc_taxpayer.trim(),
      dir_matriz_taxpayer: taxpayer.dir_matriz_taxpayer.trim(),
      signature_password_taxpayer: this.aesEncrypt(
        taxpayer.signature_password_taxpayer.trim()
      ),
      id_user_: parseInt(id_user_),
      id_taxpayer: parseInt(taxpayer.id_taxpayer),
      company: {
        id_company: parseInt(taxpayer.id_company),
      },
      user: {
        id_user: parseInt(taxpayer.id_user),
        person: {
          id_person: parseInt(taxpayer.id_person),
          academic: {
            id_academic: parseInt(taxpayer.id_academic),
            title_academic: taxpayer.title_academic.trim(),
            abbreviation_academic: taxpayer.abbreviation_academic.trim(),
            nivel_academic: taxpayer.nivel_academic.trim(),
          },
          job: {
            id_job: parseInt(taxpayer.id_job),
            name_job: taxpayer.name_job.trim(),
            address_job: taxpayer.address_job.trim(),
            phone_job: taxpayer.phone_job.trim(),
            position_job: taxpayer.position_job.trim(),
          },
          dni_person: taxpayer.dni_person.trim(),
          name_person: taxpayer.name_person.trim(),
          last_name_person: taxpayer.last_name_person.trim(),
          address_person: taxpayer.address_person.trim(),
          phone_person: taxpayer.phone_person.trim(),
        },
        type_user: {
          id_type_user: parseInt(taxpayer.id_type_user),
        },
        name_user: taxpayer.name_user.trim(),
        password_user: this.aesEncrypt(taxpayer.password_user.trim()),
        avatar_user: taxpayer.avatar_user,
        status_user: taxpayer.status_user,
      },
      setting_taxpayer: {
        id_setting_taxpayer: parseInt(taxpayer.id_setting_taxpayer),
      },
      /**
       * Generate structure of second level the entity (is important add the ids of entity)
       * similar the return of read
       */
    };

    delete taxpayer.id_company;
    delete taxpayer.id_user;
    delete taxpayer.id_person;
    delete taxpayer.id_academic;
    delete taxpayer.title_academic;
    delete taxpayer.abbreviation_academic;
    delete taxpayer.nivel_academic;
    delete taxpayer.id_job;
    delete taxpayer.name_job;
    delete taxpayer.address_job;
    delete taxpayer.phone_job;
    delete taxpayer.position_job;
    delete taxpayer.dni_person;
    delete taxpayer.name_person;
    delete taxpayer.last_name_person;
    delete taxpayer.address_person;
    delete taxpayer.phone_person;
    delete taxpayer.id_type_user;
    delete taxpayer.name_user;
    delete taxpayer.password_user;
    delete taxpayer.avatar_user;
    delete taxpayer.status_user;
    /**
     * Update
     */
    this._taxpayerService
      .updateTaxpayer(taxpayer)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (_taxpayer: Taxpayer) => {
          if (_taxpayer) {
            this._notificationService.success(
              'Contribuyente actualizado correctamente'
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
   * Delete the taxpayer
   */
  deleteTaxpayer(): void {
    this._angelConfirmationService
      .open({
        title: 'Eliminar contribuyente',
        message:
          '¿Estás seguro de que deseas eliminar este contribuyente? ¡Esta acción no se puede deshacer!',
      })
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((confirm: ActionAngelConfirmation) => {
        if (confirm === 'confirmed') {
          /**
           * Get the current taxpayer's id
           */
          const id_user_ = this.data.user.id_user;
          const id_taxpayer = this.taxpayer.id_taxpayer;
          /**
           * Get the next/previous taxpayer's id
           */
          const currentIndex = this.taxpayers.findIndex(
            (item) => item.id_taxpayer === id_taxpayer
          );

          const nextIndex =
            currentIndex +
            (currentIndex === this.taxpayers.length - 1 ? -1 : 1);
          const nextId =
            this.taxpayers.length === 1 &&
            this.taxpayers[0].id_taxpayer === id_taxpayer
              ? null
              : this.taxpayers[nextIndex].id_taxpayer;
          /**
           * Delete the taxpayer
           */
          this._taxpayerService
            .deleteTaxpayer(id_user_, id_taxpayer)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
              next: (response: boolean) => {
                if (response) {
                  /**
                   * Return if the taxpayer wasn't deleted...
                   */
                  this._notificationService.success(
                    'Contribuyente eliminado correctamente'
                  );
                  /**
                   * Get the current activated route
                   */
                  let route = this._activatedRoute;
                  while (route.firstChild) {
                    route = route.firstChild;
                  }
                  /**
                   * Navigate to the next taxpayer if available
                   */
                  if (nextId) {
                    this._router.navigate(['../', nextId], {
                      relativeTo: route,
                    });
                  } else {
                    /**
                     * Otherwise, navigate to the parent
                     */
                    this._router.navigate(['../'], { relativeTo: route });
                  }
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
          /**
           * Mark for check
           */
          this._changeDetectorRef.markForCheck();
        }
        this._layoutService.setOpenModal(false);
      });
  }
  /**
   * aesDecrypt
   * @param textEncrypted
   * @returns
   */
  aesDecrypt(textEncrypted: string) {
    return this._securityCap.aesDecrypt(textEncrypted);
  }
  /**
   * aesEncrypt
   * @param text
   * @returns
   */
  aesEncrypt(text: string) {
    return this._securityCap.aesEncrypt(text);
  }
  /**
   * Upload avatar
   *
   * @param fileList
   */
  uploadAvatar(fileList: FileList, user: User): void {
    // Return if canceled
    if (!fileList.length) {
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png'];
    const file = fileList[0];

    // Return if the file is not allowed
    if (!allowedTypes.includes(file.type)) {
      return;
    }

    // Upload the avatar
    this._taxpayerService
      .uploadAvatarFromTaxpayer(user, file, this.data.user)
      .subscribe();
    // Set Edit mode in true
    this.editMode = false;
  }

  /**
   * Remove the avatar
   */
  removeAvatar(user: User): void {
    this._taxpayerService
      .removeAvatarFromTaxpayer(user, this.data.user)
      .subscribe();
    // Set the file input value as null
    this._avatarFileInput.nativeElement.value = null;
    // Set Edit mode in true
    this.editMode = false;
  }
  /**
   * uploadSignature
   * @param target
   */
  uploadSignature(target: any): void {
    this.isUploadSignature = true;
    const id_user_ = this.data.user.id_user;
    const files: FileList = target.files;
    const file: File = files[0];

    this._taxpayerService
      .uploadSignature(file, id_user_, this.taxpayer.id_taxpayer)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response) {
            this._notificationService.success('Archivo subido correctamente');
          } else {
            this._notificationService.error(
              'Ocurrió un error subiendo el archivo'
            );
          }
          /**
           * Mark for check
           */
          this._changeDetectorRef.markForCheck();
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
   * downloadSignature
   */
  downloadSignature() {
    const id_user_ = this.data.user.id_user;

    const signature_path_taxpayer =
      this.taxpayerForm.getRawValue().signature_path_taxpayer;

    this._taxpayerService
      .downloadSignature(id_user_, signature_path_taxpayer)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (dataSource: Blob) => {
          if (dataSource) {
            saveAs(dataSource, signature_path_taxpayer);
          } else {
            this._notificationService.error(
              'Ocurrió un error descargando el archivo'
            );
          }
          /**
           * Mark for check
           */
          this._changeDetectorRef.markForCheck();
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
   * deleteSignature
   */
  deleteSignature() {
    this.isUploadSignature = true;
    const id_user_ = this.data.user.id_user;

    this._taxpayerService
      .removeSignature(id_user_, this.taxpayer.id_taxpayer)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (response) {
            this._notificationService.success(
              'Archivo eliminado correctamente'
            );
          } else {
            this._notificationService.error(
              'Ocurrió un error eliminado el archivo'
            );
          }
          /**
           * Mark for check
           */
          this._changeDetectorRef.markForCheck();
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
   * openModalInstitutions
   */
  openModalInstitutions() {
    this._modalInstitutionsService.openModalInstitutions(
      this.taxpayer.id_taxpayer
    );
  }
  /**
   * openModalEstablishments
   */
  openModalEstablishments() {
    this._modalEstablishmentsService.openModalEstablishments(
      this.taxpayer.id_taxpayer
    );
  }
  /**
   * openModalEmissionPoints
   */
  openModalEmissionPoints() {
    this._modalEmissionPointsService.openModalEmissionPoints(
      this.taxpayer.id_taxpayer
    );
  }
  /**
   * openModalSettingTaxpayer
   */
  openModalSettingTaxpayer() {
    this._modalSettingTaxpayerService.openModalSettingTaxpayer(
      this.taxpayer.id_taxpayer,
      this.taxpayer.setting_taxpayer?.id_setting_taxpayer!
    );
  }
}
