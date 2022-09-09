import { angelAnimations } from '@angel/animations';
import { AngelAlertType } from '@angel/components/alert';
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
import saveAs from 'file-saver';
import { FileInput } from 'ngx-material-file-input';
import { filter, fromEvent, merge, Subject, takeUntil } from 'rxjs';
import { mailServer } from '../mail-server/mail-server.data';
import { MailServerService } from '../mail-server/mail-server.service';
import { MailServer } from '../mail-server/mail-server.types';
import { ModalMailServersService } from '../mail-server/modal-mail-servers/modal-mail-servers.service';
import { settingTaxpayer } from '../setting-taxpayer.data';
import { SettingTaxpayerService } from '../setting-taxpayer.service';
import { SettingTaxpayer } from '../setting-taxpayer.types';
import { ModalSettingTaxpayerService } from './modal-setting-taxpayer.service';

@Component({
  selector: 'app-modal-setting-taxpayer',
  templateUrl: './modal-setting-taxpayer.component.html',
  animations: angelAnimations,
})
export class ModalSettingTaxpayerComponent implements OnInit {
  id_taxpayer: string = '';
  id_setting_taxpayer: string = '';
  categoriesMailServer: MailServer[] = [];
  selectedMailServer: MailServer = mailServer;

  nameEntity: string = 'Configuración';
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
  settingTaxpayer: SettingTaxpayer = settingTaxpayer;
  settingTaxpayerForm!: FormGroup;
  private settingTaxpayers!: SettingTaxpayer[];

  private _tagsPanelOverlayRef!: OverlayRef;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  /**
   * isOpenModal
   */
  isOpenModal: boolean = false;
  /**
   * isOpenModal
   */
  isUploadLogo: boolean = false;
  /**
   * Constructor
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    private _store: Store<{ global: AppInitialData }>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _settingTaxpayerService: SettingTaxpayerService,
    @Inject(DOCUMENT) private _document: any,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _notificationService: NotificationService,
    private _layoutService: LayoutService,
    private _mailServerService: MailServerService,
    private _modalSettingTaxpayerService: ModalSettingTaxpayerService,
    private _modalMailServersService: ModalMailServersService
  ) {}

  /** ----------------------------------------------------------------------------------------------------- */
  /** @ Lifecycle hooks
	  /** ----------------------------------------------------------------------------------------------------- */

  /**
   * On init
   */
  ngOnInit(): void {
    this.id_taxpayer = this._data.id_taxpayer;
    this.id_setting_taxpayer = this._data.id_setting_taxpayer;
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
     * Create the settingTaxpayer form
     */
    this.settingTaxpayerForm = this._formBuilder.group({
      id_setting_taxpayer: [''],
      id_mail_server: [''],
      mailing_setting_taxpayer: ['', [Validators.required]],
      from_setting_taxpayer: ['', [Validators.maxLength(250)]],
      subject_setting_taxpayer: ['', [Validators.maxLength(250)]],
      html_setting_taxpayer: [''],
      download_note_setting_taxpayer: [
        '',
        [Validators.required, Validators.maxLength(500)],
      ],
      logo_path_setting_taxpayer: [
        '',
        [Validators.required, Validators.maxLength(100)],
      ],
      removablefileInitial: [''],
    });
    /**
     * Get the settingTaxpayers
     */
    this._settingTaxpayerService
      .readSettingTaxpayerById(this.id_setting_taxpayer)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        /**
         * Get the settingTaxpayer
         */
        this._settingTaxpayerService.settingTaxpayer$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((settingTaxpayer: SettingTaxpayer) => {
            /**
             * Get the settingTaxpayer
             */
            this.settingTaxpayer = settingTaxpayer;
            /**
             * Creamos un objeto file para ponerlo dentro del imput para que no lo puedan remplazar
             */
            if (this.settingTaxpayer.logo_path_setting_taxpayer) {
              const file = new File(
                ['logo'],
                this.settingTaxpayer.logo_path_setting_taxpayer,
                {
                  type: 'application/pdf',
                }
              );
              this.settingTaxpayerForm
                .get('removablefileInitial')
                ?.patchValue(new FileInput([file]));
            }

            this.readAllMailServer();

            /**
             * Patch values to the form
             */
            this.patchForm();
            /**
             * Toggle the edit mode off
             */
            if (!this.isUploadLogo) {
              this.toggleEditMode(false);
            }
            /**
             * Mark for check
             */
            this._changeDetectorRef.markForCheck();
          });
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
   * readAllMailServer
   */
  readAllMailServer() {
    // MailServer
    this._mailServerService
      .readAllMailServer()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((mail_servers: MailServer[]) => {
        this.categoriesMailServer = mail_servers;

        if (this.settingTaxpayer.mail_server.id_mail_server != null) {
          this.selectedMailServer = this.categoriesMailServer.find(
            (item) =>
              item.id_mail_server ==
              this.settingTaxpayer.mail_server.id_mail_server.toString()
          )!;
        }
      });
  }
  /**
   * Pacth the form with the information of the database
   */
  patchForm(): void {
    this.settingTaxpayerForm.patchValue({
      ...this.settingTaxpayer,
      id_mail_server: this.settingTaxpayer.mail_server.id_mail_server,
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
    this.readAllMailServer();
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
   * Update the settingTaxpayer
   */
  updateSettingTaxpayer(): void {
    this.isUploadLogo = false;
    /**
     * Get the settingTaxpayer
     */
    const id_user_ = this.data.user.id_user;
    let settingTaxpayer = this.settingTaxpayerForm.getRawValue();
    /**
     * Delete whitespace (trim() the atributes type string)
     */
    settingTaxpayer = {
      ...settingTaxpayer,
      from_setting_taxpayer: settingTaxpayer.from_setting_taxpayer.trim(),
      subject_setting_taxpayer: settingTaxpayer.subject_setting_taxpayer.trim(),
      html_setting_taxpayer: settingTaxpayer.html_setting_taxpayer.trim(),
      download_note_setting_taxpayer:
        settingTaxpayer.download_note_setting_taxpayer.trim(),
      id_user_: parseInt(id_user_),
      id_setting_taxpayer: parseInt(settingTaxpayer.id_setting_taxpayer),
      mail_server: {
        id_mail_server: parseInt(settingTaxpayer.id_mail_server),
      },
    };
    /**
     * Update
     */
    this._settingTaxpayerService
      .updateSettingTaxpayer(settingTaxpayer)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (_settingTaxpayer: SettingTaxpayer) => {
          if (_settingTaxpayer) {
            this._notificationService.success(
              'Configuración actualizada correctamente'
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
   * uploadLogo
   * @param target
   */
  uploadLogo(target: any): void {
    this.isUploadLogo = true;
    const id_user_ = this.data.user.id_user;
    const files: FileList = target.files;
    const file: File = files[0];

    this._settingTaxpayerService
      .uploadLogo(file, id_user_, this.settingTaxpayer.id_setting_taxpayer)
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
   * downloadLogo
   */
  downloadLogo() {
    const id_user_ = this.data.user.id_user;

    const logo_path_setting_taxpayer =
      this.settingTaxpayerForm.getRawValue().logo_path_setting_taxpayer;

    this._settingTaxpayerService
      .downloadLogo(id_user_, logo_path_setting_taxpayer)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (dataSource: Blob) => {
          if (dataSource) {
            saveAs(dataSource, logo_path_setting_taxpayer);
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
   * deleteLogo
   */
  deleteLogo() {
    this.isUploadLogo = true;
    const id_user_ = this.data.user.id_user;

    this._settingTaxpayerService
      .removeLogo(id_user_, this.settingTaxpayer.id_setting_taxpayer)
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
   * closeModalSettingTaxpayer
   */
  closeModalSettingTaxpayer() {
    this._modalSettingTaxpayerService.closeModalSettingTaxpayer();
  }
  /**
   * openModalMailServers
   */
  openModalMailServers() {
    this._modalMailServersService.openModalMailServers(this.id_taxpayer);
  }
}
