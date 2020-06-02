import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmTruckScheduleChartComponent} from './sm-truck-schedule-chart/sm-truck-schedule-chart.component';
import {SharedModule} from '@shared/shared.module';
import {SmTruckScheduleCompactComponent} from './sm-truck-schedule-compact/sm-truck-schedule-compact.component';
import {Md2DatepickerModule, MdNativeDateModule} from 'md2';
import {BsDatepickerModule} from 'ngx-bootstrap';
import {SmAssignOrderDialogComponent} from './sm-assign-order-dialog/sm-assign-order-dialog.component';
import {OrderManagementModule} from '@management/order-management/order-management.module';

@NgModule({
    declarations: [SmTruckScheduleChartComponent, SmTruckScheduleCompactComponent, SmAssignOrderDialogComponent],
    imports: [
        CommonModule,
        SharedModule,
        BsDatepickerModule.forRoot(),
        Md2DatepickerModule,
        MdNativeDateModule,
        OrderManagementModule
    ],
    exports: [
        SmTruckScheduleChartComponent,
        SmTruckScheduleCompactComponent,
        SmAssignOrderDialogComponent
    ],
    entryComponents: [
        SmTruckScheduleCompactComponent,
        SmAssignOrderDialogComponent
    ]
})
export class ScheduleManagementModule {
}
