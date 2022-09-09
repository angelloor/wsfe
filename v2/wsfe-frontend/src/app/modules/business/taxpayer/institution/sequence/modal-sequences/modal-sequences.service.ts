import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from 'app/layout/layout.service';
import { ModalSequencesComponent } from './modal-sequences.component';

@Injectable({
  providedIn: 'root',
})
export class ModalSequencesService {
  constructor(
    private _dialog: MatDialog,
    private _layoutService: LayoutService
  ) {}
  _dialogRef: any;

  openModalSequences(id_institution: string) {
    this._layoutService.setOpenModal(true);
    return (this._dialogRef = this._dialog.open(ModalSequencesComponent, {
      minHeight: 'inherit',
      maxHeight: 'inherit',
      height: 'auto',
      width: '40rem',
      maxWidth: '',
      panelClass: ['mat-dialog-cont'],
      disableClose: true,
      data: {
        id_institution,
      },
    }));
  }

  closeModalSequences() {
    this._dialogRef.close();
  }
}
