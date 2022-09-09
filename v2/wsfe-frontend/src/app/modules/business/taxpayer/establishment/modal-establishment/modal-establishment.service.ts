import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from 'app/layout/layout.service';
import { ModalEstablishmentComponent } from './modal-establishment.component';

@Injectable({
  providedIn: 'root',
})
export class ModalEstablishmentService {
  constructor(
    private _dialog: MatDialog,
    private _layoutService: LayoutService
  ) {}
  _dialogRef: any;

  openModalEstablishment(id_establishment: string) {
    this._layoutService.setOpenModal(true);

    return (this._dialogRef = this._dialog.open(ModalEstablishmentComponent, {
      minHeight: 'inherit',
      maxHeight: '90vh',
      height: 'auto',
      width: '40rem',
      maxWidth: '',
      panelClass: ['mat-dialog-cont'],
      disableClose: true,
      data: {
        id_establishment,
      },
    }));
  }

  closeModalEstablishment() {
    this._dialogRef.close();
  }
}
