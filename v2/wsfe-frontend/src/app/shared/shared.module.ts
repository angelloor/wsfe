import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ModalViewSchemaComponent } from './modal-view-schema/modal-view-schema.component';
import { LocalDatePipe } from './pipes/local-date.pipe';
import { PreviewPdfComponent } from './preview-pdf/preview-pdf.component';
import { PreviewReportComponent } from './preview-report/preview-report.component';
@NgModule({
  declarations: [
    LocalDatePipe,
    PreviewReportComponent,
    ModalViewSchemaComponent,
    PreviewPdfComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxExtendedPdfViewerModule,
    PdfViewerModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    TextFieldModule,
  ],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, LocalDatePipe],
})
export class SharedModule {}
