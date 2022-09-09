import { Route } from '@angular/router';
import { VoucherSQLServerListComponent } from './list/list.component';
import { VoucherSQLServerComponent } from './voucher-sql-server.component';

export const voucherSQLServerRoutes: Route[] = [
  {
    path: '',
    component: VoucherSQLServerComponent,
    children: [
      {
        path: '',
        component: VoucherSQLServerListComponent,
      },
    ],
  },
];
