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
import { PreviewPdfService } from 'app/shared/preview-pdf/preview-pdf.service';
import { PreviewReportComponent } from 'app/shared/preview-report/preview-report.component';
import { GlobalUtils } from 'app/utils/GlobalUtils';
import { FullDate } from 'app/utils/utils.types';
import { saveAs } from 'file-saver';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import {
  TYPE_ENVIRONMENT,
  TYPE_VOUCHER_STATUS,
  TYPE_VOUCHER_STATUS_ENUM,
  _typeVoucherStatus,
} from '../../business.types';
import { InfoVoucherService } from '../../shared/info-voucher/info-voucher.service';
import { InstitutionService } from '../../taxpayer/institution/institution.service';
import { Institution } from '../../taxpayer/institution/institution.types';
import { TaxpayerService } from '../../taxpayer/taxpayer.service';
import { Taxpayer } from '../../taxpayer/taxpayer.types';
import { VoucherService } from '../../voucher/voucher.service';
import { Voucher } from '../../voucher/voucher.types';

@Component({
  selector: 'voucher-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class VoucherListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isScreenSmall: boolean = false;
  pdfSource: string = '';
  /**
   * Type Enum
   */
  typeVoucherStatus: TYPE_VOUCHER_STATUS_ENUM[] = _typeVoucherStatus;

  typeSelect!: TYPE_VOUCHER_STATUS_ENUM;
  /**
   * Type Enum
   */
  categoriesTaxpayer: Taxpayer[] = [];
  categoriesInstitution: Institution[] = [];

  environment: TYPE_ENVIRONMENT = '2';
  id_institution: string = '*';
  emission_date_voucher: string = '';
  authorization_date_voucher: string = '';
  internal_status_voucher: TYPE_VOUCHER_STATUS | '*' = '*';

  page_number: string = '*';
  amount: string = '*';
  order_by: 'asc' | 'desc' = 'asc';
  pageSizeOptions: number[] = [10, 25, 100];

  statusSearch: boolean = false;

  vouchers$!: Observable<Voucher[]>;

  private data!: AppInitialData;
  myVouchersForm!: FormGroup;

  searchInputControl: FormControl = new FormControl();
  selectedVoucher!: Voucher;

  sign_in_visitor: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  vouchers: Voucher[] = [];
  vouchersSource = new MatTableDataSource<Voucher>(this.vouchers);
  vouchersSelection = new SelectionModel<Voucher>(true, []);

  displayedColumns: string[] = [
    'select',
    'number_voucher',
    'access_key_voucher',
    'identificacionComprador',
    'emission_date_voucher',
    'internal_status_voucher',
    'authorization_date_voucher',
    'importeTotal',
    'preview',
  ];

  displayedColumnsScreenSmall: string[] = [
    'select',
    'number_voucher',
    'emission_date_voucher',
    'information',
    'preview',
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
    private _previewPdfService: PreviewPdfService,
    private _infoVoucherService: InfoVoucherService,
    private _angelMediaWatcherService: AngelMediaWatcherService,
    private _taxpayerService: TaxpayerService,
    private _institutionService: InstitutionService,
    private _reportService: ReportService,
    private _matDialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.vouchersSource.paginator = this.paginator;
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

    // Taxpayer
    this._taxpayerService
      .readAllTaxpayer()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((taxpayers: Taxpayer[]) => {
        this.categoriesTaxpayer = taxpayers;
      });
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
       * Set query_environment
       */
      if (this.data.query_environment) {
        this.environment = this.data.query_environment!;
      }
      /**
       * byRangeEmissionDateVoucherRead
       */
      this.byRangeEmissionDateVoucherRead(
        this.environment,
        this.id_institution,
        this.emission_date_voucher,
        this.authorization_date_voucher,
        this.internal_status_voucher
      );
    });

    this.myVouchersForm = this._formBuilder.group({
      emission_date_voucher: [''],
      authorization_date_voucher: [''],
      id_taxpayer: [''],
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
     * Get the vouchers
     */
    this.vouchers$ = this._voucherService.vouchers$;
    /**
     *  Vouchers Subscribe
     */
    this._voucherService.vouchers$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((vouchers: Voucher[]) => {
        this.setVouchersSource(vouchers);
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
            return this._voucherService.readVoucherByQuery(
              this.environment,
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
         * byBuyerIdentifierVoucherRead
         */
        this.byRangeEmissionDateVoucherRead(
          this.environment,
          this.id_institution,
          this.emission_date_voucher,
          this.authorization_date_voucher,
          this.internal_status_voucher
        );
      }
    }
  }
  /**
   * byTaxpayerRead
   */
  byTaxpayerRead(): void {
    const id_taxpayer = this.myVouchersForm.getRawValue().id_taxpayer;

    this._institutionService
      .byTaxpayerRead(id_taxpayer, '')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((institutions: Institution[]) => {
        this.categoriesInstitution = institutions;
      });
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

    this.byRangeEmissionDateVoucherRead(
      this.environment,
      this.id_institution,
      this.emission_date_voucher,
      this.authorization_date_voucher,
      this.internal_status_voucher
    );
  }
  /**
   * byRangeEmissionDateVoucherRead
   * @param environment
   * @param id_institution
   * @param emission_date_voucher
   * @param authorization_date_voucher
   * @param internal_status_voucher
   */
  byRangeEmissionDateVoucherRead(
    environment: TYPE_ENVIRONMENT,
    id_institution: string,
    emission_date_voucher: string,
    authorization_date_voucher: string,
    internal_status_voucher: string
  ): void {
    this._voucherService
      .byRangeEmissionDateVoucherRead(
        environment,
        id_institution,
        emission_date_voucher,
        authorization_date_voucher,
        internal_status_voucher
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((vouchers: Voucher[]) => {
        this.setVouchersSource(vouchers);
        /**
         * Mark for check
         */
        this._changeDetectorRef.markForCheck();
      });
  }
  /**
   * setVouchersSource
   * @param vouchers
   */
  setVouchersSource(vouchers: Voucher[]): void {
    this.vouchers = vouchers;
    this.vouchersSource = new MatTableDataSource<Voucher>(this.vouchers);
    /**
     * Set source to paginator and change labels
     */

    setTimeout(() => {
      if (this.paginator) {
        this.vouchersSource.paginator = this.paginator;

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
    const lengthVouchersSource: number = this.vouchersSource.data.length;
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
    this.vouchersSelection.select(...this.vouchersSource.data);
  }
  /**
   * checkboxLabel
   * @param rowVoucher
   * @returns
   */
  checkboxLabel(rowVoucher?: Voucher): string {
    if (!rowVoucher) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    } else {
      return `${
        this.vouchersSelection.isSelected(rowVoucher) ? 'deselect' : 'select'
      } row ${rowVoucher.number_voucher + 1}`;
    }
  }
  /**
   * setDataSource
   * @param vouchers
   */
  setDataSource(vouchers: Voucher[]) {
    this.vouchersSource = new MatTableDataSource<Voucher>(vouchers);
    this.vouchersSource.paginator = this.paginator;
  }
  /**
   * openInfoVoucher
   * @param voucher
   */
  openInfoVoucher(voucher: Voucher): void {
    this._infoVoucherService
      .openInfoVoucher(voucher)
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._layoutService.setOpenModal(false);
      });
  }
  /**
   * preview
   * @param voucher
   */
  preview(voucher: Voucher): void {
    const id_institution: string = voucher.institution.id_institution;
    const access_key_voucher: string = voucher.access_key_voucher;
    const type_file_voucher: 'pdf' | 'xml' = 'pdf';

    this._voucherService
      .downloadVoucherArrayBuffer(
        id_institution,
        access_key_voucher,
        type_file_voucher
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (voucherArrayBuffer: ArrayBuffer) => {
          this._previewPdfService
            .openPreviewPdf(voucherArrayBuffer)
            .afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
              this._layoutService.setOpenModal(false);
            });
        },
        error: () => {
          this._notificationService.error(
            '¡Error interno!, consulte al administrador.'
          );
        },
      });
  }
  /**
   * downloadVoucher
   * @param voucher
   * @param type_file_voucher
   */
  downloadVoucher(voucher: Voucher, type_file_voucher: 'pdf' | 'xml'): void {
    const id_institution: string = voucher.institution.id_institution;
    const access_key_voucher: string = voucher.access_key_voucher;
    this._voucherService
      .downloadVoucher(id_institution, access_key_voucher, type_file_voucher)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (voucherBlob: Blob) => {
          saveAs(voucherBlob, access_key_voucher);
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
   * downloadVouchers
   * @param type_file_voucher
   */
  downloadVouchers(type_file_voucher: 'pdf' | 'xml'): void {
    if (this.vouchersSelection.selected.length > 0) {
      this.vouchersSelection.selected.map((voucher: Voucher) => {
        this.downloadVoucher(voucher, type_file_voucher);
      });
    }
  }
  /**
   * reportByRangeEmissionDateVoucher
   */
  reportByRangeEmissionDateVoucher() {
    const id_user_: string = this.data.user.id_user;

    this._voucherService
      .reportByRangeEmissionDateVoucher(
        this.environment,
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
