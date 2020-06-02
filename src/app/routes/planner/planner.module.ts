import { PlannerTruckScheduleComponent } from '@app/routes/planner/planner-truck-schedule/planner-truck-schedule.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { PlannerRoutingModule } from '@app/routes/planner/planner-routing.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { PlannerArModule } from '@app/routes/planner/planner-ar/planner-ar.module';
import { NgModule } from '@angular/core';
import { PlannerDeliveryComponent } from './planner-delivery/planner-delivery.component';
import { DeliveryManagementModule } from '@management/delivery-management/delivery-management.module';
import { Md2DatepickerModule, MdNativeDateModule } from 'md2';
import { ScheduleManagementModule } from '@management/schedule-management/schedule-management.module';
import { PlannerDataImportComponent } from './planner-data-import/planner-data-import.component';
import { PlannerAnalyticsInsightsModule } from './planner-analytics-insights/planner-analytics-insights.module';
import { InventoryManagementModule } from '@management/inventory-management/inventory-management.module';
import { PlannerTruckScheduleTripsComponent } from './planner-truck-schedule/planner-truck-schedule-trips/planner-truck-schedule-trips.component';
import { ActivityInfoComponent } from './planner-truck-schedule/activity-info/activity-info.component';
import { PlannerTruckScheduleFreeTrucksComponent } from './planner-truck-schedule/planner-truck-schedule-trips/planner-truck-schedule-free-trucks/planner-truck-schedule-free-trucks.component';
import { PlannerReportsComponent } from './planner-reports/planner-reports.component';

@NgModule({
  declarations: [
    PlannerTruckScheduleComponent,
    PlannerDeliveryComponent,
    PlannerDataImportComponent,
    PlannerTruckScheduleTripsComponent,
    ActivityInfoComponent,
    PlannerTruckScheduleFreeTrucksComponent,
    PlannerReportsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    DeliveryManagementModule,
    PlannerRoutingModule,
    PlannerArModule,
    Md2DatepickerModule,
    MdNativeDateModule,
    ScheduleManagementModule,
    PlannerAnalyticsInsightsModule,
    InventoryManagementModule
  ],
  entryComponents: [
    ActivityInfoComponent
  ],
})
export class PlannerModule {
}
