import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from 'app/layout/layout.service';
import { ModalEmissionPointsComponent } from './modal-emission-points.component';

@Injectable({
  providedIn: 'root',
})
export class ModalEmissionPointsService {
  constructor(
    private _dialog: MatDialog,
    private _layoutService: LayoutService
  ) {}
  _dialogRef: any;

  openModalEmissionPoints(id_taxpayer: string) {
    this._layoutService.setOpenModal(true);
    return (this._dialogRef = this._dialog.open(ModalEmissionPointsComponent, {
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

  closeModalEmissionPoints() {
    this._dialogRef.close();
  }
}
