import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from '@app/routes/_layout/layout/layout.component';
import {RemoteLayoutComponent} from '@app/routes/_layout/remote-layout/remote-layout.component';
import {TruckDriverMappingComponent} from '@app/routes/fleet/truck-driver-mapping/truck-driver-mapping.component';
import {DriverHistoryComponent} from '@app/routes/fleet/driver-history/driver-history.component';
import {ShipmentCostComponent} from '@app/routes/fleet/shipment-cost/shipment-cost.component';
import {FleetManagementComponent} from '@app/routes/fleet/fleet-management/fleet-management.component';
import {FleetOwnerPageComponent} from '@app/routes/fleet/fleet-owner-page/fleet-owner-page.component';
import {FleetOperatorPageComponent} from '@app/routes/fleet/fleet-operator-page/fleet-operator-page.component';
import {AuthGuard} from '@app/guard/auth.guard';
import {DEFAULT_PARENT_ROUTES, DEFAULT_ROLES} from '@app/user-management/shared/models/data.models/user.model';
import {NmPageComponent} from '@app/routes/admin/notification/nm-page/nm-page.component';

const resolveLabelFn = (model) => {
    return model;
};
const FLEET_OPERATOR_ROUTES = [
    {path: '', redirectTo: 'truck-driver-mapping', pathMatch: 'full'},
    {
        path: 'truck-driver-mapping', component: TruckDriverMappingComponent,
        data: {
            breadcrumb: {
                model: 'Availability',
                resolveLabelFn: resolveLabelFn,
            }
        },
    },
    {
        path: 'driver-history', component: DriverHistoryComponent,
        data: {
            breadcrumb: {
                model: 'Driver History',
                resolveLabelFn: resolveLabelFn,
            }
        },
    },
    {
        path: 'fleet-management', component: FleetManagementComponent,
        data: {
            breadcrumb: {
                model: 'Resources',
                resolveLabelFn: resolveLabelFn,
            }
        },
    },
  {
    path: 'notification-management', component: NmPageComponent, data: {
      breadcrumb: {
        model: 'Events',
        resolveLabelFn: resolveLabelFn,
      }
    },
  },
];
const FLEET_ROUTES: Routes = [
    {
        path: 'fleet',
        component: LayoutComponent,
        data: {
            breadcrumb: {
                model: 'Hauler',
                resolveLabelFn: resolveLabelFn,
            }
        },
        children: [
            {
                path: 'owner',
                component: FleetOwnerPageComponent,
                data: {
                    breadcrumb: {
                        model: 'Owner',
                        resolveLabelFn: resolveLabelFn,
                    },
                  role: [DEFAULT_ROLES.ADMIN, DEFAULT_ROLES.TRUCK_COMPANY_OWNER,DEFAULT_ROLES.TRUCK_COMPANY_OPERATOR]
                },
                children: [
                    ...FLEET_OPERATOR_ROUTES,
                    {
                        path: 'shipment-cost', component: ShipmentCostComponent,
                        data: {
                            breadcrumb: {
                                model: 'Shipment Cost',
                                resolveLabelFn: resolveLabelFn,
                            }
                        },
                    },
                ]
            },
            {
                path: 'operator',
                component: FleetOperatorPageComponent,
                data: {
                    breadcrumb: {
                        model: 'Fleet Company',
                        resolveLabelFn: resolveLabelFn,
                    },
                  role: [DEFAULT_ROLES.ADMIN,DEFAULT_ROLES.TRUCK_COMPANY_OWNER, DEFAULT_ROLES.TRUCK_COMPANY_OPERATOR]
                },
                children: [
                    ...FLEET_OPERATOR_ROUTES,
                ]
            },
        ],
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    }

];
const routes: Routes = [
    ...FLEET_ROUTES,
    {
        path: DEFAULT_PARENT_ROUTES.REMOTE,
        component: RemoteLayoutComponent,
        data: {
            breadcrumb: {
                model: 'Remote',
                resolveLabelFn: resolveLabelFn,
            }
        },
        children: [...FLEET_ROUTES]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FleetRoutingModule {
}
