import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlannerAnalyticsInsightsComponent } from './planner-analytics-insights.component';
import { ActivityQueueComponent } from './activity-queue/activity-queue.component';
import { AnalyticsArtifactsComponent } from './analytics-artifacts/analytics-artifacts.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { Md2DatepickerModule, MdNativeDateModule } from 'md2';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [
    PlannerAnalyticsInsightsComponent,
    ActivityQueueComponent,
    AnalyticsArtifactsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    Md2DatepickerModule,
    MdNativeDateModule
  ]
})
export class PlannerAnalyticsInsightsModule { }
