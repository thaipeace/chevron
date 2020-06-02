import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '@shared/shared.module';
import {FleetRoutingModule} from '@app/routes/fleet/fleet-routing.module';
import {DriverHistoryComponent} from '@app/routes/fleet/driver-history/driver-history.component';
import {DriverDetailComponent} from '@app/routes/fleet/driver-detail/driver-detail.component';
import {ShipmentCostComponent} from '@app/routes/fleet/shipment-cost/shipment-cost.component';
import {TruckDriverMappingComponent} from './truck-driver-mapping/truck-driver-mapping.component';
import {FleetPageComponent} from './fleet-page/fleet-page.component';
import {FleetManagementModule} from '@management/fleet-management/fleet-management.module';
import {FleetManagementComponent} from './fleet-management/fleet-management.component';
import {FleetOwnerPageComponent} from './fleet-owner-page/fleet-owner-page.component';
import {FleetOperatorPageComponent} from './fleet-operator-page/fleet-operator-page.component';
import {BsDatepickerModule} from 'ngx-bootstrap';

@NgModule({
    declarations: [
        ShipmentCostComponent,
        DriverDetailComponent,
        DriverHistoryComponent,
        TruckDriverMappingComponent,
        FleetPageComponent,
        FleetManagementComponent,
        FleetOwnerPageComponent,
        FleetOperatorPageComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        FleetManagementModule,
        FleetRoutingModule,
        BsDatepickerModule.forRoot(),
    ],
    entryComponents: [DriverDetailComponent]
})
export class FleetModule {
}
