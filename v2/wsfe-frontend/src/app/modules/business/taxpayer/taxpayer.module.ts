import { AngelAlertModule } from '@angel/components/alert';
import { AngelFindByKeyPipeModule } from '@angel/pipes/find-by-key';
import { NgModule } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import * as moment from 'moment';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { TaxpayerDetailsComponent } from './details/details.component';
import { ModalEmissionPointComponent } from './emission-point/modal-emission-point/modal-emission-point.component';
import { ModalEmissionPointsComponent } from './emission-point/modal-emission-points/modal-emission-points.component';
import { ModalEstablishmentComponent } from './establishment/modal-establishment/modal-establishment.component';
import { ModalEstablishmentsComponent } from './establishment/modal-establishments/modal-establishments.component';
import { ModalInstitutionComponent } from './institution/modal-institution/modal-institution.component';
import { ModalInstitutionsComponent } from './institution/modal-institutions/modal-institutions.component';
import { ModalSequenceComponent } from './institution/sequence/modal-sequence/modal-sequence.component';
import { ModalSequencesComponent } from './institution/sequence/modal-sequences/modal-sequences.component';
import { TaxpayerListComponent } from './list/list.component';
import { ModalMailServerComponent } from './setting-taxpayer/mail-server/modal-mail-server/modal-mail-server.component';
import { ModalMailServersComponent } from './setting-taxpayer/mail-server/modal-mail-servers/modal-mail-servers.component';
import { ModalSettingTaxpayerComponent } from './setting-taxpayer/modal-setting-taxpayer/modal-setting-taxpayer.component';
import { TaxpayerComponent } from './taxpayer.component';
import { taxpayerRoutes } from './taxpayer.routing';

@NgModule({
  declarations: [
    TaxpayerListComponent,
    TaxpayerDetailsComponent,
    TaxpayerComponent,
    ModalInstitutionComponent,
    ModalInstitutionsComponent,
    ModalEstablishmentComponent,
    ModalEstablishmentsComponent,
    ModalEmissionPointComponent,
    ModalEmissionPointsComponent,
    ModalSequencesComponent,
    ModalSequenceComponent,
    ModalSettingTaxpayerComponent,
    ModalMailServersComponent,
    ModalMailServerComponent,
  ],
  imports: [
    RouterModule.forChild(taxpayerRoutes),
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MaterialFileInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressBarModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatTooltipModule,
    AngelFindByKeyPipeModule,
    AngelAlertModule,
    SharedModule,
  ],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: moment.ISO_8601,
        },
        display: {
          dateInput: 'LL',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
})
export class TaxpayerModule {}
