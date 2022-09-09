import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from 'app/layout/layout.service';
import { ModalMailServersComponent } from './modal-mail-servers.component';

@Injectable({
  providedIn: 'root',
})
export class ModalMailServersService {
  constructor(
    private _dialog: MatDialog,
    private _layoutService: LayoutService
  ) {}
  _dialogRef: any;

  openModalMailServers(id_taxpayer: string) {
    this._layoutService.setOpenModal(true);
    return (this._dialogRef = this._dialog.open(ModalMailServersComponent, {
      minHeight: 'inherit',
      maxHeight: 'inherit',
      height: 'auto',
      width: '35rem',
      maxWidth: '',
      panelClass: ['mat-dialog-cont'],
      disableClose: true,
      data: {
        id_taxpayer,
      },
    }));
  }

  closeModalMailServers() {
    this._dialogRef.close();
  }
}
