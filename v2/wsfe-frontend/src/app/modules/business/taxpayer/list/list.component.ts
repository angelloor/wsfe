import {
  ActionAngelConfirmation,
  AngelConfirmationService,
} from '@angel/services/confirmation';
import { AngelMediaWatcherService } from '@angel/services/media-watcher';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppInitialData, MessageAPI } from 'app/core/app/app.type';
import { AuthService } from 'app/core/auth/auth.service';
import { LayoutService } from 'app/layout/layout.service';
import { NotificationService } from 'app/shared/notification/notification.service';
import { environment } from 'environments/environment';
import { fromEvent, merge, Observable, Subject, timer } from 'rxjs';
import {
  filter,
  finalize,
  switchMap,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs/operators';
import { TaxpayerService } from '../taxpayer.service';
import { Taxpayer } from '../taxpayer.types';

@Component({
  selector: 'taxpayer-list',
  templateUrl: './list.component.html',
})
export class TaxpayerListComponent implements OnInit {
  _urlPathAvatar: string = environment.urlBackend + '/resource/img/avatar/';

  @ViewChild('matDrawer', { static: true }) matDrawer!: MatDrawer;
  count: number = 0;
  taxpayers$!: Observable<Taxpayer[]>;

  openMatDrawer: boolean = false;

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
  drawerMode!: 'side' | 'over';
  searchInputControl: FormControl = new FormControl();
  selectedTaxpayer!: Taxpayer;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  /**
   * isOpenModal
   */
  isOpenModal: boolean = false;
  /**
   * isOpenModal
   */
  constructor(
    private _store: Store<{ global: AppInitialData }>,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: any,
    private _router: Router,
    private _angelMediaWatcherService: AngelMediaWatcherService,
    private _taxpayerService: TaxpayerService,
    private _notificationService: NotificationService,
    private _angelConfirmationService: AngelConfirmationService,
    private _layoutService: LayoutService,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
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
     * Get the taxpayers
     */
    this.taxpayers$ = this._taxpayerService.taxpayers$;
    /**
     *  Count Subscribe and readAll
     */
    this._taxpayerService
      .readAllTaxpayer()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((taxpayers: Taxpayer[]) => {
        /**
         * Update the counts
         */
        this.count = taxpayers.length;
        /**
         * Mark for check
         */
        this._changeDetectorRef.markForCheck();
      });
    /**
     *  Count Subscribe
     */
    this._taxpayerService.taxpayers$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((taxpayers: Taxpayer[]) => {
        /**
         * Update the counts
         */
        this.count = taxpayers.length;
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
          return this._taxpayerService.readTaxpayerByQuery(query.toLowerCase());
        })
      )
      .subscribe();
    /**
     * Subscribe to media changes
     */
    this._angelMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        /**
         * Set the drawerMode if the given breakpoint is active
         */
        if (matchingAliases.includes('lg')) {
          this.drawerMode = 'side';
        } else {
          this.drawerMode = 'over';
        }
        /**
         * Mark for check
         */
        this._changeDetectorRef.markForCheck();
      });
    /**
     * Subscribe to MatDrawer opened change
     */
    this.matDrawer.openedChange
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((opened) => {
        this.openMatDrawer = opened;
        if (!opened) {
          /**
           * Remove the selected when drawer closed
           */
          this.selectedTaxpayer = null!;
          /**
           * Mark for check
           */
          this._changeDetectorRef.markForCheck();
        }
      });
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
          this.createTaxpayer();
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
   * Go to Contribuyente
   * @param id
   */
  goToEntity(id: string): void {
    /**
     * Get the current activated route
     */
    let route = this._activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    /**
     * Go to Contribuyente
     */
    this._router.navigate([this.openMatDrawer ? '../' : './', id], {
      relativeTo: route,
    });
    /**
     * Mark for check
     */
    this._changeDetectorRef.markForCheck();
  }
  /**
   * On backdrop clicked
   */
  onBackdropClicked(): void {
    /**
     * Get the current activated route
     */
    let route = this._activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    /**
     * Go to the parent route
     */
    this._router.navigate(['../'], { relativeTo: route });
    /**
     * Mark for check
     */
    this._changeDetectorRef.markForCheck();
  }
  /**
   * Create Contribuyente
   */
  createTaxpayer(): void {
    this._angelConfirmationService
      .open({
        title: 'Añadir contribuyente',
        message:
          '¿Estás seguro de que deseas añadir un nuevo contribuyente? ¡Esta acción no se puede deshacer!',
      })
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((confirm: ActionAngelConfirmation) => {
        if (confirm === 'confirmed') {
          const id_user_ = this.data.user.id_user;
          /**
           * Create the contribuyente
           */
          this._taxpayerService
            .createTaxpayer(id_user_)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
              next: (_taxpayer: Taxpayer) => {
                if (_taxpayer) {
                  this._notificationService.success(
                    'Contribuyente agregado correctamente'
                  );
                  /**
                   * Go to new contribuyente
                   */
                  this.goToEntity(_taxpayer.id_taxpayer);
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
   * Track by function for ngFor loops
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
