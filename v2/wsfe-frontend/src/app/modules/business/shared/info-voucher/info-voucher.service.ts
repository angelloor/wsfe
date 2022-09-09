import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from 'app/layout/layout.service';
import { Voucher } from '../../voucher/voucher.types';
import { InfoVoucherComponent } from './info-voucher.component';

@Injectable({
  providedIn: 'root',
})
export class InfoVoucherService {
  constructor(
    private _dialog: MatDialog,
    private _layoutService: LayoutService
  ) {}
  _dialogRef: any;

  openInfoVoucher(voucher: Voucher) {
    this._layoutService.setOpenModal(true);
    return (this._dialogRef = this._dialog.open(InfoVoucherComponent, {
      minHeight: 'inherit',
      maxHeight: 'inherit',
      height: 'auto',
      width: '32rem',
      maxWidth: '',
      panelClass: ['mat-dialog-cont'],
      disableClose: true,
      data: {
        voucher,
      },
    }));
  }

  closeInfoVoucher() {
    this._dialogRef.close();
  }
}
