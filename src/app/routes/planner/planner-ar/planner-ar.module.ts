import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlannerArPageComponent } from './planner-ar-page/planner-ar-page.component';
import { PlannerArOrderComponent } from './planner-ar-order/planner-ar-order.component';
import { PlannerArTruckComponent } from './planner-ar-truck/planner-ar-truck.component';
import { RoutesRoutingModule } from '@app/routes/routes-routing.module';

import { SharedModule } from '@app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { Md2DatepickerModule, MdNativeDateModule } from 'md2';
import { ApproveARDataDialogComponent } from './planner-ar-order/approve-ar-data-dialog/approve-ar-data-dialog.component';

@NgModule({
  declarations: [PlannerArPageComponent,
    PlannerArOrderComponent,
    PlannerArTruckComponent,
    ApproveARDataDialogComponent],
  imports: [
    CommonModule,
    RoutesRoutingModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    Md2DatepickerModule,
    MdNativeDateModule
  ],
  entryComponents: [ApproveARDataDialogComponent]
})
export class PlannerArModule {
}
