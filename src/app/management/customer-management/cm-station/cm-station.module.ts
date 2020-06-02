import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CmStationPageComponent} from './cm-station-page/cm-station-page.component';
import {SharedModule} from '@shared/shared.module';
import {CmStationDetailsDialogComponent} from './cm-station-details-dialog/cm-station-details-dialog.component';
import {CmStationNewComponent} from './cm-station-new/cm-station-new.component';
import {CmStationDetailsComponent} from './cm-station-details/cm-station-details.component';
import {CmStationListComponent} from './cm-station-list/cm-station-list.component';
import {CmStationUploadDialogComponent} from './cm-station-upload-dialog/cm-station-upload-dialog.component';
import {CmTankModule} from '@management/customer-management/cm-tank/cm-tank.module';
import {InventoryManagementModule} from '@management/inventory-management/inventory-management.module';
import { DischargePointsComponent } from './discharge-points/discharge-points.component';
import { EditDischargePointComponent } from './discharge-points/edit-discharge-point/edit-discharge-point.component';
import {DeliveryManagementModule} from '@management/delivery-management/delivery-management.module';
import { CmRoutesComponent } from './cm-routes/cm-routes.component';
import { EditCmRouteComponent } from './cm-routes/edit-cm-route/edit-cm-route.component';
import { CmRouteDetailsCompactComponent } from './cm-routes/cm-route-details-compact/cm-route-details-compact.component';
import { MapManagementModule } from '@app/management/map-management/map-management.module';

@NgModule({
  declarations: [CmStationPageComponent,
    CmStationNewComponent,
    CmStationDetailsDialogComponent,
    CmStationDetailsComponent,
    CmStationListComponent,
    CmStationUploadDialogComponent,
    DischargePointsComponent,
    EditDischargePointComponent,
    CmRoutesComponent,
    EditCmRouteComponent,
    CmRouteDetailsCompactComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CmTankModule,
    InventoryManagementModule,
    DeliveryManagementModule,
    MapManagementModule

  ],
  exports: [
    CmStationPageComponent,
    CmStationDetailsComponent,
    CmStationListComponent,
    CmRouteDetailsCompactComponent
  ],
  entryComponents: [
    CmStationDetailsDialogComponent,
    CmStationNewComponent,
    CmStationUploadDialogComponent,
    EditDischargePointComponent,
    EditCmRouteComponent,
    CmRouteDetailsCompactComponent
  ]
})
export class CmStationModule {
}
