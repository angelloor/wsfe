import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from 'app/layout/layout.service';
import { ModalSettingTaxpayerComponent } from './modal-setting-taxpayer.component';

@Injectable({
  providedIn: 'root',
})
export class ModalSettingTaxpayerService {
  constructor(
    private _dialog: MatDialog,
    private _layoutService: LayoutService
  ) {}
  _dialogRef: any;

  openModalSettingTaxpayer(id_taxpayer: string, id_setting_taxpayer: string) {
    this._layoutService.setOpenModal(true);

    return (this._dialogRef = this._dialog.open(ModalSettingTaxpayerComponent, {
      minHeight: 'inherit',
      maxHeight: '90vh',
      height: 'auto',
      width: '40rem',
      maxWidth: '',
      panelClass: ['mat-dialog-cont'],
      disableClose: true,
      data: {
        id_taxpayer,
        id_setting_taxpayer,
      },
    }));
  }

  closeModalSettingTaxpayer() {
    this._dialogRef.close();
  }
}
