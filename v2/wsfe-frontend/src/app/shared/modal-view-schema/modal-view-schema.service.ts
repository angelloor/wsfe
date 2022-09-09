import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from 'app/layout/layout.service';
import { ModalViewSchemaComponent } from './modal-view-schema.component';

@Injectable({
  providedIn: 'root',
})
export class ModalViewSchemaService {
  constructor(
    private _dialog: MatDialog,
    private _layoutService: LayoutService
  ) {}
  _dialogRef: any;

  openModalViewSchema(schema: any) {
    this._layoutService.setOpenModal(true);
    return (this._dialogRef = this._dialog.open(ModalViewSchemaComponent, {
      minHeight: 'inherit',
      maxHeight: 'inherit',
      height: 'auto',
      width: '32rem',
      maxWidth: '',
      panelClass: ['mat-dialog-cont'],
      disableClose: true,
      data: {
        schema,
      },
    }));
  }

  closeModalViewSchema() {
    this._dialogRef.close();
  }
}
