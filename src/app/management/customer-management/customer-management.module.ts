import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CmTreeviewComponent} from './cm-treeview/cm-treeview.component';
import {SharedModule} from '@shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CmTankModule} from '@management/customer-management/cm-tank/cm-tank.module';
import {CmStationModule} from '@management/customer-management/cm-station/cm-station.module';
import {CmCustomerModule} from '@management/customer-management/cm-customer/cm-customer.module';
import {CmMapComponent} from './cm-map/cm-map.component';

@NgModule({
  declarations: [CmTreeviewComponent, CmMapComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    CmTankModule,
    CmStationModule,
    CmCustomerModule
  ],
  exports: [
    CmTreeviewComponent,
    CmMapComponent
  ]
})
export class CustomerManagementModule {
}
