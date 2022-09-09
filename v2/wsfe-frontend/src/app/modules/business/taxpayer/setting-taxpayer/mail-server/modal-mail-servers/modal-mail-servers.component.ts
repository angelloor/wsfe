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
  TYPE_MAIL_SERVER,
  TYPE_MAIL_SERVER_ENUM,
  _typeMailServer,
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
import { MailServerService } from '../mail-server.service';
import { MailServer } from '../mail-server.types';
import { ModalMailServerService } from '../modal-mail-server/modal-mail-server.service';
import { ModalMailServersService } from './modal-mail-servers.service';

@Component({
  selector: 'app-modal-mail-servers',
  templateUrl: './modal-mail-servers.component.html',
})
export class ModalMailServersComponent implements OnInit {
  id_taxpayer: string = '';
  count: number = 0;
  mailServers$!: Observable<MailServer[]>;

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
  selectedMailServer!: MailServer;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  /**
   * Type Enum
   */
  typeMailServer: TYPE_MAIL_SERVER_ENUM[] = _typeMailServer;
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
    private _mailServerService: MailServerService,
    private _notificationService: NotificationService,
    private _angelConfirmationService: AngelConfirmationService,
    private _layoutService: LayoutService,
    private _authService: AuthService,
    private _modalMailServersService: ModalMailServersService,
    private _modalMailServerService: ModalMailServerService
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
     * Get the mailServers
     */
    this.mailServers$ = this._mailServerService.mailServers$;
    /**
     *  Count Subscribe and readAll
     */
    this._mailServerService
      .byTaxpayerRead(this.id_taxpayer, '')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((mailServers: MailServer[]) => {
        /**
         * Update the counts
         */
        this.count = mailServers.length;
        /**
         * Mark for check
         */
        this._changeDetectorRef.markForCheck();
      });
    /**
     *  Count Subscribe
     */
    this._mailServerService.mailServers$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((mailServers: MailServer[]) => {
        /**
         * Update the counts
         */
        this.count = mailServers.length;
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
          return this._mailServerService.byTaxpayerRead(
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
          this.createMailServer();
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
   * Create Servidor de correo
   */
  createMailServer(): void {
    this._angelConfirmationService
      .open({
        title: 'Añadir servidor de correo',
        message:
          '¿Estás seguro de que deseas añadir una nueva servidor de correo? ¡Esta acción no se puede deshacer!',
      })
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((confirm: ActionAngelConfirmation) => {
        if (confirm === 'confirmed') {
          const id_user_ = this.data.user.id_user;
          /**
           * Create the servidor de correo
           */
          this._mailServerService
            .createMailServer(id_user_, this.id_taxpayer)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
              next: (_mailServer: MailServer) => {
                if (_mailServer) {
                  this._notificationService.success(
                    'Servidor de correo agregada correctamente'
                  );
                  /**
                   * Go to new servidor de correo
                   */
                  // this.goToEntity(_mailServer.id_mail_server);
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
   * closeModalMailServers
   */
  closeModalMailServers(): void {
    this._modalMailServersService.closeModalMailServers();
  }
  /**
   * openModalMailServer
   * @param id_mail_server
   */
  openModalMailServer(id_mail_server: string): void {
    this._modalMailServerService.openModalMailServer(id_mail_server);
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
   * getTypeSelectMailServer
   */
  getTypeSelectMailServer(
    type_mail_server: TYPE_MAIL_SERVER
  ): TYPE_MAIL_SERVER_ENUM {
    return this.typeMailServer.find(
      (mailServer) => mailServer.value_type == type_mail_server
    )!;
  }
}
