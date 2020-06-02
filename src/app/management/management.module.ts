import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderManagementModule} from '@management/order-management/order-management.module';
import {CustomerManagementModule} from '@management/customer-management/customer-management.module';
import {InventoryManagementModule} from '@management/inventory-management/inventory-management.module';
import {FleetManagementModule} from '@management/fleet-management/fleet-management.module';
import {NotificationManagementModule} from './notification-management/notification-management.module';
import {ActivityManagementModule} from '@management/activity-management/activity-management.module';
import {ScheduleManagementModule} from '@management/schedule-management/schedule-management.module';
import {SettingsManagementModule} from './settings-management/settings-management.module';
import {MapManagementModule} from '@management/map-management/map-management.module';

@NgModule({
  imports: [
    CommonModule,
    OrderManagementModule,
    CustomerManagementModule,
    InventoryManagementModule,
    FleetManagementModule,
    NotificationManagementModule,
    ActivityManagementModule,
    ScheduleManagementModule,
    SettingsManagementModule,
    MapManagementModule,
  ]
})
export class ManagementModule {
}
