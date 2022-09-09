import { AngelAlertModule } from '@angel/components/alert';
import { AngelCardModule } from '@angel/components/card';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Route, RouterModule } from '@angular/router';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NotfoundComponent } from './not-found/not-found.component';
import { SignInComponent } from './sign-in/sign-in.component';

const publicRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sign-in',
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'not-found',
    component: NotfoundComponent,
  },
];

@NgModule({
  declarations: [NotfoundComponent, SignInComponent],
  imports: [
    RouterModule.forChild(publicRoutes),
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    NgxCaptchaModule,
    MatIconModule,
    AngelCardModule,
    AngelAlertModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class PublicModule {}
