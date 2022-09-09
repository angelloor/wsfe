import { Route } from '@angular/router';
import { TaxpayerDetailsComponent } from './details/details.component';
import { TaxpayerListComponent } from './list/list.component';
import { TaxpayerComponent } from './taxpayer.component';
import { CanDeactivateTaxpayerDetails } from './taxpayer.guards';
import { TaxpayerResolver } from './taxpayer.resolvers';

export const taxpayerRoutes: Route[] = [
  {
    path: '',
    component: TaxpayerComponent,
    children: [
      {
        path: '',
        component: TaxpayerListComponent,
        children: [
          {
            path: ':id',
            component: TaxpayerDetailsComponent,
            resolve: {
              task: TaxpayerResolver,
            },
            canDeactivate: [CanDeactivateTaxpayerDetails],
          },
        ],
      },
    ],
  },
];
