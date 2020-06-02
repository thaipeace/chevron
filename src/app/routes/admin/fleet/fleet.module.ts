import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FleetPageComponent} from './fleet-page/fleet-page.component';
import {FleetManagementModule} from '@management/fleet-management/fleet-management.module';

@NgModule({
  declarations: [FleetPageComponent],
  imports: [
    CommonModule,
    FleetManagementModule
  ]
})
export class FleetModule {
}
