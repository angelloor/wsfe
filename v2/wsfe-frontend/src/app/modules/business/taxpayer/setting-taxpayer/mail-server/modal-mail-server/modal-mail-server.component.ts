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
  TYPE_MAIL_SERVER_ENUM,
  _typeMailServer,
} from 'app/modules/business/business.types';
import { NotificationService } from 'app/shared/notification/notification.service';
import { GlobalValidator } from 'app/shared/validator/global.validator';
import { SecurityCap } from 'app/utils/SecurityCap';
import { filter, fromEvent, merge, Subject, takeUntil } from 'rxjs';
import { MailServerService } from '../mail-server.service';
import { MailServer } from '../mail-server.types';
import { ModalMailServerService } from './modal-mail-server.service';

@Component({
  selector: 'app-modal-mail-server',
  templateUrl: './modal-mail-server.component.html',
  animations: angelAnimations,
})
export class ModalMailServerComponent implements OnInit {
  id_mail_server: string = '';
  nameEntity: string = 'Servidor de correo';
  private data!: AppInitialData;

  editMode: boolean = false;
  /**
   * Type Enum
   */
  typeMailServer: TYPE_MAIL_SERVER_ENUM[] = _typeMailServer;

  typeSelect!: TYPE_MAIL_SERVER_ENUM;
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
  mailServer!: MailServer;
  mailServerForm!: FormGroup;
  private mailServers!: MailServer[];

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
    private _mailServerService: MailServerService,
    @Inject(DOCUMENT) private _document: any,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _notificationService: NotificationService,
    private _angelConfirmationService: AngelConfirmationService,
    private _layoutService: LayoutService,
    private _modalMailServerService: ModalMailServerService,
    private _securityCap: SecurityCap
  ) {}

  /** ----------------------------------------------------------------------------------------------------- */
  /** @ Lifecycle hooks
	  /** ----------------------------------------------------------------------------------------------------- */

  /**
   * On init
   */
  ngOnInit(): void {
    this.id_mail_server = this._data.id_mail_server;
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
     * Create the mailServer form
     */

    this.mailServerForm = this._formBuilder.group({
      id_mail_server: [''],
      taxpayer: ['', [Validators.required]],
      type_mail_server: ['', [Validators.required]],
      host_mail_server: [
        '',
        [
          Validators.required,
          Validators.maxLength(67),
          GlobalValidator.cannotContainSpace,
        ],
      ],
      port_mail_server: [
        '',
        [
          Validators.required,
          Validators.maxLength(5),
          GlobalValidator.cannotContainSpace,
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
      secure_mail_server: ['', [Validators.required]],
      user_mail_server: [
        '',
        [
          Validators.required,
          Validators.maxLength(320),
          GlobalValidator.cannotContainSpace,
        ],
      ],
      password_mail_server: [
        '',
        [Validators.required, Validators.maxLength(250)],
      ],
      status_mail_server: ['', [Validators.required]],
    });
    /**
     * Get the mail_server
     */
    this._mailServerService
      .readMailServerByIdLocal(this.id_mail_server)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
    /**
     * Get the mailServers
     */
    this._mailServerService.mailServers$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((mailServers: MailServer[]) => {
        this.mailServers = mailServers;
        /**
         * Mark for check
         */
        this._changeDetectorRef.markForCheck();
      });
    /**
     * Get the mailServer
     */
    this._mailServerService.mailServer$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((mailServer: MailServer) => {
        /**
         * Get the mailServer
         */
        this.mailServer = mailServer;

        /**
         * Type Enum
         */
        this.typeSelect = this.typeMailServer.find(
          (mailServer) =>
            mailServer.value_type == this.mailServer.type_mail_server
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
    this.mailServerForm.patchValue({
      ...this.mailServer,
      password_mail_server: this.aesDecrypt(
        this.mailServer.password_mail_server
      ),
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
   * Update the mailServer
   */
  updateMailServer(): void {
    /**
     * Get the mailServer
     */
    const id_user_ = this.data.user.id_user;
    let mailServer = this.mailServerForm.getRawValue();
    /**
     * Delete whitespace (trim() the atributes type string)
     */
    mailServer = {
      ...mailServer,
      host_mail_server: mailServer.host_mail_server.trim(),
      user_mail_server: mailServer.user_mail_server.trim(),
      id_user_: parseInt(id_user_),
      id_mail_server: parseInt(mailServer.id_mail_server),
      port_mail_server: parseInt(mailServer.port_mail_server),
      password_mail_server: this.aesEncrypt(
        mailServer.password_mail_server.trim()
      ),
      taxpayer: {
        id_taxpayer: parseInt(mailServer.taxpayer.id_taxpayer),
      },
    };
    /**
     * Update
     */
    this._mailServerService
      .updateMailServer(mailServer)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (_mailServer: MailServer) => {
          if (_mailServer) {
            this._notificationService.success(
              'Servidor de correo actualizada correctamente'
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
   * Delete the mailServer
   */
  deleteMailServer(): void {
    this._angelConfirmationService
      .open({
        title: 'Eliminar servidor de correo',
        message:
          '¿Estás seguro de que deseas eliminar esta servidor de correo? ¡Esta acción no se puede deshacer!',
      })
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((confirm: ActionAngelConfirmation) => {
        if (confirm === 'confirmed') {
          /**
           * Get the current mailServer's id
           */
          const id_user_ = this.data.user.id_user;
          const id_mail_server = this.mailServer.id_mail_server;
          /**
           * Delete the mailServer
           */
          this._mailServerService
            .deleteMailServer(id_user_, id_mail_server)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
              next: (response: boolean) => {
                if (response) {
                  /**
                   * Return if the mailServer wasn't deleted...
                   */
                  this._notificationService.success(
                    'Servidor de correo eliminada correctamente'
                  );
                  this.closeModalMailServer();
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
   * closeModalMailServer
   */
  closeModalMailServer() {
    this._modalMailServerService.closeModalMailServer();
  }
}
