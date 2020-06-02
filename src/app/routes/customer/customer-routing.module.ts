import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from '@app/routes/_layout/layout/layout.component';
import {DashboardComponent} from '@app/routes/customer/dashboard/dashboard.component';
import {HistoryPageComponent} from '@app/routes/customer/history/history-page/history-page.component';
import {HistoryOrderComponent} from '@app/routes/customer/history/history-order/history-order.component';
import {HistoryInventoryComponent} from '@app/routes/customer/history/history-inventory/history-inventory.component';
import {RemoteLayoutComponent} from '@app/routes/_layout/remote-layout/remote-layout.component';
import {AuthGuard} from '@app/guard/auth.guard';
import {DEFAULT_PARENT_ROUTES, DEFAULT_ROLES} from '@app/user-management/shared/models/data.models/user.model';
import {NmPageComponent} from '@app/routes/admin/notification/nm-page/nm-page.component';

const resolveLabelFn = (model) => {
  return model;
};

const CUSTOMER_ROUTES = [
  {path: '', redirectTo: DEFAULT_PARENT_ROUTES.CUSTOMER, pathMatch: 'full'},
  {
    path: DEFAULT_PARENT_ROUTES.CUSTOMER,
    component: LayoutComponent,
    data: {
      breadcrumb: {
        model: 'Customer',
        resolveLabelFn: resolveLabelFn,
      },
      role: [DEFAULT_ROLES.ADMIN, DEFAULT_ROLES.CUSTOMER]
    },
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent, data: {
          breadcrumb: {
            model: 'Dashboard',
            resolveLabelFn: resolveLabelFn,
          }
        }
      },
      {
        path: 'history',
        component: HistoryPageComponent,
        data: {
          breadcrumb: {
            model: 'History',
            resolveLabelFn: resolveLabelFn,
          }
        },
        children: [
          {path: '', redirectTo: 'order', pathMatch: 'full'},
          {
            path: 'order',
            component: HistoryOrderComponent, data: {
              breadcrumb: {
                model: 'Historical Orders',
                resolveLabelFn: resolveLabelFn,
              }
            }
          },
          {
            path: 'inventory',
            component: HistoryInventoryComponent, data: {
              breadcrumb: {
                model: 'Historical Inventories',
                resolveLabelFn: resolveLabelFn,
              }
            }
          },
          {path: '**', redirectTo: 'order', pathMatch: 'full'},
        ]
      },
      {
        path: 'notification-management', component: NmPageComponent, data: {
          breadcrumb: {
            model: 'Events',
            resolveLabelFn: resolveLabelFn,
          }
        },
      },
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    ],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
];

const routes: Routes = [
  ...CUSTOMER_ROUTES,
  {
    path: DEFAULT_PARENT_ROUTES.REMOTE,
    component: RemoteLayoutComponent,
    data: {
      breadcrumb: {
        model: 'Remote',
        resolveLabelFn: resolveLabelFn,
      }
    },
    children: [...CUSTOMER_ROUTES]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {
}
