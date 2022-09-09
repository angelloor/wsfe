import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';

const businessRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'voucher',
  },
  {
    path: 'taxpayer',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: () =>
      import('./taxpayer/taxpayer.module').then((m) => m.TaxpayerModule),
  },
  {
    path: 'voucher',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: () =>
      import('./voucher/voucher.module').then((m) => m.VoucherModule),
  },
  {
    path: 'my-vouchers',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: () =>
      import('./my-vouchers/my-vouchers.module').then((m) => m.VoucherModule),
  },
  {
    path: 'voucher-sql-server',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: () =>
      import('./voucher-sql-server/voucher-sql-server.module').then(
        (m) => m.VoucherSQLServerModule
      ),
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    RouterModule.forChild(businessRoutes),
  ],
})
export class BusinessModule {}
