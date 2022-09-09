import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppInitialData, MessageAPI } from 'app/core/app/app.type';
import { UserService } from 'app/modules/core/user/user.service';
import { NotificationService } from 'app/shared/notification/notification.service';
import { PreviewReportComponent } from 'app/shared/preview-report/preview-report.component';
import { GlobalUtils } from 'app/utils/GlobalUtils';
import { Subject, takeUntil } from 'rxjs';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  pdfSource: string = '';
  private data!: AppInitialData;

  constructor(
    private _store: Store<{ global: AppInitialData }>,
    private _globalUtils: GlobalUtils,
    private _matDialog: MatDialog,
    private _reportService: ReportService,
    private _notificationService: NotificationService,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    /**
     * Subscribe to user changes of state
     */
    this._store.pipe(takeUntil(this._unsubscribeAll)).subscribe((state) => {
      this.data = state.global;
    });
  }
  /**
   * reportUser
   */
  reportUser() {
    const id_user_: string = this.data.user.id_user;

    this._userService
      .reportUser()
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
        error: () => {
          this._notificationService.error(
            '¡Error interno!, consulte al administrador.'
          );
        },
      });
  }

  // isAnagram = (wordOne: string, wordTwo: string): boolean => {
  //   return wordOne.toLowerCase() === wordTwo.toLowerCase()
  //     ? false
  //     : wordOne
  //         .toLowerCase()
  //         .sort()
  //         .elementsEqual(wordTwo.toLowerCase().sorted());
  // };
}
