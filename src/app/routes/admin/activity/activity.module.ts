import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityPageComponent } from './activity-page/activity-page.component';
import { ActivityManagementModule } from '@management/activity-management/activity-management.module';
import { ActivityManagementComponent } from './activity-management/activity-management.component';
import { IntegrationServicesStatusComponent } from './integration-services-status/integration-services-status.component';
import { SharedModule } from '@app/shared/shared.module';
import { Md2DatepickerModule, MdNativeDateModule } from 'md2';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { IntegrationServiceDetailComponent } from './integration-service-detail/integration-service-detail.component';
import { ConnectionHistoricalComponent } from './integration-service-detail/connection-historical/connection-historical.component';
import { DetailDataComponent } from './integration-service-detail/detail-data/detail-data.component';

@NgModule({
    declarations: [ActivityPageComponent, ActivityManagementComponent, IntegrationServicesStatusComponent, IntegrationServiceDetailComponent, ConnectionHistoricalComponent, DetailDataComponent],
    imports: [
        CommonModule,
        ActivityManagementModule,
        SharedModule,
        Md2DatepickerModule,
        MdNativeDateModule,
        BsDatepickerModule.forRoot()
    ],
    entryComponents: [
        IntegrationServiceDetailComponent
    ],
})
export class ActivityModule {
}
