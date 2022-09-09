import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from 'app/layout/layout.service';
import { ModalInstitutionsComponent } from './modal-institutions.component';

@Injectable({
  providedIn: 'root',
})
export class ModalInstitutionsService {
  constructor(
    private _dialog: MatDialog,
    private _layoutService: LayoutService
  ) {}
  _dialogRef: any;

  openModalInstitutions(id_taxpayer: string) {
    this._layoutService.setOpenModal(true);
    return (this._dialogRef = this._dialog.open(ModalInstitutionsComponent, {
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

  closeModalInstitutions() {
    this._dialogRef.close();
  }
}
