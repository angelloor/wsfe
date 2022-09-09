import { Route } from '@angular/router';
import { VoucherListComponent } from './list/list.component';
import { VoucherComponent } from './voucher.component';

export const voucherRoutes: Route[] = [
  {
    path: '',
    component: VoucherComponent,
    children: [
      {
        path: '',
        component: VoucherListComponent,
      },
    ],
  },
];
