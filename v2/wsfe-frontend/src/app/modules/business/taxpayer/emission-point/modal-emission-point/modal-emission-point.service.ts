import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from 'app/layout/layout.service';
import { ModalEmissionPointComponent } from './modal-emission-point.component';

@Injectable({
  providedIn: 'root',
})
export class ModalEmissionPointService {
  constructor(
    private _dialog: MatDialog,
    private _layoutService: LayoutService
  ) {}
  _dialogRef: any;

  openModalEmissionPoint(id_emission_point: string) {
    this._layoutService.setOpenModal(true);

    return (this._dialogRef = this._dialog.open(ModalEmissionPointComponent, {
      minHeight: 'inherit',
      maxHeight: '90vh',
      height: 'auto',
      width: '40rem',
      maxWidth: '',
      panelClass: ['mat-dialog-cont'],
      disableClose: true,
      data: {
        id_emission_point,
      },
    }));
  }

  closeModalEmissionPoint() {
    this._dialogRef.close();
  }
}
