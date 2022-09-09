import {
  ActionAngelConfirmation,
  AngelConfirmationService,
} from '@angel/services/confirmation';
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
  _typeEnvironment,
} from 'app/modules/business/business.types';
import { NotificationService } from 'app/shared/notification/notification.service';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { InstitutionService } from '../institution.service';
import { Institution } from '../institution.types';
import { ModalInstitutionService } from '../modal-institution/modal-institution.service';
import { ModalInstitutionsService } from './modal-institutions.service';

@Component({
  selector: 'app-modal-institutions',
  templateUrl: './modal-institutions.component.html',
})
export class ModalInstitutionsComponent implements OnInit {
  id_taxpayer: string = '';
  count: number = 0;
  institutions$!: Observable<Institution[]>;

  private data!: AppInitialData;

  searchInputControl: FormControl = new FormControl();
  selectedInstitution!: Institution;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  /**
   * Type Enum
   */
  typeEnvironment: TYPE_ENVIRONMENT_ENUM[] = _typeEnvironment;
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
    private _modalInstitutionsService: ModalInstitutionsService,
    private _store: Store<{ global: AppInitialData }>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _institutionService: InstitutionService,
    private _notificationService: NotificationService,
    private _angelConfirmationService: AngelConfirmationService,
    private _layoutService: LayoutService,
    private _authService: AuthService,
    private _modalInstitutionService: ModalInstitutionService
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
     * Get the institutions
     */
    this.institutions$ = this._institutionService.institutions$;
    /**
     *  Count Subscribe and readAll
     */
    this._institutionService
      .byTaxpayerRead(this.id_taxpayer, '')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((institutions: Institution[]) => {
        /**
         * Update the counts
         */
        this.count = institutions.length;
        /**
         * Mark for check
         */
        this._changeDetectorRef.markForCheck();
      });
    /**
     *  Count Subscribe
     */
    this._institutionService.institutions$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((institutions: Institution[]) => {
        /**
         * Update the counts
         */
        this.count = institutions.length;
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
          return this._institutionService.byTaxpayerRead(
            this.id_taxpayer,
            query.toLowerCase()
          );
        })
      )
      .subscribe();
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
   * Create institution
   */
  createInstitution(): void {
    this._angelConfirmationService
      .open({
        title: 'Añadir institution',
        message:
          '¿Estás seguro de que deseas añadir una nueva institution? ¡Esta acción no se puede deshacer!',
      })
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((confirm: ActionAngelConfirmation) => {
        if (confirm === 'confirmed') {
          const id_user_ = this.data.user.id_user;
          /**
           * Create the institution
           */
          this._institutionService
            .createInstitution(id_user_, this.id_taxpayer)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
              next: (_institution: Institution) => {
                if (_institution) {
                  this._notificationService.success(
                    'institution agregada correctamente'
                  );
                  /**
                   * Go to new institution
                   */
                  this.openModalInstitution(_institution.id_institution);
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
   * openInstitution
   */
  openModalInstitution(id_institution: string) {
    this._modalInstitutionService.openModalInstitution(id_institution);
  }
  /**
   * closeModalInstitutions
   */
  closeModalInstitutions(): void {
    this._modalInstitutionsService.closeModalInstitutions();
  }
  /**
   * Track by function for ngFor loops
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
  /**
   * getTypeSelect
   */
  getTypeSelect(type_environment: TYPE_ENVIRONMENT): TYPE_ENVIRONMENT_ENUM {
    return this.typeEnvironment.find(
      (environment) => environment.value_type == type_environment
    )!;
  }
}
