import {CustomerModeComponent} from './customer-mode/customer-mode.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from '@app/routes/_layout/layout/layout.component';
import {TerminalModeComponent} from './terminal-mode/terminal-mode.component';
import {FmPageSpecificComponent} from '../../management/fleet-management/fm-page-specific/fm-page-specific.component';
import {OrderPageComponent} from '@app/routes/admin/order/order-page/order-page.component';
import {CustomerPageComponent} from '@app/routes/admin/customer/customer-page/customer-page.component';
import {CustomerTreeviewComponent} from '@app/routes/admin/customer/customer-treeview/customer-treeview.component';
import {CustomerMapComponent} from '@app/routes/admin/customer/customer-map/customer-map.component';
import {InventoryCurrentComponent} from '@app/routes/admin/inventory/inventory-current/inventory-current.component';
import {InventoryHistoryComponent} from '@app/routes/admin/inventory/inventory-history/inventory-history.component';
import {FleetPageComponent} from '@app/routes/admin/fleet/fleet-page/fleet-page.component';
import {UsersPageComponent} from '@app/routes/admin/users/users-page/users-page.component';
import {NmPageComponent} from '@app/routes/admin/notification/nm-page/nm-page.component';
import {QuotaPageComponent} from '@app/routes/admin/quota/quota-page/quota-page.component';
import {InventoryPageComponent} from '@app/routes/admin/inventory/inventory-page/inventory-page.component';
import {AuthGuard} from '@app/guard/auth.guard';
import {ActivityPageComponent} from '@app/routes/admin/activity/activity-page/activity-page.component';
import {ActivityManagementComponent} from './activity/activity-management/activity-management.component';
import {IntegrationServicesStatusComponent} from './activity/integration-services-status/integration-services-status.component';
import {DEFAULT_PARENT_ROUTES, DEFAULT_ROLES} from '@app/user-management/shared/models/data.models/user.model';
import {RemoteLayoutComponent} from '@app/routes/_layout/remote-layout/remote-layout.component';
import {OrganizationProfileComponent} from '@app/routes/admin/settings/organization-profile/organization-profile.component';
import {SystemParametersComponent} from '@app/routes/admin/settings/system-parameters/system-parameters.component';
import {BaseProductTypesComponent} from '@app/routes/admin/settings/base-product-types/base-product-types.component';
import {ProductTypesComponent} from '@app/routes/admin/settings/product-types/product-types.component';
import {HelpLinksComponent} from '@app/routes/admin/settings/help-links/help-links.component';
import {TerminalComponent} from '@app/routes/admin/settings/terminal/terminal.component';
import {RegionComponent} from '@app/routes/admin/settings/region/region.component';
import {SupplyPointComponent} from '@app/routes/admin/settings/supply-point/supply-point.component';
import {FleetBaseComponent} from '@app/routes/admin/settings/fleet-base/fleet-base.component';
import {TruckStopComponent} from '@app/routes/admin/settings/truck-stop/truck-stop.component';
import {ExceptionAreaComponent} from '@app/routes/admin/settings/exception-area/exception-area.component';
import {HelpDocumentsComponent} from '@app/routes/admin/settings/help-documents/help-documents.component';
import {TripPreferencesComponent} from '@app/routes/admin/settings/trip-preferences/trip-preferences.component';
import {OrderImportProductMappingComponent} from './settings/order-import-product-mapping/order-import-product-mapping.component';
import {DeliveryPointGroupComponent} from '@app/routes/admin/settings/delivery-point-group/delivery-point-group.component';

const resolveLabelFn = (model) => {
  return model;
};

const SETTINGS_ROUTES: Routes = [
  {
    path: 'settings',
    data: {
      breadcrumb: {
        model: 'Settings',
        resolveLabelFn: resolveLabelFn
      },
      role: [DEFAULT_ROLES.ADMIN]
    },
    children: [
      {path: '', redirectTo: 'organization-profile', pathMatch: 'full'},
      {
        path: 'organization-profile',
        component: OrganizationProfileComponent,
        data: {
          breadcrumb: {
            model: 'Organization Profile',
            resolveLabelFn: resolveLabelFn
          }
        }
      },
      {
        path: 'system-parameters',
        component: SystemParametersComponent,
        data: {
          breadcrumb: {
            model: 'System Parameters',
            resolveLabelFn: resolveLabelFn
          }
        }
      },
      {
        path: 'trip-preferences',
        component: TripPreferencesComponent,
        data: {
          breadcrumb: {
            model: 'Trip Preferences',
            resolveLabelFn: resolveLabelFn
          }
        }
      },
      {
        path: 'delivery-point-groups',
        component: DeliveryPointGroupComponent,
        data: {
          breadcrumb: {
            model: 'Delivery Point Groups',
            resolveLabelFn: resolveLabelFn
          }
        }
      },
      {
        path: 'order-import-product-mapping',
        component: OrderImportProductMappingComponent,
        data: {
          breadcrumb: {
            model: 'Order Import Product Mappings',
            resolveLabelFn: resolveLabelFn
          }
        }
      },
      {
        path: 'terminals',
        component: TerminalComponent,
        data: {
          breadcrumb: {
            model: 'Terminals',
            resolveLabelFn: resolveLabelFn
          }
        }
      },
      {
        path: 'regions',
        component: RegionComponent,
        data: {
          breadcrumb: {
            model: 'Regions',
            resolveLabelFn: resolveLabelFn
          }
        }
      },
      {
        path: 'supply-points',
        component: SupplyPointComponent,
        data: {
          breadcrumb: {
            model: 'Supply Points',
            resolveLabelFn: resolveLabelFn
          }
        }
      },
      {
        path: 'fleet-bases',
        component: FleetBaseComponent,
        data: {
          breadcrumb: {
            model: 'Fleet Bases',
            resolveLabelFn: resolveLabelFn
          }
        }
      },
      {
        path: 'truck-stops',
        component: TruckStopComponent,
        data: {
          breadcrumb: {
            model: 'Truck Stops',
            resolveLabelFn: resolveLabelFn
          }
        }
      },
      {
        path: 'exception-areas',
        component: ExceptionAreaComponent,
        data: {
          breadcrumb: {
            model: 'Exception Areas',
            resolveLabelFn: resolveLabelFn
          }
        }
      },
      {
        path: 'base-product-types',
        component: BaseProductTypesComponent,
        data: {
          breadcrumb: {
            model: 'Base Product Types',
            resolveLabelFn: resolveLabelFn
          }
        }
      },
      {
        path: 'product-types',
        component: ProductTypesComponent,
        data: {
          breadcrumb: {
            model: 'Product Types',
            resolveLabelFn: resolveLabelFn
          }
        }
      },
      {
        path: 'help-links',
        component: HelpLinksComponent,
        data: {
          breadcrumb: {
            model: 'Help Links',
            resolveLabelFn: resolveLabelFn
          }
        }
      },
      {
        path: 'help-documents',
        component: HelpDocumentsComponent,
        data: {
          breadcrumb: {
            model: 'Help Documents',
            resolveLabelFn: resolveLabelFn
          }
        }
      }
    ],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  }
];

const ADMIN_ROUTES = [
  {
    path: DEFAULT_PARENT_ROUTES.ADMIN,
    component: LayoutComponent,
    data: {
      breadcrumb: {
        model: 'Terminal',
        resolveLabelFn: resolveLabelFn,
      },
      role: [DEFAULT_ROLES.ADMIN]
    },
    children: [
      ...SETTINGS_ROUTES,
      {
        path: 'user-management', component: UsersPageComponent, data: {
          breadcrumb: {
            model: 'Users',
            resolveLabelFn: resolveLabelFn,
          }
        }
      },
      {
        path: 'inventory-management', component: InventoryPageComponent, data: {
          breadcrumb: {
            model: 'Custommer Inventory Management',
            resolveLabelFn: resolveLabelFn,
          }
        },
        children: [
          {path: '', redirectTo: 'current', pathMatch: 'full'},
          {
            path: 'historical', component: InventoryHistoryComponent,
            data: {
              breadcrumb: {
                model: 'Historical Inventory',
                resolveLabelFn: resolveLabelFn,
              }
            },
          },
          {
            path: 'current', component: InventoryCurrentComponent,
            data: {
              breadcrumb: {
                model: 'Current Inventory',
                resolveLabelFn: resolveLabelFn,
              }
            },
          }
        ]
      },
      {
        path: 'order-management', component: OrderPageComponent, data: {
          breadcrumb: {
            model: 'Orders',
            resolveLabelFn: resolveLabelFn,
          }
        },
      },
      {
        path: 'quota-management', component: QuotaPageComponent, data: {
          breadcrumb: {
            model: 'Quotas',
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
      // {
      //   path: 'station-list', component: StationListComponent, data: {
      //     breadcrumb: {
      //       model: 'Station List',
      //       resolveLabelFn: resolveLabelFn,
      //     }
      //   }
      // },
      // {
      //   path: 'station-map', component: StationMapComponent, data: {
      //     breadcrumb: {
      //       model: 'Station Map',
      //       resolveLabelFn: resolveLabelFn,
      //     }
      //   }
      // },
      {
        path: 'customer-mode', component: CustomerModeComponent, data: {
          breadcrumb: {
            model: 'Customer Mode',
            resolveLabelFn: resolveLabelFn,
          }
        }
      },
      {
        path: 'terminal-mode', component: TerminalModeComponent, data: {
          breadcrumb: {
            model: 'Terminal Mode',
            resolveLabelFn: resolveLabelFn,
          }
        }
      },
      {
        path: 'customer-management',
        component: CustomerPageComponent,
        data: {
          breadcrumb: {
            model: 'Customers',
            resolveLabelFn: resolveLabelFn,
          }
        },
        children: [
          {path: '', redirectTo: 'tree-view', pathMatch: 'full'},
          {
            path: 'tree-view', component: CustomerTreeviewComponent, data: {
              breadcrumb: {
                model: 'Tree View',
                resolveLabelFn: resolveLabelFn,
              }
            },
          },
          {
            path: 'map-view', component: CustomerMapComponent, data: {
              breadcrumb: {
                model: 'Map View',
                resolveLabelFn: resolveLabelFn,
              }
            },
          },
          {
            path: 'inventory-view', component: InventoryCurrentComponent,
            data: {
              breadcrumb: {
                model: 'Inventory View',
                resolveLabelFn: resolveLabelFn,
              }
            },
          }
        ]
      },
      {
        path: 'company-fleet-management', component: FmPageSpecificComponent, data: {
          breadcrumb: {
            model: 'Fleet Organization Management',
            resolveLabelFn: resolveLabelFn,
          }
        },
      },
      {
        path: 'fleet-management', component: FleetPageComponent, data: {
          breadcrumb: {
            model: 'Haulers',
            resolveLabelFn: resolveLabelFn,
          }
        },
      },
      {
        path: 'system-information',
        component: ActivityPageComponent,
        data: {
          breadcrumb: {
            model: 'Systems',
            resolveLabelFn: resolveLabelFn,
          }
        },
        children: [
          {path: '', redirectTo: 'activity-management', pathMatch: 'full'},
          {
            path: 'activity-management', component: ActivityManagementComponent, data: {
              breadcrumb: {
                model: 'Activity Management',
                resolveLabelFn: resolveLabelFn,
              }
            },
          },
          {
            path: 'integration-services-status', component: IntegrationServicesStatusComponent, data: {
              breadcrumb: {
                model: 'Integration Services Status',
                resolveLabelFn: resolveLabelFn,
              }
            },
          },
        ]
      },
      /* {
         path: 'fleet-management-old', component: FmPageComponent, data: {
           breadcrumb: {
             model: 'Fleet Organization Management',
             resolveLabelFn: resolveLabelFn,
           }
         },
         children: [
           {path: '', redirectTo: 'truck', pathMatch: 'full'},
           {
             path: 'truck', component: FmTruckPageComponent, data: {
               breadcrumb: {
                 model: 'Truck',
                 resolveLabelFn: resolveLabelFn,
               }
             },
           },
           {
             path: 'driver', component: FmDriverPageComponent, data: {
               breadcrumb: {
                 model: 'Driver',
                 resolveLabelFn: resolveLabelFn,
               }
             },
           },
         ]
       },*/
      // {
      //     path: 'digital-terminal',
      //     component: DigitalTerminalComponent
      // },
      {path: '', redirectTo: 'user-management', pathMatch: 'full'},
    ],
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
];

const routes: Routes = [
  ...ADMIN_ROUTES,
  {
    path: DEFAULT_PARENT_ROUTES.REMOTE,
    component: RemoteLayoutComponent,
    data: {
      breadcrumb: {
        model: 'Remote',
        resolveLabelFn: resolveLabelFn,
      }
    },
    children: [...ADMIN_ROUTES]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
