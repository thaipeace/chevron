import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminRoutingModule} from '@app/routes/admin/admin-routing.module';
import {CustomerModeComponent} from './customer-mode/customer-mode.component';
import {TerminalModeComponent} from './terminal-mode/terminal-mode.component';
import {FleetManagementModule} from '@app/management/fleet-management/fleet-management.module';
import {UserManagementModule} from '@app/management/user-management/user-management.module';
import {OrderManagementModule} from '@management/order-management/order-management.module';
import {SharedModule} from '@shared/shared.module';
import {OrderModule} from '@app/routes/admin/order/order.module';
import {CustomerModule} from '@app/routes/admin/customer/customer.module';
import {InventoryModule} from '@app/routes/admin/inventory/inventory.module';
import {FleetModule} from '@app/routes/admin/fleet/fleet.module';
import {UsersModule} from '@app/routes/admin/users/users.module';
import {NotificationModule} from '@app/routes/admin/notification/notification.module';
import {QuotaManagementModule} from '@management/quota-management/quota-management.module';
import {QuotaModule} from '@app/routes/admin/quota/quota.module';
import {ActivityModule} from '@app/routes/admin/activity/activity.module';
import {SettingsModule} from '@app/routes/admin/settings/settings.module';


@NgModule({
  entryComponents: [],
  declarations: [
    CustomerModeComponent,
    TerminalModeComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FleetManagementModule,
    UserManagementModule,
    OrderManagementModule,
    QuotaManagementModule,
    OrderModule,
    InventoryModule,
    CustomerModule,
    FleetModule,
    UsersModule,
    NotificationModule,
    QuotaModule,
    AdminRoutingModule,
    ActivityModule,
    SettingsModule
  ],
})
export class AdminModule {
}
