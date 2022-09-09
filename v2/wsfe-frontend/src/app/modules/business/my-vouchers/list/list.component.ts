import { AngelMediaWatcherService } from '@angel/services/media-watcher';
import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { AppInitialData, MessageAPI } from 'app/core/app/app.type';
import { AuthService } from 'app/core/auth/auth.service';
import { LayoutService } from 'app/layout/layout.service';
import { NotificationService } from 'app/shared/notification/notification.service';
import { PreviewPdfService } from 'app/shared/preview-pdf/preview-pdf.service';
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
import { VoucherService } from '../../voucher/voucher.service';
import { Voucher } from '../../voucher/voucher.types';

@Component({
  selector: 'my-vouchers-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class MyVouchersListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isScreenSmall: boolean = false;
  /**
   * Type Enum
   */
  typeVoucherStatus: TYPE_VOUCHER_STATUS_ENUM[] = _typeVoucherStatus;
  /**
   * Type Enum
   */
  environment: TYPE_ENVIRONMENT = '2';
  page_number: string = '*';
  amount: string = '*';
  order_by: 'asc' | 'desc' = 'asc';
  pageSizeOptions: number[] = [10, 25, 100];

  stringStartDate: string = '';
  stringEndDate: string = '';

  statusSearch: boolean = false;

  count: number = 0;
  vouchers$!: Observable<Voucher[]>;

  private data!: AppInitialData;
  myVouchersForm!: FormGroup;

  searchInputControl: FormControl = new FormControl();
  selectedVoucher!: Voucher;

  sign_in_visitor: boolean = false;
  buyer_identifier_voucher: string = '';
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  vouchers: Voucher[] = [];
  vouchersSource = new MatTableDataSource<Voucher>(this.vouchers);
  vouchersSelection = new SelectionModel<Voucher>(true, []);

  displayedColumns: string[] = [
    'select',
    'number_voucher',
    'access_key_voucher',
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
    private _angelMediaWatcherService: AngelMediaWatcherService
  ) {}

  ngAfterViewInit() {
    this.vouchersSource.paginator = this.paginator;
  }

  ngOnInit(): void {
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
      this.buyer_identifier_voucher = state.global.user.name_user;
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
      this.environment = this.data.query_environment!;
      /**
       * byBuyerIdentifierVoucherRead
       */
      this.byBuyerIdentifierVoucherRead(
        this.environment,
        this.buyer_identifier_voucher,
        this.page_number,
        this.amount,
        this.order_by
      );
    });

    this.myVouchersForm = this._formBuilder.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
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
     *  Count Subscribe
     */
    this._voucherService.vouchers$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((vouchers: Voucher[]) => {
        this.setVouchersSource(vouchers);
        /**
         * Update the counts
         */
        this.count = vouchers.length;
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
          if (query) {
            /**
             * Search
             */
            return this._voucherService.byBuyerIdentifierVoucherAndSearchByParameterRead(
              this.environment,
              this.buyer_identifier_voucher,
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
      const startDate: Date = this.myVouchersForm.getRawValue().startDate;
      const fullDateStartDate: FullDate = this._globalUtils.getFullDate(
        startDate.toString()
      );
      this.stringStartDate = `${fullDateStartDate.fullYear}-${fullDateStartDate.month}-${fullDateStartDate.day}`;
    } else {
      const endDate: Date = this.myVouchersForm.getRawValue().endDate;
      if (endDate) {
        const fullDateEndDate: FullDate = this._globalUtils.getFullDate(
          endDate.toString()
        );
        this.stringEndDate = `${fullDateEndDate.fullYear}-${fullDateEndDate.month}-${fullDateEndDate.day}`;
        /**
         * byBuyerIdentifierVoucherRead
         */
        this._voucherService
          .byBuyerIdentifierAndRangeEmissionDateVoucherRead(
            this.environment,
            this.buyer_identifier_voucher,
            this.stringStartDate,
            this.stringEndDate
          )
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((vouchers: Voucher[]) => {
            this.setVouchersSource(vouchers);
            /**
             * Update the counts
             */
            this.count = vouchers.length;
            /**
             * Mark for check
             */
            this._changeDetectorRef.markForCheck();
          });
      }
    }
  }
  /**
   * byBuyerIdentifierVoucherRead
   */
  byBuyerIdentifierVoucherRead(
    environment: TYPE_ENVIRONMENT,
    buyer_identifier_voucher: string,
    page_number: string,
    amount: string,
    order_by: 'asc' | 'desc'
  ): void {
    this._voucherService
      .byBuyerIdentifierVoucherRead(
        environment,
        buyer_identifier_voucher,
        page_number,
        amount,
        order_by
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((vouchers: Voucher[]) => {
        this.setVouchersSource(vouchers);
        /**
         * Update the counts
         */
        this.count = vouchers.length;
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
        error: (error: any) => {
          const errorBlob: Blob = error.error;
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
