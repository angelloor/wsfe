import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsCenterComponent } from './settings-center.component';

@Injectable({
  providedIn: 'root',
})
export class SettingsCenterService {
  constructor(public _dialog: MatDialog) {}
  _dialogRef: any;

  openDrawerSettings() {
    return (this._dialogRef = this._dialog.open(SettingsCenterComponent, {
      minHeight: 'inherit',
      maxHeight: '90vh',
      height: 'auto',
      width: '32rem',
      maxWidth: '',
      panelClass: ['mat-dialog-cont'],
      disableClose: false,
    }));
  }

  closeDrawerSettings() {
    this._dialogRef.close();
  }
}
