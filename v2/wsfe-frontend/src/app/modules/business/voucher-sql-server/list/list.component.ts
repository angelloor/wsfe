import { AngelMediaWatcherService } from '@angel/services/media-watcher';
import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { AppInitialData, MessageAPI } from 'app/core/app/app.type';
import { AuthService } from 'app/core/auth/auth.service';
import { LayoutService } from 'app/layout/layout.service';
import { ReportService } from 'app/modules/report/report.service';
import { NotificationService } from 'app/shared/notification/notification.service';
import { PreviewReportComponent } from 'app/shared/preview-report/preview-report.component';
import { GlobalUtils } from 'app/utils/GlobalUtils';
import { FullDate } from 'app/utils/utils.types';
import { Observable, Subject, switchMap } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  InstitutionSQLServer,
  INSTITUTION_SQLSERVER,
  TYPE_VOUCHER_STATUS,
  TYPE_VOUCHER_STATUS_ENUM,
  VoucherSQLServer,
  _typeVoucherStatusSQLServer,
} from '../../business.types';
import { VoucherService } from '../../voucher/voucher.service';

@Component({
  selector: 'voucher-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class VoucherSQLServerListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isScreenSmall: boolean = false;
  pdfSource: string = '';
  /**
   * Type Enum
   */
  typeVoucherStatus: TYPE_VOUCHER_STATUS_ENUM[] = _typeVoucherStatusSQLServer;

  typeSelect!: TYPE_VOUCHER_STATUS_ENUM;
  /**
   * Type Enum
   */
  institutionSQLServer: InstitutionSQLServer[] = INSTITUTION_SQLSERVER;

  id_institution: string = '*';
  emission_date_voucher: string = '';
  authorization_date_voucher: string = '';
  internal_status_voucher: TYPE_VOUCHER_STATUS | '*' = '*';

  page_number: string = '*';
  amount: string = '*';
  order_by: 'asc' | 'desc' = 'asc';
  pageSizeOptions: number[] = [10, 25, 100];

  statusSearch: boolean = false;

  vouchersSQLServer$!: Observable<VoucherSQLServer[]>;

  private data!: AppInitialData;
  myVouchersForm!: FormGroup;

  searchInputControl: FormControl = new FormControl();
  selectedVoucher!: VoucherSQLServer;

  sign_in_visitor: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  vouchersSQLServer: VoucherSQLServer[] = [];
  vouchersSourceSQLServer = new MatTableDataSource<VoucherSQLServer>(
    this.vouchersSQLServer
  );
  vouchersSelection = new SelectionModel<VoucherSQLServer>(true, []);

  displayedColumns: string[] = [
    'fechaemision',
    'numerodocumento',
    'razonsocialcomprador',
    'detalle',
    'total',
    'estadointerno',
    'institution',
  ];

  displayedColumnsScreenSmall: string[] = [
    'select',
    'numerodocumento',
    'detalle',
    'total',
  ];
  /**
   * isOpenModal
   */
  isOpenModal: boolean = false;
  /**
   * isOpenModal
   */
  constructor(
    private _store: Store<{ global: AppInitialData }>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _voucherService: VoucherService,
    private _notificationService: NotificationService,
    private _layoutService: LayoutService,
    private _authService: AuthService,
    private _globalUtils: GlobalUtils,
    private _angelMediaWatcherService: AngelMediaWatcherService,
    private _reportService: ReportService,
    private _matDialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.vouchersSourceSQLServer.paginator = this.paginator;
  }

  ngOnInit(): void {
    /**
     * Formar la fecha actual en string
     */
    const date: Date = new Date();
    const fullDate: FullDate = this._globalUtils.getFullDate(date.toString());
    const stringDate = `${fullDate.fullYear}-${fullDate.month}-${fullDate.day}`;
    this.emission_date_voucher = stringDate;
    this.authorization_date_voucher = stringDate;

    /**
     * Subscribe to media changes
     */
    this._angelMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        /**
         * Check if the screen is small
         */
        this.isScreenSmall = !matchingAliases.includes('sm');
      });
    /**
     * Subscribe to user changes of state
     */
    this._store.pipe(takeUntil(this._unsubscribeAll)).subscribe((state) => {
      this.data = state.global;
      this.sign_in_visitor = state.global.sign_in_visitor;
      /**
       * checkSession
       */
      if (this.sign_in_visitor) {
        this._authService
          .checkSessionVisitor()
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe();
      } else {
        this._authService
          .checkSession()
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe();
      }
      /**
       * vouchersOfSQLServerRead
       */
      this.vouchersOfSQLServerRead(
        this.id_institution,
        this.emission_date_voucher,
        this.authorization_date_voucher,
        this.internal_status_voucher
      );
    });

    this.myVouchersForm = this._formBuilder.group({
      emission_date_voucher: [''],
      authorization_date_voucher: [''],
      id_institution: [''],
      internal_status_voucher: [''],
    });
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
     * Get the vouchersSQLServer
     */
    this.vouchersSQLServer$ = this._voucherService.vouchersSQLServer$;
    /**
     *  Vouchers Subscribe
     */
    this._voucherService.vouchersSQLServer$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((vouchersSQLServer: VoucherSQLServer[]) => {
        this.setVouchersSource(vouchersSQLServer);
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
        switchMap((query: string) => {
          if (query) {
            /**
             * Search
             */
            return this._voucherService.vouchersOfSQLServerByParameterRead(
              query.toLowerCase()
            );
          } else {
            return [];
          }
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
   * dateChange
   * @param index
   */
  dateChange(index: number): void {
    if (index === 0) {
      const emission_date_voucher: Date =
        this.myVouchersForm.getRawValue().emission_date_voucher;

      const fullDateStart: FullDate = this._globalUtils.getFullDate(
        emission_date_voucher.toString()
      );

      this.emission_date_voucher = `${fullDateStart.fullYear}-${fullDateStart.month}-${fullDateStart.day}`;
    } else {
      const authorization_date_voucher: Date =
        this.myVouchersForm.getRawValue().authorization_date_voucher;

      if (authorization_date_voucher) {
        const fullDateEnd: FullDate = this._globalUtils.getFullDate(
          authorization_date_voucher.toString()
        );

        this.authorization_date_voucher = `${fullDateEnd.fullYear}-${fullDateEnd.month}-${fullDateEnd.day}`;
        /**
         * vouchersOfSQLServerRead
         */
        this.vouchersOfSQLServerRead(
          this.id_institution,
          this.emission_date_voucher,
          this.authorization_date_voucher,
          this.internal_status_voucher
        );
      }
    }
  }
  /**
   * searchVouchers
   */
  searchVouchers(): void {
    this.id_institution =
      this.myVouchersForm.getRawValue().id_institution === null
        ? '*'
        : this.myVouchersForm.getRawValue().id_institution;

    this.internal_status_voucher =
      this.myVouchersForm.getRawValue().internal_status_voucher === null
        ? '*'
        : this.myVouchersForm.getRawValue().internal_status_voucher;

    this.vouchersOfSQLServerRead(
      this.id_institution,
      this.emission_date_voucher,
      this.authorization_date_voucher,
      this.internal_status_voucher
    );
  }
  /**
   * vouchersOfSQLServerRead
   * @param id_institution
   * @param emission_date_voucher
   * @param authorization_date_voucher
   * @param internal_status_voucher
   */
  vouchersOfSQLServerRead(
    id_institution: string,
    emission_date_voucher: string,
    authorization_date_voucher: string,
    internal_status_voucher: string
  ): void {
    this._voucherService
      .vouchersOfSQLServerRead(
        id_institution,
        emission_date_voucher,
        authorization_date_voucher,
        internal_status_voucher
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: async (voucherSQLServer: VoucherSQLServer[]) => {
          this.setVouchersSource(voucherSQLServer);
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
   * setVouchersSource
   * @param vouchersSQLServer
   */
  setVouchersSource(vouchersSQLServer: VoucherSQLServer[]): void {
    this.vouchersSQLServer = vouchersSQLServer;
    this.vouchersSourceSQLServer = new MatTableDataSource<VoucherSQLServer>(
      this.vouchersSQLServer
    );
    /**
     * Set source to paginator and change labels
     */

    setTimeout(() => {
      if (this.paginator) {
        this.vouchersSourceSQLServer.paginator = this.paginator;

        this.paginator._intl.itemsPerPageLabel = 'Comprobantes por página';
        this.paginator._intl.nextPageLabel = 'Siguiente página';
        this.paginator._intl.previousPageLabel = 'Página anterior';
        this.paginator._intl.firstPageLabel = 'Primera página';
        this.paginator._intl.lastPageLabel = 'Última página';
      }
    }, 0);
  }
  /**
   * changeStatusSearch
   * @param statusSearch
   */
  changeStatusSearch(statusSearch: boolean): void {
    this.statusSearch = !statusSearch;
    this.clearInputs();
    this.vouchersSelection.clear();
  }
  /**
   * clearInputs
   */
  clearInputs(): void {
    this.searchInputControl.patchValue('');
    this.myVouchersForm.reset();
  }
  /**
   * isAllSelected
   * @returns boolean
   */
  isAllSelected(): boolean {
    const lengthVouchersSelection: number =
      this.vouchersSelection.selected.length;
    const lengthVouchersSource: number =
      this.vouchersSourceSQLServer.data.length;
    return lengthVouchersSelection === lengthVouchersSource;
  }
  /**
   * masterToggle
   */
  masterToggle(): void {
    if (this.isAllSelected()) {
      this.vouchersSelection.clear();
      return;
    }
    this.vouchersSelection.select(...this.vouchersSourceSQLServer.data);
  }
  /**
   * checkboxLabel
   * @param rowVoucher
   * @returns
   */
  checkboxLabel(rowVoucher?: VoucherSQLServer): string {
    if (!rowVoucher) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    } else {
      return `${
        this.vouchersSelection.isSelected(rowVoucher) ? 'deselect' : 'select'
      } row ${rowVoucher.numerodocumento + 1}`;
    }
  }
  /**
   * setDataSource
   * @param vouchersSQLServer
   */
  setDataSource(vouchersSQLServer: VoucherSQLServer[]) {
    this.vouchersSourceSQLServer = new MatTableDataSource<VoucherSQLServer>(
      vouchersSQLServer
    );
    this.vouchersSourceSQLServer.paginator = this.paginator;
  }
  /**
   * reportVouchersOfSQLServer
   */
  reportVouchersOfSQLServer() {
    const id_user_: string = this.data.user.id_user;

    this._voucherService
      .reportVouchersOfSQLServer(
        this.id_institution,
        this.emission_date_voucher,
        this.authorization_date_voucher,
        this.internal_status_voucher
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: async (response: any) => {
          let name_report: string = response.headers.get('name_report');
          if (name_report) {
            this.pdfSource = await this._globalUtils.blobToBase64(
              response.body
            );
            let _dialogRef = this._matDialog.open(PreviewReportComponent, {
              height: ' 90vh',
              width: '90vw',
              data: {
                source: this.pdfSource,
                nameFile: name_report,
              },
            });
            /**
             * subscribe to afterClosed
             */
            _dialogRef.afterClosed().subscribe(() => {
              this._reportService
                .deleteReport(id_user_, name_report)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe();
            });
          } else {
            let message: MessageAPI = JSON.parse(
              response.headers.get('message')
            );
            if (message.code == '06-010') {
              this._notificationService.error(
                !message.description
                  ? '¡Error interno!, consulte al administrador.'
                  : message.description
              );
            }
          }
        },
        error: (error: { error: MessageAPI }) => {
          const errorBlob: Blob | any = error.error;
          this._globalUtils
            .blobToJSON(errorBlob)
            .then((errorJSON: MessageAPI) => {
              this._notificationService.error(
                !errorJSON
                  ? '¡Error interno!, consulte al administrador.'
                  : errorJSON.description
              );
            })
            .catch((error: string) => {
              this._notificationService.error(
                !error ? '¡Error interno!, consulte al administrador.' : error
              );
            });
        },
      });
  }
  /**
   * reportResumeVouchersOfSQLServer
   */
  reportResumeVouchersOfSQLServer() {
    const id_user_: string = this.data.user.id_user;

    this._voucherService
      .reportResumeVouchersOfSQLServer(
        this.id_institution,
        this.emission_date_voucher,
        this.authorization_date_voucher,
        this.internal_status_voucher
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: async (response: any) => {
          let name_report: string = response.headers.get('name_report');
          if (name_report) {
            this.pdfSource = await this._globalUtils.blobToBase64(
              response.body
            );
            let _dialogRef = this._matDialog.open(PreviewReportComponent, {
              height: ' 90vh',
              width: '90vw',
              data: {
                source: this.pdfSource,
                nameFile: name_report,
              },
            });
            /**
             * subscribe to afterClosed
             */
            _dialogRef.afterClosed().subscribe(() => {
              this._reportService
                .deleteReport(id_user_, name_report)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe();
            });
          } else {
            let message: MessageAPI = JSON.parse(
              response.headers.get('message')
            );
            if (message.code == '06-010') {
              this._notificationService.error(
                !message.description
                  ? '¡Error interno!, consulte al administrador.'
                  : message.description
              );
            }
          }
        },
        error: (error: { error: MessageAPI }) => {
          const errorBlob: Blob | any = error.error;
          this._globalUtils
            .blobToJSON(errorBlob)
            .then((errorJSON: MessageAPI) => {
              this._notificationService.error(
                !errorJSON
                  ? '¡Error interno!, consulte al administrador.'
                  : errorJSON.description
              );
            })
            .catch((error: string) => {
              this._notificationService.error(
                !error ? '¡Error interno!, consulte al administrador.' : error
              );
            });
        },
      });
  }
  /**
   * getTypeSelectVoucherStatus
   */
  getTypeSelectVoucherStatus(
    type_voucher_status: TYPE_VOUCHER_STATUS
  ): TYPE_VOUCHER_STATUS_ENUM {
    return this.typeVoucherStatus.find(
      (voucherStatus) => voucherStatus.value_type == type_voucher_status
    )!;
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
