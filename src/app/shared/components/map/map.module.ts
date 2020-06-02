import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapMarkerComponent } from './map-marker/map-marker.component';
import { MapDefaultComponent } from './map-default/map-default.component';
import { NguiMapModule } from '@ngui/map';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { MapComingSoonComponent } from './map-coming-soon/map-coming-soon.component';
import { MapTruckHistoricalLocationComponent } from './map-truck-historical-location/map-truck-historical-location.component';
import { MapDeliveryComponent } from './map-delivery/map-delivery.component';
import { MapOrderTrackingComponent } from './map-order-tracking/map-order-tracking.component';
import { PipeModule } from '@shared/pipe/pipe.module';
import { MapPickupComponent } from './map-pickup/map-pickup.component';
import { MapPickupDialogComponent } from './map-pickup-dialog/map-pickup-dialog.component';
import { MatDialogModule, MatButtonModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    MapMarkerComponent,
    MapDefaultComponent,
    MapComingSoonComponent,
    MapTruckHistoricalLocationComponent,
    MapDeliveryComponent,
    MapOrderTrackingComponent,
    MapPickupComponent,
    MapPickupDialogComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    PipeModule,
    NguiMapModule.forRoot({
      apiUrl: `https://maps.google.com/maps/api/js?key=AIzaSyDpEj9HxyEcxum6NTmoBCM0CWEpr_c_-ug`
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDpEj9HxyEcxum6NTmoBCM0CWEpr_c_-ug'
    }),
    AgmDirectionModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  exports: [
    MapMarkerComponent,
    MapDefaultComponent,
    MapComingSoonComponent,
    MapTruckHistoricalLocationComponent,
    MapDeliveryComponent,
    MapOrderTrackingComponent,
    NguiMapModule,
    AgmCoreModule,
    AgmDirectionModule
  ],
  entryComponents: [MapPickupDialogComponent]
})
export class MapModule {}
