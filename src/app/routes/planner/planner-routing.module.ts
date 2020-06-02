import {LayoutComponent} from '@app/routes/_layout/layout/layout.component';
import {PlannerTruckScheduleComponent} from '@app/routes/planner/planner-truck-schedule/planner-truck-schedule.component';
import {OrderPageComponent} from '@app/routes/admin/order/order-page/order-page.component';
import {PlannerArPageComponent} from '@app/routes/planner/planner-ar/planner-ar-page/planner-ar-page.component';
import {InventoryHistoryComponent} from '@app/routes/admin/inventory/inventory-history/inventory-history.component';
import {InventoryCurrentComponent} from '@app/routes/admin/inventory/inventory-current/inventory-current.component';
import {RemoteLayoutComponent} from '@app/routes/_layout/remote-layout/remote-layout.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlannerDeliveryComponent} from '@app/routes/planner/planner-delivery/planner-delivery.component';
import {PlannerArOrderComponent} from './planner-ar/planner-ar-order/planner-ar-order.component';
import {InventoryPageComponent} from '@app/routes/admin/inventory/inventory-page/inventory-page.component';
import {QuotaPageComponent} from '@app/routes/admin/quota/quota-page/quota-page.component';
import {AuthGuard} from '@app/guard/auth.guard';
import {PlannerDataImportComponent} from './planner-data-import/planner-data-import.component';
import {PlannerAnalyticsInsightsComponent} from './planner-analytics-insights/planner-analytics-insights.component';
import {ActivityQueueComponent} from './planner-analytics-insights/activity-queue/activity-queue.component';
import {AnalyticsArtifactsComponent} from './planner-analytics-insights/analytics-artifacts/analytics-artifacts.component';
import {PlannerTruckScheduleTripsComponent} from './planner-truck-schedule/planner-truck-schedule-trips/planner-truck-schedule-trips.component';
import {DEFAULT_PARENT_ROUTES, DEFAULT_ROLES} from '@app/user-management/shared/models/data.models/user.model';
import {NmPageComponent} from '@app/routes/admin/notification/nm-page/nm-page.component';
import { PlannerReportsComponent } from './planner-reports/planner-reports.component';

const resolveLabelFn = model => {
  return model;
};

const PLANNER_ROUTES: Routes = [
  {
    path: DEFAULT_PARENT_ROUTES.PLANNER,
    component: LayoutComponent,
    data: {
      breadcrumb: {
        model: 'Terminal Planner',
        resolveLabelFn: resolveLabelFn
      },
      role: [DEFAULT_ROLES.ADMIN, DEFAULT_ROLES.PLANNER]
    },
    children: [
      {path: '', redirectTo: 'truck-schedule', pathMatch: 'full'},
      {
        path: 'truck-schedule',
        component: PlannerTruckScheduleComponent,
        data: {
          breadcrumb: {
            model: 'Delivery Schedule',
            resolveLabelFn: resolveLabelFn
          }
        },
        children: [
          {path: '', redirectTo: 'trips', pathMatch: 'full'},
          {
            path: 'trips',
            component: PlannerTruckScheduleTripsComponent,
            data: {
              breadcrumb: {
                model: 'Trips',
                resolveLabelFn: resolveLabelFn
              }
            }
          }
        ]
      },
      {
        path: 'order-management',
        component: OrderPageComponent,
        data: {
          breadcrumb: {
            model: 'Orders',
            resolveLabelFn: resolveLabelFn
          }
        }
      },
      {
        path: 'quota-management',
        component: QuotaPageComponent,
        data: {
          breadcrumb: {
            model: 'Quotas',
            resolveLabelFn: resolveLabelFn
          }
        }
      },
      {
        path: 'delivery',
        component: PlannerDeliveryComponent,
        data: {
          breadcrumb: {
            model: 'Delivery Execution',
            resolveLabelFn: resolveLabelFn
          }
        }
      },
      {
        path: 'reports',
        component: PlannerReportsComponent,
        data: {
          breadcrumb: {
            model: 'Reports',
            resolveLabelFn: resolveLabelFn
          }
        }
      },
      {
        path: 'ar',
        component: PlannerArPageComponent,
        data: {
          breadcrumb: {
            model: '',
            resolveLabelFn: resolveLabelFn
          }
        },
        children: [
          {path: '', redirectTo: 'order', pathMatch: 'full'},
          {
            path: 'order',
            component: PlannerArOrderComponent,
            data: {
              breadcrumb: {
                model: 'Order Generation',
                resolveLabelFn: resolveLabelFn
              }
            }
          },
        ]
      },
      {
        path: 'inventory-management',
        component: InventoryPageComponent,
        data: {
          breadcrumb: {
            model: 'Customer Inventory',
            resolveLabelFn: resolveLabelFn
          }
        },
        children: [
          {path: '', redirectTo: 'current', pathMatch: 'full'},
          {
            path: 'historical',
            component: InventoryHistoryComponent,
            data: {
              breadcrumb: {
                model: 'Historical Inventory',
                resolveLabelFn: resolveLabelFn
              }
            }
          },
          {
            path: 'current',
            component: InventoryCurrentComponent,
            data: {
              breadcrumb: {
                model: 'Current Inventory',
                resolveLabelFn: resolveLabelFn
              }
            }
          }
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
      {
        path: 'data-import',
        component: PlannerDataImportComponent,
        data: {
          breadcrumb: {
            model: 'Data Import',
            resolveLabelFn: resolveLabelFn
          }
        }
      },
      {
        path: 'system-information',
        component: PlannerAnalyticsInsightsComponent,
        data: {
          breadcrumb: {
            model: 'Systems',
            resolveLabelFn: resolveLabelFn
          }
        },
        children: [
          {path: '', redirectTo: 'activity-management', pathMatch: 'full'},
          {
            path: 'activity-management',
            component: ActivityQueueComponent,
            data: {
              breadcrumb: {
                model: 'Activity Management',
                resolveLabelFn: resolveLabelFn
              }
            }
          },
          {
            path: 'analytics-artifacts',
            component: AnalyticsArtifactsComponent,
            data: {
              breadcrumb: {
                model: 'Analytics Artifacts',
                resolveLabelFn: resolveLabelFn
              }
            }
          }
        ]
      }
    ],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  }
];
const routes: Routes = [
  ...PLANNER_ROUTES,
  {
    path: DEFAULT_PARENT_ROUTES.REMOTE,
    component: RemoteLayoutComponent,
    data: {
      breadcrumb: {
        model: 'Remote',
        resolveLabelFn: resolveLabelFn
      }
    },
    children: [...PLANNER_ROUTES],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlannerRoutingModule {
}
