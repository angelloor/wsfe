import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from 'app/layout/layout.service';
import { ModalEstablishmentsComponent } from './modal-establishments.component';

@Injectable({
  providedIn: 'root',
})
export class ModalEstablishmentsService {
  constructor(
    private _dialog: MatDialog,
    private _layoutService: LayoutService
  ) {}
  _dialogRef: any;

  openModalEstablishments(id_taxpayer: string) {
    this._layoutService.setOpenModal(true);
    return (this._dialogRef = this._dialog.open(ModalEstablishmentsComponent, {
      minHeight: 'inherit',
      maxHeight: 'inherit',
      height: 'auto',
      width: '50rem',
      maxWidth: '',
      panelClass: ['mat-dialog-cont'],
      disableClose: true,
      data: {
        id_taxpayer,
      },
    }));
  }

  closeModalEstablishments() {
    this._dialogRef.close();
  }
}
