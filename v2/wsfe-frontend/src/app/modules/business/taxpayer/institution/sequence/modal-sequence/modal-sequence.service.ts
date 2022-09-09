import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from 'app/layout/layout.service';
import { ModalSequenceComponent } from './modal-sequence.component';

@Injectable({
  providedIn: 'root',
})
export class ModalSequenceService {
  constructor(
    private _dialog: MatDialog,
    private _layoutService: LayoutService
  ) {}
  _dialogRef: any;

  openModalSequence(id_sequence: string) {
    this._layoutService.setOpenModal(true);

    return (this._dialogRef = this._dialog.open(ModalSequenceComponent, {
      minHeight: 'inherit',
      maxHeight: '90vh',
      height: 'auto',
      width: '35rem',
      maxWidth: '',
      panelClass: ['mat-dialog-cont'],
      disableClose: true,
      data: {
        id_sequence,
      },
    }));
  }

  closeModalSequence() {
    this._dialogRef.close();
  }
}
