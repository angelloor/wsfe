import { Route } from '@angular/router';
import { MyVouchersListComponent } from './list/list.component';
import { MyVouchersComponent } from './my-vouchers.component';

export const myVoucherRoutes: Route[] = [
  {
    path: '',
    component: MyVouchersComponent,
    children: [
      {
        path: '',
        component: MyVouchersListComponent,
      },
    ],
  },
];
